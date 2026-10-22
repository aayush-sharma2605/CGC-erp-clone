import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return { redirect: NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL!)) };
  }
  return { session };
}

export async function requireRole(allowedRoles: string[]) {
  const { session, redirect } = await requireAuth() as any;
  if (redirect) return { redirect };
  const role = (session.user as any).role;
  if (!allowedRoles.includes(role)) {
    return { redirect: NextResponse.redirect(new URL("/unauthorized", process.env.NEXTAUTH_URL!)) };
  }
  return { session };
}
