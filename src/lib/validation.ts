import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const AccountSchema = z.object({
  name: requiredString.max(20, "Must be 20 characters or less"),
});

export type AccountValues = z.infer<typeof AccountSchema>;

export const CategoriesSchema = z.object({
  name: requiredString.max(20, "Must be 20 characters or less"),
});

export type CategoriesValues = z.infer<typeof CategoriesSchema>;

export const TransactionsSchema = z.object({
  date: z.coerce.date(),
  account_id: requiredString,
  category_id: requiredString,
  payee: requiredString,
  amount: requiredString,
  notes: requiredString,
});

export type TransactionsValues = z.infer<typeof TransactionsSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
