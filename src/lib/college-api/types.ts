/**
 * Required session headers sent with every authenticated call to MasterSoft ERP gateway
 */
export interface ErpSessionHeaders {
  token: string;
  uaType: number | string;
  id: number | string; // UaNo
  idNo: number | string; // IdNo
  regNo: string; // RegNo
}

/**
 * College UserInfo returned by POST /api/v2/initial/authv4
 */
export interface CollegeUserInfo {
  Token: string;
  UaNo: number;
  UaType: number;
  UserName: string;
  RegNo: string;
  IdNo: string;
  EnrollmentNo: string;
  Email?: string;
  MobileNo?: string;
  CollegeId?: number;
  SessionNo?: number;
  currentSessionNo?: number;
  SectionNo?: number;
  SemesterNo?: number;
  currentSemesterNo?: number;
}

/**
 * Top-level response from POST /api/v2/initial/authv4
 */
export interface CollegeAuthResponse {
  Id: any;
  IsErrorInService: boolean;
  Message: string | null;
  UserInfo?: CollegeUserInfo | null;
}

/**
 * Course returned by POST /api/v2/initial/registeredCourses (id=<RegNo>)
 */
export interface CollegeRegisteredCourse {
  CourseNo: number;
  Ccode: string;
  CourseName: string;
  Credits?: number;
  SemesterNo?: number;
  SchemeNo?: number;
  SessionNo?: number;
  SubName?: string;
}

/**
 * Per-course attendance item returned by POST /api/v2/attendance/att (id=<RegNo>)
 */
export interface CollegeAttendanceItem {
  Semester?: string | null;
  CourseNo?: string | number;
  Course_Name?: string;
  Subject?: string;
  CourseCode?: string;
  Total_Class: number | string;
  Present: number | string;
  Absent: number | string;
  Percentage: number | string;
  UaName?: string;
}

/**
 * Single lecture record returned by POST /api/v2/attendance/attsub
 */
export interface CollegeLectureSlot {
  AttDate: string;
  AttStatus: string | number; // "1" for present, "0" for absent
  Period: string;
}

/**
 * Schedule slot returned by POST /api/v2/Schedule/student_todays_schedule
 */
export interface CollegeScheduleSlot {
  Ccode: string;
  Coursename: string;
  Slotname: string;
  Roomno?: string | null;
  Attendancestatus?: string | null;
  AttendancestatusDisplay?: string | null;
  Facultyname?: string | null;
  Section?: string | null;
}

/**
 * Assignment item returned by POST /api/v2/LmsAssignment/Get_AssignmentList_By_Uano
 */
export interface CollegeAssignmentSummary {
  AS_NO: number;
  SUBJECT: string;
  CREATEDATE: string;
  DUEDATE: string;
  CUTOFFDATE: string;
  STATUS: string; // "Active" | "Expired"
  RESULT?: string;
}

/**
 * Assignment detail returned by POST /api/v2/LmsAssignment/Get_Detail_Of_AssignmentNo
 */
export interface CollegeAssignmentDetail {
  AssiDescription?: {
    AssignmentTopic?: string;
    AssignmentQueston?: string;
  } | null;
  attachments?: Array<{
    ATTACHMENT: string;
    FILE_NAME: string;
  }> | null;
  studAttachments?: Array<{
    ATTACHMENT?: string;
    FILE_NAME?: string;
    SUBMIT_DATE?: string;
  }> | null;
  AllowMaxNoOfFile?: number;
  IsErrorInService: boolean;
  Message?: string | null;
}

/**
 * Normalized assignment model consumed by Web & Android clients
 */
export interface NormalizedAssignment {
  id: string;
  asNo: number;
  title: string;
  courseNo: string;
  courseName: string;
  courseCode: string;
  createdDate: string;
  dueDate: string;
  cutoffDate: string;
  status: "Active" | "Expired";
  isExpired: boolean;
  isSubmitted: boolean;
  daysRemaining: number;
  result?: string;
  submissionCount?: number;
  description?: string;
  facultyAttachments?: Array<{ url: string; fileName: string }>;
  studentAttachments?: Array<{ url?: string; fileName?: string; submitDate?: string }>;
}
