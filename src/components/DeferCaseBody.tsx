import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

type DeferCaseBodyProps = {
  children: ReactNode;
  /**
   * Delay before mounting heavy case-study DOM so the shared-layout hero
   * morph can start without competing for main-thread / GPU work (Safari).
   */
  delayMs?: number;
};

/**
 * Mounts case-study body after the hero has a chance to project.
 * Keeps open/close morphs smoother when the case page is large.
 */
export default function DeferCaseBody({
  children,
  delayMs = 120,
}: DeferCaseBodyProps) {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(() => !!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setShow(true);
      return;
    }
    const id = window.setTimeout(() => setShow(true), delayMs);
    return () => window.clearTimeout(id);
  }, [reduceMotion, delayMs]);

  if (!show) return null;
  return children;
}
