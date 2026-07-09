"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* ─── rotating words ──────────────────────────────────────────────────────── */
const WORDS = [
  "AI Agents",
  "RAG Systems",
  "LangGraph pipelines",
  "full-stack architecture",
] as const;
const SUFFIX = "turning complex problems into production-ready solutions.";

/* Dynamic selection colors: #607456, #EEE0CC, #BA6A4C, #7B2525 */
const SELECTION_COLORS: Record<string, string> = {
  "AI Agents": "rgba(96,  116, 86,  0.32)", // #607456 — earthy green
  "RAG Systems": "rgba(238, 224, 204, 0.28)", // #EEE0CC — warm cream
  "LangGraph pipelines": "rgba(186, 106, 76,  0.32)", // #BA6A4C — terracotta
  "full-stack architecture": "rgba(123, 37,  37,  0.32)", // #7B2525 — deep red
};

const SELECTION_BORDERS: Record<string, string> = {
  "AI Agents": "rgba(96,  116, 86,  0.70)", // #607456
  "RAG Systems": "rgba(238, 224, 204, 0.60)", // #EEE0CC
  "LangGraph pipelines": "rgba(186, 106, 76,  0.70)", // #BA6A4C
  "full-stack architecture": "rgba(123, 37,  37,  0.70)", // #7B2525
};

type HeroProps = {
  trigger: boolean;
};

export default function Hero({ trigger }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  /* word-cycle refs */
  const wordWrapRef = useRef<HTMLSpanElement>(null); // the whole inline-block container
  const wordRef = useRef<HTMLSpanElement>(null); // swappable word text
  const selBgRef = useRef<HTMLSpanElement>(null); // coloured selection highlight
  const wordIdxRef = useRef(0);
  const mountedRef = useRef(true);
  const mousePosRef = useRef({ x: 0, y: 0 }); // live mouse position
  const [wordDisplay, setWordDisplay] = useState<string>(WORDS[0]);

  /* track mouse globally so cursor can return after animation */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── Video Playback Controller ─────────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (trigger) {
      video.play().catch((err) => {
        console.warn("Video auto-play blocked or failed:", err);
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [trigger]);

  /* ── entrance animation — ONLY runs after loader finishes ──────────────── */
  useEffect(() => {
    if (!trigger) return;
    mountedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.set(
        [
          kickerRef.current,
          nameRef.current,
          subtitleRef.current,
          actionsRef.current,
        ],
        {
          autoAlpha: 0,
          y: 28,
        },
      );
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(kickerRef.current, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.1)
        .to(nameRef.current, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.26)
        .to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.76 }, 0.46)
        .to(actionsRef.current, { autoAlpha: 1, y: 0, duration: 0.66 }, 0.6);
    }, sectionRef);

    return () => {
      mountedRef.current = false;
      ctx.revert();
    };
  }, [trigger]);

  /* ── custom-cursor word-selection animation — ONLY runs after loader ───── */
  useEffect(() => {
    if (!trigger) return;
    const wordWrap = wordWrapRef.current;
    const selBg = selBgRef.current;
    if (!wordWrap || !selBg) return;

    gsap.set(selBg, { scaleX: 0, transformOrigin: "left center", opacity: 0 });

    let cycleTimer: ReturnType<typeof setTimeout>;

    function runCycle() {
      if (!mountedRef.current) return;

      /* get the custom cursor outer ring */
      const cursorOuter = document.querySelector<HTMLElement>(
        ".custom-cursor-outer",
      );

      const tl = gsap.timeline({
        onComplete: () => {
          if (mountedRef.current) cycleTimer = setTimeout(runCycle, 700);
        },
      });

      /* ① pause — let the current word breathe */
      tl.to({}, { duration: 0.9 });

      /* ② move cursor to the word's LEFT edge */
      tl.call(
        () => {
          if (!wordWrap) return;
          const rect = wordWrap.getBoundingClientRect();
          const targetX = rect.left - 14;
          const targetY = rect.top + rect.height / 2 - 18;
          if (cursorOuter) {
            gsap.to(cursorOuter, {
              x: targetX,
              y: targetY,
              opacity: 1,
              duration: 0.38,
              ease: "power3.out",
              overwrite: true,
            });
          }
        },
        [],
        ">",
      );

      /* wait for cursor to arrive */
      tl.to({}, { duration: 0.4 });

      /* ③ sweep cursor RIGHT across the word + expand selection highlight */
      tl.call(
        () => {
          if (!wordWrap) return;
          const rect = wordWrap.getBoundingClientRect();
          const endX = rect.right + 6;
          const endY = rect.top + rect.height / 2 - 18;
          if (cursorOuter) {
            gsap.to(cursorOuter, {
              x: endX,
              y: endY,
              duration: 0.44,
              ease: "power2.inOut",
              overwrite: true,
            });
          }
        },
        [],
        ">",
      );

      tl.to(
        selBg,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.44,
          ease: "power2.inOut",
        },
        "<",
      );

      /* ④ hold — word is "selected" */
      tl.to({}, { duration: 0.28 });

      /* ⑤ cursor retreats to mouse position + selection fades */
      tl.call(
        () => {
          const { x, y } = mousePosRef.current;
          if (cursorOuter) {
            gsap.to(cursorOuter, {
              x,
              y: y - 18,
              opacity: 0,
              duration: 0.34,
              ease: "power2.inOut",
              overwrite: true,
            });
          }
        },
        [],
        ">",
      );

      tl.to(
        selBg,
        { scaleX: 0, opacity: 0, duration: 0.3, ease: "power2.inOut" },
        "<",
      );

      /* ⑥ swap word immediately when cursor starts retreating */
      tl.call(
        () => {
          if (!mountedRef.current) return;
          wordIdxRef.current = (wordIdxRef.current + 1) % WORDS.length;
          setWordDisplay(WORDS[wordIdxRef.current]);
        },
        [],
        "<0.12",
      );
    }

    cycleTimer = setTimeout(runCycle, 2000);

    return () => {
      clearTimeout(cycleTimer);
    };
  }, [trigger]);

  /* ── button hover interactions ─────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".hero-btn").forEach((btn) => {
        btn.addEventListener("pointerenter", () =>
          gsap.to(btn, { scale: 1.05, duration: 0.26, ease: "power3.out" }),
        );
        btn.addEventListener("pointerleave", () =>
          gsap.to(btn, { scale: 1.0, duration: 0.26, ease: "power3.out" }),
        );
        btn.addEventListener("pointerdown", () =>
          gsap.to(btn, { scale: 0.97, duration: 0.1, ease: "power2.out" }),
        );
        btn.addEventListener("pointerup", () =>
          gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power3.out" }),
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const currentSelectionColor =
    SELECTION_COLORS[wordDisplay] || "rgba(43, 87, 72, 0.24)";
  const currentSelectionBorder =
    SELECTION_BORDERS[wordDisplay] || "rgba(156, 176, 128, 0.45)";

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{ height: "100dvh", minHeight: "100dvh" }}
      className="relative flex items-center overflow-hidden"
    >
      {/* ── BACKGROUND VIDEO ──────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          
          objectPosition: "center 10%",
          zIndex: 0,
          transform: "scale(1.0)",
          
          filter: "brightness(1.5) contrast(1.02)",
        }}
      >
        <source src="/video/banner.mp4" type="video/mp4" />
      </video>

      {/* ── OVERLAYS — multi-layered for cinematic depth ─────────────────── */}
      {/* Left heavy gradient for text readability */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(115deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.02) 100%)",
        }}
      />
      {/* Top vignette to darken the area behind the navbar logo and links */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 25%)",
        }}
      />

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "min(88vw, 780px)",
          margin: "0 clamp(1.25rem, 6vw, 6rem)",
          paddingTop: "clamp(72px, 10vh, 120px)",
        }}
      >
        {/* ── BADGE ─────────────────────────────────────────────────────── */}
        <p
          ref={kickerRef}
          className="hero-kicker"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.38rem 0.9rem",
            marginBottom: "clamp(.5rem, 1.5vh, .8rem)",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.09)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            fontFamily: "Satoshi, system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "clamp(0.60rem, 1vw, 0.57rem)",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.78)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4a85deff",
              flexShrink: 0,
              boxShadow: "0 0 6px 2px rgba(74, 109, 222, 0.6)",
            }}
          />
          Turning Data into Decisions, Code into Solutions
        </p>

        {/* ── NAME — two lines, smaller responsive size ─────────────────── */}
        <h1
          ref={nameRef}
          className="hero-title"
          style={{
            fontFamily: "var(--font-name)",
            fontWeight: 700,
            /* Reduced from original — two-line name, fully responsive */
            fontSize: "clamp(1.9rem, 4.2vw, 5.0rem)",
            translate: "none",
            rotate: "none",
            scale: "none",
            opacity: 1,
            transform: "translate(0px, 0px)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            color: "#ffffff",
            marginBottom: "clamp(1rem, 2.5vh, 1.6rem)",
            textTransform: "uppercase",
          }}
        >
          {/* Line 1 */}
          ANTHIC
          <br />
          {/* Line 2 */}
          <span style={{ opacity: 0.88 }}>KUMAR SINGH</span>
        </h1>

        {/* ── DESCRIPTION with custom-cursor word-cycle ─────────────────── */}
        <div ref={subtitleRef} className="hero-subtitle">
          <h4
            style={{
              fontFamily: "var(--font-desc)",
              fontWeight: 400,
              fontSize: "clamp(1.20rem, 1.20vw, 1rem)",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.62)",
              marginBottom: "clamp(1.6rem, 3.5vh, 2.4rem)",
              maxWidth: 640,
            }}
          >
            <div>
              <span>Specializing in </span>

              {/* ── Animated word container — dynamic fit-content to eliminate gaps ── */}
              <span
                ref={wordWrapRef}
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontWeight: 600,
                  color: "#ffffff",
                  /* Padding around selector text */
                  padding: "0.08rem 0.42rem",
                }}
              >
                {/* Coloured selection highlight */}
                <span
                  ref={selBgRef}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset:
                      "-2px -6px" /* Good padding so highlight encompasses the word perfectly */,
                    background: currentSelectionColor,
                    border: `1px solid ${currentSelectionBorder}`,
                    borderRadius: 4,
                    transformOrigin: "left center",
                    pointerEvents: "none",
                    zIndex: 0,
                    transition: "background 0.3s ease, border-color 0.3s ease",
                  }}
                />

                {/* The swappable word */}
                <span
                  ref={wordRef}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    letterSpacing: "0.01em",
                  }}
                >
                  {wordDisplay}
                </span>
              </span>
            </div>

            {/* Suffix on a new block solves gap inconsistencies and CLS entirely */}
            <div style={{ opacity: 0.82, marginTop: "0.4rem" }}>{SUFFIX}</div>
          </h4>
        </div>

        {/* ── BUTTONS ─────────────────────────────────────────────────── */}
        <div
          ref={actionsRef}
          className="hero-actions"
          style={{
            display: "flex",
            gap: "clamp(0.6rem, 1.8vw, 0.9rem)",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#projects"
            className="hero-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding:
                "clamp(0.62rem, 1.3vw, 0.85rem) clamp(1.2rem, 2.5vw, 1.8rem)",
              borderRadius: "999px",
              background: "#607456",
              color: "#F6F0F0",
              fontFamily: "Satoshi, system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(0.74rem, 1.2vw, 0.88rem)",
              letterSpacing: "0.04em",
              textDecoration: "none",
              whiteSpace: "nowrap",
              willChange: "transform",
            }}
          >
            View Work <ArrowRight size={14} />
          </a>

          <a
            href="#contact"
            className="hero-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding:
                "clamp(0.62rem, 1.3vw, 0.85rem) clamp(1.2rem, 2.5vw, 1.8rem)",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.90)",
              fontFamily: "Satoshi, system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "clamp(0.74rem, 1.2vw, 0.88rem)",
              letterSpacing: "0.04em",
              textDecoration: "none",
              whiteSpace: "nowrap",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              willChange: "transform",
            }}
          >
            Contact <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
