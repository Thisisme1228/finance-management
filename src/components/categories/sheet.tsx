import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { close } from "@/store/categorySlice";
import { returnFirstPage } from "@/store/categoryPaginationSlice";
import { RootState } from "@/store";
import { CategoryForm } from "./form";
import { CategoriesValues } from "@/lib/validation";
import { useSubmitCategoryMutation } from "@/app/(main)/categories/mutations/add";
import { useEditCategoryMutation } from "@/app/(main)/categories/mutations/edit";

const CategorySheet = () => {
  const dispatch = useDispatch();
  const addMutation = useSubmitCategoryMutation();
  const editMutation = useEditCategoryMutation();

  const { isOpen, data } = useSelector(
    (state: RootState) => state.categoryModal
  );
  const onSubmit = (name: CategoriesValues, id?: string) => {
    if (id) {
      editMutation.mutate(
        { name: name.name, id },
        {
          onSuccess: (res) => {
            if (!res.error) dispatch(close());
          },
        }
      );
    } else {
      addMutation.mutate(name, {
        onSuccess: (res) => {
          if (res.status === "201") {
            dispatch(returnFirstPage());
          }
          if (!res.error) dispatch(close());
        },
      });
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen) => !isOpen && dispatch(close())}
    >
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{data?.title}</SheetTitle>
          <SheetDescription>{data?.subtitle}</SheetDescription>
        </SheetHeader>
        <CategoryForm
          isPending={addMutation.isPending || editMutation.isPending}
          onSubmit={onSubmit}
          disabled={false}
          buttonText={data?.buttonText as string}
          id={data?.id}
          defaultValues={{
            name: data?.name || "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CategorySheet;
