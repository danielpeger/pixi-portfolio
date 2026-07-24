import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Dialog } from "@base-ui/react/dialog";
import { motion, useReducedMotion } from "motion/react";
import OptimizedImage, {
  type PictureImage,
} from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";
import { sharedLayoutTransition } from "@/lib/portfolio";

const STAGE_INSET = 48;
const BORDER_RADIUS = 20;
const BACKDROP_TRANSITION_MS = 200;

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type LightboxProps = {
  /** Stable id for portal keys (not a Motion layoutId). */
  layoutId: string;
  /** CSS aspect ratio for the expanded frame, e.g. `"5 / 4"` or `"1200 / 900"`. */
  aspectRatio: string;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  frameClassName?: string;
  expandedFrameClassName?: string;
  onOpenChange?: (open: boolean) => void;
};

function parseAspectRatio(aspectRatio: string) {
  const [w, h] = aspectRatio.replace(/\s+/g, "").split("/").map(Number);
  return { w: w || 1, h: h || 1 };
}

function readRect(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function getExpandedRect(aspectRatio: string): Rect {
  const { w, h } = parseAspectRatio(aspectRatio);
  const maxW = window.innerWidth - STAGE_INSET * 2;
  const maxH = window.innerHeight - STAGE_INSET * 2;
  let width = maxW;
  let height = (width * h) / w;
  if (height > maxH) {
    height = maxH;
    width = (height * w) / h;
  }
  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
}

export default function Lightbox({
  layoutId,
  aspectRatio,
  ariaLabel,
  children,
  className,
  frameClassName,
  expandedFrameClassName,
  onOpenChange,
}: LightboxProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const thumbRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);

  const [open, setOpen] = useState(false);
  /** Portal stays mounted through the close morph. */
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState<Rect | null>(null);
  const [expanded, setExpanded] = useState<Rect | null>(null);

  openRef.current = open;

  function blockSelect(e: MouseEvent) {
    e.preventDefault();
  }

  function measure() {
    const thumb = thumbRef.current;
    if (!thumb) return null;
    return {
      origin: readRect(thumb),
      expanded: getExpandedRect(aspectRatio),
    };
  }

  function setOpenAndNotify(next: boolean) {
    const m = measure();
    if (next) {
      if (!m) return;
      setOrigin(m.origin);
      setExpanded(m.expanded);
      setActive(true);
      setOpen(true);
    } else {
      if (m) {
        setOrigin(m.origin);
        setExpanded(m.expanded);
      }
      setOpen(false);
    }
    onOpenChange?.(next);
  }

  /** Click toggles so open↔close morphs reverse immediately mid-flight. */
  function toggleLightbox(e: MouseEvent) {
    e.stopPropagation();
    setOpenAndNotify(!openRef.current);
  }

  function onThumbKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenAndNotify(true);
    }
  }

  useEffect(() => {
    if (!active) return;
    function onResize() {
      const thumb = thumbRef.current;
      if (!thumb) return;
      setOrigin(readRect(thumb));
      setExpanded(getExpandedRect(aspectRatio));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, aspectRatio]);

  const frameStyle = { borderRadius: BORDER_RADIUS } as const;
  const target = open ? expanded : origin;
  const instant = reduceMotion || !origin || !expanded || !target;

  return (
    <>
      <div
        role="button"
        tabIndex={open || active ? -1 : 0}
        aria-label={ariaLabel}
        aria-expanded={open}
        className={cn("select-none", !open && "cursor-zoom-in", className)}
        onClick={toggleLightbox}
        onMouseDown={blockSelect}
        onKeyDown={onThumbKeyDown}
      >
        <div
          ref={thumbRef}
          className={cn(
            "relative select-none",
            frameClassName,
            active && "invisible pointer-events-none",
          )}
          style={
            active
              ? {
                  ...frameStyle,
                  aspectRatio: aspectRatio.replace(/\s+/g, " "),
                  width: "100%",
                }
              : frameStyle
          }
          aria-hidden={active || undefined}
        >
          {!active ? children : null}
        </div>
      </div>

      {active &&
        origin &&
        expanded &&
        target &&
        createPortal(
          <>
            <motion.div
              key={`${layoutId}-backdrop`}
              aria-hidden
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{
                duration: instant ? 0 : BACKDROP_TRANSITION_MS / 1000,
                ease: "easeOut",
              }}
              className="fixed inset-0 z-[10000] cursor-zoom-out select-none bg-white/80 dark:bg-black/80"
              onClick={toggleLightbox}
              onMouseDown={blockSelect}
            />

            <motion.div
              key={`${layoutId}-stage`}
              className={cn(
                "fixed z-[10001] cursor-zoom-out select-none overflow-hidden",
                expandedFrameClassName ?? frameClassName,
              )}
              initial={instant ? false : origin}
              animate={{
                top: target.top,
                left: target.left,
                width: target.width,
                height: target.height,
                borderRadius: BORDER_RADIUS,
              }}
              transition={instant ? { duration: 0 } : sharedLayoutTransition}
              onClick={toggleLightbox}
              onMouseDown={blockSelect}
              onAnimationComplete={() => {
                // Tear down only after a close morph finishes (ref avoids
                // stale closures when open↔close interrupts mid-spring).
                if (!openRef.current) setActive(false);
              }}
            >
              {children}
            </motion.div>
          </>,
          document.body,
        )}

      <Dialog.Root
        open={active}
        disablePointerDismissal
        onOpenChange={(next) => {
          // Esc (and other dismissals) always request close; ignore open requests.
          if (!next) setOpenAndNotify(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Popup className="fixed inset-0 z-[10001] pointer-events-none outline-none" />
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export function imageAspectRatio(image: PictureImage) {
  return `${image.img.w} / ${image.img.h}`;
}

type LightboxImageProps = {
  image: PictureImage;
  alt: string;
  sizes: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
};

/** Fill slot for image content inside a `Lightbox` frame. */
export function LightboxImage({
  image,
  alt,
  sizes,
  priority = false,
  objectFit = "cover",
}: LightboxImageProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ borderRadius: "inherit" }}
    >
      <OptimizedImage
        image={image}
        alt={alt}
        fill
        className={cn(
          objectFit === "contain" ? "object-contain" : "object-cover",
          "select-none [transform:translateZ(0)]",
        )}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        draggable={false}
      />
    </div>
  );
}
