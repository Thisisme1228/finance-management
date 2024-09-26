import { AccountInfo } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const submitAccountRequest = async ({
  name,
}: {
  name: string;
}): Promise<{
  status?: string;
  message?: string;
  error?: string;
  data?: AccountInfo | null;
}> =>
  kyInstance
    .post(`/api/accounts/table-data`, {
      json: { name },
    })
    .json<{ message?: string; error?: string }>();

export function useSubmitAccountMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isFirstPage } = useSelector(
    (state: RootState) => state.accountPaginationModal
  );

  const mutation = useMutation({
    mutationFn: submitAccountRequest,
    onSuccess: async (res: {
      status?: string;
      message?: string;
      error?: string;
      data?: AccountInfo | null;
    }) => {
      // Update the query data or invalidate queries as needed
      toast({
        variant: res?.error ? "destructive" : "default",
        description: res.message || res.error,
      });

      if (res.status === "201") {
        const queries = queryClient.getQueryCache().getAll();
        queries.forEach((query) => {
          if (query.queryKey[0] === "account") {
            queryClient.invalidateQueries({ queryKey: query.queryKey });
          }
        });
      }
    },
    onError(error: Error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit account. Please try again.",
      });
    },
  });

  return mutation;
}
