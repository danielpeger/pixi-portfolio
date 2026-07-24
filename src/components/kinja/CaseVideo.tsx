import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Lightbox from "@/components/Lightbox";
import { cn } from "@/lib/utils";

type CaseVideoProps = {
  src: string;
  loop?: boolean;
  bgColor?: string;
  className?: string;
  videoClassName?: string;
  /** Seek to this time (seconds) once the video can play. */
  startAt?: number;
};

const CaseVideo = forwardRef<HTMLVideoElement, CaseVideoProps>(function CaseVideo(
  { src, loop = false, bgColor, className, videoClassName, startAt },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => videoRef.current!, []);
  const [showReplay, setShowReplay] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || startAt == null) return;

    const time = startAt;

    function seek() {
      if (video) video.currentTime = time;
    }

    if (video.readyState >= 1) {
      seek();
      return;
    }

    video.addEventListener("loadedmetadata", seek, { once: true });
    return () => video.removeEventListener("loadedmetadata", seek);
  }, [startAt, videoRef]);

  function handleEnded() {
    if (!loop) setShowReplay(true);
  }

  function replay() {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
    setShowReplay(false);
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-[20px]", className)}
      style={loading && bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <video
        ref={videoRef}
        className={cn("block w-full select-none", videoClassName)}
        preload="auto"
        autoPlay
        muted
        playsInline
        loop={loop}
        onEnded={handleEnded}
        onLoadStart={() => setLoading(true)}
        onCanPlayThrough={() => setLoading(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {showReplay && (
        <button
          type="button"
          onClick={replay}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-80 md:bottom-6 md:right-8"
        >
          <img
            src="/kinjanav/replay.svg"
            alt=""
            width={11}
            height={15}
            className="brightness-0 invert"
          />
          Replay
        </button>
      )}
    </div>
  );
});

type LightboxCaseVideoProps = CaseVideoProps & {
  layoutId: string;
  aspectRatio?: string;
  ariaLabel: string;
  frameClassName?: string;
};

export function LightboxCaseVideo({
  layoutId,
  aspectRatio = "16 / 9",
  ariaLabel,
  className,
  frameClassName,
  ...videoProps
}: LightboxCaseVideoProps) {
  const thumbRef = useRef<HTMLVideoElement>(null);
  const [resumeAt, setResumeAt] = useState<number | undefined>();

  return (
    <Lightbox
      layoutId={layoutId}
      aspectRatio={aspectRatio}
      ariaLabel={ariaLabel}
      className={className}
      frameClassName={cn("relative w-full overflow-hidden", frameClassName)}
      onOpenChange={(next) => {
        if (next) setResumeAt(thumbRef.current?.currentTime ?? 0);
      }}
    >
      <CaseVideo
        {...videoProps}
        ref={thumbRef}
        startAt={resumeAt}
        className="block w-full rounded-[inherit]"
      />
    </Lightbox>
  );
}

export default CaseVideo;
