"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import HeroStats from "@/components/HeroStats/HeroStats";
import AboutMe from "@/components/AboutMe/AboutMe";

type ScrollHijackSectionProps = {
  trigger: boolean;
};

export default function ScrollHijackSection({
  trigger,
}: ScrollHijackSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);    // 600vh scroll space
  const stickyRef = useRef<HTMLDivElement>(null);     // sticky 100dvh viewport
  const trackRef = useRef<HTMLDivElement>(null);      // 200vw sliding track
  const exitRef = useRef<HTMLDivElement>(null);       // same as stickyRef alias

  const [isAboutVisible, setIsAboutVisible] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;

    if (!wrapper || !sticky || !track || !trigger) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        // Just show About Me statically
        gsap.set(track, { x: "-100vw" });
        setIsAboutVisible(true);
        return;
      }

      // ── MAIN SLIDE: Panel A (Stats) → Panel B (About Me) ────────────────
      const slideTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "+=300%",        // first 300vh of the 600vh for the slide
          scrub: 1.2,
          pin: sticky,
          pinSpacing: false,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Mark About Me as visible after 35% of slide progress
            setIsAboutVisible(self.progress > 0.35);
          },
        },
      });

      slideTl
        .fromTo(
          track,
          { x: "0vw" },
          {
            x: "-100vw",
            ease: "none",
          }
        );

      // ── EXIT: sticky panel shrinks as next section arrives ───────────────
      ScrollTrigger.create({
        trigger: wrapper,
        start: "80% top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (!sticky) return;
          gsap.set(sticky, {
            scale: gsap.utils.interpolate(1, 0.88, p),
            opacity: gsap.utils.interpolate(1, 0, p),
            borderRadius: `${gsap.utils.interpolate(0, 36, p)}px`,
          });
        },
      });

      ScrollTrigger.refresh();
    }, wrapper);

    return () => ctx.revert();
  }, [trigger]);

  return (
    // ── SCROLL SPACE: 600vh creates room for the full hijack sequence ──────
    <div
      ref={wrapperRef}
      id="about"
      style={{ position: "relative", height: "600vh" }}
    >
      {/* ── STICKY VIEWPORT: pinned by GSAP ScrollTrigger ──────────────── */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
          willChange: "transform",
          transformOrigin: "center top",
          zIndex: 20,
        }}
      >
        {/* ── HORIZONTAL TRACK: 200vw — GSAP animates x ─────────────────── */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: "200vw",
            height: "100%",
            willChange: "transform",
          }}
        >
          {/* ── PANEL A: Professional Statistics ─────────────────────────── */}
          <div
            style={{ width: "100vw", flexShrink: 0, height: "100%", overflow: "hidden" }}
            aria-hidden={isAboutVisible}
          >
            <HeroStats trigger={trigger} insideHijack />
          </div>

          {/* ── PANEL B: About Me ─────────────────────────────────────────── */}
          <div
            style={{ width: "100vw", flexShrink: 0, height: "100%", overflow: "hidden" }}
            aria-hidden={!isAboutVisible}
          >
            <AboutMe wrapperRef={wrapperRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
