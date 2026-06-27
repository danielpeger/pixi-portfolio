"use client";

import { useEffect, useRef } from "react";
import {
  Application,
  Assets,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = new Application();
    let resizeObserver: ResizeObserver | null = null;
    let handleOrientation: (event: DeviceOrientationEvent) => void = () =>
      undefined;
    let enableGyroOnPointer: () => void = () => undefined;
    let positionFpsLabel: () => void = () => undefined;
    let handlePointerMove: (event: PointerEvent) => void = () => undefined;
    let handlePointerLeave: () => void = () => undefined;
    let refreshCanvasBounds: () => void = () => undefined;
    let handleWindowResize: () => void = () => undefined;
    let handleWindowScroll: () => void = () => undefined;
    let updateTextFontSizes: () => void = () => undefined;
    let updateTextPositions: () => void = () => undefined;

    let isMounted = true;

    const init = async () => {
      const prefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)",
      )?.matches;
      const backgroundColor = prefersDark ? 0x000000 : 0xffffff;
      const textColor = prefersDark ? 0xffffff : 0x000000;
      const initOptions: Record<string, unknown> = {
        resizeTo: container,
        backgroundColor,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        powerPreference: "high-performance",
      };

      await app.init(initOptions as Parameters<typeof app.init>[0]);

      app.renderer.events.autoPreventDefault = false;
      app.canvas.style.touchAction = "manipulation";

      if (!isMounted) {
        app.destroy(true);
        return;
      }

      container.appendChild(app.canvas);
      app.canvas.style.display = "block";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";

      const scaleFontSize = (viewportWidth: number) => {
        // Single-column layout: scales up to the md breakpoint.
        if (viewportWidth < 768) {
          if (viewportWidth <= 320) return 66;
          const t = (viewportWidth - 320) / (768 - 320);
          return 66 + (114 - 66) * t;
        }

        // Two-column layout: resets at md, then scales 66 -> 80 by 1152.
        if (viewportWidth < 1152) {
          const t = (viewportWidth - 768) / (1152 - 768);
          return 66 + (90 - 66) * t;
        }

        // Holds at 80 until 1279.
        if (viewportWidth < 1280) {
          return 90;
        }

        // Jumps to 114 at 1280 and above.
        return 110;
      };

      const initialFontSize = scaleFontSize(window.innerWidth);

      if (document.fonts) {
        await document.fonts.load('400 140px "Jua"');
      }

      const textStyle = new TextStyle({
        fill: textColor,
        fontSize: initialFontSize,
        fontWeight: "400",
        fontFamily: '"Jua", Arial, Helvetica, sans-serif',
        trim: true,
      });
      const friendTextStyle = new TextStyle({
        fill: textColor,
        fontSize: initialFontSize,
        fontWeight: "400",
        fontFamily: '"Jua", Arial, Helvetica, sans-serif',
        trim: true,
      });
      const fpsText = new Text({
        text: "FPS: --",
        style: new TextStyle({
          fill: textColor,
          fontSize: 16,
          fontWeight: "600",
          fontFamily: '"SF Pro Text", system-ui, sans-serif',
        }),
      });
      fpsText.anchor.set(1, 0);
      positionFpsLabel = () => {
        fpsText.x = app.renderer.width - 16;
        fpsText.y = 12;
      };
      positionFpsLabel();

      const circleRadius = 65;
      const circle = new Graphics().circle(0, 0, circleRadius).fill("0xffcc00");
      let canvasBounds = app.canvas.getBoundingClientRect();
      refreshCanvasBounds = () => {
        canvasBounds = app.canvas.getBoundingClientRect();
      };
      let lastRenderWidth = 0;
      let lastRenderHeight = 0;
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
            positionFpsLabel();
            updateTextFontSizes();
            updateTextPositions();
          }
        }
      };

      // Coalesce bursts of resize callbacks into a single read-only sync per
      // frame.
      let resizeRafId: number | null = null;
      const scheduleSync = () => {
        if (resizeRafId !== null) return;
        resizeRafId = window.requestAnimationFrame(() => {
          resizeRafId = null;
          if (!isMounted) return;
          syncRenderer();
        });
      };

      syncRenderer();
      resizeObserver = new ResizeObserver(scheduleSync);
      resizeObserver.observe(container);
      handleWindowResize = () => {
        refreshCanvasBounds();
        scheduleSync();
      };
      handleWindowScroll = () => refreshCanvasBounds();
      window.addEventListener("resize", handleWindowResize);
      window.addEventListener("scroll", handleWindowScroll, { passive: true });
      circle.x = 20 + circleRadius;
      circle.y = 16 + circleRadius;
      let circleSquashX = 0;
      let circleSquashY = 0;
      let circleSquashTargetX = 0;
      let circleSquashTargetY = 0;
      const handTargetSize = 24;
      const handRasterScale = Math.max(2, Math.ceil(handTargetSize / 25));
      const handTexture = await Assets.load({
        src: "/hand.svg",
        data: {
          scale: handRasterScale,
          resolution: window.devicePixelRatio || 1,
        },
      });
      const tiltTexture = await Assets.load({
        src: "/tilt.svg",
        data: {
          scale: handRasterScale,
          resolution: window.devicePixelRatio || 1,
        },
      });
      const hand = new Sprite(handTexture);
      const handSize = handTargetSize;
      hand.anchor.set(0);
      hand.scale.set(handSize / hand.texture.height);
      hand.alpha = 0;
      hand.x = 28;
      hand.y = 31;
      let handFadeElapsed = 0;
      const handFadeDelay = 3;
      const handFadeDuration = 1;
      let handEnabledElapsed = 0;
      const handEnabledHold = 3;
      const handEnabledFadeDuration = 1;
      const handLabel = new Text({
        text: "Tap to enable gyroscope",
        style: new TextStyle({
          fill: 0xc3c3c8,
          fontSize: 20,
          fontWeight: "400",
          fontFamily:
            '"SF Pro Rounded", "SF Rounded", -apple-system, system-ui, sans-serif',
        }),
      });
      handLabel.alpha = 0;
      handLabel.x = hand.x + hand.width + 8;
      handLabel.y = hand.y - 2 + (hand.height - handLabel.height) / 2;

      let velocityX = 0;
      let velocityY = 0;
      let tiltX = 0;
      let tiltY = 0;
      let idleTiltElapsed = 0;
      const idleTiltDuration = 4;
      const idleTiltStartX = 0.15;
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
      const gyroDeniedKey = "gyroDenied";
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
              try {
                window.localStorage.setItem(gyroDeniedKey, "true");
              } catch {
                // Ignore storage failures.
              }
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
              try {
                window.localStorage.setItem(gyroDeniedKey, "true");
              } catch {
                // Ignore storage failures.
              }
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
        try {
          window.localStorage.removeItem(gyroDeniedKey);
        } catch {
          // Ignore storage failures.
        }
        return true;
      };

      enableGyroOnPointer = async () => {
        const enabled = await enableGyro();
        if (enabled || gyroDenied) {
          app.canvas.removeEventListener("click", enableGyroOnPointer);
          app.canvas.removeEventListener("touchend", enableGyroOnPointer);
        }
      };
      const isHandheld =
        window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
      const hasDeviceOrientation =
        isHandheld && typeof DeviceOrientationEvent !== "undefined";
      const needsTapToEnable =
        hasDeviceOrientation && "requestPermission" in DeviceOrientationEvent;
      if (hasDeviceOrientation) {
        try {
          gyroDenied = window.localStorage.getItem(gyroDeniedKey) === "true";
        } catch {
          // Ignore storage failures.
        }
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

      handlePointerMove = (event: PointerEvent) => {
        const x = event.clientX - canvasBounds.left;
        const y = event.clientY - canvasBounds.top;
        pointerX = x;
        pointerY = y;
        pointerActive = true;
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
      };

      if (!isHandheld) {
        app.canvas.addEventListener("pointermove", handlePointerMove);
        app.canvas.addEventListener("pointerdown", handlePointerMove);
        app.canvas.addEventListener("pointerleave", handlePointerLeave);
        app.canvas.addEventListener("pointerout", handlePointerLeave);
      }

      const hello = new Text({
        text: "Hello",
        style: textStyle,
      });

      const friend = new Text({
        text: "friend,",
        style: friendTextStyle,
      });

      const im = new Text({
        text: "I'm",
        style: textStyle,
      });

      const dani = new Text({
        text: "Dani",
        style: textStyle,
      });

      const computeLeftOffset = () => {
        const viewportWidth = window.innerWidth;
        if (viewportWidth > 1351) return (viewportWidth - 1208) / 2 - 72;
        if (viewportWidth > 1279) return 36;
        if (viewportWidth > 1151) return (viewportWidth - 1008) / 2 - 72;
        if (viewportWidth > 767) return 36;
        if (viewportWidth > 611) return (viewportWidth - 612) / 2;
        return 0;
      };

      const computeRightOffset = () => {
        const viewportWidth = window.innerWidth;
        if (viewportWidth > 767) return 36;
        if (viewportWidth > 611) return (viewportWidth - 612) / 2;
        return 0;
      };

      const computeHelloX = () => {
        const canvasWidth = app.renderer.width;
        return canvasWidth * 0.05 + computeLeftOffset();
      };

      const computeFriendX = () => {
        const canvasWidth = app.renderer.width;
        const x =
          canvasWidth * 0.94 -
          scaleFontSize(window.innerWidth) * 3 -
          computeRightOffset();
        return x;
      };

      const computeImX = () => {
        const canvasWidth = app.renderer.width;
        const x = canvasWidth * 0.12 + computeLeftOffset();
        return x;
      };

      const computeDaniX = () => {
        const canvasWidth = app.renderer.width;
        const x =
          canvasWidth -
          scaleFontSize(window.innerWidth) * 2.3 -
          computeRightOffset();
        return x;
      };

      const computeYMultiplier = (base: number) =>
        window.innerWidth > 767 ? base : base + 0.045;

      const computeHelloY = () =>
        window.innerHeight * computeYMultiplier(0.58) -
        scaleFontSize(window.innerWidth);

      const computeFriendY = () =>
        window.innerHeight * computeYMultiplier(0.675) -
        scaleFontSize(window.innerWidth);

      const computeImY = () =>
        window.innerHeight * computeYMultiplier(0.78) -
        scaleFontSize(window.innerWidth);

      const computeDaniY = () =>
        window.innerHeight * computeYMultiplier(0.835) -
        scaleFontSize(window.innerWidth);

      hello.x = computeHelloX();
      hello.y = computeHelloY();
      hello.rotation = (-10 * Math.PI) / 180;

      friend.x = computeFriendX();
      friend.y = computeFriendY();
      friend.rotation = (3 * Math.PI) / 180;

      im.x = computeImX();
      im.y = computeImY();

      dani.x = computeDaniX();
      dani.y = computeDaniY();

      const textBodies = [
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
      const textLocalBoundsCache = new WeakMap<
        Text,
        { x: number; y: number; width: number; height: number }
      >();
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
      // Oriented bounding box (OBB) derived from the sprite's local glyph
      // bounds plus its rotation, so the collision box tracks the rotated
      // visuals exactly instead of using an upright axis-aligned rectangle.
      const getObb = (sprite: Text) => {
        const bounds = getCachedLocalBounds(sprite);
        const cos = Math.cos(sprite.rotation);
        const sin = Math.sin(sprite.rotation);
        const localCenterX = bounds.x + bounds.width / 2;
        const localCenterY = bounds.y + bounds.height / 2;
        return {
          cx: sprite.x + cos * localCenterX - sin * localCenterY,
          cy: sprite.y + sin * localCenterX + cos * localCenterY,
          // Local x/y axes expressed in world space.
          axX: cos,
          axY: sin,
          ayX: -sin,
          ayY: cos,
          hw: bounds.width / 2,
          hh: bounds.height / 2,
        };
      };

      // Separating Axis Theorem between two OBBs. Returns the minimum
      // translation vector (unit normal pointing from b toward a) and the
      // penetration depth, or null when they don't overlap.
      const obbCollision = (
        a: ReturnType<typeof getObb>,
        b: ReturnType<typeof getObb>,
      ) => {
        const axes = [
          { x: a.axX, y: a.axY },
          { x: a.ayX, y: a.ayY },
          { x: b.axX, y: b.axY },
          { x: b.ayX, y: b.ayY },
        ];
        const dcx = a.cx - b.cx;
        const dcy = a.cy - b.cy;
        let minOverlap = Infinity;
        let nx = 0;
        let ny = 0;
        for (const axis of axes) {
          const ra =
            Math.abs(a.axX * axis.x + a.axY * axis.y) * a.hw +
            Math.abs(a.ayX * axis.x + a.ayY * axis.y) * a.hh;
          const rb =
            Math.abs(b.axX * axis.x + b.axY * axis.y) * b.hw +
            Math.abs(b.ayX * axis.x + b.ayY * axis.y) * b.hh;
          const centerProj = dcx * axis.x + dcy * axis.y;
          const overlap = ra + rb - Math.abs(centerProj);
          if (overlap <= 0) return null;
          if (overlap < minOverlap) {
            minOverlap = overlap;
            const sign = centerProj < 0 ? -1 : 1;
            nx = axis.x * sign;
            ny = axis.y * sign;
          }
        }
        return { nx, ny, overlap: minOverlap };
      };
      for (const body of textBodies) {
        getCachedLocalBounds(body.sprite);
      }

      const helloBody = textBodies[0];
      const friendBody = textBodies[1];
      const imBody = textBodies[2];
      const daniBody = textBodies[3];

      updateTextFontSizes = () => {
        const fontSize = scaleFontSize(window.innerWidth);
        textStyle.fontSize = fontSize;
        friendTextStyle.fontSize = fontSize;
        for (const body of textBodies) {
          textLocalBoundsCache.delete(body.sprite);
        }
      };

      updateTextPositions = () => {
        helloBody.targetX = computeHelloX();
        helloBody.targetY = computeHelloY();
        friendBody.targetX = computeFriendX();
        friendBody.targetY = computeFriendY();
        imBody.targetX = computeImX();
        imBody.targetY = computeImY();
        daniBody.targetX = computeDaniX();
        daniBody.targetY = computeDaniY();
      };

      app.stage.addChild(
        circle,
        hand,
        handLabel,
        hello,
        friend,
        im,
        dani,
        fpsText,
      );

      let fpsElapsed = 0;
      const fpsUpdateInterval = 0.05;
      app.ticker.add((ticker) => {
        const rawDelta = ticker.deltaTime;
        const delta = rawDelta;
        const damping = 0.968;
        const bounce = 1.07;
        const textDamping = 0.968;
        const textBounce = 1.07;
        const maxVelocity = 40;
        const circleMass = 1;
        const cursorRadius = 6;
        const cursorKickScale = 0.005;
        const cursorSquashScale = 0.25;
        const cursorSquashSpeedRef = 800;
        const textSpring = 0.008;
        const squashDecay = 0.5;
        const squashRise = 0.13;
        const circleSquashMax = 2;
        const circleSquashVelocityScale = 0.09;
        const stretchFactor = 1.4;

        fpsElapsed += ticker.deltaMS / 1000;
        if (fpsElapsed >= fpsUpdateInterval) {
          fpsText.text = `FPS: ${Math.round(ticker.FPS)}`;
          fpsElapsed = 0;
        }

        if (!gyroEnabled || !hasOrientationData) {
          if (!isHandheld) {
            idleTiltElapsed += ticker.deltaMS / 1000;
            const lerpT = Math.min(1, idleTiltElapsed / idleTiltDuration);
            tiltX = idleTiltStartX * (1 - lerpT);
            tiltY = idleTiltStartY * (1 - lerpT);
          } else {
            tiltX = idleTiltStartX;
            tiltY = idleTiltStartY;
          }
        } else {
          idleTiltElapsed = 0;
        }
        const handShouldFadeIn = handMode === "prompt";
        if (handShouldFadeIn) {
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

        velocityX = (velocityX + tiltX * delta) * damping;
        velocityY = (velocityY + tiltY * delta) * damping;
        velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, velocityX));
        velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, velocityY));

        circle.x += velocityX * delta;
        circle.y += velocityY * delta;

        if (!isHandheld && pointerActive) {
          const dx = circle.x - pointerX;
          const dy = circle.y - pointerY;
          const minDist = circleRadius + cursorRadius;
          const distSq = dx * dx + dy * dy;
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
              const kick = (1 + restitution) * velAlongNormal * cursorKickScale;
              velocityX -= kick * nx;
              velocityY -= kick * ny;
              const pointerSpeed = Math.hypot(pointerVX, pointerVY);
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
                speedScale;
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
          pointerVX *= 0.9;
          pointerVY *= 0.9;
        }

        const maxX = app.renderer.width - circleRadius;
        const maxY = app.renderer.height - circleRadius;

        if (circle.x < circleRadius) {
          circle.x = circleRadius;
          velocityX = Math.abs(velocityX) * bounce;
          circleSquashTargetX = Math.max(
            circleSquashTargetX,
            Math.min(
              circleSquashMax,
              Math.abs(velocityX) * circleSquashVelocityScale,
            ),
          );
        } else if (circle.x > maxX) {
          circle.x = maxX;
          velocityX = -Math.abs(velocityX) * bounce;
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
          velocityY = Math.abs(velocityY) * bounce;
          circleSquashTargetY = Math.max(
            circleSquashTargetY,
            Math.min(
              circleSquashMax,
              Math.abs(velocityY) * circleSquashVelocityScale,
            ),
          );
        } else if (circle.y > maxY) {
          circle.y = maxY;
          velocityY = -Math.abs(velocityY) * bounce;
          circleSquashTargetY = Math.max(
            circleSquashTargetY,
            Math.min(
              circleSquashMax,
              Math.abs(velocityY) * circleSquashVelocityScale,
            ),
          );
        }

        const collisionsEnabled = true;

        for (const body of textBodies) {
          const text = body.sprite;
          const bounds = getCachedLocalBounds(text);
          const left = bounds.x;
          const top = bounds.y;
          const right = bounds.x + bounds.width;
          const bottom = bounds.y + bounds.height;

          const cos = Math.cos(text.rotation);
          const sin = Math.sin(text.rotation);

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

          if (collisionsEnabled && distSq < circleRadius * circleRadius) {
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
              const restitution = textBounce;
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
          body.vx *= textDamping;
          body.vy *= textDamping;
          text.x += body.vx * delta;
          text.y += body.vy * delta;
        }

        for (let i = 0; i < textBodies.length; i += 1) {
          for (let j = i + 1; j < textBodies.length; j += 1) {
            const a = textBodies[i];
            const b = textBodies[j];
            if (!collisionsEnabled) continue;

            const collision = obbCollision(getObb(a.sprite), getObb(b.sprite));
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

        circle.scale.set(
          1 - circleSquashX + circleSquashY * stretchFactor,
          1 - circleSquashY + circleSquashX * stretchFactor,
        );
      });
    };

    init();

    return () => {
      isMounted = false;
      window.removeEventListener("deviceorientation", handleOrientation);
      app.canvas.removeEventListener("click", enableGyroOnPointer);
      app.canvas.removeEventListener("touchend", enableGyroOnPointer);
      app.canvas.removeEventListener("pointermove", handlePointerMove);
      app.canvas.removeEventListener("pointerdown", handlePointerMove);
      app.canvas.removeEventListener("pointerleave", handlePointerLeave);
      app.canvas.removeEventListener("pointerout", handlePointerLeave);
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("scroll", handleWindowScroll);
      resizeObserver?.disconnect();
      app.destroy(true);
    };
  }, []);

  return (
    <main className="flex flex-col flex-wrap content-between h-[5000px] md:before:content-[''] md:before:basis-full md:before:w-0 md:before:md:order-2 text-lg md:text-base xl:text-xl">
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <div
          ref={containerRef}
          className="bg-green-500 h-[92svh] md:h-[min(92svh,800px)] xl:h-[min(92svh,960px)]"
        />
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] md:mt-16 mb-16">
          <p>
            A design engineer trying to put the{" "}
            <span className="italic">soft</span> in software. I'm based in
            Budapest, sharing life with my wife and our tabby cat. I've been in
            product design since 2016, and I'm currently pursuing a master’s in
            software engineering.
          </p>
        </div>
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          <h3 className="pb-2 text-xl xl:text-2xl">Places I've worked at</h3>
          <ul>
            <li className="py-2">
              <a href="https://www.google.com">LastPass</a>
            </li>
            <li className="py-2">
              <a href="https://www.google.com">Paperpal</a>
            </li>
            <li className="py-2">
              <a href="https://www.google.com">Gizmodo</a>
            </li>
            <li className="py-2">
              <a href="https://www.google.com">index.hu</a>
            </li>
          </ul>
        </div>
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] mb-16">
          <h3 className="pb-2 text-xl xl:text-2xl">Some stuff I built</h3>
          <div className="w-full bg-yellow-100 aspect-[5/4] rounded-[20px]"></div>
          <p>
            In 2019 I was part of the team rethinking navigation on the Kinja
            platform. This is the story of how we used an iterative
            human-centered design process to make our content structured and
            discoverable.
          </p>
        </div>
      </section>
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <div className="px-8 md:px-[72px] max-w-[612px] xl:max-w-[712px] mx-auto md:mr-0">
          <div className="w-full bg-yellow-100 aspect-[5/4] rounded-[20px]"></div>
          <p>
            Index.hu is the highest-traffic online news outlet in Hungary. I
            spent 2 years at Index, working on user research, design,
            illustrations and motion graphics.
          </p>
        </div>
      </section>
    </main>
  );
}
