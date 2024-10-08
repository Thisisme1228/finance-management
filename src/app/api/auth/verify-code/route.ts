import prisma from "@/lib/prisma";
import Core from "@alicloud/pop-core";
import { NextRequest } from "next/server";

// Configure Alibaba Cloud SMS client
const client = new Core({
  accessKeyId: `${process.env.NEXT_ALIBABA_ACCESS_KEY_ID}`,
  accessKeySecret: `${process.env.NEXT_ALIBABA_ACCESS_KEY_SECRET}`,
  endpoint: "https://dysmsapi.aliyuncs.com",
  apiVersion: "2017-05-25",
});

export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get("phone");
    const code = req.nextUrl.searchParams.get("code");

    if (!phone || !code) {
      return Response.json({ error: "Invalid phone or code" }, { status: 200 });
    }

    const verification = await prisma.verification.findUnique({
      where: { phone: phone },
    });

    if (!verification || verification.code !== code) {
      return Response.json(
        { error: "Invalid verification code" },
        { status: 200 }
      );
    }

    // Optionally, you can delete the verification code after successful verification
    await prisma.verification.delete({
      where: { phone: phone },
    });

    return Response.json({
      message: "Success",
      status: 200,
    });
  } catch (error) {
    console.log("Error sending SMS:", error);
    return Response.json({
      message: "Error",
      status: 500,
      error: "Failed to send SMS",
    });
  }
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
}
