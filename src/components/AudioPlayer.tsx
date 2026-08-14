import { useEffect, useRef, useState } from "react";
import { SFPause } from "sf-symbols-lib/monochrome/SFPause";
import { SFPlay } from "sf-symbols-lib/monochrome/SFPlay";
import { Spinner } from "@/components/ui/spinner";
import {
  applyMediaSessionMetadata,
  applyMediaSessionPlaybackState,
  applyMediaSessionPosition,
  bindMediaSessionActionHandlers,
  clearNowPlaying,
} from "@/lib/mediaSession";

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string;
  artwork: string;
};

const TRACKS: Track[] = [
  {
    id: "saat-alfarah",
    title: "Saat Alfarah",
    artist: "The Scorpions, Saif Abu Bakr",
    album: "Jazz, Jazz, Jazz (Habibi Funk 009)",
    src: "/Saat Alfarah - The Scorpions, Saif Abu Bakr.m4a",
    artwork: "/artwork/saat-alfarah.jpg",
  },
  {
    id: "monte-carlo",
    title: "Monte Carlo",
    artist: "Remi Wolf",
    album: "Monte Carlo",
    src: "/Monte Carlo - Remi Wolf.m4a",
    artwork: "/artwork/monte-carlo.jpg",
  },
  {
    id: "jobaratok",
    title: "Jóbarátok vagyunk",
    artist: "Locomotiv GT",
    album: "Mindenki másképp csinálja",
    src: "/jobaratok-vagyunk.mp3",
    artwork: "/artwork/jobaratok.jpg",
  },
  {
    id: "blue-sky",
    title: "Blue Sky",
    artist: "The Allman Brothers Band",
    album: "Eat a Peach",
    src: "/Blue Sky - The Allman Brothers Band.m4a",
    artwork: "/artwork/blue-sky.jpg",
  },
  {
    id: "i-wish",
    title: "I Wish I Knew How It Would Feel to Be Free",
    artist: "Nina Simone",
    album: "Miss Simone: The Hits",
    src: "/I Wish I Knew How It Would Feel to Be Free - Nina Simone.m4a",
    artwork: "/artwork/i-wish.jpg",
  },
];

const SEEK_OFFSET_SECONDS = 10;
const RESTART_THRESHOLD_SECONDS = 3;

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentIdRef = useRef<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const setCurrentTrackId = (id: string | null) => {
    currentIdRef.current = id;
    setCurrentId(id);
  };

  const trackById = (id: string | null) =>
    TRACKS.find((track) => track.id === id);

  const syncNowPlaying = (track: Track, isPlaying: boolean) => {
    const audio = audioRef.current;
    applyMediaSessionMetadata(track);
    applyMediaSessionPlaybackState(isPlaying ? "playing" : "paused");
    if (audio) applyMediaSessionPosition(audio);
  };

  const stopPlayback = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setLoading(false);
    const track = trackById(currentIdRef.current);
    if (track) syncNowPlaying(track, false);
  };

  const startPlayback = (audio: HTMLAudioElement) => {
    if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      setLoading(true);
    }
    setPlaying(true);
    const track = trackById(currentIdRef.current);
    if (track) syncNowPlaying(track, true);
    void audio.play().then(
      () => {
        const current = trackById(currentIdRef.current);
        if (current) syncNowPlaying(current, true);
      },
      () => {
        setPlaying(false);
        setLoading(false);
        const current = trackById(currentIdRef.current);
        if (current) syncNowPlaying(current, false);
      },
    );
  };

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = encodeURI(track.src);
    setCurrentTrackId(track.id);
    syncNowPlaying(track, true);
    startPlayback(audio);
  };

  const playAtIndex = (index: number) => {
    const nextIndex = (index + TRACKS.length) % TRACKS.length;
    playTrack(TRACKS[nextIndex]);
  };

  const playNext = () => {
    const index = TRACKS.findIndex((track) => track.id === currentIdRef.current);
    playAtIndex(index < 0 ? 0 : index + 1);
  };

  const playPrevious = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > RESTART_THRESHOLD_SECONDS) {
      audio.currentTime = 0;
      applyMediaSessionPosition(audio);
      return;
    }
    const index = TRACKS.findIndex((track) => track.id === currentIdRef.current);
    playAtIndex(index < 0 ? 0 : index - 1);
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

  const seekBy = (offset: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration, audio.currentTime + offset),
    );
    applyMediaSessionPosition(audio);
  };

  const controlsRef = useRef({
    playTrack,
    startPlayback,
    stopPlayback,
    playNext,
    playPrevious,
    seekBy,
  });
  controlsRef.current = {
    playTrack,
    startPlayback,
    stopPlayback,
    playNext,
    playPrevious,
    seekBy,
  };

  useEffect(() => {
    const unbind = bindMediaSessionActionHandlers({
      play: () => {
        const audio = audioRef.current;
        if (!audio) return;
        const track = trackById(currentIdRef.current) ?? TRACKS[0];
        if (currentIdRef.current !== track.id) {
          controlsRef.current.playTrack(track);
          return;
        }
        controlsRef.current.startPlayback(audio);
      },
      pause: () => controlsRef.current.stopPlayback(),
      nexttrack: () => controlsRef.current.playNext(),
      previoustrack: () => controlsRef.current.playPrevious(),
      seekbackward: (details) =>
        controlsRef.current.seekBy(-(details.seekOffset || SEEK_OFFSET_SECONDS)),
      seekforward: (details) =>
        controlsRef.current.seekBy(details.seekOffset || SEEK_OFFSET_SECONDS),
      seekto: (details) => {
        const audio = audioRef.current;
        if (!audio || details.seekTime == null) return;
        audio.currentTime = details.seekTime;
        applyMediaSessionPosition(audio);
      },
    });
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      unbind();
      clearNowPlaying();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        playsInline
        onLoadedMetadata={() => {
          const track = trackById(currentIdRef.current);
          const audio = audioRef.current;
          if (track && audio) {
            applyMediaSessionMetadata(track);
            applyMediaSessionPosition(audio);
          }
        }}
        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
          const track = trackById(currentIdRef.current);
          if (track) syncNowPlaying(track, true);
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
