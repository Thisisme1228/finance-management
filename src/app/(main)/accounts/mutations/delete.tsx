import { AccountInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";

const deleteAccountRequest = async (
  data: { id: string } | { ids: string[] }
): Promise<{
  status?: string;
  message?: string;
  error?: string;
  data?: AccountInfo | null;
}> => {
  const IdObj = Object.entries(data)[0];
  return kyInstance
    .delete(`/api/accounts/table-data`, {
      json: { [IdObj[0]]: IdObj[1] },
    })
    .json<{ message?: string; error?: string }>();
};

export function useDeleteAccountMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAccountRequest,
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
        description: "Failed to delete account. Please try again.",
      });
    },
  });

  return mutation;
}
