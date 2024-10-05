import { Prisma } from "@prisma/client";

export function getUserDataSelect() {
  return {
    id: true,
    username: true,
    displayName: true,
    createdAt: true,
    avatarUrl: true,
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
  user_id?: string;
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

export type CategoriesData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoriesDataInclude>;
}>;

export interface CategoriesPage {
  data: CategoriesData[];
  totalCount: number;
}

export interface CategoryInfo {
  id: string;
  user_id?: string;
  name: string;
  createdAt?: Date;
}

export interface CategoryData {
  title: string;
  subtitle: string;
  buttonText: string;
  id?: string;
  name?: string;
}

export function getCategoriesDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
  } satisfies Prisma.CategoryInclude;
}

export type TransactionsData = Prisma.TransactionGetPayload<{
  include: ReturnType<typeof getTransactionsDataInclude>;
}>;

export interface TransactionsPage {
  data: TransactionsData[];
  totalCount: number;
}

export interface TransactionInfo {
  id?: string;
  userId?: string;
  amount?: string;
  notes?: string;
  account?: { name: string; id: string };
  account_id?: string;
  category?: { name: string; id: string };
  category_id?: string;
  payee?: string;
  date?: Date;
  createdAt?: Date;
}

export interface TransactionData {
  title: string;
  subtitle: string;
  buttonText: string;
  data?: {};
  id?: string;
  amount?: number;
  notes?: string;
  account_id?: string;
  category_id?: string;
  userId?: string;
  payee?: string;
  date?: string;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getTransactionsDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    account: {
      select: {
        id: true,
        name: true,
      },
    },
  } satisfies Prisma.TransactionInclude;
}
