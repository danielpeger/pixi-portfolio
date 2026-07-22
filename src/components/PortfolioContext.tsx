"use client";

import { createContext, use } from "react";
import type { PortfolioView } from "@/lib/portfolio";

export type PortfolioContextValue = {
  view: PortfolioView;
  iconsOn: boolean;
  navigate: (view: PortfolioView) => void;
  back: () => void;
};

export const PortfolioContext = createContext<PortfolioContextValue | null>(
  null,
);

export function usePortfolio() {
  const ctx = use(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used within PortfolioApp");
  }
  return ctx;
}
