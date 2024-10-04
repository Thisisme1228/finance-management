import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { close } from "@/store/transactionSlice";
import { returnFirstPage } from "@/store/transactionPaginationSlice";
import { RootState } from "@/store";
import { TransactionForm } from "./form";
import { TransactionInfo } from "@/lib/types";
import { useSubmitTransactionMutation } from "@/app/(main)/transactions/mutations/add";
import { useEditTransactionMutation } from "@/app/(main)/transactions/mutations/edit";
import { useSubmitAccountMutation } from "@/app/(main)/accounts/mutations/add";
import { useSubmitCategoryMutation } from "@/app/(main)/categories/mutations/add";
import { fetchData as fetchCategoriesData } from "@/app/(main)/categories/mutations/fetch";
import { fetchData as fetchAccounstData } from "@/app/(main)/accounts/mutations/fetch";
import { useEffect, useState } from "react";

const TransactionSheet = () => {
  const dispatch = useDispatch();
  const addMutation = useSubmitTransactionMutation();
  const editMutation = useEditTransactionMutation();
  const submitAccountMutation = useSubmitAccountMutation();
  const submitCategoryMutation = useSubmitCategoryMutation();
  type Props = { value: string; label: string };
  const [categoryData, setCategoryData] = useState<Props[]>([]);
  const [accountData, setAccountData] = useState<Props[]>([]);
  const { isOpen, data } = useSelector(
    (state: RootState) => state.transactionModal
  );

  useEffect(() => {
    if (isOpen) {
      fetchCategoriesData().then(({ rows }) => {
        const categoryData = rows?.map(
          (category: { name: string; id: string }) => ({
            label: category.name,
            value: category.id,
          })
        );
        setCategoryData(categoryData ?? []);
      });

      fetchAccounstData().then(({ rows }) => {
        const accountData = rows?.map(
          (account: { name: string; id: string }) => ({
            label: account.name,
            value: account.id,
          })
        );
        setAccountData(accountData ?? []);
      });
    }
  }, [isOpen]);

  const onCreateCategory = (name: string) =>
    submitCategoryMutation.mutate({
      name,
    });

  const onCreateAccount = (name: string) =>
    submitAccountMutation.mutate({
      name,
    });

  const onSubmit = (values: TransactionInfo) => {
    if (values.id) {
      editMutation.mutate(
        { ...values },
        {
          onSuccess: (res) => {
            if (!res.error) dispatch(close());
          },
        }
      );
    } else {
      addMutation.mutate(values, {
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
      <SheetContent className="overflow-auto space-y-4">
        <SheetHeader>
          <SheetTitle>{data?.title}</SheetTitle>
          <SheetDescription>{data?.subtitle}</SheetDescription>
        </SheetHeader>
        <TransactionForm
          isPending={addMutation.isPending || editMutation.isPending}
          onSubmit={onSubmit}
          onCreateAccount={onCreateAccount}
          onCreateCategory={onCreateCategory}
          disabled={false}
          buttonText={data?.buttonText as string}
          data={data?.data}
          accountOptions={accountData}
          categoryOptions={categoryData}
        />
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSheet;
