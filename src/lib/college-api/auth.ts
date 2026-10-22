import { encryptCredential } from "./crypto";
import { callCollegeApi, CollegeApiError } from "./client";
import { CollegeAuthResponse, CollegeUserInfo } from "./types";

/**
 * Authenticates a student against the official CGCL MasterSoft gateway (POST /api/v2/initial/authv4)
 * using AES-256-CBC encrypted credentials.
 */
export async function loginToCollegeApi(
  username: string,
  password: string
): Promise<CollegeUserInfo> {
  const encUsername = encryptCredential(username.trim());
  const encPassword = encryptCredential(password);

  const res = await callCollegeApi<CollegeAuthResponse>("/initial/authv4", {
    method: "POST",
    body: {
      username: encUsername,
      password: encPassword,
    },
    sessionHeaders: {
      token: "",
      uaType: "0",
      id: "0",
      idNo: "0",
      regNo: "0",
    },
  });

  if (!res || res.IsErrorInService || !res.UserInfo) {
    throw new CollegeApiError(
      res?.Message || "Invalid username or password",
      307,
      false,
      res
    );
  }

  return res.UserInfo;
}
