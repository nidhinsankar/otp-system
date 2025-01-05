import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
export async function POST(req: NextRequest) {
  const schema = z.object({
    sessionId: z.string().regex(/^[a-f0-9]{40}[\da-t]+$/),
    otp: z.string().length(6),
  });

  try {
    const body = await req.json();
    const { otp, sessionId } = schema.parse(body);

    const session = await db.oTPUserSession.findUnique({
      where: { sessionId },
    });
    if (!session) {
      return NextResponse.json({ message: "Invalid OTP" });
    }
    if (session.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" });
    }
    await db.oTPUserSession.update({
      where: { sessionId },
      data: { isVerified: true },
    });

    const jwt_token = jwt.sign({ sessionId }, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });
    return NextResponse.json({ message: "Otp verfied sucessfully", jwt_token });
  } catch (error) {
    return NextResponse.json({ message: "otp verification failed", error });
  }
}
