"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

type PageLoaderProps = {
  onComplete: () => void;
};

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const completedRef = useRef(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const logo = logoRef.current;
    const line = lineRef.current;
    const dot = dotRef.current;
    const counter = countRef.current;
    const label = labelRef.current;
    const panels = panelRefs.current;
    const bodyOverflow = document.body.style.overflow;

    if (!logo || !line || !dot || !counter || !label) {
      return;
    }

    document.body.style.overflow = "hidden";

    gsap.fromTo(
      logo,
      { opacity: 0, y: 18, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out", delay: 0.2 },
    );

    gsap.to(logo, {
      y: -6,
      duration: 2.2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.2,
    });

    const DURATION = 2600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      setCount(Math.round(e * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    gsap.to(line, {
      scaleX: 1,
      duration: 2.6,
      ease: "power2.inOut",
    });

    gsap.to(dot, {
      opacity: 0.15,
      repeat: -1,
      yoyo: true,
      duration: 0.6,
      ease: "power1.inOut",
    });

    const tl = gsap.timeline({
      delay: 3.1,
      onComplete: () => {
        document.body.style.overflow = bodyOverflow;

        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      },
    });

    tl.to([logo, counter, label], {
      opacity: 0,
      y: -16,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.05,
    });

    panels.forEach((panel, i) => {
      tl.to(
        panel,
        {
          y: "-100%",
          duration: 1.05,
          ease: "power4.inOut",
        },
        0.35 + i * 0.16,
      );
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = bodyOverflow;
      tl.kill();
      gsap.killTweensOf([logo, line, dot, counter, label, ...panels]);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-9999 overflow-hidden" >
      <div className="absolute inset-0 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="flex-1"
            style={{ backgroundColor: "#659287" }}
          />
        ))}
      </div>

      <div
        ref={logoRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center  pointer-events-none"
        style={{ opacity: 0 }}
      >
        <Image
          src="/logos/lodingpage.png"
          alt="Anthic portfolio logo"
          width={820}
          height={320}
          priority
          style={{
            height: "clamp(140px, 24vw, 280px)",
            width: "auto",
            objectFit: "contain",
            opacity: 0.88,
            marginBottom: "-35px",
          }}
        />

        <div ref={labelRef} className="flex items-center gap-2">
          <span
            ref={dotRef}
            className="block w-2 h-2 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          />

          <span
            style={{
              fontFamily: "Satoshi, system-ui, sans-serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.05em",
            }}
          >
            Loading portfolio
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div
          ref={lineRef}
          className="h-full origin-left"
          style={{
            backgroundColor: "rgba(255,255,255,0.28)",
            transform: "scaleX(0)",
          }}
        />
      </div>

      <div
        ref={countRef}
        className="absolute bottom-6 right-6 z-10 pointer-events-none select-none tabular-nums"
        style={{
          fontFamily: "Satoshi, system-ui, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(4rem, 10vw, 8rem)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        {count}%
      </div>

      <div
        className="absolute bottom-7 left-6 z-10 pointer-events-none"
        style={{
          fontFamily: "Satoshi, system-ui, sans-serif",
          fontSize: "0.5rem",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.14)",
          fontWeight: 500,
        }}
      >
        Portfolio · 2026
      </div>
    </div>
  );
}
