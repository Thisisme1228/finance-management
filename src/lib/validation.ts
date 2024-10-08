import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const phoneRegex = /^1[3-9]\d{9}$/;

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  phone: requiredString.regex(phoneRegex, "Invalid phone number"),
  OTP: requiredString.min(6, "Must be 6 characters"),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const textMessageLoginSchema = z.object({
  phone: requiredString.regex(phoneRegex, "Invalid phone number"),
  OTP: requiredString.min(6, "Must be 6 characters"),
});

export type TextMessageLoginValues = z.infer<typeof textMessageLoginSchema>;

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
  category_id: z.string().nullable().optional(),
  payee: requiredString,
  amount: requiredString,
  notes: z.string().nullable().optional(),
});

export const TransactionsCsvSchema = z.object({
  date: z.coerce.date(),
  account_id: requiredString,
  payee: requiredString,
  amount: z.string().transform((val: string) => parseFloat(val)),
});

export type TransactionsValues = z.infer<typeof TransactionsSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
