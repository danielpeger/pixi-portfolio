"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CompareImagesProps = {
  leftSrc: string;
  rightSrc: string;
  leftAlt?: string;
  rightAlt?: string;
  className?: string;
};

export default function CompareImages({
  leftSrc,
  rightSrc,
  leftAlt = "After",
  rightAlt = "Before",
  className,
}: CompareImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!containerRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
      if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-4/3 w-full touch-pan-y select-none overflow-hidden rounded-[20px] cursor-col-resize",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      aria-label="Compare before and after"
      tabIndex={0}
    >
      <Image
        src={rightSrc}
        alt={rightAlt}
        fill
        className="object-cover object-left"
        sizes="(max-width: 960px) 100vw, 720px"
        unoptimized
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={leftSrc}
          alt={leftAlt}
          fill
          className="object-cover object-left"
          sizes="(max-width: 960px) 100vw, 720px"
          unoptimized
          draggable={false}
        />
      </div>
      <div
        className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 bg-accent"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-background" />
      </div>
    </div>
  );
}
