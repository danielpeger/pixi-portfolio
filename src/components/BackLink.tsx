"use client";

import { useRouter } from "next/navigation";

type BackLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function BackLink({
  className,
  children = "← Back",
}: BackLinkProps) {
  const router = useRouter();

  // history.back() → popstate → ViewTransitions wraps it in startViewTransition
  // and restores the prior scroll position before the new snapshot.
  return (
    <button type="button" className={className} onClick={() => router.back()}>
      {children}
    </button>
  );
}
