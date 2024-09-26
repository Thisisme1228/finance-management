import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getTransactionsDataInclude, TransactionsPage } from "@/lib/types";
import { NextRequest } from "next/server";
import { TransactionsSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") ?? "10");
    const pageIndex = parseInt(
      req.nextUrl.searchParams.get("pageIndex") ?? "0"
    );
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the total count of transaction
    const totalCount = await prisma.transaction.count({
      where: {
        userId: user.id,
      },
    });

    // Fetch the paginated transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      include: getTransactionsDataInclude(),
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: pageIndex * pageSize,
    });

    const data: TransactionsPage = {
      data: transactions,
      totalCount,
    };

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
    const { name: contentValidated } = TransactionsSchema.parse({ name });

    // TODO: check if transaction is already used
    const existingTransactionname = await prisma.transaction.findFirst({
      where: {
        userId: loggedInUser.id,
        name: {
          equals: contentValidated,
          //Case-insensitive means the program ignores case and matches values regardless of their lower or upper case letters
          mode: "insensitive",
        },
      },
    });
    if (existingTransactionname) {
      return Response.json(
        { error: "Transaction already taken" },
        { status: 200 }
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        name: contentValidated,
        userId: loggedInUser.id,
      },
    });

    return Response.json(
      { status: "201", message: "Transaction created", data: newTransaction },
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
      await prisma.transaction.deleteMany({
        where: {
          userId: loggedInUser.id,
          id: IdRequest.id,
        },
      });
    } else {
      await prisma.transaction.deleteMany({
        where: {
          userId: loggedInUser.id,
          id: {
            in: IdRequest.ids,
          },
        },
      });
    }

    return Response.json(
      { status: "200", message: "Transaction deleted" },
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
    const { name: contentValidated } = TransactionsSchema.parse({ name });

    const transactionExisted = await prisma.transaction.findFirst({
      where: {
        userId: loggedInUser.id,
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
    if (transactionExisted) {
      return Response.json(
        {
          status: "200",
          error: "Transaction already taken",
        },
        { status: 200 }
      );
    }
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        name: contentValidated,
      },
    });
    return Response.json(
      {
        status: "200",
        message: "Successed to edit transaction",
        data: updatedTransaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
