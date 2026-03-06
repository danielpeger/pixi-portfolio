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

    const viewportHeight =
      window.visualViewport?.height ??
      window.innerHeight ??
      document.documentElement.clientHeight;
    container.style.height = `${Math.round(viewportHeight * 0.92)}px`;

    const app = new Application();
    let resizeObserver: ResizeObserver | null = null;
    let handleOrientation: (event: DeviceOrientationEvent) => void = () =>
      undefined;
    let enableGyroOnPointer: () => void = () => undefined;
    let positionFpsLabel: () => void = () => undefined;
    let handlePointerMove: (event: PointerEvent) => void = () => undefined;
    let handlePointerLeave: () => void = () => undefined;

    let isMounted = true;

    const init = async () => {
      const prefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)",
      )?.matches;
      const backgroundColor = prefersDark ? 0x000000 : 0xffffff;
      const textColor = prefersDark ? 0xffffff : 0x000000;

      await app.init({
        resizeTo: container,
        backgroundColor,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

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

      if (document.fonts) {
        await document.fonts.load('400 70px "Jua"');
      }

      const textStyle = new TextStyle({
        fill: textColor,
        fontSize: 70,
        fontWeight: "400",
        fontFamily: '"Jua", Arial, Helvetica, sans-serif',
        trim: false,
      });
      const friendTextStyle = new TextStyle({
        fill: textColor,
        fontSize: 70,
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
      const refreshCanvasBounds = () => {
        canvasBounds = app.canvas.getBoundingClientRect();
      };
      const resizeToContainer = () => {
        const { width, height } = container.getBoundingClientRect();
        if (width > 0 && height > 0) {
          app.renderer.resize(width, height);
          refreshCanvasBounds();
          positionFpsLabel();
        }
      };

      resizeToContainer();
      resizeObserver = new ResizeObserver(resizeToContainer);
      resizeObserver.observe(container);
      window.addEventListener("resize", refreshCanvasBounds);
      window.addEventListener("scroll", refreshCanvasBounds, { passive: true });
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

      hello.x = 20;
      hello.y = 330;
      hello.rotation = (-10 * Math.PI) / 180;

      friend.x = 170;
      friend.y = 393;
      friend.rotation = (3 * Math.PI) / 180;

      im.x = 47;
      im.y = 470;

      dani.x = 242;
      dani.y = 484;

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
      const getCollisionBounds = (sprite: Text) => {
        const bounds = getCachedLocalBounds(sprite);
        return {
          left: sprite.x + bounds.x,
          top: sprite.y + bounds.y,
          right: sprite.x + bounds.x + bounds.width,
          bottom: sprite.y + bounds.y + bounds.height,
        };
      };
      for (const body of textBodies) {
        getCachedLocalBounds(body.sprite);
      }

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
        const delta = ticker.deltaTime;
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

        for (const body of textBodies) {
          const text = body.sprite;
          const {
            left: rectLeft,
            top: rectTop,
            right: rectRight,
            bottom: rectBottom,
          } = getCollisionBounds(text);
          const rectCenterX = (rectLeft + rectRight) / 2;
          const rectCenterY = (rectTop + rectBottom) / 2;

          const nearestX = Math.max(rectLeft, Math.min(circle.x, rectRight));
          const nearestY = Math.max(rectTop, Math.min(circle.y, rectBottom));

          const diffX = circle.x - nearestX;
          const diffY = circle.y - nearestY;
          const distSq = diffX * diffX + diffY * diffY;

          if (distSq < circleRadius * circleRadius) {
            const dist = Math.max(0.0001, Math.sqrt(distSq));
            const normalX =
              distSq === 0 ? circle.x - rectCenterX : diffX / dist;
            const normalY =
              distSq === 0 ? circle.y - rectCenterY : diffY / dist;
            const normalLength = Math.max(
              0.0001,
              Math.sqrt(normalX * normalX + normalY * normalY),
            );
            const nx = normalX / normalLength;
            const ny = normalY / normalLength;

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
            const aSprite = a.sprite;
            const bSprite = b.sprite;

            const {
              left: aLeft,
              top: aTop,
              right: aRight,
              bottom: aBottom,
            } = getCollisionBounds(aSprite);

            const {
              left: bLeft,
              top: bTop,
              right: bRight,
              bottom: bBottom,
            } = getCollisionBounds(bSprite);

            const overlapX = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);
            const overlapY = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);

            if (overlapX > 0 && overlapY > 0) {
              const aCenterX = aLeft + aSprite.width / 2;
              const aCenterY = aTop + aSprite.height / 2;
              const bCenterX = bLeft + bSprite.width / 2;
              const bCenterY = bTop + bSprite.height / 2;

              let nx = 0;
              let ny = 0;
              let separation = 0;

              if (overlapX < overlapY) {
                separation = overlapX;
                nx = aCenterX < bCenterX ? -1 : 1;
              } else {
                separation = overlapY;
                ny = aCenterY < bCenterY ? -1 : 1;
              }

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
      window.removeEventListener("resize", refreshCanvasBounds);
      window.removeEventListener("scroll", refreshCanvasBounds);
      resizeObserver?.disconnect();
      app.destroy(true);
    };
  }, []);

  return (
    <main className="flex flex-col flex-wrap content-between h-[5000px] md:before:content-[''] md:before:basis-full md:before:w-0 md:before:md:order-2 text-lg md:text-base xl:text-xl">
      <section className="w-full md:w-[calc(50%+36px)] md:order-1">
        <div
          ref={containerRef}
          className="bg-green-500 h-[80vh] md:h-[calc(100vh+72px)] md:max-h-[800px] xl:max-h-[960px]"
        />
      </section>
      <section className="w-full md:w-[calc(50%-36px)] md:order-2">
        <div className="max-w-[612px] md:max-w-[540px] xl:max-w-[640px] mx-auto md:ml-0 px-8 md:pl-0 md:pr-[72px] md:mt-16 mb-16">
          <p>
            A design engineer trying to put the{" "}
            <span className="italic">soft</span> back in software. <br />
            Based in Budapest, 32, proud husband and owner of a tabby cat. 10
            years in product design, and currently pursuing a master’s in
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
