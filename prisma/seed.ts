import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Campus ERP database...\n");

  // ── Departments ──────────────────────────────────────────────────────────────
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: "CSE" },
      update: {},
      create: { name: "Computer Science & Engineering", code: "CSE" },
    }),
    prisma.department.upsert({
      where: { code: "ECE" },
      update: {},
      create: { name: "Electronics & Communication Engineering", code: "ECE" },
    }),
    prisma.department.upsert({
      where: { code: "ME" },
      update: {},
      create: { name: "Mechanical Engineering", code: "ME" },
    }),
    prisma.department.upsert({
      where: { code: "CE" },
      update: {},
      create: { name: "Civil Engineering", code: "CE" },
    }),
    prisma.department.upsert({
      where: { code: "MBA" },
      update: {},
      create: { name: "Master of Business Administration", code: "MBA" },
    }),
  ]);
  console.log(`✅ ${departments.length} departments created`);

  const cseDept = departments[0];

  // ── Academic Session ──────────────────────────────────────────────────────────
  const session = await prisma.academicSession.upsert({
    where: { id: "session-2024-25-odd" },
    update: {},
    create: {
      id: "session-2024-25-odd",
      name: "2024-25 Odd Semester",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-12-31"),
      isActive: true,
    },
  });
  console.log(`✅ Academic session created: ${session.name}`);

  // ── Courses ───────────────────────────────────────────────────────────────────
  const courses = await Promise.all([
    prisma.course.upsert({ where: { code: "CS301" }, update: {}, create: { name: "Data Structures & Algorithms", code: "CS301", departmentId: cseDept.id, credits: 4, semester: 3 } }),
    prisma.course.upsert({ where: { code: "CS302" }, update: {}, create: { name: "Database Management Systems", code: "CS302", departmentId: cseDept.id, credits: 4, semester: 3 } }),
    prisma.course.upsert({ where: { code: "CS303" }, update: {}, create: { name: "Operating Systems", code: "CS303", departmentId: cseDept.id, credits: 3, semester: 3 } }),
    prisma.course.upsert({ where: { code: "CS304" }, update: {}, create: { name: "Computer Networks", code: "CS304", departmentId: cseDept.id, credits: 3, semester: 3 } }),
    prisma.course.upsert({ where: { code: "CS305" }, update: {}, create: { name: "Software Engineering", code: "CS305", departmentId: cseDept.id, credits: 3, semester: 3, isElective: false } }),
    prisma.course.upsert({ where: { code: "CS401" }, update: {}, create: { name: "Machine Learning", code: "CS401", departmentId: cseDept.id, credits: 4, semester: 4, isElective: true } }),
  ]);
  console.log(`✅ ${courses.length} courses created`);

  // ── Admin User ────────────────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash("demo1234", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@demo.edu" },
    update: {},
    create: {
      email: "admin@demo.edu",
      password: adminPass,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`✅ Admin user: admin@demo.edu / demo1234`);

  // ── Faculty Users ─────────────────────────────────────────────────────────────
  const facultyPass = await bcrypt.hash("demo1234", 12);
  const facultyUser = await prisma.user.upsert({
    where: { email: "faculty@demo.edu" },
    update: {},
    create: {
      email: "faculty@demo.edu",
      password: facultyPass,
      role: "FACULTY",
      isActive: true,
    },
  });

  await prisma.faculty.upsert({
    where: { userId: facultyUser.id },
    update: {},
    create: {
      userId: facultyUser.id,
      employeeId: "FAC001",
      firstName: "Rajesh",
      lastName: "Kumar",
      designation: "Assistant Professor",
      qualification: "Ph.D. Computer Science",
      phone: "9876543210",
      departmentId: cseDept.id,
      joiningDate: new Date("2020-07-01"),
    },
  });
  console.log(`✅ Faculty user: faculty@demo.edu / demo1234`);

  const facultyUser2 = await prisma.user.upsert({
    where: { email: "faculty2@demo.edu" },
    update: {},
    create: {
      email: "faculty2@demo.edu",
      password: facultyPass,
      role: "FACULTY",
      isActive: true,
    },
  });
  const faculty2 = await prisma.faculty.upsert({
    where: { userId: facultyUser2.id },
    update: {},
    create: {
      userId: facultyUser2.id,
      employeeId: "FAC002",
      firstName: "Priya",
      lastName: "Sharma",
      designation: "Associate Professor",
      qualification: "M.Tech Computer Science",
      phone: "9876543211",
      departmentId: cseDept.id,
      joiningDate: new Date("2018-07-01"),
    },
  });

  // ── Student Users ─────────────────────────────────────────────────────────────
  const studentPass = await bcrypt.hash("demo1234", 12);

  const studentData = [
    { email: "student@demo.edu", enrollmentNo: "CSE2022001", firstName: "Arjun", lastName: "Mehta" },
    { email: "student2@demo.edu", enrollmentNo: "CSE2022002", firstName: "Priya", lastName: "Patel" },
    { email: "student3@demo.edu", enrollmentNo: "CSE2022003", firstName: "Rohan", lastName: "Singh" },
    { email: "student4@demo.edu", enrollmentNo: "CSE2022004", firstName: "Ananya", lastName: "Gupta" },
    { email: "student5@demo.edu", enrollmentNo: "CSE2022005", firstName: "Vikram", lastName: "Nair" },
  ];

  const createdStudents = [];
  for (const sd of studentData) {
    const user = await prisma.user.upsert({
      where: { email: sd.email },
      update: {},
      create: { email: sd.email, password: studentPass, role: "STUDENT", isActive: true },
    });
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        enrollmentNo: sd.enrollmentNo,
        firstName: sd.firstName,
        lastName: sd.lastName,
        gender: "MALE",
        phone: `987654${Math.floor(1000 + Math.random() * 9000)}`,
        departmentId: cseDept.id,
        currentSemester: 5,
        academicSessionId: session.id,
        admissionYear: 2022,
        parentName: "Parent " + sd.lastName,
        city: "Mumbai",
        state: "Maharashtra",
      },
    });
    createdStudents.push(student);
  }
  console.log(`✅ ${createdStudents.length} students created`);
  console.log(`   student@demo.edu / demo1234`);

  // ── Enrollments ───────────────────────────────────────────────────────────────
  for (const student of createdStudents) {
    for (const course of courses) {
      await prisma.courseEnrollment.upsert({
        where: { studentId_courseId_semester: { studentId: student.id, courseId: course.id, semester: 5 } },
        update: {},
        create: { studentId: student.id, courseId: course.id, semester: 5 },
      });
    }
  }
  console.log(`✅ Course enrollments created`);

  // ── Attendance Records ────────────────────────────────────────────────────────
  const faculty1 = await prisma.faculty.findUnique({ where: { userId: facultyUser.id } });

  const attendanceStatuses = ["PRESENT", "PRESENT", "PRESENT", "PRESENT", "ABSENT", "PRESENT", "LATE", "PRESENT"] as const;
  let attCount = 0;
  const today = new Date();

  for (const student of createdStudents) {
    for (const course of courses.slice(0, 4)) {
      // Last 30 days of attendance
      for (let day = 30; day >= 0; day--) {
        const date = new Date(today);
        date.setDate(date.getDate() - day);
        if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

        const statusIdx = Math.floor(Math.random() * attendanceStatuses.length);
        const status = attendanceStatuses[statusIdx];

        try {
          await prisma.attendanceRecord.upsert({
            where: {
              studentId_courseId_date_period: {
                studentId: student.id,
                courseId: course.id,
                date,
                period: 1,
              },
            },
            update: {},
            create: {
              studentId: student.id,
              courseId: course.id,
              date,
              period: 1,
              status,
              markedById: faculty1?.id,
            },
          });
          attCount++;
        } catch {}
      }
    }
  }
  console.log(`✅ ${attCount} attendance records created`);

  // ── Fee Invoices ──────────────────────────────────────────────────────────────
  let feeCount = 0;
  for (const student of createdStudents) {
    const inv = await prisma.feeInvoice.upsert({
      where: { invoiceNo: `INV-2024-${student.enrollmentNo}` },
      update: {},
      create: {
        studentId: student.id,
        academicSessionId: session.id,
        invoiceNo: `INV-2024-${student.enrollmentNo}`,
        totalAmount: 75000,
        paidAmount: student === createdStudents[0] ? 75000 : student === createdStudents[1] ? 37500 : 0,
        dueDate: new Date("2024-09-30"),
        status: student === createdStudents[0] ? "PAID" : student === createdStudents[1] ? "PARTIAL" : "PENDING",
        items: {
          create: [
            { description: "Tuition Fee", amount: 55000, category: "Tuition" },
            { description: "Library Fee", amount: 2000, category: "Library" },
            { description: "Lab Fee", amount: 8000, category: "Lab" },
            { description: "Development Fee", amount: 5000, category: "Development" },
            { description: "Examination Fee", amount: 5000, category: "Examination" },
          ],
        },
      },
    });
    feeCount++;

    // Add payment for paid student
    if (student === createdStudents[0]) {
      await prisma.payment.upsert({
        where: { receiptNo: `RCP-2024-${student.enrollmentNo}-001` },
        update: {},
        create: {
          invoiceId: inv.id,
          amount: 75000,
          method: "ONLINE",
          transactionId: "TXN123456789",
          receiptNo: `RCP-2024-${student.enrollmentNo}-001`,
          paidAt: new Date("2024-08-15"),
        },
      });
    }
  }
  console.log(`✅ ${feeCount} fee invoices created`);

  // ── Leave Applications ────────────────────────────────────────────────────────
  const mainStudent = createdStudents[0];
  await prisma.leaveApplication.upsert({
    where: { id: "leave-demo-001" },
    update: {},
    create: {
      id: "leave-demo-001",
      studentId: mainStudent.id,
      fromDate: new Date("2024-11-18"),
      toDate: new Date("2024-11-20"),
      reason: "Medical appointment and recovery",
      status: "APPROVED",
      approvedById: faculty1?.id,
      approverNote: "Get well soon!",
    },
  });
  await prisma.leaveApplication.upsert({
    where: { id: "leave-demo-002" },
    update: {},
    create: {
      id: "leave-demo-002",
      studentId: mainStudent.id,
      fromDate: new Date("2024-12-05"),
      toDate: new Date("2024-12-06"),
      reason: "Family function — sister's wedding",
      status: "PENDING",
    },
  });
  console.log(`✅ Leave applications created`);

  // ── Gate Passes ───────────────────────────────────────────────────────────────
  await prisma.gatePass.upsert({
    where: { id: "gatepass-demo-001" },
    update: {},
    create: {
      id: "gatepass-demo-001",
      studentId: mainStudent.id,
      reason: "Medical emergency at home",
      outDate: new Date("2024-11-15T14:00:00"),
      returnDate: new Date("2024-11-15T18:00:00"),
      status: "USED",
      approvedById: faculty1?.id,
    },
  });
  await prisma.gatePass.upsert({
    where: { id: "gatepass-demo-002" },
    update: {},
    create: {
      id: "gatepass-demo-002",
      studentId: mainStudent.id,
      reason: "College project site visit",
      outDate: new Date("2024-12-02T09:00:00"),
      returnDate: new Date("2024-12-02T17:00:00"),
      status: "PENDING",
    },
  });
  console.log(`✅ Gate passes created`);

  // ── Timetable ─────────────────────────────────────────────────────────────────
  const timetable = await prisma.timetable.upsert({
    where: { id: "tt-cse-s5-2024" },
    update: {},
    create: {
      id: "tt-cse-s5-2024",
      departmentId: cseDept.id,
      academicSessionId: session.id,
      semester: 5,
    },
  });

  const slots = [
    { courseIdx: 0, day: 0, start: "09:00", end: "10:00" },
    { courseIdx: 1, day: 0, start: "10:00", end: "11:00" },
    { courseIdx: 2, day: 1, start: "09:00", end: "10:00" },
    { courseIdx: 3, day: 1, start: "10:00", end: "11:00" },
    { courseIdx: 0, day: 2, start: "11:00", end: "12:00" },
    { courseIdx: 4, day: 2, start: "14:00", end: "15:00" },
    { courseIdx: 1, day: 3, start: "09:00", end: "10:00" },
    { courseIdx: 2, day: 3, start: "11:00", end: "12:00" },
    { courseIdx: 3, day: 4, start: "10:00", end: "11:00" },
    { courseIdx: 4, day: 4, start: "14:00", end: "15:00" },
  ];

  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    await prisma.timetableSlot.upsert({
      where: { id: `slot-${i}` },
      update: {},
      create: {
        id: `slot-${i}`,
        timetableId: timetable.id,
        courseId: courses[s.courseIdx].id,
        facultyId: faculty1?.id,
        dayOfWeek: s.day,
        startTime: s.start,
        endTime: s.end,
        room: `Room ${100 + s.courseIdx + s.day}`,
      },
    });
  }
  console.log(`✅ Timetable with ${slots.length} slots created`);

  // ── Exam & Results ────────────────────────────────────────────────────────────
  const exam = await prisma.exam.upsert({
    where: { id: "exam-mid-2024" },
    update: {},
    create: {
      id: "exam-mid-2024",
      name: "Mid-Term Examination 2024",
      academicSessionId: session.id,
      startDate: new Date("2024-10-07"),
      endDate: new Date("2024-10-14"),
      status: "COMPLETED",
    },
  });

  for (let i = 0; i < courses.slice(0, 4).length; i++) {
    const course = courses[i];
    const sub = await prisma.examSubject.upsert({
      where: { id: `examsub-${i}` },
      update: {},
      create: {
        id: `examsub-${i}`,
        examId: exam.id,
        courseId: course.id,
        date: new Date(`2024-10-0${7 + i}`),
        startTime: "09:00",
        endTime: "12:00",
        room: `Hall ${i + 1}`,
        maxMarks: 50,
        passingMarks: 20,
      },
    });

    // Mark entries
    for (const student of createdStudents) {
      const marks = Math.floor(25 + Math.random() * 25);
      await prisma.markEntry.upsert({
        where: { id: `mark-mid-${student.id}-${course.id}` },
        update: {},
        create: {
          id: `mark-mid-${student.id}-${course.id}`,
          studentId: student.id,
          courseId: course.id,
          examSubjectId: sub.id,
          marksObtained: marks,
          maxMarks: 50,
          type: "External",
          enteredById: faculty1?.id,
        },
      });

      // Internal marks
      const internalMarks = Math.floor(15 + Math.random() * 10);
      await prisma.markEntry.upsert({
        where: { id: `mark-int-${student.id}-${course.id}` },
        update: {},
        create: {
          id: `mark-int-${student.id}-${course.id}`,
          studentId: student.id,
          courseId: course.id,
          marksObtained: internalMarks,
          maxMarks: 25,
          type: "Internal",
          enteredById: faculty1?.id,
        },
      });
    }

    // Exam registrations
    for (const student of createdStudents) {
      await prisma.examRegistration.upsert({
        where: { studentId_examId: { studentId: student.id, examId: exam.id } },
        update: {},
        create: {
          studentId: student.id,
          examId: exam.id,
          hallTicketNo: `HT2024${student.enrollmentNo}`,
        },
      });
    }
  }
  console.log(`✅ Exam, marks, and hall tickets created`);

  // ── Notices ───────────────────────────────────────────────────────────────────
  const notices = [
    { title: "Mid-Term Examination Schedule Released", content: "The mid-term examination schedule for odd semester 2024-25 has been released. Students are requested to check their respective department notice boards and the ERP portal for subject-wise schedules. Hall tickets will be available for download from 5th October onwards.", audience: "STUDENTS" },
    { title: "Fee Payment Deadline — Last Date 30 Sept", content: "Students who have not paid their semester fees are reminded that the last date for fee payment is 30th September 2024. A late fine of ₹500/day will be charged after the due date. Contact the accounts office for any queries.", audience: "STUDENTS" },
    { title: "Technical Fest — Technova 2024", content: "The annual technical festival 'Technova 2024' will be held on 15th-17th November 2024. Students interested in participating should register through the ERP portal. Events include hackathon, paper presentation, project exhibition, and coding competitions.", audience: "ALL" },
    { title: "Faculty Meeting — Department Heads", content: "A mandatory meeting for all department heads and faculty members is scheduled for 25th October 2024 at 3:00 PM in the Conference Hall. Agenda: Academic performance review and curriculum updates.", audience: "FACULTY" },
  ] as const;

  for (let i = 0; i < notices.length; i++) {
    const n = notices[i];
    await prisma.notice.upsert({
      where: { id: `notice-${i + 1}` },
      update: {},
      create: {
        id: `notice-${i + 1}`,
        title: n.title,
        content: n.content,
        audience: n.audience as any,
        authorId: adminUser.id,
        isPinned: i === 0,
      },
    });
  }
  console.log(`✅ ${notices.length} notices created`);

  // ── Pay Slip ──────────────────────────────────────────────────────────────────
  if (faculty1) {
    await prisma.paySlip.upsert({
      where: { facultyId_month_year: { facultyId: faculty1.id, month: 10, year: 2024 } },
      update: {},
      create: {
        facultyId: faculty1.id,
        month: 10,
        year: 2024,
        basicPay: 65000,
        allowances: 18500,
        deductions: 9000,
        netPay: 74500,
      },
    });
    await prisma.paySlip.upsert({
      where: { facultyId_month_year: { facultyId: faculty1.id, month: 9, year: 2024 } },
      update: {},
      create: {
        facultyId: faculty1.id,
        month: 9,
        year: 2024,
        basicPay: 65000,
        allowances: 18500,
        deductions: 9000,
        netPay: 74500,
      },
    });
  }
  console.log(`✅ Pay slips created`);

  console.log("\n🎉 Database seeded successfully!\n");
  console.log("Demo accounts:");
  console.log("  Student : student@demo.edu  / demo1234");
  console.log("  Faculty : faculty@demo.edu  / demo1234");
  console.log("  Admin   : admin@demo.edu    / demo1234\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
