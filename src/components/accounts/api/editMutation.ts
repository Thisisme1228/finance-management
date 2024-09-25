import { AccountInfo } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";

const editAccountRequest = async (
  data: AccountInfo
): Promise<{
  status?: string;
  message?: string;
  error?: string;
}> =>
  kyInstance
    .patch(`/api/accounts/table-data`, {
      json: data,
    })
    .json<{ message?: string; error?: string }>();

export function useEditAccountMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editAccountRequest,
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
        description: "Failed to edit account. Please try again.",
      });
    },
  });

  return mutation;
}
