"use server";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import prisma from "@/lib/prisma";
import { hash } from "argon2";
import { cookies } from "next/headers";
import { lucia } from "@/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";

interface ActionResult {
  error: string;
}

export async function signup(credentials: SignUpValues): Promise<ActionResult> {
  try {
    const { email, username, password } = signUpSchema.parse(credentials);
    const passwordHash = await hash(password);
    const userId = generateIdFromEntropySize(10); // 16 characters long

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
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }
    //A database transaction refers to a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
    await prisma.$transaction(async (tx) => {
      // Code running in a transaction...
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
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
