"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type HeroStatsProps = {
  trigger: boolean;
};

const headlineLines = [
  {
    text: "Data that speaks. AI that reasons.",
    accent: "#6366f1",
    direction: "left",
  },
  {
    text: "Software that ships.",
    accent: "#10b981",
    direction: "right",
  },
  {
    text: "Three disciplines, one engineer",
    accent: "#f59e0b",
    direction: "left",
  },
  {
    text: "and the numbers behind the work.",
    accent: "#ef4444",
    direction: "right",
  },
] as const;

const stats = [
  { value: "3.27/4.0", label: "Current GPA" },
  { value: "10+", label: "Projects Completed" },
  { value: "2 Years", label: "Professional Exp" },
  { value: "34+", label: "Tech & Tools" },
] as const;

export default function HeroStats({ trigger }: HeroStatsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const liftY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -120]);
  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [0.96, 1, 1.03]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !trigger) {
      return;
    }

    const hideCursor = () => {
      const cursor = document.querySelector<HTMLElement>(
        ".custom-cursor-outer",
      );

      if (cursor) {
        gsap.to(cursor, { autoAlpha: 0, duration: 0.18, overwrite: true });
      }
    };

    section.addEventListener("pointerenter", hideCursor);
    section.addEventListener("pointermove", hideCursor);

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const textLines = gsap.utils.toArray<HTMLElement>(".stats-line-text");
      const revealers = gsap.utils.toArray<HTMLElement>(".stats-line-revealer");
      const cards = gsap.utils.toArray<HTMLElement>(".stats-metric");

      textLines.forEach((line) => gsap.set(line, { autoAlpha: 0 }));
      revealers.forEach((revealer, index) => {
        gsap.set(revealer, {
          clipPath:
            headlineLines[index].direction === "left"
              ? "inset(0 100% 0 0)"
              : "inset(0 0 0 100%)",
        });
      });
      gsap.set(cards, {
        autoAlpha: 0,
        y: 28,
      });

      if (reduceMotion) {
        gsap.set(textLines, { autoAlpha: 1 });
        gsap.set(revealers, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

      let hasPlayed = false;
      const playHeadline = () => {
        if (hasPlayed) {
          return;
        }

        hasPlayed = true;
        const tl = gsap.timeline({
          defaults: {
            ease: "power4.inOut",
          },
        });

        revealers.forEach((revealer, index) => {
          const direction = headlineLines[index].direction;
          const textLine = textLines[index];
          const enterClip =
            direction === "left" ? "inset(0 0% 0 0)" : "inset(0 0 0 0%)";
          const exitClip =
            direction === "left" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
          const start = index * 0.16;

          tl.to(
            revealer,
            {
              clipPath: enterClip,
              duration: 0.38,
            },
            start,
          )
            .set(textLine, { autoAlpha: 1 }, start + 0.34)
            .to(
              revealer,
              {
                clipPath: exitClip,
                duration: 0.38,
              },
              start + 0.42,
            );
        });

        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.1",
        );
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top 72%",
        once: true,
        onEnter: playHeadline,
      });

      if (ScrollTrigger.isInViewport(section, 0.2)) {
        playHeadline();
      }
    }, section);

    return () => {
      section.removeEventListener("pointerenter", hideCursor);
      section.removeEventListener("pointermove", hideCursor);
      ctx.revert();
    };
  }, [trigger]);

  return (
    <motion.section
      ref={sectionRef}
      id="statistics"
      style={{ y: liftY, scale, opacity }}
      className="hero-statistics relative z-20 -mt-20 min-h-[100svh] w-full bg-transparent pt-8 text-white md:-mt-28"
    >
      <div className="stats-floating-panel relative min-h-[calc(100svh-2rem)] w-full overflow-hidden rounded-t-[56px] border-x border-t border-white/15 bg-black shadow-[0_-40px_120px_rgba(0,0,0,0.75)] sm:rounded-t-[72px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-28 rounded-t-[inherit] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_62%)]"
        />
        <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-[1040px] flex-col items-center justify-center gap-14 px-3 py-20 text-center sm:px-6">
          <div className="flex flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.085] px-5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]">
              <span className="h-3 w-3 rounded-full bg-[#35d66f] shadow-[0_0_14px_rgba(53,214,111,0.72)]" />
              <span className="text-xs font-black uppercase leading-none tracking-[0.04em] text-white/90">
                Professional Statistics
              </span>
            </div>
            <h2
              aria-label={headlineLines.map((line) => line.text).join(" ")}
              className="text-balance font-sans text-[clamp(1.3rem,4.15vw,3.55rem)] font-black leading-[1.12] tracking-[-0.04em] text-white"
            >
              {headlineLines.map((line) => (
                <span
                  key={line.text}
                  className="stats-sweep-line relative mx-auto block w-fit overflow-hidden px-2 py-1 text-white"
                >
                  <span
                    aria-hidden="true"
                    className="stats-line-revealer pointer-events-none absolute inset-0 z-10 rounded-md"
                    style={{
                      backgroundColor: line.accent,
                      clipPath:
                        line.direction === "left"
                          ? "inset(0 100% 0 0)"
                          : "inset(0 0 0 100%)",
                    }}
                  />
                  <span
                    className="stats-line-text relative z-0 text-white opacity-0"
                    style={{ visibility: "hidden" }}
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div className="grid w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101112]/92 shadow-[0_24px_90px_rgba(0,0,0,0.42)] sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="stats-metric group relative min-h-32 border-b border-white/10 px-8 py-9 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:border-dashed sm:border-white/20 sm:last:border-r-0"
              >
                <div className="transition duration-300 ease-out group-hover:-translate-y-3 group-hover:opacity-0">
                  <p className="mb-4 text-[0.7rem] font-black uppercase tracking-[0.12em] text-white/46">
                    {stat.label}
                  </p>
                  <div className="font-sans text-[clamp(1.75rem,2.35vw,2.45rem)] font-black leading-none tracking-[-0.05em] text-white">
                    {stat.value}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 flex translate-y-4 items-center justify-center opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-black shadow-[0_18px_42px_rgba(255,255,255,0.13)]">
                    {stat.label}
                    <ExternalLink size={15} strokeWidth={2.3} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
