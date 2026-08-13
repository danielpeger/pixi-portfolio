export const CASE_LAYOUT_IDS = {
  overview: "overview-image",
  ratio: "ratio-image",
  kinja: "kinja-image",
  ladu: "ladu-image",
  preflight: "preflight-image",
} as const;

export type CaseLayoutId =
  (typeof CASE_LAYOUT_IDS)[keyof typeof CASE_LAYOUT_IDS];

export type PortfolioView =
  | "home"
  | "overview"
  | "ratio"
  | "kinja"
  | "ladu"
  | "preflight";

export type CaseView = Exclude<PortfolioView, "home">;

export const LAYOUT_ID_BY_CASE: Record<CaseView, CaseLayoutId> = {
  overview: CASE_LAYOUT_IDS.overview,
  ratio: CASE_LAYOUT_IDS.ratio,
  kinja: CASE_LAYOUT_IDS.kinja,
  ladu: CASE_LAYOUT_IDS.ladu,
  preflight: CASE_LAYOUT_IDS.preflight,
};

export const sharedLayoutTransition = {
  type: "spring" as const,
  // Slightly snappier / less oscillatory — fewer expensive projection frames
  // on Safari while still reading as a soft morph.
  stiffness: 320,
  damping: 34,
  mass: 0.85,
};

/** Same sizes on home cards + case heroes so one srcset entry is preferred. */
export const CASE_HERO_SIZES = "(max-width: 960px) 100vw, 960px";

export function isCaseView(view: PortfolioView): view is CaseView {
  return view !== "home";
}

export function viewFromPath(pathname: string): PortfolioView {
  if (pathname.startsWith("/overview")) return "overview";
  if (pathname.startsWith("/ratio")) return "ratio";
  if (pathname.startsWith("/kinja")) return "kinja";
  if (pathname.startsWith("/ladu")) return "ladu";
  if (pathname.startsWith("/preflight")) return "preflight";
  return "home";
}

export function pathForView(view: PortfolioView): string {
  if (view === "home") return "/";
  return `/${view}`;
}
