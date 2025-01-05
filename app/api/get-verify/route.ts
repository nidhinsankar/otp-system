import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({
      isValid: false,
      message: "Authorization header missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({
      isValid: true,
      message: "Token is valid",
    });
  } catch {
    return NextResponse.json({
      isValid: false,
      message: "Invalid or expired token",
    });
  }
}
