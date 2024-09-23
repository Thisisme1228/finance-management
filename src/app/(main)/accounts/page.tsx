"use client";

import { Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { open } from "@/components/accounts/newAccountSlice";
import { DataTable } from "@/components/ui/datatable";
import { AccountsTableType } from "./columns";

const AccountsPage = () => {
  const dispatch = useDispatch();

  // if (accountsQuery.isLoading) {
  // return (
  //   <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24 z-10">
  //   <Card className="border-none drop-shadow-sm">
  //     <CardHeader>
  //       <Skeleton className="h-8 w-48"/>
  //     </CardHeader>
  //     <CardContent>
  //       <div className="h-[500px] w-full flex items-center justify-center">
  //       <Loader2 className="size-6 text-slate-300 animate-sping" />
  //       </div>
  //     </CardContent>
  //   </Card>
  // </div>
  // );
  // }

  return (
    <div className="max-x-screen-2xl mx-auto w-full pb-10 -mt-24 z-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Account page</CardTitle>
          <Button onClick={() => dispatch(open())} size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          {/* <DataTable
            columns={columns}
            data={accounts}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          /> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
