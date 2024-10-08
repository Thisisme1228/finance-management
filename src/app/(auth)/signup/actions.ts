"use server";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import prisma from "@/lib/prisma";
import { hash } from "argon2";
import { cookies } from "next/headers";
import { lucia } from "@/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";

// interface ActionResult {
//   error: string;
// }

export async function signup(credentials: SignUpValues) {
  try {
    const { email, username, password, phone, OTP } =
      signUpSchema.parse(credentials);
    const passwordHash = await hash(password);
    const userId = generateIdFromEntropySize(10); // 16 characters long

    // Check if the verification code is correct
    const verification = await prisma.verification.findUnique({
      where: { phone },
    });

    if (!verification || verification.code !== OTP) {
      return {
        error: "Invalid verification code",
      };
    }

    // TODO: check if username is already used
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          //Case-insensitive means the program ignores case and matches values regardless of their lower or upper case letters
          mode: "insensitive",
        },
      },
    });
    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingPhoneNumber = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (existingPhoneNumber) {
      return { error: "Phone number already taken" };
    }
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return { error: "Email already taken" };
    }
    //A database category refers to a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
    await prisma.$transaction(async (tx) => {
      // Code running in a category...
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
          phone,
        },
      });
      await tx.verification.delete({
        where: { phone },
      });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
