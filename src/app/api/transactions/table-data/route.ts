import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getTransactionsDataInclude, TransactionsPage } from "@/lib/types";
import { NextRequest } from "next/server";
import { TransactionsSchema } from "@/lib/validation";
import {
  convertAmountFromMiliunits,
  convertAmountToMiliunits,
} from "@/lib/utils";
import { Decimal } from "@prisma/client/runtime/library";

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
      orderBy: { date: "desc" },
      take: pageSize,
      skip: pageIndex * pageSize,
    });

    const convertedData = transactions.map((transaction) => ({
      ...transaction,
      amount: new Decimal(
        convertAmountFromMiliunits(Number(transaction.amount))
      ),
    }));

    const data: TransactionsPage = {
      data: convertedData,
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

    const data = await req.json();
    const contentValidated = TransactionsSchema.parse(data);

    const amount = parseFloat(contentValidated.amount);
    const amountInMiliunits = convertAmountToMiliunits(amount);

    const newTransaction = await prisma.transaction.create({
      data: {
        ...contentValidated,
        userId: loggedInUser.id,
        amount: amountInMiliunits,
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

    const data = await req.json();
    const contentValidated = TransactionsSchema.parse(data);

    const amount = parseFloat(contentValidated.amount);
    const amountInMiliunits = convertAmountToMiliunits(amount);

    const updatedTransaction = await prisma.transaction.update({
      where: { id: data.id },
      data: {
        ...contentValidated,
        amount: amountInMiliunits,
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
