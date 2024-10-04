import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getAccountDataInclude, AccountsPage } from "@/lib/types";
import { NextRequest } from "next/server";
import { AccountSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const pageSize = req.nextUrl.searchParams.get("pageSize");
    const pageIndex = req.nextUrl.searchParams.get("pageIndex");

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the total count of accounts
    const totalCount = await prisma.account.count({
      where: {
        user_id: user.id,
      },
    });

    // Fetch the paginated accounts
    let accounts = [];
    if (pageSize) {
      accounts = await prisma.account.findMany({
        where: {
          user_id: user.id,
        },
        include: getAccountDataInclude(),
        orderBy: { createdAt: "desc" },
        take: parseInt(pageSize),
        skip: parseInt(pageIndex ?? "0") * parseInt(pageSize),
      });
    } else {
      accounts = await prisma.account.findMany({
        where: {
          user_id: user.id,
        },
        include: getAccountDataInclude(),
        orderBy: { createdAt: "desc" },
      });
    }

    const data: AccountsPage = {
      data: accounts,
      totalCount,
    };
    console.log("data", data);
    return Response.json({ ...data, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
        user_id: loggedInUser.id,
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
        user_id: loggedInUser.id,
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

export async function DELETE(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const IdRequest = await req.json();
    const IdObj = Object.entries(IdRequest)[0];

    if (IdObj[0] === "id") {
      await prisma.account.deleteMany({
        where: {
          user_id: loggedInUser.id,
          id: IdRequest.id,
        },
      });
    } else {
      await prisma.account.deleteMany({
        where: {
          user_id: loggedInUser.id,
          id: {
            in: IdRequest.ids,
          },
        },
      });
    }

    return Response.json(
      { status: "200", message: "Account deleted" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name } = await req.json();
    const { name: contentValidated } = AccountSchema.parse({ name });

    const accountExisted = await prisma.account.findFirst({
      where: {
        user_id: loggedInUser.id,
        id: {
          not: id,
        },
        name: {
          equals: contentValidated,
          //Case-insensitive means the program ignores case and matches values regardless of their lower or upper case letters
          mode: "insensitive",
        },
      },
    });
    if (accountExisted) {
      return Response.json(
        {
          status: "200",
          error: "Account already taken",
        },
        { status: 200 }
      );
    }
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        name: contentValidated,
      },
    });
    return Response.json(
      {
        status: "200",
        message: "Successed to edit account",
        data: updatedAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
