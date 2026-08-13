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
import PreflightCase from "@/components/cases/PreflightCase";
import { PortfolioContext } from "@/components/PortfolioContext";
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
  preflight: "Preflight — Daniel Péger",
};

/** Fallback if layout animation complete never fires. */
const MORPH_FALLBACK_MS = 900;

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
   * with the case hero. Home stays opacity-0 + in-flow for the case visit
   * (switching it to `fixed` was reflowing the hero and springing twice).
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

  const currentView = useRef(view);
  const scrollPositions = useRef(new Map<PortfolioView, number>());
  const isBackRef = useRef(false);
  const caseScrollRef = useRef<HTMLDivElement>(null);

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
    const onScroll = () => {
      if (currentView.current !== "home" && keepHome) return;
      scrollPositions.current.set(currentView.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [keepHome]);

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
      setView(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [beginCloseElevate]);

  const isHome = view === "home";
  const morphingOpen = !isHome && keepHome && !homeParked;
  const caseOverlay = !isHome && keepHome;

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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
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
    } else if (caseScrollRef.current) {
      caseScrollRef.current.scrollTop = 0;
    }
    isBackRef.current = false;
  }, [view, keepHome]);

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
      window.history.pushState({ view: next }, "", pathForView(next));
      setView(next);
    },
    [beginCloseElevate],
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

  return (
    <PortfolioContext.Provider value={{ view, navigate, back }}>
      <LayoutGroup id="portfolio">
        {keepHome && (
          <div
            className={
              isHome
                ? undefined
                : // Hide immediately under the opaque case overlay. Stay in
                  // document flow (never switch to fixed mid-visit) so parking
                  // doesn't reflow and re-spring the hero. Prefer opacity over
                  // visibility:hidden — Safari drops compositor layers for the
                  // latter mid-morph.
                  "opacity-0 pointer-events-none"
            }
            aria-hidden={!isHome}
            inert={!isHome ? true : undefined}
          >
            <HomeContent
              active={isHome}
              shareLayout={homeShareLayout}
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
                ? // Stable for the whole case visit — toggling overflow after
                  // the morph reflows the hero and springs it a second time.
                  "fixed inset-0 z-10 overflow-y-auto bg-background"
                : undefined
            }
          >
            {view === "overview" && (
              <OverviewCase onHeroLayoutComplete={onHeroLayoutComplete} />
            )}
            {view === "ratio" && (
              <RatioCase onHeroLayoutComplete={onHeroLayoutComplete} />
            )}
            {view === "kinja" && (
              <KinjaCase onHeroLayoutComplete={onHeroLayoutComplete} />
            )}
            {view === "ladu" && (
              <LaduCase onHeroLayoutComplete={onHeroLayoutComplete} />
            )}
            {view === "preflight" && (
              <PreflightCase onHeroLayoutComplete={onHeroLayoutComplete} />
            )}
          </div>
        )}
      </LayoutGroup>
    </PortfolioContext.Provider>
  );
}
