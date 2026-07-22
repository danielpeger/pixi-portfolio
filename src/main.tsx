import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Import fonts from JS so Vite rewrites woff2 urls into hashed /assets/* paths.
// (CSS @import of @fontsource left relative ./files/* urls that 404 in production.)
import "@fontsource/rubik/latin-400.css";
import "@fontsource/rubik/latin-ext-400.css";
import "@fontsource/jua/latin-400.css";
import "@fontsource/playfair-display/latin-500-italic.css";
import "@fontsource/playfair-display/latin-ext-500-italic.css";
import PortfolioApp from "@/components/PortfolioApp";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioApp />
  </StrictMode>,
);
