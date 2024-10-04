import { TransactionInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";

const deleteTransactionRequest = async (
  data: { id: string } | { ids: string[] }
): Promise<{
  status?: string;
  message?: string;
  error?: string;
  data?: TransactionInfo | null;
}> => {
  const IdObj = Object.entries(data)[0];
  return kyInstance
    .delete(`/api/transactions/table-data`, {
      json: { [IdObj[0]]: IdObj[1] },
    })
    .json<{ message?: string; error?: string }>();
};

export function useDeleteTransactionMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTransactionRequest,
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
        description: "Failed to delete transaction. Please try again.",
      });
    },
  });

  return mutation;
}
