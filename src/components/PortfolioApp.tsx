import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LayoutGroup, useReducedMotion } from "motion/react";
import HomeContent from "@/components/HomeContent";
import OverviewCase from "@/components/cases/OverviewCase";
import RatioCase from "@/components/cases/RatioCase";
import KinjaCase from "@/components/cases/KinjaCase";
import LaduCase from "@/components/cases/LaduCase";
import { PortfolioContext } from "@/components/PortfolioContext";
import { isIconsOn } from "@/lib/features";
import { prefetchCaseImages } from "@/lib/prefetchCaseImages";
import {
  isCaseView,
  LAYOUT_ID_BY_CASE,
  pathForView,
  type CaseLayoutId,
  type PortfolioView,
  viewFromPath,
} from "@/lib/portfolio";

const VIEW_TITLES: Record<PortfolioView, string> = {
  home: "Daniel Péger",
  overview: "Overview — Daniel Péger",
  ratio: "Ratio — Daniel Péger",
  kinja: "Kinja — Daniel Péger",
  ladu: "Ladu — Daniel Péger",
};

/** Fallback if layout animation complete never fires. */
const MORPH_FALLBACK_MS = 900;

/**
 * iOS Safari sizes `position:fixed; inset:0` to the padded (safe) viewport
 * even with `viewport-fit=cover`. Stretch into the unsafe regions during the
 * brief open-morph overlay; after park we switch to document scroll instead.
 */
const CASE_OVERLAY_STYLE = {
  top: "calc(0px - env(safe-area-inset-top, 0px))",
  right: "calc(0px - env(safe-area-inset-right, 0px))",
  bottom: "calc(0px - env(safe-area-inset-bottom, 0px))",
  left: "calc(0px - env(safe-area-inset-left, 0px))",
  width: "auto",
} as const;

/**
 * Client-side portfolio shell: home + case studies as views so Motion
 * layoutId shared transitions can run in-tree. URLs stay real via
 * history.pushState for deep links / back-forward.
 */
export default function PortfolioApp() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<PortfolioView>(() =>
    viewFromPath(window.location.pathname),
  );
  const [keepHome, setKeepHome] = useState(
    () => viewFromPath(window.location.pathname) === "home",
  );
  /**
   * After the open morph, drop home layoutIds so they don't keep pairing
   * with the case hero. Home is then taken `fixed` out of flow so the case
   * can document-scroll (same safe-area path as a deep link). Switching home
   * to fixed *during* the morph reflows the hero — only do it once parked.
   */
  const [homeParked, setHomeParked] = useState(
    () => viewFromPath(window.location.pathname) !== "home",
  );
  /**
   * Card to keep above page chrome for the close morph (no scrim — home
   * shows immediately; only this image is lifted).
   */
  const [elevateLayoutId, setElevateLayoutId] = useState<CaseLayoutId | null>(
    null,
  );
  const [iconsOn, setIconsOn] = useState(() =>
    isIconsOn(new URLSearchParams(window.location.search)),
  );

  const currentView = useRef(view);
  const scrollPositions = useRef(new Map<PortfolioView, number>());
  const isBackRef = useRef(false);
  const caseScrollRef = useRef<HTMLDivElement>(null);
  const wasCaseOverlay = useRef(false);

  useEffect(() => {
    currentView.current = view;
  }, [view]);

  useEffect(() => {
    if (view === "home") setKeepHome(true);
  }, [view]);

  useEffect(() => {
    if (keepHome) prefetchCaseImages();
  }, [keepHome]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    document.title = VIEW_TITLES[view];
  }, [view]);

  const beginCloseElevate = useCallback(
    (from: PortfolioView) => {
      if (!isCaseView(from) || reduceMotion) {
        setElevateLayoutId(null);
        return;
      }
      setElevateLayoutId(LAYOUT_ID_BY_CASE[from]);
    },
    [reduceMotion],
  );

  useEffect(() => {
    const onPopState = () => {
      const next = viewFromPath(window.location.pathname);
      if (next === "home") beginCloseElevate(currentView.current);
      isBackRef.current = true;
      setIconsOn(isIconsOn(new URLSearchParams(window.location.search)));
      setView(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [beginCloseElevate]);

  const isHome = view === "home";
  const morphingOpen = !isHome && keepHome && !homeParked;
  /**
   * Fixed overlay only while the open morph needs home in-flow underneath.
   * After park, the case document-scrolls like a deep link — that path already
   * paints into the iOS safe areas; `position:fixed` does not.
   */
  const caseOverlay = morphingOpen;

  useEffect(() => {
    if (isHome) {
      setHomeParked(false);
      return;
    }
    setElevateLayoutId(null);
    if (!keepHome || reduceMotion) {
      setHomeParked(true);
      return;
    }
    const id = window.setTimeout(
      () => setHomeParked(true),
      MORPH_FALLBACK_MS,
    );
    return () => window.clearTimeout(id);
  }, [isHome, keepHome, reduceMotion, view]);

  useEffect(() => {
    if (!elevateLayoutId) return;
    const id = window.setTimeout(
      () => setElevateLayoutId(null),
      MORPH_FALLBACK_MS,
    );
    return () => window.clearTimeout(id);
  }, [elevateLayoutId]);

  useLayoutEffect(() => {
    if (!caseOverlay) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overscrollBehavior = prev.bodyOverscroll;
    };
  }, [caseOverlay]);

  // Hand scroll from the fixed scroller to the window when the morph ends.
  useLayoutEffect(() => {
    if (wasCaseOverlay.current && !caseOverlay) {
      const top = caseScrollRef.current?.scrollTop ?? 0;
      window.scrollTo({ top, left: 0, behavior: "auto" });
    }
    wasCaseOverlay.current = caseOverlay;
  }, [caseOverlay]);

  useLayoutEffect(() => {
    if (isBackRef.current) {
      window.scrollTo({
        top: scrollPositions.current.get(view) ?? 0,
        left: 0,
        behavior: "auto",
      });
    } else if (view === "home") {
      window.scrollTo({
        top: scrollPositions.current.get("home") ?? 0,
        left: 0,
        behavior: "auto",
      });
    } else if (!keepHome) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else if (!homeParked && caseScrollRef.current) {
      caseScrollRef.current.scrollTop = 0;
    }
    // When homeParked flips, the transfer effect owns scroll — don't reset.
    isBackRef.current = false;
  }, [view, keepHome, homeParked]);

  useEffect(() => {
    const onScroll = () => {
      // During the open morph, scroll lives on the fixed case scroller.
      if (currentView.current !== "home" && keepHome && !homeParked) return;
      scrollPositions.current.set(currentView.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [keepHome, homeParked]);

  const hrefFor = useCallback(
    (next: PortfolioView) => {
      const path = pathForView(next);
      if (!iconsOn) return path;
      const params = new URLSearchParams();
      params.set("icons", "on");
      return `${path}?${params.toString()}`;
    },
    [iconsOn],
  );

  const navigate = useCallback(
    (next: PortfolioView) => {
      if (next === currentView.current) return;
      if (currentView.current === "home") {
        scrollPositions.current.set("home", window.scrollY);
      }
      isBackRef.current = false;
      if (currentView.current === "home" && next !== "home") {
        setHomeParked(false);
        setElevateLayoutId(null);
      } else if (next === "home") {
        beginCloseElevate(currentView.current);
      }
      window.history.pushState({ view: next }, "", hrefFor(next));
      setView(next);
    },
    [beginCloseElevate, hrefFor],
  );

  const back = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate("home");
  }, [navigate]);

  const onHeroLayoutComplete = useCallback(() => {
    if (!isHome) setHomeParked(true);
  }, [isHome]);

  const onHomeLayoutComplete = useCallback(() => {
    setElevateLayoutId(null);
  }, []);

  // layoutIds stay on home cards while open morph needs them, and whenever
  // we're on home (including the close morph).
  const homeShareLayout = isHome || morphingOpen;
  // Keep case layoutId for the whole home-originated visit so the close morph
  // still has a pair when the case unmounts. Dropping it only during park→flow
  // was unnecessary — at scroll 0 the hero screen box is unchanged.
  const caseShareLayout = !isHome && keepHome;

  return (
    <PortfolioContext.Provider value={{ view, iconsOn, navigate, back }}>
      <LayoutGroup id="portfolio">
        {keepHome && (
          <div
            className={
              isHome
                ? undefined
                : homeParked
                  ? // Out of flow after morph so the case document-scrolls
                    // with full safe-area coverage (like a deep link).
                    "fixed inset-0 z-0 opacity-0 pointer-events-none"
                  : // In flow during open morph for shared-layout measurement.
                    // Prefer opacity over visibility:hidden — Safari drops
                    // compositor layers for the latter mid-morph.
                    "opacity-0 pointer-events-none"
            }
            aria-hidden={!isHome}
            inert={!isHome ? true : undefined}
          >
            <HomeContent
              active={isHome}
              shareLayout={homeShareLayout}
              iconsOn={iconsOn}
              elevateLayoutId={elevateLayoutId}
              onLayoutAnimationComplete={
                elevateLayoutId ? onHomeLayoutComplete : undefined
              }
            />
          </div>
        )}

        {view !== "home" && (
          <div
            ref={caseScrollRef}
            className={
              caseOverlay
                ? "fixed z-10 overflow-y-auto overscroll-none bg-background"
                : undefined
            }
            style={caseOverlay ? CASE_OVERLAY_STYLE : undefined}
          >
            {view === "overview" && (
              <OverviewCase
                iconsOn={iconsOn}
                shareLayout={caseShareLayout}
                onHeroLayoutComplete={onHeroLayoutComplete}
              />
            )}
            {view === "ratio" && (
              <RatioCase
                iconsOn={iconsOn}
                shareLayout={caseShareLayout}
                onHeroLayoutComplete={onHeroLayoutComplete}
              />
            )}
            {view === "kinja" && (
              <KinjaCase
                iconsOn={iconsOn}
                shareLayout={caseShareLayout}
                onHeroLayoutComplete={onHeroLayoutComplete}
              />
            )}
            {view === "ladu" && (
              <LaduCase
                iconsOn={iconsOn}
                shareLayout={caseShareLayout}
                onHeroLayoutComplete={onHeroLayoutComplete}
              />
            )}
          </div>
        )}
      </LayoutGroup>
    </PortfolioContext.Provider>
  );
}
