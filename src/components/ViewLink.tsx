"use client";

import { usePortfolio } from "@/components/PortfolioContext";
import { pathForView, type PortfolioView } from "@/lib/portfolio";

type ViewLinkProps = {
  view: Exclude<PortfolioView, "home">;
  className?: string;
  children: React.ReactNode;
};

/** In-app navigation that keeps Motion layoutId in the same React tree. */
export default function ViewLink({ view, className, children }: ViewLinkProps) {
  const { navigate, iconsOn } = usePortfolio();
  const href = iconsOn ? `${pathForView(view)}?icons=on` : pathForView(view);

  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return;
        }
        event.preventDefault();
        navigate(view);
      }}
    >
      {children}
    </a>
  );
}
