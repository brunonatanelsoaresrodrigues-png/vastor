import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const money = (value: number, decimals = 0) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
export const shortMoney = (value: number) =>
  value >= 1000 ? `${money(value / 1000, value % 1000 === 0 ? 0 : 1)} mil` : money(value);
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value.length === 10 ? `${value}T12:00:00Z` : value));
export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
