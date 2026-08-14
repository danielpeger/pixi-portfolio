import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  absoluteArtworkUrl,
  applyMediaSessionMetadata,
  applyNowPlayingTitle,
  buildMediaMetadataInit,
  clearNowPlaying,
  mediaSessionSupported,
} from "./mediaSession.ts";

type FakeMediaSession = {
  metadata: unknown;
  playbackState: MediaSessionPlaybackState;
  setActionHandler: () => void;
  setPositionState: () => void;
};

const TRACK = {
  title: "Blue Sky",
  artist: "The Allman Brothers Band",
  album: "Universal Masters Collection",
  artwork: "/artwork/blue-sky.jpg",
};

describe("mediaSession", () => {
  const originalNavigator = globalThis.navigator;
  const originalDocument = globalThis.document;
  const originalLocation = globalThis.location;
  const originalMediaMetadata = globalThis.MediaMetadata;

  beforeEach(() => {
    const mediaSession: FakeMediaSession = {
      metadata: null,
      playbackState: "none",
      setActionHandler() {},
      setPositionState() {},
    };
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { mediaSession },
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { title: "Daniel Péger" },
    });
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { href: "https://danielpeger.com/overview" },
    });
    class FakeMediaMetadata {
      title: string;
      artist: string;
      album: string;
      artwork: MediaImage[];
      constructor(init: MediaMetadataInit) {
        this.title = init.title ?? "";
        this.artist = init.artist ?? "";
        this.album = init.album ?? "";
        this.artwork = init.artwork ? [...init.artwork] : [];
      }
    }
    globalThis.MediaMetadata = FakeMediaMetadata as typeof MediaMetadata;
  });

  afterEach(() => {
    clearNowPlaying();
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: originalDocument,
    });
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: originalLocation,
    });
    globalThis.MediaMetadata = originalMediaMetadata;
  });

  it("builds absolute JPEG artwork URLs for iOS lock screen", () => {
    const init = buildMediaMetadataInit(TRACK, "https://danielpeger.com/");
    assert.equal(init.title, "Blue Sky");
    assert.equal(init.artist, "The Allman Brothers Band");
    assert.equal(init.album, "Universal Masters Collection");
    assert.ok(init.artwork && init.artwork.length > 0);
    for (const image of init.artwork ?? []) {
      assert.equal(image.src, "https://danielpeger.com/artwork/blue-sky.jpg");
      assert.equal(image.type, "image/jpeg");
      assert.match(image.sizes ?? "", /^\d+x\d+$/);
    }
  });

  it("resolves artwork against the page origin, not the current path", () => {
    assert.equal(
      absoluteArtworkUrl("/artwork/monte-carlo.jpg", "https://danielpeger.com/kinja"),
      "https://danielpeger.com/artwork/monte-carlo.jpg",
    );
  });

  it("publishes MediaMetadata instead of leaving the page title as the now-playing name", () => {
    assert.equal(mediaSessionSupported(), true);
    applyMediaSessionMetadata(TRACK);
    const session = navigator.mediaSession;
    const metadata = session.metadata as MediaMetadata;
    assert.equal(metadata.title, "Blue Sky");
    assert.equal(metadata.artist, "The Allman Brothers Band");
    assert.equal(document.title, "Blue Sky · The Allman Brothers Band");
  });

  it("restores the page title when playback ends", () => {
    applyNowPlayingTitle(TRACK);
    assert.equal(document.title, "Blue Sky · The Allman Brothers Band");
    applyNowPlayingTitle(null);
    assert.equal(document.title, "Daniel Péger");
  });

  it("does not clobber a title the app set after playback started", () => {
    applyNowPlayingTitle(TRACK);
    document.title = "Overview — Daniel Péger";
    applyNowPlayingTitle(null);
    assert.equal(document.title, "Overview — Daniel Péger");
  });
});
