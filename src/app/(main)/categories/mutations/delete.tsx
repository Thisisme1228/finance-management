import { CategoryInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";

const deleteCategoryRequest = async (
  data: { id: string } | { ids: string[] }
): Promise<{
  status?: string;
  message?: string;
  error?: string;
  data?: CategoryInfo | null;
}> => {
  const IdObj = Object.entries(data)[0];
  return kyInstance
    .delete(`/api/categories/table-data`, {
      json: { [IdObj[0]]: IdObj[1] },
    })
    .json<{ message?: string; error?: string }>();
};

export function useDeleteCategoryMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategoryRequest,
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
        description: "Failed to delete category. Please try again.",
      });
    },
  });

  return mutation;
}
