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

export type CategoriesData = Prisma.CategoryGetPayload<{
  include: ReturnType<typeof getCategoriesDataInclude>;
}>;

export interface CategoriesPage {
  data: CategoriesData[];
  totalCount: number;
}

export interface CategoryInfo {
  id: string;
  userId?: string;
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
