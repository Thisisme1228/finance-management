import { Prisma } from "@prisma/client";

export function getUserDataSelect() {
  return {
    id: true,
    username: true,
    displayName: true,
    createdAt: true,
    //https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb
  } satisfies Prisma.UserSelect; //Infer the output type of methods like findMany and create
}

export type AccountsData = Prisma.AccountGetPayload<{
  include: ReturnType<typeof getAccountDataInclude>;
}>;

export interface AccountsPage {
  data: AccountsData[];
  totalCount: number;
}

export interface AccountInfo {
  id: string;
  userId?: string;
  name: string;
  createdAt?: Date;
}

export interface AccountData {
  title: string;
  subtitle: string;
  buttonText: string;
  id?: string;
  name?: string;
}

export function getAccountDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
  } satisfies Prisma.AccountInclude;
}

export type TransactionsData = Prisma.TransactionGetPayload<{
  include: ReturnType<typeof getTransactionsDataInclude>;
}>;

export interface TransactionsPage {
  data: TransactionsData[];
  totalCount: number;
}

export interface TransactionInfo {
  id: string;
  userId?: string;
  name: string;
  createdAt?: Date;
}

export interface TransactionData {
  title: string;
  subtitle: string;
  buttonText: string;
  id?: string;
  name?: string;
}

export function getTransactionsDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
  } satisfies Prisma.TransactionInclude;
}
