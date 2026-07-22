import { useEffect, useRef, useState } from "react";
import {
  Application,
  Assets,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  computeDaniX,
  computeDaniY,
  computeFriendX,
  computeFriendY,
  computeHelloX,
  computeHelloY,
  computeImX,
  computeImY,
  scaleFontSize,
  type TextLayoutMetrics,
} from "./pixi-sketch/layout";
import {
  getObb,
  getRotationAxes,
  isBodySettled,
  obbCollision,
  restitutionForSpeed,
  type LocalBounds,
} from "./pixi-sketch/physics";

type PixiSketchProps = {
  className?: string;
  /** When false, the ticker pauses so a keep-alive mount doesn't burn CPU. */
  active?: boolean;
};

const GYRO_DENIED_KEY = "gyroDenied";

function readGyroDenied() {
  try {
    return window.localStorage.getItem(GYRO_DENIED_KEY) === "true";
  } catch {
    return false;
  }
}

function writeGyroDenied(denied: boolean) {
  try {
    if (denied) {
      window.localStorage.setItem(GYRO_DENIED_KEY, "true");
    } else {
      window.localStorage.removeItem(GYRO_DENIED_KEY);
    }
  } catch {
    // Ignore storage failures.
  }
}

export default function PixiSketch({
  className,
  active = true,
}: PixiSketchProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const syncOnActivateRef = useRef<(() => void) | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const app = appRef.current;
    if (!app?.ticker) return;
    if (active) {
      app.ticker.start();
      syncOnActivateRef.current?.();
    } else {
      app.ticker.stop();
    }
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new Application();
    appRef.current = app;
    let resizeObserver: ResizeObserver | null = null;
    let handleOrientation: (event: DeviceOrientationEvent) => void = () =>
      undefined;
    let enableGyroOnPointer: () => void = () => undefined;
    let handlePointerMove: (event: PointerEvent) => void = () => undefined;
    let handlePointerLeave: () => void = () => undefined;
    let refreshCanvasBounds: () => void = () => undefined;
    let handleWindowResize: () => void = () => undefined;
    let handleWindowScroll: () => void = () => undefined;
    let updateTextFontSizes: () => void = () => undefined;
    let updateTextPositions: () => void = () => undefined;
    let handleColorSchemeChange: (event: MediaQueryListEvent) => void = () =>
      undefined;
    let colorSchemeQuery: MediaQueryList | null = null;
    let resizeRafId: number | null = null;

    let isMounted = true;

    const init = async () => {
      const softPushEnabled =
        new URLSearchParams(window.location.search).get("softpush") !== "off";
      colorSchemeQuery =
        window.matchMedia?.("(prefers-color-scheme: dark)") ?? null;
      const themeColors = (dark: boolean) => ({
        background: dark ? 0x000000 : 0xffffff,
        text: dark ? 0xffffff : 0x000000,
        tertiary: dark ? 0xdadadd : 0xc3c3c8,
      });
      const initialTheme = themeColors(colorSchemeQuery?.matches ?? false);
      const dpr = window.devicePixelRatio || 1;
      const isHandheld =
        window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

      // Kick off network/decode work before (and during) app.init so fonts and
      // SVGs overlap with WebGL setup instead of waiting in a waterfall.
      const handTargetSize = 24;
      const handRasterScale = Math.max(2, Math.ceil(handTargetSize / 25));
      const assetsPromise = Promise.all([
        Assets.load({
          src: "/hand.svg",
          data: { scale: handRasterScale, resolution: dpr },
        }),
        Assets.load({
          src: "/tilt.svg",
          data: { scale: handRasterScale, resolution: dpr },
        }),
        Assets.load({
          src: "/hold.svg",
          data: { scale: 4, resolution: dpr },
        }),
        Assets.load({
          src: "/flick.svg",
          data: { scale: 4, resolution: dpr },
        }),
      ]);
      const fontsPromise = document.fonts
        ? document.fonts
            .load('400 140px "Jua"')
            .catch(() => {
              // Don't block the sketch if a font file fails to load.
            })
        : Promise.resolve();

      // resizeTo keeps Pixi's backing store tied to the container; our own
      // ResizeObserver + syncRenderer then re-asserts canvas CSS 100% so
      // autoDensity's pixel height can't lag a frame (that lag was the blink).
      await app.init({
        resizeTo: container,
        backgroundColor: initialTheme.background,
        resolution: dpr,
        autoDensity: true,
        powerPreference: "high-performance",
      });

      app.renderer.events.autoPreventDefault = false;
      app.canvas.style.touchAction = "manipulation";

      if (!isMounted) {
        if (app.renderer) app.destroy(true);
        return;
      }

      container.appendChild(app.canvas);
      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";

      const [[handTexture, tiltTexture, holdTexture, flickTexture]] =
        await Promise.all([assetsPromise, fontsPromise]);

      if (!isMounted) {
        if (app.renderer) app.destroy(true);
        return;
      }

      let cachedFontSize = scaleFontSize(window.innerWidth);
      const textStyle = new TextStyle({
        fill: initialTheme.text,
        fontSize: cachedFontSize,
        fontWeight: "400",
        fontFamily: '"Jua", Arial, Helvetica, sans-serif',
        trim: true,
      });
      let circleRadius = cachedFontSize * 0.6;
      const circle = new Graphics().circle(0, 0, circleRadius).fill("0xffcc00");
      let canvasBounds = app.canvas.getBoundingClientRect();
      refreshCanvasBounds = () => {
        canvasBounds = app.canvas.getBoundingClientRect();
      };
      let lastRenderWidth = 0;
      let lastRenderHeight = 0;

      const layoutMetrics = (): TextLayoutMetrics => ({
        canvasWidth: app.renderer.width,
        canvasHeight: app.renderer.height,
        viewportWidth: window.innerWidth,
        fontSize: cachedFontSize,
      });

      // Read-only: resizes the Pixi renderer to match the container's current
      // box. The container's height is owned entirely by CSS, so this never
      // writes the container's size and is safe to call from the
      // ResizeObserver (writing it there caused the resize-loop flicker).
      const syncRenderer = () => {
        const { width, height } = container.getBoundingClientRect();
        if (width > 0 && height > 0) {
          const roundedWidth = Math.round(width);
          const roundedHeight = Math.round(height);
          if (
            roundedWidth !== lastRenderWidth ||
            roundedHeight !== lastRenderHeight
          ) {
            lastRenderWidth = roundedWidth;
            lastRenderHeight = roundedHeight;
            app.renderer.resize(roundedWidth, roundedHeight);
            app.canvas.style.width = "100%";
            app.canvas.style.height = "100%";
            refreshCanvasBounds();
            updateTextFontSizes();
            updateTextPositions();
          }
        }
      };

      // Coalesce bursts of resize callbacks into a single read-only sync per
      // frame.
      const scheduleSync = () => {
        if (resizeRafId !== null) return;
        resizeRafId = window.requestAnimationFrame(() => {
          resizeRafId = null;
          if (!isMounted) return;
          syncRenderer();
        });
      };

      syncRenderer();
      syncOnActivateRef.current = scheduleSync;
      resizeObserver = new ResizeObserver(scheduleSync);
      resizeObserver.observe(container);
      handleWindowResize = () => {
        refreshCanvasBounds();
        scheduleSync();
      };
      handleWindowScroll = () => refreshCanvasBounds();
      window.addEventListener("resize", handleWindowResize);
      window.addEventListener("scroll", handleWindowScroll, { passive: true });

      const hand = new Sprite(handTexture);
      const handSize = handTargetSize;
      hand.anchor.set(0);
      hand.scale.set(handSize / hand.texture.height);
      hand.alpha = 0;
      hand.x = 28;
      hand.y = 31;
      let handFadeElapsed = 0;
      const handFadeDelay = 1.5;
      const handFadeDuration = 0.5;
      let handEnabledElapsed = 0;
      const handEnabledHold = 3;
      const handEnabledFadeDuration = 0.5;
      const handLabel = new Text({
        text: "Tap to enable gyroscope",
        style: new TextStyle({
          fill: initialTheme.tertiary,
          fontSize: 20,
          fontWeight: "400",
          fontFamily:
            '"SF Pro Rounded", "SF Rounded", -apple-system, system-ui, sans-serif',
        }),
      });
      handLabel.alpha = 0;
      handLabel.x = hand.x + hand.width + 8;
      handLabel.y = hand.y - 2 + (hand.height - handLabel.height) / 2;

      const applyTheme = (dark: boolean) => {
        const colors = themeColors(dark);
        app.renderer.background.color = colors.background;
        textStyle.fill = colors.text;
        handLabel.style.fill = colors.tertiary;
      };
      handleColorSchemeChange = (event) => applyTheme(event.matches);
      colorSchemeQuery?.addEventListener("change", handleColorSchemeChange);

      let velocityX = 0;
      let velocityY = 0;
      let tiltX = 0;
      let tiltY = 0;
      let idleTiltElapsed = 0;
      const idleTiltDuration = 2.5;
      const idleTiltStartY = 0.5;
      let baseGamma: number | null = null;
      let baseBeta: number | null = null;
      let hasOrientationData = false;
      let pointerX = 0;
      let pointerY = 0;
      let pointerVX = 0;
      let pointerVY = 0;
      let pointerActive = false;
      let lastPointerTime = 0;
      let lastPointerX = 0;
      let lastPointerY = 0;

      handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.gamma == null || event.beta == null) return;
        hasOrientationData = true;
        if (baseGamma == null || baseBeta == null) {
          baseGamma = event.gamma;
          baseBeta = event.beta;
        }
        tiltX = (event.gamma - baseGamma) * 0.04;
        tiltY = (event.beta - baseBeta) * 0.04;
      };

      let gyroEnabled = false;
      let gyroDenied = false;
      let handMode: "prompt" | "enabled" | "hidden" = "hidden";
      const enableGyro = async () => {
        if (typeof DeviceOrientationEvent === "undefined") return false;
        if (gyroEnabled) return true;
        if ("requestPermission" in DeviceOrientationEvent) {
          try {
            const permission = await (
              DeviceOrientationEvent as typeof DeviceOrientationEvent & {
                requestPermission?: () => Promise<PermissionState>;
              }
            ).requestPermission?.();
            if (permission !== "granted") {
              gyroDenied = true;
              handMode = "hidden";
              writeGyroDenied(true);
              return false;
            }
          } catch (error) {
            console.warn(
              "Device orientation permission request failed.",
              error,
            );
            const notAllowed =
              error instanceof DOMException && error.name === "NotAllowedError";
            if (!notAllowed) {
              gyroDenied = true;
              handMode = "hidden";
              writeGyroDenied(true);
            }
            return false;
          }
        }
        baseGamma = null;
        baseBeta = null;
        window.addEventListener("deviceorientation", handleOrientation);
        gyroEnabled = true;
        handMode = "enabled";
        handEnabledElapsed = 0;
        hand.texture = tiltTexture;
        hand.scale.set(20 / hand.texture.height);
        handLabel.text = "Tilt phone to move ball";
        handLabel.x = hand.x + hand.width + 8;
        handLabel.y = hand.y + (hand.height - handLabel.height) / 2;
        writeGyroDenied(false);
        return true;
      };

      enableGyroOnPointer = async () => {
        const enabled = await enableGyro();
        if (enabled || gyroDenied) {
          app.canvas.removeEventListener("click", enableGyroOnPointer);
          app.canvas.removeEventListener("touchend", enableGyroOnPointer);
        }
      };
      const hasDeviceOrientation =
        isHandheld && typeof DeviceOrientationEvent !== "undefined";
      const needsTapToEnable =
        hasDeviceOrientation && "requestPermission" in DeviceOrientationEvent;
      if (hasDeviceOrientation) {
        gyroDenied = readGyroDenied();
        const shouldPrompt = needsTapToEnable && !gyroDenied;
        handMode = shouldPrompt ? "prompt" : "hidden";
        hand.visible = shouldPrompt;
        if (shouldPrompt) {
          app.canvas.addEventListener("click", enableGyroOnPointer);
          app.canvas.addEventListener("touchend", enableGyroOnPointer);
        } else if (!needsTapToEnable) {
          enableGyro();
        }
      } else {
        handMode = "hidden";
        hand.visible = false;
        handLabel.visible = false;
      }

      const cursor = new Sprite(holdTexture);
      cursor.anchor.set(0.5);
      const cursorSize = 28;
      cursor.scale.set(cursorSize / cursor.texture.height);
      cursor.visible = false;
      cursor.eventMode = "none";
      // The extended finger points straight up in the source SVG, so rotating
      // by (angleToBall + 90deg) makes the fingertip aim at the yellow circle.
      const cursorPointOffset = Math.PI / 2;
      // Swaps to the "flick" hand while the cursor is near the circle.
      let cursorIsFlick = false;
      let cursorFlickElapsed = 0;

      handlePointerMove = (event: PointerEvent) => {
        const x = event.clientX - canvasBounds.left;
        const y = event.clientY - canvasBounds.top;
        pointerX = x;
        pointerY = y;
        pointerActive = true;
        cursor.visible = true;
        const now = performance.now();
        if (lastPointerTime > 0) {
          const dt = Math.max(0.001, (now - lastPointerTime) / 1000);
          pointerVX = (x - lastPointerX) / dt;
          pointerVY = (y - lastPointerY) / dt;
        }
        lastPointerTime = now;
        lastPointerX = x;
        lastPointerY = y;
      };

      handlePointerLeave = () => {
        pointerActive = false;
        pointerVX = 0;
        pointerVY = 0;
        cursor.visible = false;
      };

      if (!isHandheld) {
        // Pixi's EventSystem rewrites the canvas cursor style on every pointer
        // move, so setting `canvas.style.cursor` alone gets overwritten. Set the
        // EventSystem's default cursor so the native pointer stays hidden.
        app.renderer.events.cursorStyles.default = "none";
        app.canvas.style.cursor = "none";
        app.canvas.addEventListener("pointermove", handlePointerMove);
        app.canvas.addEventListener("pointerdown", handlePointerMove);
        app.canvas.addEventListener("pointerleave", handlePointerLeave);
        app.canvas.addEventListener("pointerout", handlePointerLeave);
      }

      const hello = new Text({ text: "Hello", style: textStyle });
      const friend = new Text({ text: "friend,", style: textStyle });
      const im = new Text({ text: "I'm", style: textStyle });
      const dani = new Text({ text: "Dani", style: textStyle });

      const m0 = layoutMetrics();
      hello.x = computeHelloX(m0);
      hello.y = computeHelloY(m0);
      hello.rotation = (-10 * Math.PI) / 180;

      friend.x = computeFriendX(m0);
      friend.y = computeFriendY(m0);
      friend.rotation = (3 * Math.PI) / 180;

      im.x = computeImX(m0);
      im.y = computeImY(m0);

      dani.x = computeDaniX(m0);
      dani.y = computeDaniY(m0);

      circle.x = computeHelloX(m0);
      circle.y = 16 + circleRadius;
      let circleSquashX = 0;
      let circleSquashY = 0;
      let circleSquashTargetX = 0;
      let circleSquashTargetY = 0;
      let squashAccumulator = 0;

      type TextBody = {
        sprite: Text;
        vx: number;
        vy: number;
        mass: number;
        targetX: number;
        targetY: number;
      };

      const textBodies: TextBody[] = [
        {
          sprite: hello,
          vx: 0,
          vy: 0,
          mass: 7,
          targetX: hello.x,
          targetY: hello.y,
        },
        {
          sprite: friend,
          vx: 0,
          vy: 0,
          mass: 7,
          targetX: friend.x,
          targetY: friend.y,
        },
        { sprite: im, vx: 0, vy: 0, mass: 7, targetX: im.x, targetY: im.y },
        {
          sprite: dani,
          vx: 0,
          vy: 0,
          mass: 7,
          targetX: dani.x,
          targetY: dani.y,
        },
      ];
      const textLocalBoundsCache = new WeakMap<Text, LocalBounds>();
      const getCachedLocalBounds = (sprite: Text) => {
        let bounds = textLocalBoundsCache.get(sprite);
        if (!bounds) {
          const localBounds = sprite.getLocalBounds();
          bounds = {
            x: localBounds.x,
            y: localBounds.y,
            width: localBounds.width,
            height: localBounds.height,
          };
          textLocalBoundsCache.set(sprite, bounds);
        }
        return bounds;
      };
      for (const body of textBodies) {
        getCachedLocalBounds(body.sprite);
      }

      const helloBody = textBodies[0];
      const friendBody = textBodies[1];
      const imBody = textBodies[2];
      const daniBody = textBodies[3];

      updateTextFontSizes = () => {
        cachedFontSize = scaleFontSize(window.innerWidth);
        textStyle.fontSize = cachedFontSize;
        for (const body of textBodies) {
          textLocalBoundsCache.delete(body.sprite);
        }
        circleRadius = cachedFontSize * 0.6;
        circle.clear().circle(0, 0, circleRadius).fill("0xffcc00");
      };

      updateTextPositions = () => {
        const m = layoutMetrics();
        helloBody.targetX = computeHelloX(m);
        helloBody.targetY = computeHelloY(m);
        friendBody.targetX = computeFriendX(m);
        friendBody.targetY = computeFriendY(m);
        imBody.targetX = computeImX(m);
        imBody.targetY = computeImY(m);
        daniBody.targetX = computeDaniX(m);
        daniBody.targetY = computeDaniY(m);
      };

      app.stage.addChild(
        circle,
        hand,
        handLabel,
        hello,
        friend,
        im,
        dani,
        cursor,
      );

      if (!isMounted) {
        if (app.renderer) app.destroy(true);
        return;
      }
      setReady(true);
      if (!activeRef.current) {
        app.ticker.stop();
      }

      // Tuned constants — hoisted out of the ticker so they aren't rebuilt
      // sixty times a second.
      const damping = 0.968;
      const bounce = softPushEnabled ? 1 : 1.07;
      const textDamping = 0.968;
      const textBounce = softPushEnabled ? 1 : 1.07;
      const maxVelocity = 40;
      const circleMass = 1;
      const cursorRadius = 6;
      const cursorFlickGap = 0;
      const cursorFlickMinHold = 0.4;
      const cursorKickScale = 0.003;
      const cursorKickVelocityInfluence = softPushEnabled ? 0.25 : 0.5;
      const cursorKickReferenceSpeed = 8000;
      const softPushBallMax = 10;
      const softPushCursorMax = 2000;
      const softPushScale = 0.001;
      const cursorSquashScale = 1;
      const cursorSquashSpeedRef = 1;
      const textSpring = 0.008;
      const squashDecay = 0.5;
      const squashRise = 0.13;
      const squashStepMS = 1000 / 60;
      const circleSquashMax = isHandheld ? 2 : 0.8;
      const circleSquashVelocityScale = 0.09;
      const stretchFactor = 1.4;

      app.ticker.add((ticker) => {
        const delta = ticker.deltaTime;

        // Decay constants are tuned for 60fps (delta === 1). Raising each
        // factor to `delta` keeps decay-per-second constant at other rates.
        const frameDamping = Math.pow(damping, delta);
        const frameTextDamping = Math.pow(textDamping, delta);
        const framePointerDamping = Math.pow(0.9, delta);

        if (!gyroEnabled || !hasOrientationData) {
          idleTiltElapsed += ticker.deltaMS / 1000;
          const lerpT = Math.min(1, idleTiltElapsed / idleTiltDuration);
          // Peak at ~700px tall; shorter (and taller) canvases get a softer kick.
          const h = app.renderer.height;
          const heightScale = h >= 700 ? 700 / h : h / 700;
          tiltX = 0.006 * cachedFontSize * heightScale * (1 - lerpT);
          tiltY = 0.4 * heightScale * (1 - lerpT) + idleTiltStartY;
        } else {
          idleTiltElapsed = 0;
        }

        if (handMode === "prompt") {
          handFadeElapsed += ticker.deltaMS / 1000;
        }
        if (handMode === "enabled") {
          handEnabledElapsed += ticker.deltaMS / 1000;
        }

        const promptFadeProgress = Math.min(
          1,
          Math.max(0, (handFadeElapsed - handFadeDelay) / handFadeDuration),
        );
        const enabledFadeProgress = Math.min(
          1,
          Math.max(
            0,
            (handEnabledElapsed - handEnabledHold) / handEnabledFadeDuration,
          ),
        );
        let handAlpha = 0;
        if (handMode === "prompt") {
          handAlpha = promptFadeProgress;
        } else if (handMode === "enabled") {
          handAlpha = 1 - enabledFadeProgress;
          if (handEnabledElapsed >= handEnabledHold + handEnabledFadeDuration) {
            handMode = "hidden";
          }
        }

        hand.alpha = handAlpha;
        hand.visible = handMode !== "hidden";
        handLabel.alpha = handAlpha;
        handLabel.visible = handMode !== "hidden";

        velocityX = (velocityX + tiltX * delta) * frameDamping;
        velocityY = (velocityY + tiltY * delta) * frameDamping;
        velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, velocityX));
        velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, velocityY));

        circle.x += velocityX * delta;
        circle.y += velocityY * delta;

        if (!isHandheld && pointerActive) {
          const dx = circle.x - pointerX;
          const dy = circle.y - pointerY;
          const minDist = circleRadius + cursorRadius;
          const distSq = dx * dx + dy * dy;

          const flickDist = circleRadius + cursorRadius + cursorFlickGap;
          const withinFlickRange = distSq < flickDist * flickDist;
          if (withinFlickRange && !cursorIsFlick) {
            cursorIsFlick = true;
            cursorFlickElapsed = 0;
            cursor.texture = flickTexture;
          } else if (cursorIsFlick) {
            cursorFlickElapsed += ticker.deltaMS / 1000;
            if (!withinFlickRange && cursorFlickElapsed >= cursorFlickMinHold) {
              cursorIsFlick = false;
              cursor.texture = holdTexture;
            }
          }

          if (distSq < minDist * minDist) {
            const dist = Math.max(0.0001, Math.sqrt(distSq));
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            circle.x += nx * overlap;
            circle.y += ny * overlap;

            const relVelX = velocityX - pointerVX;
            const relVelY = velocityY - pointerVY;
            const velAlongNormal = relVelX * nx + relVelY * ny;
            if (velAlongNormal < 0) {
              const restitution = 0.2;
              const approachSpeed = -velAlongNormal;
              const ballSpeed = Math.hypot(velocityX, velocityY);
              const pointerSpeed = Math.hypot(pointerVX, pointerVY);
              // 1 = fully soft nudge, 0 = full reference-floor kick.
              const softT = softPushEnabled
                ? (1 - Math.min(1, ballSpeed / softPushBallMax)) *
                  (1 - Math.min(1, pointerSpeed / softPushCursorMax))
                : 0;
              const softFactor = softT * softT * (3 - 2 * softT);
              const hardKick =
                (1 + restitution) *
                Math.max(
                  0,
                  cursorKickReferenceSpeed +
                    (approachSpeed - cursorKickReferenceSpeed) *
                      cursorKickVelocityInfluence,
                ) *
                cursorKickScale;
              const softKick =
                (1 + restitution) * approachSpeed * softPushScale;
              const kick = softKick * softFactor + hardKick * (1 - softFactor);
              velocityX += kick * nx;
              velocityY += kick * ny;
              const speedScale = Math.min(
                1,
                pointerSpeed / cursorSquashSpeedRef,
              );
              const impact =
                Math.min(
                  circleSquashMax,
                  Math.abs(velAlongNormal) * circleSquashVelocityScale,
                ) *
                cursorSquashScale *
                speedScale *
                (1 - softFactor + softFactor * softPushScale);
              circleSquashTargetX = Math.max(
                circleSquashTargetX,
                impact * Math.abs(nx),
              );
              circleSquashTargetY = Math.max(
                circleSquashTargetY,
                impact * Math.abs(ny),
              );
            }
          }
          pointerVX *= framePointerDamping;
          pointerVY *= framePointerDamping;
        }

        const maxX = app.renderer.width - circleRadius;
        const maxY = app.renderer.height - circleRadius;

        if (circle.x < circleRadius) {
          circle.x = circleRadius;
          const speed = Math.abs(velocityX);
          velocityX = speed * restitutionForSpeed(speed, bounce);
          circleSquashTargetX = Math.max(
            circleSquashTargetX,
            Math.min(
              circleSquashMax,
              Math.abs(velocityX) * circleSquashVelocityScale,
            ),
          );
        } else if (circle.x > maxX) {
          circle.x = maxX;
          const speed = Math.abs(velocityX);
          velocityX = -speed * restitutionForSpeed(speed, bounce);
          circleSquashTargetX = Math.max(
            circleSquashTargetX,
            Math.min(
              circleSquashMax,
              Math.abs(velocityX) * circleSquashVelocityScale,
            ),
          );
        }

        if (circle.y < circleRadius) {
          circle.y = circleRadius;
          const speed = Math.abs(velocityY);
          velocityY = speed * restitutionForSpeed(speed, bounce);
          circleSquashTargetY = Math.max(
            circleSquashTargetY,
            Math.min(
              circleSquashMax,
              Math.abs(velocityY) * circleSquashVelocityScale,
            ),
          );
        } else if (circle.y > maxY) {
          circle.y = maxY;
          const speed = Math.abs(velocityY);
          velocityY = -speed * restitutionForSpeed(speed, bounce);
          circleSquashTargetY = Math.max(
            circleSquashTargetY,
            Math.min(
              circleSquashMax,
              Math.abs(velocityY) * circleSquashVelocityScale,
            ),
          );
        }

        for (const body of textBodies) {
          const text = body.sprite;
          const bounds = getCachedLocalBounds(text);
          const left = bounds.x;
          const top = bounds.y;
          const right = bounds.x + bounds.width;
          const bottom = bounds.y + bounds.height;

          const { cos, sin } = getRotationAxes(text);

          // Transform the circle center into the text's local (unrotated)
          // frame so the rectangle test matches the rotated glyphs exactly.
          const relX = circle.x - text.x;
          const relY = circle.y - text.y;
          const localCX = relX * cos + relY * sin;
          const localCY = -relX * sin + relY * cos;

          const nearestX = Math.max(left, Math.min(localCX, right));
          const nearestY = Math.max(top, Math.min(localCY, bottom));

          const diffX = localCX - nearestX;
          const diffY = localCY - nearestY;
          const distSq = diffX * diffX + diffY * diffY;

          if (distSq < circleRadius * circleRadius) {
            const dist = Math.max(0.0001, Math.sqrt(distSq));
            let localNX =
              distSq === 0 ? localCX - (left + right) / 2 : diffX / dist;
            let localNY =
              distSq === 0 ? localCY - (top + bottom) / 2 : diffY / dist;
            const localNLength = Math.max(
              0.0001,
              Math.sqrt(localNX * localNX + localNY * localNY),
            );
            localNX /= localNLength;
            localNY /= localNLength;

            // Rotate the contact normal back into world space.
            const nx = cos * localNX - sin * localNY;
            const ny = sin * localNX + cos * localNY;

            const overlap = circleRadius - dist;
            const totalMass = circleMass + body.mass;
            const circleMove = overlap * (body.mass / totalMass);
            const textMove = overlap * (circleMass / totalMass);

            circle.x += nx * circleMove;
            circle.y += ny * circleMove;
            text.x -= nx * textMove;
            text.y -= ny * textMove;

            const relVelX = velocityX - body.vx;
            const relVelY = velocityY - body.vy;
            const velAlongNormal = relVelX * nx + relVelY * ny;

            if (velAlongNormal < 0) {
              const restitution = restitutionForSpeed(
                -velAlongNormal,
                textBounce,
              );
              const impulse =
                (-(1 + restitution) * velAlongNormal) /
                (1 / circleMass + 1 / body.mass);

              velocityX += (impulse / circleMass) * nx;
              velocityY += (impulse / circleMass) * ny;
              body.vx -= (impulse / body.mass) * nx;
              body.vy -= (impulse / body.mass) * ny;

              const impact = Math.min(
                circleSquashMax,
                Math.abs(velAlongNormal) * circleSquashVelocityScale,
              );
              circleSquashTargetX = Math.max(
                circleSquashTargetX,
                impact * Math.abs(nx),
              );
              circleSquashTargetY = Math.max(
                circleSquashTargetY,
                impact * Math.abs(ny),
              );
            }
          }

          body.vx += (body.targetX - text.x) * textSpring * delta;
          body.vy += (body.targetY - text.y) * textSpring * delta;
          body.vx *= frameTextDamping;
          body.vy *= frameTextDamping;
          text.x += body.vx * delta;
          text.y += body.vy * delta;
        }

        for (let i = 0; i < textBodies.length; i += 1) {
          for (let j = i + 1; j < textBodies.length; j += 1) {
            const a = textBodies[i];
            const b = textBodies[j];
            // Skip SAT when both words are parked near their rest pose —
            // they can't bump. Resume as soon as either is disturbed.
            if (
              isBodySettled(
                a.vx,
                a.vy,
                a.sprite.x,
                a.sprite.y,
                a.targetX,
                a.targetY,
              ) &&
              isBodySettled(
                b.vx,
                b.vy,
                b.sprite.x,
                b.sprite.y,
                b.targetX,
                b.targetY,
              )
            ) {
              continue;
            }

            const collision = obbCollision(
              getObb(a.sprite, getCachedLocalBounds(a.sprite)),
              getObb(b.sprite, getCachedLocalBounds(b.sprite)),
            );
            if (!collision) continue;

            const { nx, ny, overlap: separation } = collision;
            const aSprite = a.sprite;
            const bSprite = b.sprite;

            const totalMass = a.mass + b.mass;
            const aMove = separation * (b.mass / totalMass);
            const bMove = separation * (a.mass / totalMass);

            aSprite.x += nx * aMove;
            aSprite.y += ny * aMove;
            bSprite.x -= nx * bMove;
            bSprite.y -= ny * bMove;

            const relVelX = a.vx - b.vx;
            const relVelY = a.vy - b.vy;
            const velAlongNormal = relVelX * nx + relVelY * ny;

            if (velAlongNormal < 0) {
              const restitution = 0.35;
              const impulse =
                (-(1 + restitution) * velAlongNormal) /
                (1 / a.mass + 1 / b.mass);

              a.vx += (impulse / a.mass) * nx;
              a.vy += (impulse / a.mass) * ny;
              b.vx -= (impulse / b.mass) * nx;
              b.vy -= (impulse / b.mass) * ny;
            }
          }
        }

        // Squash envelope steps on a fixed 60fps clock so peak deformation
        // stays consistent across frame rates.
        squashAccumulator += ticker.deltaMS;
        let squashSteps = 0;
        while (squashAccumulator >= squashStepMS && squashSteps < 6) {
          squashAccumulator -= squashStepMS;
          squashSteps += 1;
          if (circleSquashTargetX > 0.0001) {
            circleSquashTargetX *= squashDecay;
          } else {
            circleSquashTargetX = 0;
          }
          if (circleSquashTargetY > 0.0001) {
            circleSquashTargetY *= squashDecay;
          } else {
            circleSquashTargetY = 0;
          }
          circleSquashX += (circleSquashTargetX - circleSquashX) * squashRise;
          circleSquashY += (circleSquashTargetY - circleSquashY) * squashRise;
        }
        if (squashSteps === 6) {
          squashAccumulator = 0;
        }

        circle.scale.set(
          1 - circleSquashX + circleSquashY * stretchFactor,
          1 - circleSquashY + circleSquashX * stretchFactor,
        );

        if (!isHandheld && pointerActive) {
          cursor.x = pointerX;
          cursor.y = pointerY;
          cursor.rotation =
            Math.atan2(circle.y - pointerY, circle.x - pointerX) +
            cursorPointOffset;
        }
      });
    };

    init();

    return () => {
      isMounted = false;
      setReady(false);
      appRef.current = null;
      syncOnActivateRef.current = null;
      if (resizeRafId !== null) {
        window.cancelAnimationFrame(resizeRafId);
      }
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("scroll", handleWindowScroll);
      colorSchemeQuery?.removeEventListener("change", handleColorSchemeChange);
      resizeObserver?.disconnect();

      // app.canvas throws if init never finished (Strict Mode remount / fast nav).
      const canvas = app.renderer?.canvas as HTMLCanvasElement | undefined;
      if (canvas) {
        canvas.removeEventListener("click", enableGyroOnPointer);
        canvas.removeEventListener("touchend", enableGyroOnPointer);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("pointerdown", handlePointerMove);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
        canvas.removeEventListener("pointerout", handlePointerLeave);
      }

      if (app.renderer) {
        app.destroy(true);
      }
    };
    // Intentionally mount-once: keep-alive toggles `active` via a separate effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--background)] text-secondary-foreground">
          <Spinner className="size-6" />
        </div>
      )}
    </div>
  );
}
