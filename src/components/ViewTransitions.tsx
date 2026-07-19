"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
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

function pageKind(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/ratio")) return "ratio";
  return "other";
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

function untagRatioElements() {
  document.querySelectorAll<HTMLElement>(`[data-vt="${VT_RATIO}"]`).forEach((el) => {
    // removeProperty so .ratio-hero can keep its CSS view-transition-name
    el.style.removeProperty("view-transition-name");
  });
}

function tagRatioElement(root: ParentNode = document) {
  const el = root.querySelector<HTMLElement>(`[data-vt="${VT_RATIO}"]`);
  if (el) el.style.viewTransitionName = VT_RATIO;
  return el;
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
      scrollPositions.current.set(currentPathname.current, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const beginViewTransition = useCallback((direction: TransitionDirection, isBack: boolean) => {
    if (!("startViewTransition" in document)) return;

    scrollPositions.current.set(currentPathname.current, window.scrollY);
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

    // Leaving home → tag the thumbnail so the old snapshot includes it.
    if (pageKind(direction.from) === "home") {
      tagRatioElement();
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
        untagRatioElements();
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
      router.push(href);
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

  useEffect(() => {
    if (!transitionRef.current) {
      currentPathname.current = pathname;
      return;
    }

    let cancelled = false;

    (async () => {
      const y = scrollPositions.current.get(pathname) ?? 0;
      // Push navigations start at the top; back/forward restore.
      window.scrollTo({
        top: isBackRef.current ? y : 0,
        left: 0,
        behavior: "auto",
      });

      // Demo quirk: scroll position isn't applied until after a microtask.
      await Promise.resolve();

      // Returning home: tag the thumbnail so the new snapshot includes it.
      if (pageKind(pathname) === "home") {
        tagRatioElement();
      } else if (pageKind(pathname) === "ratio") {
        tagRatioElement();
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
