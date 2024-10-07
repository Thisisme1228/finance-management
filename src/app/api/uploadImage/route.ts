// Import necessary modules
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import OSS from "ali-oss";
import { validateRequest } from "@/auth";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { randomUUID } from "crypto";

// Configure Alibaba Cloud OSS client
const client = new OSS({
  region: `${process.env.NEXT_ALIBABA_REGION}`,
  accessKeyId: `${process.env.NEXT_ALIBABA_ACCESS_KEY_ID}`,
  accessKeySecret: `${process.env.NEXT_ALIBABA_ACCESS_KEY_SECRET}`,
  bucket: `${process.env.NEXT_ALIBABA_BUCKET}`,
});

async function uploadToAlibaba(buffer: Buffer, filename: string) {
  try {
    const result = await client.put(filename, buffer);
    console.log("File uploaded to Alibaba Cloud OSS:", result.url);
    return result.url;
  } catch (error) {
    console.error("Error uploading to Alibaba Cloud OSS:", error);
    throw error;
  }
}

// 生成预签名URL
async function generatePresignedUrl(filename: string): Promise<string> {
  try {
    const url = client.signatureUrl(filename, { expires: 3600 }); // URL有效期为1小时
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

// Define the POST handler for the file upload
export const POST = async (req: NextRequest) => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the incoming form data
    const formData = await req.formData();

    // Get the file from the form data
    const file = formData.get("file");

    // Check if a file is received
    if (!file) {
      // If no file is received, return a JSON response with an error and a 400 status code
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }

    // Convert the file data to a Buffer
    const buffer = Buffer.from(await (file as Blob).arrayBuffer());

    // Replace spaces in the file name with underscores
    // const filename = file.name.replaceAll(" ", "_");
    const filename = `images/${dayjs().format("YYYY-MM-DD")}/${randomUUID()}.webp`;

    // Write the file to the specified directory (public/assets) with the modified filename
    // await writeFile(
    //   path.join(process.cwd(), "public/" + filename),
    //   new Uint8Array(buffer)
    // );

    // Upload the file to Alibaba Cloud OSS
    const alibabaUrl = await uploadToAlibaba(buffer, filename);

    // 生成预签名URL
    // const presignedUrl = await generatePresignedUrl(filename);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl: `${process.env.NEXT_ALIBABA_ACCESS_ADDRESS + `/` + filename}`,
      },
    });

    // Return a JSON response with a success message and a 201 status code
    return NextResponse.json({
      Message: "Success",
      status: 201,
      avatarUrl: `${process.env.NEXT_ALIBABA_ACCESS_ADDRESS + `/` + filename}`,
    });
  } catch (error) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
    console.log("Error occurred ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
