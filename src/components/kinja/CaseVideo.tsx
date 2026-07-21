"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CaseVideoProps = {
  src: string;
  loop?: boolean;
  bgColor?: string;
  className?: string;
};

export default function CaseVideo({
  src,
  loop = false,
  bgColor,
  className,
}: CaseVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showReplay, setShowReplay] = useState(false);
  const [loading, setLoading] = useState(true);

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
        className="block w-full"
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
          <Image
            src="/kinjanav/replay.svg"
            alt=""
            width={11}
            height={15}
            className="brightness-0 invert"
            unoptimized
          />
          Replay
        </button>
      )}
    </div>
  );
}
