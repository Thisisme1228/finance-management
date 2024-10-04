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
      const { status, data } = await kyInstance
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
        incomeAmount: data.incomeAmount,
        expensesAmount: data.expensesAmount,
        remainingAmount: data.remainingAmount,
        categories: data.categories.map((category) => ({
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
