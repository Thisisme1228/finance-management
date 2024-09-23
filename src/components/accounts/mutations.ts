import { AccountInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";

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
    .post(`/api/accounts/submit-account`, {
      json: { name },
    })
    .json<{ message?: string; error?: string }>();

export function useSubmitAccountMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      if (res.status === "201")
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError(error: Error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit account name. Please try again.",
      });
    },
  });

  return mutation;
}
