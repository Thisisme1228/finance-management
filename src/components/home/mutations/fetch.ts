import { useSearchParams } from "next/navigation";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: from ? ["summary", { from, to, accountId }] : ["summary"],
    queryFn: async () => {
      const {
        status,
        data,
      }: {
        status: number;
        data: {
          incomeAmount: number;
          expensesAmount: number;
          remainingAmount: number;
          remainingChange: number;
          incomeChange: number;
          expensesChange: number;
          categories: {
            name: string;
            value: string;
          }[];
          days: {
            date: string;
            income: number;
            expenses: number;
          }[];
        };
      } = await kyInstance
        .get(
          "/api/summary",
          from ? { searchParams: { from, to, accountId } } : {}
        )
        .json();
      if (status !== 200) {
        throw new Error("Faild to fetch transactions");
      }
      return {
        ...data,
        incomeAmount: data?.incomeAmount,
        expensesAmount: data?.expensesAmount,
        remainingAmount: data?.remainingAmount,
        categories: data?.categories?.map((category) => ({
          ...category,
          value: parseFloat(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: day.income,
          expenses: day.expenses,
        })),
      };
    },
  });
  return query;
};
