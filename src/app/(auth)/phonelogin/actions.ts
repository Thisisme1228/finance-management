"use server";
import { cookies } from "next/headers";
import { lucia } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function verifyLogin({
  phone,
  OTP,
}: {
  phone: string;
  OTP: string;
}) {
  try {
    const verification = await prisma.verification.findUnique({
      where: { phone },
    });

    if (!verification || verification.code !== OTP) {
      return { error: "Invalid verification code" };
    }

    // Optionally, delete the verification code after successful verification
    await prisma.verification.delete({
      where: { phone },
    });

    const userInfo = await prisma.user.findFirst({
      where: {
        phone,
      },
    });

    if (userInfo) {
      // Handle successful login logic here
      const session = await lucia.createSession(userInfo.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return redirect("/");
    }
    return { error: "User not found" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error verifying login:", error);
    return { error: "Failed to login" };
  }
}
