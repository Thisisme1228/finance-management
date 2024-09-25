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

      if (res.status === "200")
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
