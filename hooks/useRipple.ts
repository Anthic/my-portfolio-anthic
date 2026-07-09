"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function useRipple() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!finePointer) {
      return;
    }

    const handleClick = (event: PointerEvent) => {
      const ripple = document.createElement("span");
      ripple.className = "click-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 0.5 },
        {
          scale: 3,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    window.addEventListener("pointerdown", handleClick);

    return () => {
      window.removeEventListener("pointerdown", handleClick);
      document
        .querySelectorAll(".click-ripple")
        .forEach((element) => element.remove());
    };
  }, []);
}
