"use client";

import { Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { cancel } from "@/store/categoryPaginationSlice";
import { open } from "@/store/categorySlice";
import { DataTable } from "@/components/ui/datatable";
import { CategoryInfo } from "@/lib/types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDeleteCategoryMutation } from "@/app/(main)/categories/mutations/delete";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { UseConfirm } from "@/components/hooks/use-confirm";
import { Checkbox } from "@/components/ui/checkbox";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { formatRelativeDate } from "@/lib/utils";
import { useState, useMemo } from "react";
import { fetchData } from "./mutations/fetch";
import { AccountInfo } from "@/lib/types";
const CategoriesTablePage = () => {
  const { isFirstPage } = useSelector(
    (state: RootState) => state.categoryPaginationModal
  );

  const dispatch = useDispatch();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useMemo(() => {
    if (isFirstPage) {
      setPagination({ pageIndex: 0, pageSize: 10 });
      dispatch(cancel());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstPage]);

  const deleteCategories = useDeleteCategoryMutation();
  const isDisabled = deleteCategories.isPending;
  const { data, status, isFetching } = useQuery({
    queryKey: ["category", pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData,
  });
  const defaultData = useMemo(() => [], []);

  const pageCount = data?.pageCount ?? 0;
  const tableData = data?.rows ?? defaultData;
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading categories.
      </p>
    );
  }

  const columns: ColumnDef<CategoryInfo>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-right">CreatedAt</div>,
      cell: ({ row }) => {
        const dateFormated = formatRelativeDate(row.getValue("createdAt"));
        return <div className="text-right font-medium">{dateFormated}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right"></div>,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="text-right">
            <Button
              size="sm"
              variant="outline"
              className="mr-4"
              onClick={() =>
                dispatch(
                  open({
                    title: "Edit category",
                    subtitle: "Edit a category to track your categories.",
                    buttonText: "Save Changes",
                    id: category.id,
                    name: category.name,
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
                const id = category.id;
                deleteCategories.mutate({ id });
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

  return (
    <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24 z-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Category page</CardTitle>
          <Button
            onClick={() =>
              dispatch(
                open({
                  title: "New category",
                  subtitle: "Create a new category to track your categories.",
                  buttonText: "Create category",
                })
              )
            }
            size="sm"
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
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
                No categories found. Create category here.
              </p>
            </div>
          )}
          {tableData?.length ? (
            <DataTable
              data={tableData}
              columns={columns}
              filterKey="name"
              confirmTitle="Delete Confirmation"
              confirmContent="Are you sure you want to delete the selected row(s)?"
              disabled={isDisabled}
              tablePages={pageCount}
              pagination={pagination}
              setPagination={setPagination}
              isFetching={isFetching}
              onDelete={(row) => {
                const ids = row.map((r) => r.id);
                deleteCategories.mutate({ ids });
              }}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesTablePage;
