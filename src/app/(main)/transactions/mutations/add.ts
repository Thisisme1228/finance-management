import { TransactionInfo } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const submitTransactionRequest = async (
  data: TransactionInfo
): Promise<{
  status?: string;
  message?: string;
  error?: string;
  data?: TransactionInfo | null;
}> =>
  kyInstance
    .post(`/api/transactions/table-data`, {
      json: data,
    })
    .json<{ message?: string; error?: string }>();

export function useSubmitTransactionMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isFirstPage } = useSelector(
    (state: RootState) => state.transactionPaginationModal
  );

  const mutation = useMutation({
    mutationFn: submitTransactionRequest,
    onSuccess: async (res: {
      status?: string;
      message?: string;
      error?: string;
      data?: TransactionInfo | null;
    }) => {
      // Update the query data or invalidate queries as needed
      toast({
        variant: res?.error ? "destructive" : "default",
        description: res.message || res.error,
      });

      if (res.status === "201") {
        const queries = queryClient.getQueryCache().getAll();
        queries.forEach((query) => {
          if (query.queryKey[0] === "transaction") {
            queryClient.invalidateQueries({ queryKey: query.queryKey });
          }
        });
      }
    },
    onError(error: Error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit transaction. Please try again.",
      });
    },
  });

  return mutation;
}
