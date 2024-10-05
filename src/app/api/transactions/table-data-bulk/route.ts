import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  getTransactionsDataInclude,
  TransactionInfo,
  TransactionsPage,
} from "@/lib/types";
import { NextRequest } from "next/server";
import { TransactionsSchema } from "@/lib/validation";
import {
  convertAmountFromMiliunits,
  convertAmountToMiliunits,
} from "@/lib/utils";
import { json } from "stream/consumers";

export async function POST(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const contentValidated = data.map((item: TransactionInfo) => {
      const amount = parseFloat(item.amount as string);
      const amountInMiliunits = convertAmountToMiliunits(amount);
      const data = TransactionsSchema.parse(item);
      return {
        ...data,
        amount: amountInMiliunits,
        userId: loggedInUser.id,
      };
    });

    const newTransaction = await prisma.transaction.createMany({
      data: contentValidated,
    });

    return Response.json(
      {
        status: "201",
        message: "Transaction created",
        count: newTransaction.count,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
