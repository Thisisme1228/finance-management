import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { AccountSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    const { name: contentValidated } = AccountSchema.parse({ name });

    // TODO: check if account is already used
    const existingAccountname = await prisma.account.findFirst({
      where: {
        name: {
          equals: contentValidated,
          //Case-insensitive means the program ignores case and matches values regardless of their lower or upper case letters
          mode: "insensitive",
        },
      },
    });
    if (existingAccountname) {
      return Response.json({ error: "Account already taken" }, { status: 200 });
    }

    const newAccount = await prisma.account.create({
      data: {
        name: contentValidated,
        userId: loggedInUser.id,
      },
    });

    return Response.json(
      { status: "201", message: "Account created", data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
