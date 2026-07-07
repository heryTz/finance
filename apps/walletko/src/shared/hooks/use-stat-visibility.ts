import { useState } from "react";

export type StatKey =
  | "totalBalance"
  | "monthIncome"
  | "monthExpense"
  | "allTimeIncome"
  | "allTimeExpense";

export const STAT_LABELS: Record<StatKey, string> = {
  totalBalance: "Total Balance",
  monthIncome: "Income this month",
  monthExpense: "Expenses this month",
  allTimeIncome: "All Time Income",
  allTimeExpense: "All Time Expense",
};

export const STAT_KEYS: StatKey[] = [
  "totalBalance",
  "monthIncome",
  "monthExpense",
  "allTimeIncome",
  "allTimeExpense",
];

const DEFAULT_VISIBLE: StatKey[] = [
  "totalBalance",
  "monthIncome",
  "monthExpense",
];

function loadFromStorage(storageKey: string): Set<StatKey> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set(DEFAULT_VISIBLE);
    const parsed = JSON.parse(raw) as unknown[];
    const valid = parsed.filter((k): k is StatKey =>
      STAT_KEYS.includes(k as StatKey),
    );
    return new Set(valid);
  } catch {
    return new Set(DEFAULT_VISIBLE);
  }
}

export function useStatVisibility(storageKey = "dashboard-stat-visibility") {
  const [visible, setVisible] = useState<Set<StatKey>>(() =>
    loadFromStorage(storageKey),
  );

  const toggle = (key: StatKey) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      localStorage.setItem(storageKey, JSON.stringify([...next]));
      return next;
    });
  };

  return { visible, toggle, labels: STAT_LABELS };
}
