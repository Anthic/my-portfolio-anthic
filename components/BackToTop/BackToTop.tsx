"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenisInstance } from "@/lib/lenis";

export default function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    gsap.set(button, { autoAlpha: 0, scale: 0.82, pointerEvents: "none" });

    const trigger = ScrollTrigger.create({
      start: 520,
      end: "max",
      onUpdate: (self) => {
        gsap.to(button, {
          autoAlpha: self.scroll() > 520 ? 1 : 0,
          scale: self.scroll() > 520 ? 1 : 0.82,
          pointerEvents: self.scroll() > 520 ? "auto" : "none",
          duration: 0.25,
          ease: "power3.out",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  const scrollTop = () => {
    const lenis = getLenisInstance();

    if (lenis) {
      lenis.scrollTo(0, { duration: 1.15 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollTop}
      className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white text-black shadow-2xl shadow-black/30 transition hover:bg-emerald-200"
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
