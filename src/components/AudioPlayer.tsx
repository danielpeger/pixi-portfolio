import { useEffect, useRef, useState } from "react";
import { SFPause } from "sf-symbols-lib/monochrome/SFPause";
import { SFPlay } from "sf-symbols-lib/monochrome/SFPlay";
import { Spinner } from "@/components/ui/spinner";

type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
};

const TRACKS: Track[] = [
  {
    id: "saat-alfarah",
    title: "Saat Alfarah",
    artist: "The Scorpions, Saif Abu Bakr",
    src: "/Saat Alfarah - The Scorpions, Saif Abu Bakr.m4a",
  },
  {
    id: "monte-carlo",
    title: "Monte Carlo",
    artist: "Remi Wolf",
    src: "/Monte Carlo - Remi Wolf.m4a",
  },
  {
    id: "jobaratok",
    title: "Jóbarátok vagyunk",
    artist: "Locomotiv GT",
    src: "/jobaratok-vagyunk.mp3",
  },
  {
    id: "blue-sky",
    title: "Blue Sky",
    artist: "The Allman Brothers Band",
    src: "/Blue Sky - The Allman Brothers Band.m4a",
  },
  {
    id: "i-wish",
    title: "I Wish I Knew How It Would Feel to Be Free",
    artist: "Nina Simone",
    src: "/I Wish I Knew How It Would Feel to Be Free - Nina Simone.m4a",
  },
];

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const stopPlayback = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const startPlayback = (audio: HTMLAudioElement) => {
    if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      setLoading(true);
    }
    setPlaying(true);
    void audio.play().catch(() => {
      setPlaying(false);
      setLoading(false);
    });
  };

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = encodeURI(track.src);
    setCurrentId(track.id);
    startPlayback(audio);
  };

  const playNext = () => {
    const index = TRACKS.findIndex((track) => track.id === currentId);
    playTrack(TRACKS[(index + 1) % TRACKS.length]);
  };

  const toggleTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentId === track.id) {
      if (playing || loading) {
        stopPlayback();
      } else {
        startPlayback(audio);
      }
      return;
    }

    playTrack(track);
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        playsInline
        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onWaiting={() => {
          if (!audioRef.current?.paused) setLoading(true);
        }}
        onEnded={playNext}
        onError={() => {
          setPlaying(false);
          setLoading(false);
        }}
      />
      <ul>
        {TRACKS.map((track, index) => {
          const isCurrent = currentId === track.id;
          const isLoading = isCurrent && loading;
          const isPlaying = isCurrent && playing && !loading;
          return (
            <li
              key={track.id}
              className={
                index < TRACKS.length - 1
                  ? "pb-3 mb-2 border-b border-separator"
                  : undefined
              }
            >
              <button
                type="button"
                className="flex w-full cursor-pointer items-start justify-between gap-4 border-0 bg-transparent p-0 text-left font-rubik text-inherit"
                aria-pressed={isPlaying}
                aria-busy={isLoading}
                aria-label={
                  isLoading
                    ? `Loading ${track.title}`
                    : isPlaying
                      ? `Pause ${track.title}`
                      : `Play ${track.title}`
                }
                onClick={() => toggleTrack(track)}
              >
                <span>
                  <span className="block">{track.title}</span>
                  <span className="block text-tertiary-foreground">
                    {track.artist}
                  </span>
                </span>
                <span className="mt-1 block size-5 shrink-0 overflow-clip text-tertiary-foreground">
                  {isLoading ? (
                    <Spinner aria-hidden className="size-full" />
                  ) : isPlaying ? (
                    <SFPause aria-hidden size="md" className="size-full" />
                  ) : (
                    <SFPlay aria-hidden size="md" className="size-full" />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
