import prisma from "@/lib/prisma";
import Core from "@alicloud/pop-core";

// Configure Alibaba Cloud SMS client
const client = new Core({
  accessKeyId: `${process.env.NEXT_ALIBABA_ACCESS_KEY_ID}`,
  accessKeySecret: `${process.env.NEXT_ALIBABA_ACCESS_KEY_SECRET}`,
  endpoint: "https://dysmsapi.aliyuncs.com",
  apiVersion: "2017-05-25",
});

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    const existingPhoneNumber = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (!existingPhoneNumber) {
      return Response.json({
        message: "Error",
        status: 200,
        error: "Phone number not found",
      });
    }

    const code = generateVerificationCode();

    const params = {
      RegionId: `${process.env.NEXT_ALIBABA_REGION_ID}`,
      PhoneNumbers: phone,
      SignName: `${process.env.NEXT_ALIBABA_SIGN_NAME}`,
      TemplateCode: `${process.env.NEXT_ALIBABA_TEMPLATE_CODE}`,
      TemplateParam: JSON.stringify({ code }),
    };

    const requestOption = {
      method: "POST",
    };

    const result: { Code: string } = await client.request(
      "SendSms",
      params,
      requestOption
    );

    // Store the verification code in the database
    await prisma.verification.upsert({
      where: { phone: phone },
      update: { code, createdAt: new Date() },
      create: { phone: phone, code },
    });

    return Response.json({
      message: "Success",
      status: 200,
      data: result.Code,
      error: "",
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
