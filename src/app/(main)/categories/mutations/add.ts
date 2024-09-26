import { CategoryInfo } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const submitCategoryRequest = async ({
  name,
}: {
  name: string;
}): Promise<{
  status?: string;
  message?: string;
  error?: string;
  data?: CategoryInfo | null;
}> =>
  kyInstance
    .post(`/api/categories/table-data`, {
      json: { name },
    })
    .json<{ message?: string; error?: string }>();

export function useSubmitCategoryMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isFirstPage } = useSelector(
    (state: RootState) => state.categoryPaginationModal
  );

  const mutation = useMutation({
    mutationFn: submitCategoryRequest,
    onSuccess: async (res: {
      status?: string;
      message?: string;
      error?: string;
      data?: CategoryInfo | null;
    }) => {
      // Update the query data or invalidate queries as needed
      toast({
        variant: res?.error ? "destructive" : "default",
        description: res.message || res.error,
      });

      if (res.status === "201") {
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
        description: "Failed to submit category. Please try again.",
      });
    },
  });

  return mutation;
}
