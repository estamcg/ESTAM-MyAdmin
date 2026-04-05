import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCFA(amount: number | null | undefined): string {
  return (amount ?? 0).toLocaleString("fr-FR") + " FCFA";
}
