import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { subDays, parse, differenceInDays } from "date-fns";
import {
  calculatePercentage,
  convertAmountFromMiliunits,
  fillMissingDays,
} from "@/lib/utils";
import { NextRequest } from "next/server";

interface FinancialData {
  income: number;
  expenses: number;
  remaining: number;
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");
    const accountId = req.nextUrl.searchParams.get("accountId");
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;

    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    const accountIdCondition = accountId
      ? `AND transactions.account_id = '${accountId}'`
      : "";

    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ): Promise<FinancialData[]> {
      const query = `
      SELECT
        SUM(CASE WHEN amount >= 0 THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as expenses,
        SUM(amount) as remaining
      FROM transactions
      INNER JOIN accounts ON transactions.account_id = accounts.id
      WHERE accounts.user_id = '${userId}'
        AND transactions.date >= '${startDate.toISOString()}'
        AND transactions.date <= '${endDate.toISOString()}'
        ${accountIdCondition}
    `;

      return await prisma.$queryRawUnsafe<FinancialData[]>(query);
    }

    const [currentPeriod] = await fetchFinancialData(
      user.id,
      startDate,
      endDate
    );
    const [lastPeriod] = await fetchFinancialData(
      user.id,
      lastPeriodStart,
      lastPeriodEnd
    );

    const incomeChange = calculatePercentage(
      currentPeriod.income,
      lastPeriod.income
    );
    const expensesChange = calculatePercentage(
      currentPeriod.expenses,
      lastPeriod.expenses
    );
    const remainingChange = calculatePercentage(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    const query = `
        SELECT 
          categories.name AS name,
          SUM(ABS(transactions.amount)) AS value
        FROM transactions
        INNER JOIN accounts ON transactions.account_id = accounts.id
        INNER JOIN categories ON transactions.category_id = categories.id
        WHERE 
          accounts.user_id = '${user.id}'
          AND transactions.amount < 0
          AND transactions.date >= '${startDate.toISOString()}'
          AND transactions.date <= '${endDate.toISOString()}'
          ${accountIdCondition}
        GROUP BY categories.name
        ORDER BY SUM(ABS(transactions.amount)) DESC;
      `;

    const category: { name: string; value: number }[] =
      await prisma.$queryRawUnsafe(query);

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce(
      (sum, current) => sum + current.value,
      0
    );
    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Other",
        value: otherSum,
      });
    }

    const query2 = `
    SELECT 
      transactions.date AS date,
      SUM(CASE WHEN transactions.amount >= 0 THEN transactions.amount ELSE 0 END) AS income,
      SUM(CASE WHEN transactions.amount < 0 THEN ABS(transactions.amount) ELSE 0 END) AS expenses
    FROM transactions
    INNER JOIN accounts ON transactions.account_id = accounts.id
    WHERE 
      accounts.user_id = '${user.id}'
      AND transactions.date >= '${startDate.toISOString()}'
      AND transactions.date <= '${endDate.toISOString()}'
      ${accountIdCondition}
    GROUP BY transactions.date
    ORDER BY transactions.date;
  `;

    const activeDays: {
      date: Date;
      income: number;
      expenses: number;
    }[] = await prisma.$queryRawUnsafe(query2);
    console.log(activeDays);

    const days = fillMissingDays(activeDays, startDate, endDate);

    const convertedDays = days.map((day) => ({
      date: day.date.toISOString(),
      income: convertAmountFromMiliunits(day.income),
      expenses: convertAmountFromMiliunits(day.expenses),
    }));

    const convertedCategories = finalCategories.map((category) => ({
      name: category.name,
      value: convertAmountFromMiliunits(category.value),
    }));

    return Response.json({
      message: "Success",
      status: 200,
      data: {
        remainingAmount: convertAmountFromMiliunits(currentPeriod.remaining),
        remainingChange,
        incomeAmount: convertAmountFromMiliunits(currentPeriod.income),
        incomeChange,
        expensesAmount: convertAmountFromMiliunits(currentPeriod.expenses),
        expensesChange,
        categories: convertedCategories,
        days: convertedDays,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
