import { TransactionInfo } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";

const editTransactionRequest = async (
  data: TransactionInfo
): Promise<{
  status?: string;
  message?: string;
  error?: string;
}> =>
  kyInstance
    .patch(`/api/transactions/table-data`, {
      json: data,
    })
    .json<{ message?: string; error?: string }>();

export function useEditTransactionMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editTransactionRequest,
    onSuccess: async (res: {
      status?: string;
      message?: string;
      error?: string;
    }) => {
      // Update the query data or invalidate queries as needed
      toast({
        variant: res?.error ? "destructive" : "default",
        description: res.message || res.error,
      });

      if (res.status === "200") {
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
        description: "Failed to edit transaction. Please try again.",
      });
    },
  });

  return mutation;
}
