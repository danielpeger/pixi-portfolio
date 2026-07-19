"use client";

import Link from "next/link";
import { useViewTransitions } from "@/components/ViewTransitions";

type TransitionLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

/** Link that runs a Jake-style view transition (shared element + scroll). */
export default function TransitionLink({
  href,
  className,
  children,
}: TransitionLinkProps) {
  const { navigate } = useViewTransitions();

  return (
    <Link
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
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
