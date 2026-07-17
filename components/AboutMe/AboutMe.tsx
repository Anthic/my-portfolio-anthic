"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import { motion } from "framer-motion";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(96,116,86,${0.05 + i * 0.01})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        style={{ color: "rgba(96, 116, 86, 0.55)" }}
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const techStackItems = [
  { name: "Python", icon: "https://cdn.simpleicons.org/python" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript" },
  { name: "React", icon: "https://cdn.simpleicons.org/react" },
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/ffffff" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs" },
  { name: "FastAPI", icon: "https://cdn.simpleicons.org/fastapi" },
  { name: "Flask", icon: "https://cdn.simpleicons.org/flask/ffffff" },
];

const aiAndToolsItems = [
  { name: "TensorFlow", icon: "https://cdn.simpleicons.org/tensorflow" },
  { name: "PyTorch", icon: "https://cdn.simpleicons.org/pytorch" },
  { name: "LangChain", icon: "https://cdn.simpleicons.org/langchain" },
  { name: "OpenCV", icon: "https://cdn.simpleicons.org/opencv" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql" },
  { name: "Redis", icon: "https://cdn.simpleicons.org/redis" },
  { name: "Docker", icon: "https://cdn.simpleicons.org/docker" },
  { name: "Kubernetes", icon: "https://cdn.simpleicons.org/kubernetes" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git" },
];

function BrandCard({ name, icon }: { name: string; icon: string }) {
  return (
    <div
      className="group flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.06] hover:border-[#607456]/40 hover:shadow-[0_0_25px_rgba(96,116,86,0.15)] hover:-translate-y-0.5"
      style={{
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div className="relative w-7 h-7 flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        <img
          src={icon}
          alt={name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <span className="text-base font-bold text-white/70 transition-colors duration-300 group-hover:text-white tracking-wide font-sans">
        {name}
      </span>
    </div>
  );
}

type AboutMeProps = {
  /** The 800vh wrapper ref from ScrollHijackSection — used to key scroll triggers */
  wrapperRef: RefObject<HTMLDivElement | null>;
};

export default function AboutMe({ wrapperRef }: AboutMeProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    if (!wrapper || !panel) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        if (introRef.current) gsap.set(introRef.current, { autoAlpha: 0 });
        if (cardRef.current) gsap.set(cardRef.current, { y: 0, scale: 1, borderRadius: 0 });
        if (contentRef.current) gsap.set(contentRef.current, { y: "-200vh" });
        return;
      }

      // ══════════════════════════════════════════════════════════════════
      // SCROLL TIMELINE  (800vh wrapper)
      //
      //  0% → 37.5% Horizontal slide: Panel A (HeroStats) → Panel B (AboutMe)
      //  37.5%      Panel B fully in view. Buttons visible. Card fully below screen.
      //  40% → 54%  Card scale & sweep entrance from bottom (y: 60vh → 0vh, scale: 0.8 → 1.0)
      //  54% → 85%  Inner content scroll (marquee moves up, image reveals, then tech stack reveals)
      // ══════════════════════════════════════════════════════════════════

      // ── 1. CARD ENTRANCE ─────────────────────────────────────────────
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          {
            y: "60vh",
            scale: 0.8,
            borderRadius: "60px 60px 0 0",
          },
          {
            y: "0vh",
            scale: 1,
            borderRadius: "0px",
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: wrapper,
              start: "40% top",
              end: "54% top",
              scrub: 2,
            },
          }
        );
      }

      // ── 1.5. INNER CONTENT SCROLL & IMAGE PARALLAX ───────────────────
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            y: "0vh",
          },
          {
            y: "-200vh",
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "54% top",
              end: "85% top",
              scrub: 2,
            },
          }
        );
      }

      if (imageParallaxRef.current) {
        gsap.fromTo(
          imageParallaxRef.current,
          {
            yPercent: -10,
          },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "54% top",
              end: "85% top",
              scrub: 2,
            },
          }
        );
      }

      // ── 2. INTRO BUTTONS FADE OUT ────────────────────────────────────
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { autoAlpha: 1, y: 0 },
          {
            autoAlpha: 0,
            y: -20,
            ease: "power2.in",
            scrollTrigger: {
              trigger: wrapper,
              start: "40% top",
              end: "48% top",
              scrub: 1.5,
              onUpdate: (self) => {
                if (introRef.current) {
                  introRef.current.style.pointerEvents =
                    self.progress > 0.92 ? "none" : "auto";
                }
              },
            },
          }
        );
      }

      ScrollTrigger.refresh();
    }, panel);

    return () => ctx.revert();
  }, [wrapperRef]);

  /* ── Marquee items: 3 titles + branded green diamond separator ── */
  const diamondSvg = (
    <svg viewBox="0 0 100 100" style={{ width: "60%", height: "60%", fill: "#121212" }}>
      <path d="M50 0 C60 30 100 40 100 50 C100 60 60 70 50 100 C40 70 0 60 0 50 C0 40 40 30 50 0" />
    </svg>
  );

  const sepStyle: React.CSSProperties = {
    width: "clamp(4.5rem, 7vw, 9rem)",
    height: "clamp(4.5rem, 7vw, 9rem)",
    borderRadius: "50%",
    background: "#607456",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "clamp(2rem, 3vw, 4rem)",
    marginLeft: "clamp(2rem, 3vw, 4rem)",
    flexShrink: 0,
  };

  const textStyle: React.CSSProperties = {
    fontSize: "clamp(4rem, 8.5vw, 12rem)",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "-0.03em",
    color: "#ffffff",
    marginRight: "clamp(1.5rem, 2.5vw, 3rem)",
    marginLeft: "clamp(1.5rem, 2.5vw, 3rem)",
    fontFamily: "var(--font-name), Satoshi, system-ui, sans-serif",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const marqueeItems = [
    <span key="t1" style={textStyle}>AI ENGINEER</span>,
    <div key="s1" style={sepStyle}>{diamondSvg}</div>,
    <span key="t2" style={textStyle}>STATISTICIAN</span>,
    <div key="s2" style={sepStyle}>{diamondSvg}</div>,
    <span key="t3" style={textStyle}>FULL STACK DEVELOPER</span>,
    <div key="s3" style={sepStyle}>{diamondSvg}</div>,
  ];

  return (
    <div
      ref={panelRef}
      style={{
        width: "100%",
        height: "100%",
        background: "black",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Radial glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(96,116,86,0.13) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Top shimmer border ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          insetInline: 0,
          top: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.18) 60%, transparent)",
          zIndex: 1,
        }}
      />

      {/* ── Intro overlay: About me button + side labels ── */}
      <div
        ref={introRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        {/* Left label */}
        <div
          style={{
            position: "absolute",
            left: "clamp(2rem, 5vw, 6rem)",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.8)",
            fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "Satoshi, system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>↓</span>
          <span>Scroll to Explore</span>
        </div>

        {/* Centre: pill + arrow circle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              background: "#ffffff",
              color: "#000000",
              fontWeight: 700,
              fontSize: "clamp(0.85rem, 1.1vw, 1.05rem)",
              fontFamily: "Satoshi, system-ui, sans-serif",
              padding: "clamp(0.8rem, 1.1vw, 1.1rem) clamp(1.8rem, 2.5vw, 2.5rem)",
              borderRadius: "9999px",
              cursor: "default",
              userSelect: "none",
              boxShadow: "0 10px 30px rgba(255,255,255,0.08)",
            }}
          >
            About me
          </div>
          <div
            style={{
              width: "clamp(2.8rem, 3.8vw, 3.8rem)",
              height: "clamp(2.8rem, 3.8vw, 3.8rem)",
              borderRadius: "50%",
              background: "#ffffff",
              color: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "default",
              userSelect: "none",
              boxShadow: "0 10px 30px rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.1rem, 1.4vw, 1.45rem)",
                fontWeight: "bold",
                transform: "translate(0.5px, -0.5px)",
              }}
            >
              ↗
            </span>
          </div>
        </div>

        {/* Right label */}
        <div
          style={{
            position: "absolute",
            right: "clamp(2rem, 5vw, 6rem)",
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.45)",
            fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "Satoshi, system-ui, sans-serif",
          }}
        >
          My Short Story
        </div>
      </div>

      {/* ── Main Card ── */}
      <div
        ref={cardRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#121212",
          borderRadius: "60px 60px 0 0",
          overflow: "hidden",
          zIndex: 5,
          transformOrigin: "bottom center",
          transform: "translateY(60vh) scale(0.8)",
          willChange: "transform",
        }}
      >
        {/* ── Inner scrolling content wrapper ── */}
        <div
          ref={contentRef}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            willChange: "transform",
          }}
        >
          {/* ── Phase 1: Marquee Section (Full Viewport) ── */}
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ width: "100%" }}>
              <InfiniteMarquee
                items={marqueeItems}
                speed={22}
                className="w-full"
              />
            </div>
          </div>

          {/* ── Phase 2: Large Image Section (Full Viewport) ── */}
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              padding: "4vh 4vw",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* Background floating paths behind the image card */}
            <div className="absolute inset-0 z-0">
              <FloatingPaths position={1} />
              <FloatingPaths position={-1} />
            </div>

            <div
              style={{
                position: "relative",
                height: "350vh",
                aspectRatio: "3 / 4",
                maxHeight: "100%",
                maxWidth: "240vw",
                overflow: "hidden",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              {/* Inner Image Container */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Parallax wrapper */}
                <div
                  ref={imageParallaxRef}
                  style={{
                    position: "absolute",
                    width: "calc(100% + 100px)",
                    height: "130vh",
                    top: "-15vh",
                    left: "-50px",
                    willChange: "transform",
                  }}
                >
                  <img
                    src="/images/feature-img.jpeg"
                    alt="Feature Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center center",
                      filter: "grayscale(100%) contrast(1.1)",
                      transition: "filter 0.8s ease-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "grayscale(0%) contrast(1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "grayscale(100%) contrast(1.1)";
                    }}
                  />
                </div>
              </div>

              {/* Vault frame - covers the clip edges with gradient matching card background #121212 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              >
                {/* Top bar */}
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: 0,
                    width: "100%",
                    height: "52px",
                    backgroundColor: "#121212",
                  }}
                />
                {/* Top gradient */}
                <div
                  style={{
                    position: "absolute",
                    top: "51px",
                    left: 0,
                    width: "100%",
                    height: "128px",
                    background: "linear-gradient(to bottom, #121212, rgba(18, 18, 18, 0))",
                  }}
                />

                {/* Bottom bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    width: "100%",
                    height: "52px",
                    backgroundColor: "#121212",
                  }}
                />
                {/* Bottom gradient */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "51px",
                    left: 0,
                    width: "100%",
                    height: "128px",
                    background: "linear-gradient(to top, #121212, rgba(18, 18, 18, 0))",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Phase 3: Tech Stack & Ecosystem (Full Viewport) ── */}
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexShrink: 0,
              padding: "6vh 8vw",
              boxSizing: "border-box",
              position: "relative",
              background: "#121212",
            }}
          >
            {/* Subtle premium background glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 80% 50%, rgba(96, 116, 86, 0.04) 0%, transparent 60%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full max-w-7xl mx-auto mb-12 relative z-10">
              {/* Left Side Header */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#607456] font-sans">
                  Skills & Expertise
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight font-sans">
                  Scalable AI. <br />
                  <span className="text-white/60">Reliable Engineering.</span>
                </h3>
                <p className="text-base md:text-lg text-[#a8bba2] font-medium leading-relaxed mt-2 font-sans">
                  Transforming Ideas into Intelligent Products.
                </p>
              </div>

              {/* Right Side Description */}
              <div className="lg:col-span-7 lg:pt-4">
                <p className="text-[14px] md:text-[16px] text-white/50 leading-relaxed font-normal max-w-2xl font-sans">
                  I build production-grade software that combines Artificial Intelligence, Machine Learning, and modern full-stack engineering. From multi-agent AI systems and cloud-native architectures to predictive analytics and scalable web applications, I create solutions designed for real-world impact.
                </p>
              </div>
            </div>

            {/* Marquees */}
            <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto mt-6 relative z-10">
              <div className="overflow-hidden w-full">
                <InfiniteMarquee
                  items={techStackItems.map((item) => (
                    <BrandCard key={item.name} name={item.name} icon={item.icon} />
                  ))}
                  speed={24}
                  gap={20}
                />
              </div>
              <div className="overflow-hidden w-full">
                <InfiniteMarquee
                  items={aiAndToolsItems.map((item) => (
                    <BrandCard key={item.name} name={item.name} icon={item.icon} />
                  ))}
                  speed={24}
                  reverse
                  gap={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
