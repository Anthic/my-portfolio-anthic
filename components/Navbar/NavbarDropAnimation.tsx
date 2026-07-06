"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * NavbarDropAnimation — Ultra-smooth cinematic water drop entrance
 *
 * Sequence:
 *  1. FALL      — Teardrop descends with gravity ease + vertical elongation + subtle sway
 *  2. IMPACT    — Instant squash + 3 staggered ripple rings + micro satellite droplets
 *  3. SETTLE    — Multi-oscillation elastic surface-tension bounce
 *  4. GOO MORPH — Liquid spreads via SVG goo filter into exact navbar pill shape
 *  5. REVEAL    — Goo dissolved, SVG fades, real Framer navbar spring kicks in
 *
 * Constraints:
 *  - Navbar.tsx untouched — zero HTML/CSS changes
 *  - Drop body = pure black
 *  - Pill dimensions measured live from the DOM for responsive accuracy
 *  - window.__replayNavDrop() for testing (remove in production)
 */

type Props = {
  trigger: boolean;
  onComplete?: () => void;
};

/* ─── Geometry helpers ───────────────────────────────────────────────────────── */

/**
 * A high-fidelity teardrop path.
 * tip at bottom (cx, cy + ry), round head centred at (cx, cy - ry + rx*1.1)
 * pointSharpness 0..1 — 0 = round bottom, 1 = sharp tip
 */
function teardropPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pointSharpness = 0.82
): string {
  const k   = 0.5523;                // cubic-bezier circle approximation
  const headCY = cy - (ry - rx);    // centre of the round head
  const tipY   = cy + ry;           // very bottom tip

  // control points for the lower curves (creating the pointed tip)
  const lowerCtrl = ry * (1 - pointSharpness) * 0.5;

  return [
    `M ${cx} ${tipY}`,
    // left side rising to head
    `C ${cx - rx * 0.48 * pointSharpness} ${tipY - lowerCtrl}`,
    `  ${cx - rx} ${headCY + rx * k}`,
    `  ${cx - rx} ${headCY}`,
    // head arc — left to top
    `C ${cx - rx} ${headCY - rx * k}`,
    `  ${cx - rx * k} ${headCY - rx}`,
    `  ${cx} ${headCY - rx}`,
    // head arc — top to right
    `C ${cx + rx * k} ${headCY - rx}`,
    `  ${cx + rx} ${headCY - rx * k}`,
    `  ${cx + rx} ${headCY}`,
    // right side descending to tip
    `C ${cx + rx} ${headCY + rx * k}`,
    `  ${cx + rx * 0.48 * pointSharpness} ${tipY - lowerCtrl}`,
    `  ${cx} ${tipY}`,
    `Z`,
  ].join(" ");
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function NavbarDropAnimation({ trigger, onComplete }: Props) {
  const svgRef      = useRef<SVGSVGElement>(null);
  const dropRef     = useRef<SVGPathElement>(null);
  const gloss1Ref   = useRef<SVGEllipseElement>(null);   // primary highlight
  const gloss2Ref   = useRef<SVGEllipseElement>(null);   // secondary bottom shimmer
  const rip1Ref     = useRef<SVGEllipseElement>(null);
  const rip2Ref     = useRef<SVGEllipseElement>(null);
  const rip3Ref     = useRef<SVGEllipseElement>(null);
  const sat1Ref     = useRef<SVGCircleElement>(null);    // satellite droplet 1
  const sat2Ref     = useRef<SVGCircleElement>(null);    // satellite droplet 2
  const sat3Ref     = useRef<SVGCircleElement>(null);    // satellite droplet 3
  const barRef      = useRef<SVGRectElement>(null);
  const blurElRef   = useRef<SVGFEGaussianBlurElement>(null);
  const matElRef    = useRef<SVGFEColorMatrixElement>(null);
  const tlRef       = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!trigger) return;

    // Wait two frames — paint + layout fully settled before measuring
    let raf1: number, raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(run);
    });

    function run() {
      const svg = svgRef.current;
      if (!svg) return;

      /* ── 1. Measure live navbar pill ──────────────────────────────────── */
      const desktopNav = document.querySelector<HTMLElement>(
        "nav[aria-label='Primary navigation']"
      );
      const pill =
        desktopNav?.querySelector<HTMLElement>("div[class*='rounded-full']") ??
        desktopNav?.querySelector<HTMLElement>("div");

      const W = window.innerWidth;
      const H = window.innerHeight;

      // Sensible fallback values (desktop ~760px pill, 52px tall, 16px from top)
      let pillTop  = 16;
      let pillLeft = (W - Math.min(W * 0.92, 760)) / 2;
      let pillW    = Math.min(W * 0.92, 760);
      let pillH    = 52;

      if (pill) {
        const r  = pill.getBoundingClientRect();
        pillTop  = r.top;
        pillLeft = r.left;
        pillW    = r.width;
        pillH    = r.height;
      }

      const pillRx = pillH / 2;
      const cx     = pillLeft + pillW / 2;
      const cy     = pillTop  + pillH / 2;

      /* ── 2. Drop rest dimensions ──────────────────────────────────────── */
      const RX = 13;   // rest half-width
      const RY = 20;   // rest half-height

      const startY = RY + 10;    // start just inside the top of the viewport — fully visible from the first frame

      /* ── 3. SVG viewport ─────────────────────────────────────────────── */
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

      /* ── 4. Initial SVG element states ───────────────────────────────── */
      const setDropPath = (dcy: number, rx: number, ry: number, sharp = 0.82) => {
        dropRef.current?.setAttribute("d", teardropPath(cx, dcy, rx, ry, sharp));
      };

      const setGloss = (dcy: number, rx: number, ry: number, opacity: number) => {
        if (gloss1Ref.current) {
          gsap.set(gloss1Ref.current, {
            attr: {
              cx: cx - rx * 0.28,
              cy: dcy - ry * 0.30,
              rx: rx * 0.40,
              ry: ry * 0.22,
            },
            opacity,
          });
        }
        if (gloss2Ref.current) {
          gsap.set(gloss2Ref.current, {
            attr: {
              cx: cx + rx * 0.12,
              cy: dcy + ry * 0.55,
              rx: rx * 0.22,
              ry: ry * 0.10,
            },
            opacity: opacity * 0.25,
          });
        }
      };

      setDropPath(startY, RX, RY);
      gsap.set(dropRef.current,  { opacity: 1 });
      setGloss(startY, RX, RY, 0.70);

      // Ripples start collapsed at impact point
      const ripInit = { cx, cy, rx: RX, ry: RY * 0.22, opacity: 0 };
      gsap.set([rip1Ref.current, rip2Ref.current, rip3Ref.current], { attr: ripInit, opacity: 0 });

      // Satellites hidden at impact centre
      gsap.set([sat1Ref.current, sat2Ref.current, sat3Ref.current], {
        attr: { cx, cy, r: 3.5 },
        opacity: 0,
      });

      // Bar hidden, tiny, centred on pill
      gsap.set(barRef.current, {
        attr: { x: cx - pillW / 2, y: pillTop, width: pillW, height: pillH, rx: pillRx, ry: pillRx },
        scaleX: 0.03,
        opacity: 0,
        transformOrigin: `${cx}px ${cy}px`,
      });

      gsap.set(svg, { display: "block", opacity: 1 });

      /* ── 5. Timeline ─────────────────────────────────────────────────── */
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      tlRef.current = tl;

      // ┌─────────────────────────────────────────────────────────────────┐
      // │  PHASE 1 — FALL                                                 │
      // │  Gravity: power4.in  |  Total: ~0.92s                          │
      // │  Shape elongates, tip sharpens, slight pendulum sway            │
      // └─────────────────────────────────────────────────────────────────┘
      const fall = { cy: startY, rx: RX, ry: RY, sharp: 0.82, sway: 0 };

      tl.to(fall, {
        duration: 1.55,           // slow honey-drop fall — languid & smooth
        ease: "power2.in",        // gentle acceleration, not harsh gravity
        cy: cy,
        rx: RX * 0.84,            // slight squeeze (less than before — slow drops stay rounder)
        ry: RY * 1.28,            // mild elongation — honey drops don't stretch much
        sharp: 0.88,              // tip only moderately pointed
        sway: Math.PI * 0.08,     // soft pendulum drift side to side
        onUpdate() {
          // gentle sinusoidal sway that peaks at mid-fall
          const swayProgress = (fall.cy - startY) / (cy - startY);
          const swayX = Math.sin(swayProgress * Math.PI) * fall.rx * 0.35;
          setDropPath(fall.cy, fall.rx, fall.ry, fall.sharp);
          gsap.set(dropRef.current, { x: swayX });
          setGloss(fall.cy, fall.rx + swayX * 0.1, fall.ry, 0.70);
        },
      }, 0);

      // ┌─────────────────────────────────────────────────────────────────┐
      // │  PHASE 2 — IMPACT                                               │
      // │  Instant squash  |  3 ripple rings  |  3 micro satellites       │
      // └─────────────────────────────────────────────────────────────────┘
      const squash = { rx: RX * 0.72, ry: RY * 1.58, cy };

      tl.to(squash, {
        duration: 0.09,
        ease: "power1.out",
        rx: RX * 2.10,
        ry: RY * 0.38,
        onUpdate() {
          // reset any sway offset first
          gsap.set(dropRef.current, { x: 0 });
          setDropPath(squash.cy, squash.rx, squash.ry, 0.20);
          setGloss(squash.cy, squash.rx, squash.ry, 0.40);
        },
      });

      // — Ripple ring 1 (tightest, fastest) —
      tl.set(rip1Ref.current,  { attr: { cx, cy, rx: squash.rx, ry: squash.ry }, opacity: 0.75 }, "<");
      tl.to(rip1Ref.current, {
        duration: 0.75,
        ease: "power3.out",
        opacity: 0,
        attr: { rx: RX * 7, ry: RY * 1.1 },
      }, "<");

      // — Ripple ring 2 (mid, delayed 50ms) —
      tl.set(rip2Ref.current,  { attr: { cx, cy, rx: squash.rx * 0.7, ry: squash.ry * 0.7 }, opacity: 0.5 }, "<0.05");
      tl.to(rip2Ref.current, {
        duration: 0.90,
        ease: "power3.out",
        opacity: 0,
        attr: { rx: RX * 10.5, ry: RY * 1.45 },
      }, "<");

      // — Ripple ring 3 (widest, most faded, delayed 100ms) —
      tl.set(rip3Ref.current,  { attr: { cx, cy, rx: squash.rx * 0.4, ry: squash.ry * 0.4 }, opacity: 0.28 }, "<0.05");
      tl.to(rip3Ref.current, {
        duration: 1.10,
        ease: "power2.out",
        opacity: 0,
        attr: { rx: RX * 14, ry: RY * 1.75 },
      }, "<");

      // — Micro satellites (shoot out and fall away) —
      const satAngles = [-38, 0, 38]; // degrees from vertical
      const satRefs   = [sat1Ref.current, sat2Ref.current, sat3Ref.current];

      satAngles.forEach((deg, i) => {
        const rad  = (deg * Math.PI) / 180;
        const dist = 24 + i * 8;
        const tx   = Math.sin(rad) * dist;
        const ty   = -Math.cos(rad) * dist * 0.5;
        const el   = satRefs[i];

        tl.set(el, { attr: { cx, cy, r: 4 - i * 0.8 }, opacity: 0.8, x: 0, y: 0 }, "<");
        tl.to(el, {
          duration: 0.45 + i * 0.06,
          ease: "power2.out",
          x: tx,
          y: ty,
          opacity: 0,
          attr: { r: 1.5 },
        }, "<");
      });

      // ┌─────────────────────────────────────────────────────────────────┐
      // │  PHASE 3 — SETTLE / SURFACE TENSION                             │
      // │  Multi-oscillation elastic — feels like a real liquid drop      │
      // └─────────────────────────────────────────────────────────────────┘
      const settle = { rx: RX * 2.10, ry: RY * 0.38, cy };

      tl.to(settle, {
        duration: 0.72,
        ease: "elastic.out(1.05, 0.38)",
        rx: RX,
        ry: RY,
        onUpdate() {
          setDropPath(settle.cy, settle.rx, settle.ry, 0.82);
          setGloss(settle.cy, settle.rx, settle.ry, 0.68);
        },
      });

      // ┌─────────────────────────────────────────────────────────────────┐
      // │  PHASE 4 — GOO MORPH                                            │
      // │  Drop dissolves / bar liquifies open via goo SVG filter         │
      // └─────────────────────────────────────────────────────────────────┘
      // Tiny beat pause for drama before the morph begins
      tl.to({}, { duration: 0.10 }, ">");

      // Reveal bar (still tiny), goo filter blends drop + bar together
      tl.set(barRef.current, { opacity: 1 }, ">");

      const morph = { rx: RX, ry: RY, cy, dropOp: 1.0 };

      tl.to(morph, {
        duration: 0.62,
        ease: "power2.inOut",
        rx: 1.5,
        ry: 1.5,
        dropOp: 0,
        onUpdate() {
          setDropPath(morph.cy, morph.rx, morph.ry, 0.82);
          if (dropRef.current) {
            dropRef.current.style.opacity = String(morph.dropOp);
          }
          setGloss(morph.cy, morph.rx, morph.ry, morph.dropOp * 0.68);
        },
      }, ">");

      // Bar expands from centre with elastic overshoot
      tl.to(barRef.current, {
        duration: 0.80,
        ease: "elastic.out(0.82, 0.52)",
        scaleX: 1,
        opacity: 1,
      }, "<0.08");

      // ┌─────────────────────────────────────────────────────────────────┐
      // │  PHASE 5 — DISSOLVE GOO → REVEAL REAL NAVBAR                    │
      // │  Filter zeroed so bar renders pixel-crisp, then overlay fades   │
      // └─────────────────────────────────────────────────────────────────┘
      tl.call(() => {
        // Kill the goo: set blur to 0 and matrix to identity
        if (blurElRef.current) blurElRef.current.setAttribute("stdDeviation", "0");
        if (matElRef.current) {
          matElRef.current.setAttribute(
            "values",
            "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          );
        }

        // Shimmer the bar off
        gsap.to(barRef.current, {
          duration: 0.22,
          ease: "power2.in",
          opacity: 0,
        });

        // Fade the whole SVG overlay out
        gsap.to(svg, {
          duration: 0.30,
          ease: "power2.in",
          delay: 0.04,
          opacity: 0,
          onComplete: () => {
            svg.style.display = "none";
            svg.style.pointerEvents = "none";
            onComplete?.();   // → navReady = true → Framer spring fires
          },
        });
      }, [], ">");
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      tlRef.current?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  /* ── Dev replay helper — remove the useEffect below for production ── */
  useEffect(() => {
    if (!trigger || typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__replayNavDrop = () => tlRef.current?.restart(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { delete (window as any).__replayNavDrop; };
  }, [trigger]);

  if (!trigger) return null;

  /* ── SVG markup — note: all positioning is set by GSAP on mount ── */
  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        pointerEvents: "none",
        display: "none",       // GSAP sets display:block when trigger fires
        overflow: "hidden",    // clip ripples at viewport edge — prevents phantom scrollbar
        width: "100vw",
        height: "100vh",
      }}
    >
      <defs>
        {/*
          GOO filter — the magic that liquid-merges the drop + bar:
          1. Heavy Gaussian blur smears the alpha channel
          2. feColorMatrix spikes the alpha (row 4) to threshold the blurred region
             giving a crisp blob boundary even though the input is blurry
          3. feComposite clips colour back to the original, clean pixel values
        */}
        <filter
          id="nda-goo"
          x="-80%"
          y="-300%"
          width="260%"
          height="700%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            ref={blurElRef}
            in="SourceGraphic"
            stdDeviation="11"
            result="blur"
          />
          <feColorMatrix
            ref={matElRef}
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 26 -11"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        {/* Primary specular highlight — upper-left bright catch-light */}
        <radialGradient id="nda-gloss1" cx="30%" cy="22%" r="60%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.95)" />
          <stop offset="55%"  stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </radialGradient>

        {/* Secondary shimmer — bottom inner reflection (physical water optics) */}
        <radialGradient id="nda-gloss2" cx="50%" cy="30%" r="55%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.60)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </radialGradient>
      </defs>

      {/* ── GOO layer: drop body + expanding bar share the filter ── */}
      <g filter="url(#nda-goo)">
        {/* Teardrop body — pure black per AGENTS.md spec */}
        <path ref={dropRef} fill="black" />

        {/* Navbar pill rectangle that morphs open during phase 4 */}
        <rect ref={barRef} fill="black" />
      </g>

      {/* ── Gloss highlights — outside filter so they stay pixel-crisp ── */}
      <ellipse ref={gloss1Ref} fill="url(#nda-gloss1)" />
      <ellipse ref={gloss2Ref} fill="url(#nda-gloss2)" />

      {/* ── Impact ripple rings ── */}
      <ellipse ref={rip1Ref} fill="none" stroke="rgba(0,0,0,0.50)" strokeWidth="1.8" />
      <ellipse ref={rip2Ref} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="1.3" />
      <ellipse ref={rip3Ref} fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="1.0" />

      {/* ── Micro satellite droplets that shoot out on impact ── */}
      <circle ref={sat1Ref} fill="black" />
      <circle ref={sat2Ref} fill="black" />
      <circle ref={sat3Ref} fill="black" />
    </svg>
  );
}
