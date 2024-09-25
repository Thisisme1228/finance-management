"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AccountInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UseConfirm } from "@/components/hooks/use-confirm";
import { Trash } from "lucide-react";

export function DataTable({
  data,
  columns,
  filterKey,
  disabled,
  onDelete,
  confirmTitle,
  confirmContent,
  ispending,
  hasNextPage,
  hasPreviousPage,
  fetchNextPage,
  tablePages,
}: {
  data: AccountInfo[];
  columns: ColumnDef<AccountInfo>[];
  filterKey: string;
  disabled?: boolean;
  onDelete: (rows: AccountInfo[]) => void;
  confirmTitle: string;
  confirmContent: string;
  ispending: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  tablePages: number;
  fetchNextPage: () => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-end flex-wrap md:flex-nowrap md:justify-between">
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="w-full sm:w-full md:max-w-sm"
        />
        <div className="flex h-full mt-4 md:mt-0">
          <UseConfirm
            title={confirmTitle}
            content={confirmContent}
            isDisabled={disabled}
            confirm={async () => {
              await onDelete(
                table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original)
              );
              table.resetRowSelection();
            }}
          >
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                disabled={disabled}
                variant="outline"
                className="ml-auto mr-4"
              >
                <Trash className="size-4 mr-2" />
                Delete ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}
          </UseConfirm>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div> */}
        <div className="space-x-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  isActive={hasPreviousPage && !ispending}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasPreviousPage && !ispending) {
                      return fetchNextPage();
                    }
                  }}
                />
              </PaginationItem>
              {tablePages > 1 ? (
                <>
                  {Array.from({ length: tablePages }).map((_, index) => {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          // isActive={index === table.getPageIndex()}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            table.setPageIndex(index);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                </>
              ) : null}
              <PaginationItem>
                <PaginationNext
                  isActive={hasNextPage && !ispending}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasNextPage && !ispending) {
                      return fetchNextPage();
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
