import { Prisma } from "@prisma/client";

export function getAccountDataSelect() {
  return {
    id: true,
    userId: true,
    name: true,
    user: true,
    createdAt: true,
    //https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb
  } satisfies Prisma.AccountSelect; //Infer the output type of methods like findMany and create
}

export type AccountsData = Prisma.AccountGetPayload<{
  select: ReturnType<typeof getAccountDataSelect>;
}>;

export interface AccountsPage {
  Accounts: AccountsData[];
  nextCursor: string | null;
}

export interface AccountInfo {
  id: string;
  userId?: string;
  name: string;
  createdAt?: Date;
}
