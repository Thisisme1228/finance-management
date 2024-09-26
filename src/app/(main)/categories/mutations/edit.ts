import { CategoryInfo } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";

const editCategoryRequest = async (
  data: CategoryInfo
): Promise<{
  status?: string;
  message?: string;
  error?: string;
}> =>
  kyInstance
    .patch(`/api/categories/table-data`, {
      json: data,
    })
    .json<{ message?: string; error?: string }>();

export function useEditCategoryMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editCategoryRequest,
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
          if (query.queryKey[0] === "category") {
            queryClient.invalidateQueries({ queryKey: query.queryKey });
          }
        });
      }
    },
    onError(error: Error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to edit category. Please try again.",
      });
    },
  });

  return mutation;
}
