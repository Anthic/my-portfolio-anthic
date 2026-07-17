"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageLoader from "@/components/Loader/PageLoader";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import CustomCursor from "@/components/Cursor/CustomCursor";
import Navbar from "@/components/Navbar/Navbar";
import NavbarDropAnimation from "@/components/Navbar/NavbarDropAnimation";
import Hero from "@/components/Hero/Hero";
import ScrollHijackSection from "@/components/ScrollHijack/ScrollHijackSection";

import BackToTop from "@/components/BackToTop/BackToTop";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [navReady, setNavReady] = useState(false);

  const handleNavAnimComplete = useCallback(() => {
    setNavReady(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !loaded) {
      return;
    }

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const heroLayer = root.querySelector<HTMLElement>(".hero-pin-layer");
      const heroVisual = heroLayer?.querySelector<HTMLElement>("section");
      // The stats section is now inside ScrollHijackSection — reference it there
      const statsSection = root.querySelector<HTMLElement>(".hero-statistics");

      if (heroLayer && statsSection && !reduceMotion) {
        // Pin the Hero while the stats panel slides into view
        ScrollTrigger.create({
          trigger: heroLayer,
          start: "top top",
          end: "+=112%",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });

        if (heroVisual) {
          // Subtle parallax: hero video scales/dims as stats arrive — fades to 0
          gsap.to(heroVisual, {
            yPercent: -3,
            scale: 0.97,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: statsSection,
              start: "top bottom",
              end: "top top",
              scrub: 0.9,
            },
          });
        }
      }

      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, [loaded]);

  return (
    <>
      {!loaded && <PageLoader onComplete={handleLoaderComplete} />}
      <SmoothScroll>
        <CustomCursor />
        <Navbar isReady={navReady} />
        <NavbarDropAnimation
          trigger={loaded}
          onComplete={handleNavAnimComplete}
        />
        <main ref={rootRef} className="overflow-hidden bg-[#090909] text-white">
          {/* ── Hero: full-screen video banner ───────────────────────── */}
          <div className="hero-pin-layer relative z-10">
            <Hero trigger={loaded} />
          </div>

          {/* ── ScrollHijackSection: Stats → About Me slide transition ─ */}
          <ScrollHijackSection trigger={loaded} />

   
        </main>
        <BackToTop />
      </SmoothScroll>
    </>
  );
}
