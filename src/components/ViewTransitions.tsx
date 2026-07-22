"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type TransitionDirection = {
  from: string;
  to: string;
};

type ViewTransitionsContextValue = {
  navigate: (href: string) => void;
};

export const ViewTransitionsContext =
  createContext<ViewTransitionsContextValue | null>(null);

const VT_RATIO = "ratio-image";
const VT_OVERVIEW = "overview-image";
const VT_KINJA = "kinja-image";
const VT_LADU = "ladu-image";

type SharedVtName =
  | typeof VT_RATIO
  | typeof VT_OVERVIEW
  | typeof VT_KINJA
  | typeof VT_LADU;

function pageKind(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/ratio")) return "ratio";
  if (path.startsWith("/overview")) return "overview";
  if (path.startsWith("/kinja")) return "kinja";
  if (path.startsWith("/ladu")) return "ladu";
  return "other";
}

function sharedVtForTransition(from: string, to: string): SharedVtName | null {
  const kinds = new Set([pageKind(from), pageKind(to)]);
  if (kinds.has("home") && kinds.has("ratio")) return VT_RATIO;
  if (kinds.has("home") && kinds.has("overview")) return VT_OVERVIEW;
  if (kinds.has("home") && kinds.has("kinja")) return VT_KINJA;
  if (kinds.has("home") && kinds.has("ladu")) return VT_LADU;
  return null;
}

function clearVtClasses() {
  const { classList } = document.documentElement;
  for (const name of [...classList]) {
    if (
      name.startsWith("from-") ||
      name.startsWith("to-") ||
      name === "back-transition"
    ) {
      classList.remove(name);
    }
  }
}

function untagSharedElements(name: SharedVtName) {
  document.querySelectorAll<HTMLElement>(`[data-vt="${name}"]`).forEach((el) => {
    // removeProperty so .*-hero can keep its CSS view-transition-name
    el.style.removeProperty("view-transition-name");
  });
}

function untagAllSharedElements() {
  untagSharedElements(VT_RATIO);
  untagSharedElements(VT_OVERVIEW);
  untagSharedElements(VT_KINJA);
  untagSharedElements(VT_LADU);
}

function isVtVisible(el: HTMLElement) {
  if (typeof el.checkVisibility === "function") {
    return el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  }
  return el.getClientRects().length > 0;
}

/** Tag the visible shared image — keep-alive can leave multiple in the DOM. */
function tagSharedElement(name: SharedVtName, root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>(`[data-vt="${name}"]`);
  let fallback: HTMLElement | null = null;
  for (const el of els) {
    if (isVtVisible(el)) {
      el.style.viewTransitionName = name;
      return el;
    }
    fallback = el;
  }
  if (fallback) fallback.style.viewTransitionName = name;
  return fallback;
}

/**
 * View Transitions modeled on Jake Archibald's HTTP 203 playlist demo:
 * https://http203-playlist.netlify.app/
 *
 * - Dynamically tag the shared image only for the active transition
 * - Manually restore scroll before the new snapshot (with a microtask wait)
 * - Drive history back/forward via document.startViewTransition
 */
export default function ViewTransitions({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPathname = useRef(pathname);
  const scrollPositions = useRef(new Map<string, number>());
  const pendingDirection = useRef<TransitionDirection | null>(null);
  const isBackRef = useRef(false);
  /** Hold scroll while leaving a page so Next/Safari can't flash y=0 mid-VT. */
  const lockedScrollY = useRef<number | null>(null);

  const [currentViewTransition, setCurrentViewTransition] = useState<
    null | [Promise<void>, () => void]
  >(null);
  const transitionRef = useRef(currentViewTransition);

  useEffect(() => {
    transitionRef.current = currentViewTransition;
  }, [currentViewTransition]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (
        lockedScrollY.current !== null &&
        Math.abs(window.scrollY - lockedScrollY.current) > 1
      ) {
        window.scrollTo(0, lockedScrollY.current);
        return;
      }
      scrollPositions.current.set(currentPathname.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const beginViewTransition = useCallback((direction: TransitionDirection, isBack: boolean) => {
    if (!("startViewTransition" in document)) return;

    scrollPositions.current.set(currentPathname.current, window.scrollY);
    // Lock current scroll until we intentionally restore/reset in layout effect.
    lockedScrollY.current = window.scrollY;
    pendingDirection.current = direction;
    isBackRef.current = isBack;

    clearVtClasses();
    document.documentElement.classList.add(
      `from-${pageKind(direction.from)}`,
      `to-${pageKind(direction.to)}`,
    );
    if (isBack) {
      document.documentElement.classList.add("back-transition");
    }

    const sharedVt = sharedVtForTransition(direction.from, direction.to);

    // Leaving home → tag the thumbnail so the old snapshot includes it.
    if (pageKind(direction.from) === "home" && sharedVt) {
      tagSharedElement(sharedVt);
    }

    let pendingViewTransitionResolve: () => void;
    const pendingViewTransition = new Promise<void>((resolve) => {
      pendingViewTransitionResolve = resolve;
    });

    const pendingStartViewTransition = new Promise<void>((resolve) => {
      const transition = document.startViewTransition(() => {
        resolve();
        return pendingViewTransition;
      });

      transition.finished.finally(() => {
        clearVtClasses();
        untagAllSharedElements();
      });
    });

    setCurrentViewTransition([
      pendingStartViewTransition,
      pendingViewTransitionResolve!,
    ]);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href === currentPathname.current) return;

      if (!("startViewTransition" in document)) {
        router.push(href);
        return;
      }

      beginViewTransition({ from: currentPathname.current, to: href }, false);
      // Prevent Next.js from scrolling the still-visible page to top mid-transition.
      router.push(href, { scroll: false });
    },
    [beginViewTransition, router],
  );

  useEffect(() => {
    if (!("startViewTransition" in document)) return;

    const onPopState = () => {
      const to = window.location.pathname;
      beginViewTransition({ from: currentPathname.current, to }, true);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [beginViewTransition]);

  // useLayoutEffect: apply scroll before paint so Safari/WebKit never flash y=0.
  useLayoutEffect(() => {
    if (!transitionRef.current) {
      currentPathname.current = pathname;
      return;
    }

    let cancelled = false;

    (async () => {
      const y = scrollPositions.current.get(pathname) ?? 0;
      // Release lock, then apply the intentional scroll for this navigation.
      lockedScrollY.current = null;
      // Push navigations start at the top; back/forward restore.
      window.scrollTo({
        top: isBackRef.current ? y : 0,
        left: 0,
        behavior: "auto",
      });

      // Demo quirk: scroll position isn't applied until after a microtask.
      await Promise.resolve();

      // Clear keep-alive duplicates, then tag the visible shared image.
      const kind = pageKind(pathname);
      const sharedVt =
        kind === "ratio"
          ? VT_RATIO
          : kind === "overview"
            ? VT_OVERVIEW
            : kind === "kinja"
              ? VT_KINJA
              : kind === "ladu"
                ? VT_LADU
                : pendingDirection.current
                  ? sharedVtForTransition(
                      pendingDirection.current.from,
                      pendingDirection.current.to,
                    )
                  : null;

      if (
        sharedVt &&
        (kind === "home" ||
          kind === "ratio" ||
          kind === "overview" ||
          kind === "kinja" ||
          kind === "ladu")
      ) {
        untagAllSharedElements();
        tagSharedElement(sharedVt);
      }

      void document.documentElement.offsetHeight;

      if (cancelled || !transitionRef.current) return;
      transitionRef.current[1]();
      transitionRef.current = null;
      currentPathname.current = pathname;
      pendingDirection.current = null;
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (currentViewTransition && currentPathname.current !== pathname) {
    use(currentViewTransition[0]);
  }

  return (
    <ViewTransitionsContext.Provider value={{ navigate }}>
      {children}
    </ViewTransitionsContext.Provider>
  );
}

export function useViewTransitions() {
  const ctx = use(ViewTransitionsContext);
  if (!ctx) {
    throw new Error("useViewTransitions must be used within ViewTransitions");
  }
  return ctx;
}
