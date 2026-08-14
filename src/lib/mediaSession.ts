export type NowPlayingTrack = {
  title: string;
  artist: string;
  album?: string;
  artwork: string;
};

const ARTWORK_SIZES = [
  "96x96",
  "128x128",
  "192x192",
  "256x256",
  "384x384",
  "512x512",
] as const;

const SESSION_ACTIONS = [
  "play",
  "pause",
  "previoustrack",
  "nexttrack",
  "seekbackward",
  "seekforward",
  "seekto",
] as const;

let restoredTitle: string | null = null;
let nowPlayingTitle: string | null = null;

export function mediaSessionSupported(): boolean {
  return typeof navigator !== "undefined" && "mediaSession" in navigator;
}

export function absoluteArtworkUrl(
  artworkPath: string,
  baseHref = globalThis.location?.href ?? "https://localhost/",
): string {
  return new URL(artworkPath, baseHref).href;
}

export function buildMediaMetadataInit(
  track: NowPlayingTrack,
  baseHref?: string,
): MediaMetadataInit {
  const src = absoluteArtworkUrl(track.artwork, baseHref);
  return {
    title: track.title,
    artist: track.artist,
    album: track.album ?? "",
    artwork: ARTWORK_SIZES.map((sizes) => ({
      src,
      sizes,
      type: "image/jpeg",
    })),
  };
}

export function applyNowPlayingTitle(track: NowPlayingTrack | null): void {
  if (typeof document === "undefined") return;
  if (track) {
    const nextTitle = `${track.title} · ${track.artist}`;
    if (restoredTitle === null) restoredTitle = document.title;
    nowPlayingTitle = nextTitle;
    document.title = nextTitle;
    return;
  }
  if (restoredTitle !== null && document.title === nowPlayingTitle) {
    document.title = restoredTitle;
  }
  restoredTitle = null;
  nowPlayingTitle = null;
}

export function applyMediaSessionMetadata(track: NowPlayingTrack): void {
  if (!mediaSessionSupported()) return;
  navigator.mediaSession.metadata = new MediaMetadata(
    buildMediaMetadataInit(track),
  );
  applyNowPlayingTitle(track);
}

export function applyMediaSessionPlaybackState(
  state: MediaSessionPlaybackState,
): void {
  if (!mediaSessionSupported()) return;
  navigator.mediaSession.playbackState = state;
}

export function applyMediaSessionPosition(audio: HTMLAudioElement): void {
  if (
    !mediaSessionSupported() ||
    typeof navigator.mediaSession.setPositionState !== "function"
  ) {
    return;
  }

  const { duration, currentTime, playbackRate } = audio;
  if (!Number.isFinite(duration) || duration <= 0) return;

  try {
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: Number.isFinite(playbackRate) && playbackRate > 0 ? playbackRate : 1,
      position: Math.max(0, Math.min(currentTime, duration)),
    });
  } catch {
    // Safari throws if position/duration get out of sync during src changes.
  }
}

export function setMediaSessionActionHandler(
  action: MediaSessionAction,
  handler: MediaSessionActionHandler | null,
): void {
  if (!mediaSessionSupported()) return;
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch {
    // Browsers throw for actions they don't implement.
  }
}

export function bindMediaSessionActionHandlers(
  handlers: Partial<Record<MediaSessionAction, MediaSessionActionHandler>>,
): () => void {
  for (const action of SESSION_ACTIONS) {
    setMediaSessionActionHandler(action, handlers[action] ?? null);
  }
  return () => {
    for (const action of SESSION_ACTIONS) {
      setMediaSessionActionHandler(action, null);
    }
  };
}

export function clearNowPlaying(): void {
  applyNowPlayingTitle(null);
  if (!mediaSessionSupported()) return;
  navigator.mediaSession.metadata = null;
  navigator.mediaSession.playbackState = "none";
}
