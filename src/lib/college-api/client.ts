import querystring from "querystring";
import { ErpSessionHeaders } from "./types";

const DEFAULT_BASE_URL = "https://mapi.cgclerp.in/api/v2";

export interface CollegeApiOptions {
  method?: "POST" | "GET";
  body?: Record<string, any>;
  formData?: FormData;
  sessionHeaders?: Partial<ErpSessionHeaders>;
  timeoutMs?: number;
}

export class CollegeApiError extends Error {
  statusCode: number;
  isSessionExpired: boolean;
  data?: any;

  constructor(message: string, statusCode: number, isSessionExpired = false, data?: any) {
    super(message);
    this.name = "CollegeApiError";
    this.statusCode = statusCode;
    this.isSessionExpired = isSessionExpired;
    this.data = data;
  }
}

/**
 * Unified gateway client executing secure form-encoded calls against the college ERP gateway.
 */
export async function callCollegeApi<T = any>(
  endpoint: string,
  options: CollegeApiOptions = {}
): Promise<T> {
  const baseUrl = (process.env.COLLEGE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const method = options.method || "POST";
  const session = options.sessionHeaders || {};

  const isMultipart = Boolean(options.formData);
  const headers: Record<string, string> = {
    token: String(session.token ?? ""),
    uaType: String(session.uaType ?? "0"),
    id: String(session.id ?? "0"),
    idNo: String(session.idNo ?? "0"),
    regNo: String(session.regNo ?? "0"),
    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13; Build/TQ3A.230901.001)",
  };

  if (!isMultipart) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const reqBody = isMultipart
    ? options.formData
    : method === "POST" && options.body
    ? querystring.stringify(options.body)
    : undefined;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 15000);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: reqBody,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await res.text();
    let json: any = null;
    try {
      json = JSON.parse(text);
    } catch {
      // Non-JSON response
      if (!res.ok) {
        throw new CollegeApiError(
          `Gateway returned HTTP ${res.status}: ${text.slice(0, 100)}`,
          res.status
        );
      }
      return text as unknown as T;
    }

    // Check for business or session error
    if (res.status === 401 || (json && json.Message === "Your session expired")) {
      throw new CollegeApiError("Your college ERP session has expired. Please log in again.", 401, true, json);
    }

    if (json && json.IsErrorInService === true) {
      // If it's a soft message like "No Data found", return json gracefully rather than crashing
      if (typeof json.Message === "string" && json.Message.toLowerCase().includes("no data")) {
        return json as T;
      }
      throw new CollegeApiError(json.Message || "Service error from college gateway", res.status, false, json);
    }

    if (!res.ok && res.status !== 307) {
      throw new CollegeApiError(json?.Message || `Gateway error HTTP ${res.status}`, res.status, false, json);
    }

    return json as T;
  } catch (err: any) {
    clearTimeout(timeout);
    if (err instanceof CollegeApiError) throw err;
    if (err.name === "AbortError") {
      throw new CollegeApiError("Connection to College ERP gateway timed out. Please retry.", 504);
    }
    throw new CollegeApiError(err.message || "Failed to communicate with College ERP", 500);
  }
}
