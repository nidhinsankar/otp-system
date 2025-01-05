import * as crypto from "node:crypto";
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSessionId() {
  const id = crypto.randomBytes(20).toString("hex");
  const timestamp = Date.now().toString(30);
  return `${id}${timestamp}`;
}
