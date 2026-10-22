import { callCollegeApi } from "./client";
import {
  ErpSessionHeaders,
  CollegeRegisteredCourse,
  CollegeAttendanceItem,
  CollegeScheduleSlot,
  CollegeLectureSlot,
} from "./types";

/**
 * Fetches the student's registered courses from the official gateway.
 * Endpoint: POST /api/v2/initial/registeredCourses
 * Body: id=<RegNo>
 */
export async function getRegisteredCourses(
  session: ErpSessionHeaders
): Promise<CollegeRegisteredCourse[]> {
  const res = await callCollegeApi<any>("/initial/registeredCourses", {
    body: { id: session.regNo },
    sessionHeaders: session,
  });

  if (Array.isArray(res?.RegisterCourse)) {
    return res.RegisterCourse;
  }
  if (Array.isArray(res)) {
    return res;
  }
  return [];
}

/**
 * Fetches per-course attendance details from the official gateway.
 * Endpoint: POST /api/v2/attendance/att
 * Body: id=<RegNo>
 */
export async function getStudentAttendance(
  session: ErpSessionHeaders
): Promise<CollegeAttendanceItem[]> {
  try {
    const res = await callCollegeApi<any>("/attendance/att", {
      body: { id: session.regNo },
      sessionHeaders: session,
    });

    if (Array.isArray(res?.AttendanceDetails)) {
      return res.AttendanceDetails;
    }
    if (Array.isArray(res)) {
      return res;
    }
  } catch (err) {
    console.warn("Error fetching /attendance/att:", err);
  }
  return [];
}

/**
 * Fetches lecture-by-lecture attendance history for a single subject.
 * Endpoint: POST /api/v2/attendance/attsub
 * Body: id=<RegNo>&sub=<CourseNo>&sessionno=<currentSessionNo>
 */
export async function getSubjectAttendanceHistory(
  session: ErpSessionHeaders,
  courseNo: string | number,
  sessionNo?: string | number
): Promise<CollegeLectureSlot[]> {
  try {
    const sNo = sessionNo || (session as any).currentSessionNo || 142;
    const res = await callCollegeApi<any>("/attendance/attsub", {
      body: {
        id: session.regNo,
        sub: String(courseNo),
        sessionno: String(sNo),
      },
      sessionHeaders: session,
    });

    if (Array.isArray(res?.AttendanceBySubject)) {
      return res.AttendanceBySubject;
    }
  } catch (err) {
    console.warn(`Error fetching attsub for course ${courseNo}:`, err);
  }
  return [];
}

/**
 * Fetches today's student class schedule.
 * Endpoint: POST /api/v2/Schedule/student_todays_schedule
 * Body: id=<IdNo>
 */
export async function getStudentSchedule(
  session: ErpSessionHeaders
): Promise<CollegeScheduleSlot[]> {
  try {
    const res = await callCollegeApi<any>("/Schedule/student_todays_schedule", {
      body: { id: session.idNo },
      sessionHeaders: session,
    });

    if (Array.isArray(res?.TodaysStudentClassSchedule)) {
      return res.TodaysStudentClassSchedule;
    }
  } catch (err) {
    console.warn("Primary schedule endpoint empty or errored, falling back:", err);
  }

  return [];
}

/**
 * Weekly day name → 0-based index (Monday=0 … Saturday=5).
 */
const DAY_NAME_TO_INDEX: Record<string, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

/**
 * Parses a DetailList key-value pair array into a plain object.
 * DetailList: [{ Key: "Course Name", Value: "Data Structures" }, ...]
 */
function parseDetailList(detailList: Array<{ Key: string; Value: string }>): Record<string, string> {
  const map: Record<string, string> = {};
  if (!Array.isArray(detailList)) return map;
  for (const kv of detailList) {
    if (kv.Key) map[kv.Key.trim()] = (kv.Value || "").trim();
  }
  return map;
}

export interface WeeklySlot {
  id: string;
  dayOfWeek: number; // 0=Monday … 5=Saturday
  startTime: string;
  endTime: string;
  room: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  periodDetails: string; // raw period string from API
}

/**
 * Fetches the full weekly timetable from the verified schedule/studentv4 endpoint.
 * Endpoint: POST /api/v2/schedule/studentv4
 * Body: idno=<IdNo>&sessionno=<currentSessionNo>
 *
 * ACTUAL response shape (verified from live API):
 * {
 *   ClassTables: [
 *     {
 *       Day: "WEDNESDAY",          // uppercase day name
 *       Detail: [
 *         {
 *           LectureName: "Period 1",
 *           PeriodDetails: null,    // usually null — DO NOT USE for time
 *           LectureTime: "09:15 AM-10:10 AM",  // actual time range
 *           DetailList: [           // array of arrays (not flat!)
 *             [                     // inner array has the KV objects
 *               { type: null, Key: "Course Name",  Value: "Data Visualization using tableau" },
 *               { type: null, Key: "Course Code",  Value: "BTAIML 505-20" },
 *               { type: null, Key: "Section",      Value: "A" },
 *               { type: null, Key: "Room",         Value: "NO ROOM" },
 *               { type: null, Key: "Batch",        Value: "NO BATCH" },
 *               { type: null, Key: "Faculty",      Value: "Meenakshi Garg" }
 *             ]
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export async function getWeeklySchedule(
  session: ErpSessionHeaders
): Promise<WeeklySlot[]> {
  try {
    const sessionNo = (session as any).currentSessionNo || (session as any).sessionNo || 142;
    const res = await callCollegeApi<any>("/schedule/studentv4", {
      body: { idno: String(session.idNo), sessionno: String(sessionNo) },
      sessionHeaders: session,
    });

    if (!Array.isArray(res?.ClassTables) || res.ClassTables.length === 0) {
      return [];
    }

    const slots: WeeklySlot[] = [];

    for (const dayTable of res.ClassTables) {
      const dayName: string = (dayTable.Day || "").toLowerCase().trim();
      const dayIndex = DAY_NAME_TO_INDEX[dayName];
      if (dayIndex === undefined) continue; // skip unknown/Sunday

      const details: any[] = Array.isArray(dayTable.Detail) ? dayTable.Detail : [];

      for (let i = 0; i < details.length; i++) {
        const detail = details[i];

        // LectureTime is a direct property on the Detail object (e.g. "09:15 AM-10:10 AM")
        // PeriodDetails is usually null — do not rely on it
        const rawTime = (detail.LectureTime || detail.PeriodDetails || "").trim();
        // Split on " - " or "-" (with or without spaces around dash)
        const times = rawTime.split(/ - |-/).map((t: string) => t.trim());
        const startTime = times[0] || "";
        const endTime = times[1] || "";

        // DetailList is an array of arrays — flatten one level to get {Key,Value} objects
        const rawDetailList: any[] = Array.isArray(detail.DetailList)
          ? (detail.DetailList as any[]).flat()
          : [];
        const kv = parseDetailList(rawDetailList);

        const room = kv["Room"] && kv["Room"].toUpperCase() !== "NO ROOM" ? kv["Room"] : "";
        const courseCode = kv["Course Code"] || "";
        const courseName = kv["Course Name"] || "";
        const facultyName = kv["Faculty"] || "";

        // Skip slots where we couldn't parse any meaningful data
        if (!courseName && !courseCode) continue;

        slots.push({
          id: `${dayIndex}-${i}-${courseCode || courseName}`,
          dayOfWeek: dayIndex,
          startTime,
          endTime,
          room,
          courseCode,
          courseName,
          facultyName,
          periodDetails: rawTime,
        });
      }
    }

    return slots;
  } catch (err) {
    console.warn("getWeeklySchedule error:", err);
    return [];
  }
}

/**
 * Parses MasterSoft ERP MM-dd-yyyy date into a Date object in IST end-of-day
 */
export function parseMasterSoftDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      // 23:59:59 IST = 18:29:59 UTC
      return new Date(Date.UTC(year, month, day, 18, 29, 59));
    }
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Fetches assignments for a single course from the official gateway.
 * Endpoint: POST /api/v2/LmsAssignment/Get_AssignmentList_By_Uano
 * Note: uaNo in body must be IdNo!
 */
export async function getCourseAssignments(
  session: ErpSessionHeaders,
  courseNo: string | number,
  sessionNo?: string | number,
  sectionNo?: string | number
): Promise<any[]> {
  try {
    const sNo = sessionNo || (session as any).currentSessionNo || 142;
    const secNo = sectionNo || (session as any).sectionNo || 0;
    const res = await callCollegeApi<any>("/LmsAssignment/Get_AssignmentList_By_Uano", {
      body: {
        sessionno: String(sNo),
        courseno: String(courseNo),
        uaNo: String(session.idNo), // Required: IdNo
        sectionno: String(secNo),
      },
      sessionHeaders: session,
    });

    if (Array.isArray(res?.Assign)) {
      return res.Assign;
    }
    if (Array.isArray(res?.Assignments)) {
      return res.Assignments;
    }
  } catch (err) {
    console.warn(`Error fetching assignments for course ${courseNo}:`, err);
  }
  return [];
}

/**
 * Fetches assignment detail including handouts and student attachments.
 * Endpoint: POST /api/v2/LmsAssignment/Get_Detail_Of_AssignmentNo
 */
export async function getAssignmentDetail(
  session: ErpSessionHeaders,
  asNo: string | number
): Promise<any> {
  try {
    const res = await callCollegeApi<any>("/LmsAssignment/Get_Detail_Of_AssignmentNo", {
      body: { asno: String(asNo) },
      sessionHeaders: session,
    });
    return res;
  } catch (err) {
    console.warn(`Error fetching assignment detail for ${asNo}:`, err);
    throw err;
  }
}

/**
 * Aggregates assignments across all registered courses for the authenticated student.
 */
export async function getAllStudentAssignments(
  session: ErpSessionHeaders,
  courses?: CollegeRegisteredCourse[]
): Promise<any[]> {
  let regCourses = courses;
  if (!regCourses || regCourses.length === 0) {
    regCourses = await getRegisteredCourses(session);
  }

  if (!regCourses || regCourses.length === 0) {
    return [];
  }

  // Fetch assignments per course concurrently
  const assignmentPromises = regCourses.map(async (c) => {
    const rawList = await getCourseAssignments(session, c.CourseNo, c.SessionNo || (session as any).currentSessionNo);
    return { course: c, rawList };
  });

  const results = await Promise.allSettled(assignmentPromises);
  const aggregated: any[] = [];
  const now = new Date();

  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const { course, rawList } = r.value;

    for (const item of rawList) {
      const dueDateObj = parseMasterSoftDate(item.DUEDATE);
      const cutoffDateObj = parseMasterSoftDate(item.CUTOFFDATE) || dueDateObj;

      const daysRemaining = dueDateObj
        ? Math.ceil((dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      const isExpired =
        item.STATUS === "Expired" ||
        (cutoffDateObj ? now.getTime() > cutoffDateObj.getTime() : false);

      aggregated.push({
        id: `as-${item.AS_NO}`,
        asNo: item.AS_NO,
        title: item.SUBJECT || `Assignment ${item.AS_NO}`,
        courseNo: String(course.CourseNo),
        courseName: course.CourseName || course.Ccode || `Course ${course.CourseNo}`,
        courseCode: course.Ccode || `C-${course.CourseNo}`,
        category: course.SubName || "Theory",
        createdDate: item.CREATEDATE,
        dueDate: item.DUEDATE,
        cutoffDate: item.CUTOFFDATE,
        status: isExpired ? "Expired" : (item.STATUS || "Active"),
        isExpired,
        isSubmitted: Boolean(item.RESULT && item.RESULT !== ""),
        daysRemaining,
        result: item.RESULT || "",
      });
    }
  }

  // Enrich assignments with live submission history & attachments from official gateway
  try {
    const detailPromises = aggregated.map(async (as) => {
      try {
        const detail = await getAssignmentDetail(session, as.asNo);
        const studAttachments = detail?.studAttachments || [];
        const hasSubmission =
          studAttachments.length > 0 ||
          Boolean(as.result && as.result !== "") ||
          (typeof as.status === "string" && as.status.toLowerCase().includes("submit"));

        return {
          asNo: as.asNo,
          isSubmitted: hasSubmission,
          submissionCount: studAttachments.length,
          studentAttachments: studAttachments,
          facultyAttachments: detail?.attachments || [],
          description:
            detail?.AssiDescription?.AssignmentQueston ||
            detail?.AssiDescription?.AssignmentTopic ||
            "",
        };
      } catch {
        return {
          asNo: as.asNo,
          isSubmitted: Boolean(as.result && as.result !== ""),
          submissionCount: 0,
        };
      }
    });

    const detailResults = await Promise.allSettled(detailPromises);
    const detailMap = new Map<number, any>();
    for (const r of detailResults) {
      if (r.status === "fulfilled" && r.value) {
        detailMap.set(r.value.asNo, r.value);
      }
    }

    for (const as of aggregated) {
      const detail = detailMap.get(as.asNo);
      if (detail) {
        as.isSubmitted = detail.isSubmitted;
        as.submissionCount = detail.submissionCount;
        if (detail.studentAttachments) as.studentAttachments = detail.studentAttachments;
        if (detail.facultyAttachments) as.facultyAttachments = detail.facultyAttachments;
        if (detail.description) as.description = detail.description;
      }
    }
  } catch (err) {
    console.warn("Failed to enrich assignment details with submissions:", err);
  }

  // Sort: Active pending first (soonest deadline first), then submitted, then Expired
  return aggregated.sort((a, b) => {
    if (a.isExpired !== b.isExpired) return a.isExpired ? 1 : -1;
    if (a.isSubmitted !== b.isSubmitted) return a.isSubmitted ? 1 : -1;
    return a.daysRemaining - b.daysRemaining;
  });
}

/**
 * Submits assignment reply to the official gateway with strict deadline verification.
 * Endpoint: POST /api/v2/LmsAssignment/AssignmentReply
 */
export async function submitAssignmentReply(
  session: ErpSessionHeaders,
  asNo: string | number,
  description: string,
  fileBlob: Blob,
  fileName: string,
  cutoffDate?: string
): Promise<{ success: boolean; message: string }> {
  // Authoritative deadline gate
  if (cutoffDate) {
    const cutoffObj = parseMasterSoftDate(cutoffDate);
    if (cutoffObj && new Date().getTime() > cutoffObj.getTime()) {
      throw new Error("Assignment submission deadline has passed. Late submissions are rejected by the college ERP.");
    }
  }

  const formData = new FormData();
  formData.append("AS_NO", String(asNo));
  // Pass both UA_NO and IDNO (some endpoints use IdNo for UA_NO)
  formData.append("UA_NO", String(session.idNo || session.id));
  formData.append("IDNO", String(session.idNo));
  formData.append("DESCRIPTION", description || "Submitted via Campus ERP Assignment Center");
  formData.append("STATUS", "1");
  formData.append("FILE", fileBlob, fileName);

  const res = await callCollegeApi<any>("/LmsAssignment/AssignmentReply", {
    formData,
    sessionHeaders: session,
  });

  if (res?.IsErrorInService === true) {
    throw new Error(res.Message || "College ERP rejected the assignment submission.");
  }

  return {
    success: true,
    message: res?.Message || "Assignment submitted successfully to College ERP.",
  };
}
