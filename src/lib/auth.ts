import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginToCollegeApi } from "@/lib/college-api/auth";
import { CollegeApiError } from "@/lib/college-api/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "College ID / Username / Email", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = ((credentials?.username || credentials?.email) as string)?.trim();
        const password = credentials?.password as string;

        if (!identifier || !password) return null;

        const isDemoAllowed = process.env.ENABLE_DEMO_MODE === "true";
        const isDemoUser =
          isDemoAllowed &&
          (identifier === "student@demo.edu" ||
            identifier === "faculty@demo.edu" ||
            identifier === "admin@demo.edu");

        // ── 1. Demo Mode Authentication (Explicitly gated) ──
        if (isDemoUser) {
          const user = await prisma.user.findUnique({
            where: { email: identifier },
            include: {
              student: { select: { id: true, firstName: true, lastName: true, enrollmentNo: true, departmentId: true } },
              faculty: { select: { id: true, firstName: true, lastName: true, employeeId: true, departmentId: true } },
            },
          });

          if (!user || !user.isActive) return null;
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            isRealAccount: false,
            name: user.student
              ? `${user.student.firstName} ${user.student.lastName}`
              : user.faculty
              ? `${user.faculty.firstName} ${user.faculty.lastName}`
              : user.email,
            profileId: user.student?.id ?? user.faculty?.id ?? null,
            enrollmentNo: user.student?.enrollmentNo ?? user.faculty?.employeeId ?? null,
            departmentId: user.student?.departmentId ?? user.faculty?.departmentId ?? null,
          };
        }

        // ── 2. Official College ERP API Authentication (Live CGCL Gateway) ──
        try {
          const userInfo = await loginToCollegeApi(identifier, password);

          return {
            id: `cgc-${userInfo.IdNo || userInfo.UaNo}`,
            email: userInfo.Email || `${userInfo.RegNo.toLowerCase()}@college.edu`,
            name: userInfo.UserName,
            role: "STUDENT",
            isRealAccount: true,
            collegeSession: {
              token: userInfo.Token,
              uaType: userInfo.UaType,
              id: userInfo.UaNo,
              idNo: userInfo.IdNo,
              regNo: userInfo.RegNo,
              currentSessionNo: userInfo.currentSessionNo || userInfo.SessionNo || 0,
              sectionNo: userInfo.SectionNo || 0,
              currentSemesterNo: userInfo.currentSemesterNo || userInfo.SemesterNo || 1,
            },
            profileId: String(userInfo.IdNo || userInfo.UaNo),
            enrollmentNo: userInfo.RegNo,
            departmentId: String(userInfo.CollegeId || "1"),
          };
        } catch (err: any) {
          if (err instanceof CollegeApiError) {
            throw new Error(err.message);
          }
          throw new Error("Unable to connect to College ERP server. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.profileId = (user as any).profileId;
        token.enrollmentNo = (user as any).enrollmentNo;
        token.departmentId = (user as any).departmentId;
        token.isRealAccount = (user as any).isRealAccount ?? false;
        token.collegeSession = (user as any).collegeSession ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).profileId = token.profileId;
        (session.user as any).enrollmentNo = token.enrollmentNo;
        (session.user as any).departmentId = token.departmentId;
        (session.user as any).isRealAccount = token.isRealAccount ?? false;
        (session.user as any).collegeSession = token.collegeSession ?? null;
      }
      return session;
    },
  },
});
