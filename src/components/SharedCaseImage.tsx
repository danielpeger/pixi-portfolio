import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import OptimizedImage, { type PictureImage } from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";
import { type CaseLayoutId, sharedLayoutTransition } from "@/lib/portfolio";

/** Above page chrome (Pixi, copy, other cards) while a shared-layout morph runs. */
const MORPH_Z_INDEX = 9999;

type SharedCaseImageProps = {
  layoutId: CaseLayoutId;
  image: PictureImage;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  /**
   * When false (kept-alive but hidden home), omit layoutId so it
   * doesn't collide with the case-study hero during the shared-layout morph.
   */
  shareLayout?: boolean;
  /**
   * Force a top z-index from the first frame of a known morph (e.g. close),
   * before onLayoutAnimationStart fires.
   */
  elevate?: boolean;
  onLayoutAnimationComplete?: () => void;
};

export default function SharedCaseImage({
  layoutId,
  image,
  alt,
  className,
  sizes,
  priority = false,
  shareLayout = true,
  elevate = false,
  onLayoutAnimationComplete,
}: SharedCaseImageProps) {
  const reduceMotion = useReducedMotion();
  const enabled = shareLayout && !reduceMotion;
  const [animating, setAnimating] = useState(false);
  const onTop = elevate || animating;

  return (
    <motion.div
      // Always the same component type so the <img> isn't remounted when
      // shareLayout toggles (remounts blank the bitmap mid-morph in Safari).
      layoutId={enabled ? layoutId : undefined}
      layoutCrossfade={false}
      transition={sharedLayoutTransition}
      className={cn(
        "relative border border-accent-border-light bg-accent-muted-light",
        className,
      )}
      style={{
        borderRadius: 20,
        // Inline z-index so it wins over equal-z siblings and Pixi layers
        // while this instance is the shared-layout lead/follow.
        zIndex: onTop ? MORPH_Z_INDEX : undefined,
      }}
      onLayoutAnimationStart={() => setAnimating(true)}
      onLayoutAnimationComplete={() => {
        setAnimating(false);
        onLayoutAnimationComplete?.();
      }}
    >
      {/*
        Keep overflow:hidden off the layoutId node. Safari drops child paint
        when the same element has overflow clipping + Motion's projection
        transform. Clip on an inner wrapper instead; radius inherits so the
        morphing corner radius still masks the image.
      */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: "inherit" }}
      >
        <OptimizedImage
          image={image}
          alt={alt}
          fill
          className="object-cover [transform:translateZ(0)]"
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    </motion.div>
  );
}
