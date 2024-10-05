import { TransactionInfo } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { useSelector } from "react-redux";
import { removeEmptyAttributes } from "@/lib/utils";

const submitBulkTransactionRequest = async (
  data: TransactionInfo[]
): Promise<{
  status?: string;
  message?: string;
  error?: string;
  count?: number;
}> =>
  kyInstance
    .post(`/api/transactions/table-data-bulk`, {
      json: data,
    })
    .json<{ message?: string; error?: string }>();

export function useSubmitBulkTransactionMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitBulkTransactionRequest,
    onSuccess: async (res: {
      status?: string;
      message?: string;
      error?: string;
      count?: number;
    }) => {
      // Update the query data or invalidate queries as needed
      toast({
        variant: res?.error ? "destructive" : "default",
        description: res.message || res.error,
      });

      if (res.status === "201") {
        queryClient.invalidateQueries({ queryKey: ["transaction"] });
        queryClient.invalidateQueries({ queryKey: ["summary"] });
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
