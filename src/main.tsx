import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PortfolioApp from "@/components/PortfolioApp";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioApp />
  </StrictMode>,
);
