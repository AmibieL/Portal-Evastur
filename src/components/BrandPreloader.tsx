import { useLayoutEffect } from "react";
import { gsap } from "gsap";

export const PRELOADER_DONE_EVENT = "app:preloader-done";

declare global {
  interface Window {
    __EVASTUR_SHOULD_PRELOAD__?: boolean;
    __EVASTUR_PRELOADER_FALLBACK__?: number;
  }
}

const ASSET_WAIT_LIMIT_MS = 1200;

function waitForPageAssets() {
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  const pageReady = document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, ASSET_WAIT_LIMIT_MS));

  return Promise.race([
    Promise.allSettled([fontsReady, pageReady]).then(() => undefined),
    timeout,
  ]);
}

function dispatchDoneEvent() {
  window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
}

export default function BrandPreloader() {
  useLayoutEffect(() => {
    const overlay = document.getElementById("brand-preloader");
    if (!overlay) {
      dispatchDoneEvent();
      return;
    }

    const shouldPlay = Boolean(window.__EVASTUR_SHOULD_PRELOAD__)
      && document.documentElement.classList.contains("preloader-enabled");

    if (!shouldPlay) {
      overlay.remove();
      window.requestAnimationFrame(dispatchDoneEvent);
      return;
    }

    const symbolStage = overlay.querySelector<HTMLElement>("[data-preloader-symbol-stage]");
    const symbol = overlay.querySelector<SVGGraphicsElement>("[data-preloader-symbol]");
    const trace = overlay.querySelector<SVGPathElement>("[data-preloader-trace]");
    const fill = overlay.querySelector<SVGPathElement>("[data-preloader-fill]");
    const marker = overlay.querySelector<SVGCircleElement>("[data-preloader-marker]");
    const wordmark = overlay.querySelector<SVGSVGElement>("[data-preloader-wordmark]");
    const wordmarkPaths = overlay.querySelectorAll<SVGPathElement>("[data-preloader-letter]");
    const tagline = overlay.querySelector<SVGGElement>("[data-preloader-tagline]");
    const iris = overlay.querySelector<SVGSVGElement>("[data-preloader-iris]");
    const irisCircle = overlay.querySelector<SVGCircleElement>("[data-preloader-iris-circle]");

    if (!symbolStage || !symbol || !trace || !fill || !marker || !wordmark || !tagline || !iris || !irisCircle) {
      document.documentElement.classList.remove("preloader-enabled");
      overlay.remove();
      dispatchDoneEvent();
      return;
    }

    let active = true;
    let finished = false;
    const assetsReady = waitForPageAssets();
    const traceLength = trace.getTotalLength();

    const finish = () => {
      if (finished) return;
      finished = true;
      document.documentElement.classList.remove("preloader-enabled");
      overlay.remove();
      if (window.__EVASTUR_PRELOADER_FALLBACK__) {
        window.clearTimeout(window.__EVASTUR_PRELOADER_FALLBACK__);
      }
      dispatchDoneEvent();
    };

    gsap.set(trace, {
      autoAlpha: 1,
      strokeDasharray: traceLength,
      strokeDashoffset: traceLength,
    });
    gsap.set(marker, { autoAlpha: 1, scale: 0, transformOrigin: "50% 50%" });
    gsap.set(fill, { autoAlpha: 0 });
    gsap.set(symbolStage, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" });
    gsap.set(wordmarkPaths, { autoAlpha: 0, y: 18 });
    gsap.set(tagline, { autoAlpha: 0, y: 10 });

    const prepareIris = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const symbolBounds = symbol.getBoundingClientRect();
      const centerX = symbolBounds.left + symbolBounds.width / 2;
      const centerY = symbolBounds.top + symbolBounds.height / 2;
      const radius = Math.max(
        Math.hypot(centerX, centerY),
        Math.hypot(width - centerX, centerY),
        Math.hypot(centerX, height - centerY),
        Math.hypot(width - centerX, height - centerY),
      ) + 4;

      iris.setAttribute("viewBox", `0 0 ${width} ${height}`);
      irisCircle.setAttribute("cx", String(centerX));
      irisCircle.setAttribute("cy", String(centerY));
      irisCircle.setAttribute("r", "0");
      return radius;
    };

    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

    timeline
      .to(marker, { scale: 1, duration: 0.48, ease: "back.out(2.2)" })
      .to(trace, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" }, "-=0.08")
      .to(fill, { autoAlpha: 1, duration: 0.28, ease: "power1.out" }, "-=0.2")
      .to(trace, { autoAlpha: 0, duration: 0.2 }, "<")
      .to(marker, { autoAlpha: 0, scale: 0.72, duration: 0.2 }, "<")
      .to(symbolStage, { left: "14%", scale: 0.62, duration: 0.72, ease: "power3.inOut" })
      .to(wordmarkPaths, {
        autoAlpha: 1,
        y: 0,
        duration: 0.46,
        stagger: 0.065,
        ease: "power3.out",
      }, "-=0.36")
      .to(tagline, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }, "-=0.08")
      .to({}, { duration: 0.16 })
      .addPause("assets-ready", () => {
        void assetsReady.then(() => {
          if (active) timeline.resume();
        });
      })
      .add(() => {
        const finalRadius = prepareIris();
        irisCircle.dataset.finalRadius = String(finalRadius);
      })
      .to([symbolStage, wordmark], { autoAlpha: 0, scale: 0.96, duration: 0.28, ease: "power2.in" })
      .to(irisCircle, {
        attr: { r: () => Number(irisCircle.dataset.finalRadius || 0) },
        duration: 0.92,
        ease: "power3.inOut",
      }, "-=0.04")
      .call(finish);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        timeline.progress(1);
        finish();
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      active = false;
      window.removeEventListener("keydown", handleEscape);
      timeline.kill();
      if (!finished) finish();
    };
  }, []);

  return null;
}
