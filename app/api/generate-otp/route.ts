import { generateOTP, generateSessionId } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const schema = z.object({
    phoneNumber: z.string().regex(/^\+\d{10,15}$/),
  });

  try {
    const { phoneNumber } = schema.parse(body);
    const otp = generateOTP();
    const sessionId = generateSessionId();
    await db.oTPUserSession.create({
      data: {
        otp: otp,
        sessionId: sessionId,
        phoneNumber: phoneNumber,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "OTP sent sucessfully",
      otp,
      sessionId,
    });
  } catch (error) {
    return NextResponse.json({ message: "db error", error });
  }
}
