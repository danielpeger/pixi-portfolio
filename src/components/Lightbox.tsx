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
import OptimizedImage, { type PictureImage } from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";
import { sharedLayoutTransition } from "@/lib/portfolio";

const STAGE_INSET = 32;
/** Tighter bottom inset so the stage sits closer to the viewport edge. */
const STAGE_INSET_BOTTOM = 16;
const CAPTION_GAP = 12;
/** Space reserved under the image for an optional open-lightbox caption. */
const CAPTION_RESERVE = 96;
const BORDER_RADIUS = 20;
const BACKDROP_TRANSITION_MS = 200;
/** Tailwind `md` — lightbox is desktop-only below this. */
const MD_UP_QUERY = "(min-width: 768px)";

function useMdUp() {
  const [mdUp, setMdUp] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MD_UP_QUERY).matches
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(MD_UP_QUERY);
    const onChange = () => setMdUp(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return mdUp;
}

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
  /** Optional caption shown below the image in the open lightbox. */
  caption?: ReactNode;
  /**
   * When true, also show `caption` under the thumbnail while the lightbox is
   * closed. Defaults to true whenever `caption` is set.
   */
  showCaption?: boolean;
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

function getExpandedRect(aspectRatio: string, hasCaption: boolean): Rect {
  const { w, h } = parseAspectRatio(aspectRatio);
  const captionSpace = hasCaption ? CAPTION_GAP + CAPTION_RESERVE : 0;
  const maxW = window.innerWidth - STAGE_INSET * 2;
  const maxH =
    window.innerHeight - STAGE_INSET - STAGE_INSET_BOTTOM - captionSpace;
  let width = maxW;
  let height = (width * h) / w;
  if (height > maxH) {
    height = maxH;
    width = (height * w) / h;
  }
  const groupHeight = height + captionSpace;
  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    // Center the image (+ caption) group; bottom inset stays tighter than top.
    top:
      STAGE_INSET +
      (window.innerHeight - STAGE_INSET - STAGE_INSET_BOTTOM - groupHeight) / 2,
  };
}

export default function Lightbox({
  layoutId,
  aspectRatio,
  ariaLabel,
  children,
  caption,
  showCaption,
  className,
  frameClassName,
  expandedFrameClassName,
  onOpenChange,
}: LightboxProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const mdUp = useMdUp();
  const thumbRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);
  const hasCaption = Boolean(caption);
  const showClosedCaption = hasCaption && showCaption !== false;

  const [open, setOpen] = useState(false);
  /** Portal stays mounted through the close morph. */
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState<Rect | null>(null);
  const [expanded, setExpanded] = useState<Rect | null>(null);

  openRef.current = open;
  onOpenChangeRef.current = onOpenChange;

  function blockSelect(e: MouseEvent) {
    e.preventDefault();
  }

  function measure() {
    const thumb = thumbRef.current;
    if (!thumb) return null;
    return {
      origin: readRect(thumb),
      expanded: getExpandedRect(aspectRatio, hasCaption),
    };
  }

  function setOpenAndNotify(next: boolean) {
    if (next && !window.matchMedia(MD_UP_QUERY).matches) return;
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
    if (mdUp) return;
    // Drop any open lightbox when crossing below md.
    if (openRef.current) {
      setOpen(false);
      onOpenChangeRef.current?.(false);
    }
    setActive(false);
    setOrigin(null);
    setExpanded(null);
  }, [mdUp]);

  useEffect(() => {
    if (!active) return;
    function onResize() {
      const thumb = thumbRef.current;
      if (!thumb) return;
      setOrigin(readRect(thumb));
      setExpanded(getExpandedRect(aspectRatio, hasCaption));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, aspectRatio, hasCaption]);

  const frameStyle = { borderRadius: BORDER_RADIUS } as const;
  const target = open ? expanded : origin;
  const instant = reduceMotion || !origin || !expanded || !target;

  if (!mdUp) {
    return (
      <div className={cn("select-none", className)}>
        <div
          ref={thumbRef}
          className={cn("relative select-none", frameClassName)}
          style={{
            ...frameStyle,
            aspectRatio: aspectRatio.replace(/\s+/g, " "),
            width: "100%",
          }}
        >
          {children}
        </div>
        {showClosedCaption ? (
          <div className="mt-3 text-sm text-tertiary-foreground">{caption}</div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div className="select-none">
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
            style={{
              ...frameStyle,
              aspectRatio: aspectRatio.replace(/\s+/g, " "),
              width: "100%",
            }}
            aria-hidden={active || undefined}
          >
            {!active ? children : null}
          </div>
        </div>
        {showClosedCaption ? (
          <div
            className={cn(
              "mt-3 text-sm text-tertiary-foreground",
              // Hide only while fully open — restore as soon as close starts so
              // the caption doesn't vanish for the whole morph duration.
              open && "invisible",
            )}
            aria-hidden={open || undefined}
          >
            {caption}
          </div>
        ) : null}
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
                // Frame styles first so `fixed` below wins over any `relative`
                // from frameClassName (tailwind-merge keeps the last position).
                expandedFrameClassName ?? frameClassName,
                "fixed z-[10001] cursor-zoom-out select-none overflow-hidden",
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
              <div className="absolute inset-0 h-full w-full overflow-hidden rounded-[inherit]">
                {children}
              </div>
            </motion.div>

            {hasCaption ? (
              <motion.div
                key={`${layoutId}-caption`}
                initial={instant ? false : { opacity: 0 }}
                animate={{ opacity: open ? 1 : 0 }}
                transition={{
                  duration: instant ? 0 : BACKDROP_TRANSITION_MS / 1000,
                  ease: "easeOut",
                }}
                className="pointer-events-none fixed z-[10001] px-2 text-center text-lg text-foreground md:text-base xl:text-xl"
                style={{
                  top: expanded.top + expanded.height + CAPTION_GAP,
                  left: expanded.left,
                  width: expanded.width,
                }}
              >
                {caption}
              </motion.div>
            ) : null}
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
