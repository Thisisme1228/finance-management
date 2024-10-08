"use client";
import { format } from "date-fns";
import { Loader2, Plus, ArrowUpDown, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { cancel } from "@/store/transactionPaginationSlice";
import { open } from "@/store/transactionSlice";
import { DataTable } from "@/components/ui/datatable";
import { TransactionInfo } from "@/lib/types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDeleteTransactionMutation } from "@/app/(main)/transactions/mutations/delete";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { UseConfirm } from "@/components/hooks/use-confirm";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRelativeDate, cn, formatCurrency } from "@/lib/utils";
import { useState, useMemo } from "react";
import { fetchData } from "./mutations/fetch";
import { Badge } from "@/components/ui/badge";
import { UploadButton } from "@/components/transactions/upload-button";
import { useSelectAccount } from "@/components/transactions/use-select-account";
import { ImportCard } from "@/components/transactions/import-card";
import { useToast } from "@/components/ui/use-toast";
import { useSubmitBulkTransactionMutation } from "@/app/(main)/transactions/mutations/bulk-add";
import { returnFirstPage } from "@/store/transactionPaginationSlice";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: [],
};

const TransactionsTablePage = () => {
  const { toast } = useToast();
  const { isFirstPage } = useSelector(
    (state: RootState) => state.transactionPaginationModal
  );

  const dispatch = useDispatch();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  useMemo(() => {
    if (isFirstPage) {
      setPagination({ pageIndex: 0, pageSize: 10 });
      dispatch(cancel());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstPage]);

  const deleteTransactions = useDeleteTransactionMutation();
  const createTransactions = useSubmitBulkTransactionMutation();
  const isDisabled = deleteTransactions.isPending;
  const { data, status, isFetching } = useQuery({
    queryKey: ["transaction", pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData,
  });
  const defaultData = useMemo(() => [], []);

  const pageCount = data?.pageCount ?? 0;
  const tableData = data?.rows ?? defaultData;
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading transactions.
      </p>
    );
  }

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log(results);
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const columns: ColumnDef<TransactionInfo>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.original.date as Date;
        return <span>{format(date, "dd MMMM, yyyy")}</span>;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <div
            className={cn(
              "flex items-center cursor-pointer hover:underline",
              !category && "text-rose-500"
            )}
          >
            {!category && <TriangleAlert />}
            {category?.name || "Uncategorized"}
          </div>
        );
      },
    },
    {
      accessorKey: "payee",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payee
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));

        return (
          <Badge
            variant={amount < 0 ? "destructive" : "primary"}
            className="text-xs font-medium px-3.5 py-2.5"
          >
            {amount && formatCurrency(amount)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "account",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const account = row.original?.account;
        return (
          <div className="flex items-center cursor-pointer hover:underline">
            {account?.name}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right"></div>,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="text-right">
            <Button
              size="sm"
              variant="outline"
              className="mr-4"
              onClick={() =>
                dispatch(
                  open({
                    title: "Edit transaction",
                    subtitle: "Edit a transaction to track your transactions.",
                    buttonText: "Save Changes",
                    data: transaction,
                  })
                )
              }
            >
              Edit
            </Button>
            <UseConfirm
              title="Delete Confirmation"
              content="Are you sure you want to delete this row?"
              isDisabled={isDisabled}
              confirm={async () => {
                const id = transaction.id as string;
                deleteTransactions.mutate({ id });
              }}
            >
              <Button size="sm" variant="outline" className="mr-4">
                Delete
              </Button>
            </UseConfirm>
          </div>
        );
      },
    },
  ];

  const onSubmitImport = async (values: TransactionInfo[]) => {
    const accountId = await confirm();

    if (!accountId) {
      toast({
        variant: "destructive",
        description: "Please select an account to continue.",
      });
    }

    const data = values.map((value) => ({
      ...value,
      account_id: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        dispatch(returnFirstPage());
        onCancelImport();
      },
    });
  };

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24 z-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction page
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              className="w-full lg:w-auto"
              onClick={() =>
                dispatch(
                  open({
                    title: "New transaction",
                    subtitle:
                      "Create a new transaction to track your transactions.",
                    buttonText: "Create transaction",
                  })
                )
              }
              size="sm"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          {status === "pending" && (
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-12 text-slate-300 animate-spin" />
            </div>
          )}
          {status === "success" && !tableData.length && (
            <div className="h-[500px] w-full flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                No transactions found. Create transaction here.
              </p>
            </div>
          )}
          {tableData?.length ? (
            <DataTable
              data={tableData}
              columns={columns}
              filterKey="payee"
              confirmTitle="Delete Confirmation"
              confirmContent="Are you sure you want to delete the selected row(s)?"
              disabled={isDisabled}
              tablePages={pageCount}
              pagination={pagination}
              setPagination={setPagination}
              isFetching={isFetching}
              onDelete={(row) => {
                const ids = row.map((r) => r.id as string);
                deleteTransactions.mutate({ ids });
              }}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTablePage;
