"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function useCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wideScreen = window.matchMedia("(min-width: 768px)").matches;

    if (!finePointer || !wideScreen || !outerRef.current || !innerRef.current) {
      return;
    }

    const outer = outerRef.current;
    const inner = innerRef.current;
    const xOuter = gsap.quickTo(outer, "x", {
      duration: 0.42,
      ease: "power3.out",
    });
    const yOuter = gsap.quickTo(outer, "y", {
      duration: 0.42,
      ease: "power3.out",
    });
    const xInner = gsap.quickTo(inner, "x", {
      duration: 0.08,
      ease: "power2.out",
    });
    const yInner = gsap.quickTo(inner, "y", {
      duration: 0.08,
      ease: "power2.out",
    });

    const move = (event: PointerEvent) => {
      xOuter(event.clientX);
      yOuter(event.clientY);
      xInner(event.clientX);
      yInner(event.clientY);
    };

    const enterInteractive = () => {
      gsap.to(outer, {
        scale: 1.85,
        opacity: 0.56,
        duration: 0.28,
        ease: "power3.out",
      });
      gsap.to(inner, { scale: 0.72, duration: 0.28, ease: "power3.out" });
    };

    const leaveInteractive = () => {
      gsap.to(outer, {
        scale: 1,
        opacity: 0.34,
        duration: 0.28,
        ease: "power3.out",
      });
      gsap.to(inner, { scale: 1, duration: 0.28, ease: "power3.out" });
    };

    const down = () => {
      gsap.to(outer, { scale: 0.72, duration: 0.12, ease: "power2.out" });
      gsap.to(inner, { scale: 1.45, duration: 0.12, ease: "power2.out" });
    };

    const up = () => {
      gsap.to(outer, { scale: 1, duration: 0.22, ease: "power3.out" });
      gsap.to(inner, { scale: 1, duration: 0.22, ease: "power3.out" });
    };

    const interactiveSelector =
      "a, button, [data-cursor], input, textarea, select";
    const bindInteractive = () => {
      document.querySelectorAll(interactiveSelector).forEach((element) => {
        element.addEventListener("pointerenter", enterInteractive);
        element.addEventListener("pointerleave", leaveInteractive);
      });
    };

    document.documentElement.classList.add("custom-cursor-enabled");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    bindInteractive();

    const observer = new MutationObserver(bindInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.querySelectorAll(interactiveSelector).forEach((element) => {
        element.removeEventListener("pointerenter", enterInteractive);
        element.removeEventListener("pointerleave", leaveInteractive);
      });
      observer.disconnect();
      gsap.killTweensOf([outer, inner]);
    };
  }, []);

  return { outerRef, innerRef };
}
