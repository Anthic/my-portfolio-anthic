"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Code2, Layers3, PenTool, Sparkles } from "lucide-react";
import PageLoader from "@/components/Loader/PageLoader";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import CustomCursor from "@/components/Cursor/CustomCursor";
import Navbar from "@/components/Navbar/Navbar";
import NavbarDropAnimation from "@/components/Navbar/NavbarDropAnimation";
import Hero from "@/components/Hero/Hero";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import Marquee from "@/components/Marquee/Marquee";
import BackToTop from "@/components/BackToTop/BackToTop";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const projects = [
  { title: "Fintech Control Room", type: "Dashboard", gradient: "from-emerald-300 via-cyan-300 to-white" },
  { title: "Studio Booking Flow", type: "SaaS Product", gradient: "from-fuchsia-300 via-rose-200 to-amber-100" },
  { title: "AI Portfolio System", type: "Web Experience", gradient: "from-sky-300 via-violet-300 to-lime-100" },
];

const services = [
  { icon: Code2, title: "Frontend Systems", copy: "Next.js builds with clean architecture, reusable components, and performance-minded delivery." },
  { icon: Sparkles, title: "Motion Direction", copy: "GSAP animation systems that feel cinematic without stealing attention from the content." },
  { icon: Layers3, title: "Product Interfaces", copy: "Responsive dashboards, landing surfaces, and app flows shaped around real user behavior." },
  { icon: PenTool, title: "Visual Polish", copy: "Typography, spacing, interaction states, and micro-details tuned until the work feels premium." },
];

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
      // Hero handles its own entrance animations internally.
      // PortfolioPage only drives scroll-reveal and interactive effects below.

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 46,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".section-title").forEach((title) => {
        gsap.from(title.querySelectorAll(".title-char"), {
          autoAlpha: 0,
          yPercent: 80,
          stagger: 0.018,
          duration: 0.58,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 82%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        const image = card.querySelector(".project-visual");
        const title = card.querySelector(".project-title");

        card.addEventListener("pointerenter", () => {
          gsap.to(card, { y: -12, boxShadow: "0 30px 80px rgba(0,0,0,0.42)", duration: 0.34, ease: "power3.out" });
          gsap.to(image, { scale: 1.07, duration: 0.5, ease: "power3.out" });
          gsap.to(title, { x: 8, duration: 0.34, ease: "power3.out" });
        });

        card.addEventListener("pointerleave", () => {
          gsap.to(card, { y: 0, boxShadow: "0 18px 50px rgba(0,0,0,0.24)", duration: 0.34, ease: "power3.out" });
          gsap.to(image, { scale: 1, duration: 0.5, ease: "power3.out" });
          gsap.to(title, { x: 0, duration: 0.34, ease: "power3.out" });
        });
      });

      gsap.to(".marquee-track", {
        xPercent: -33.333,
        duration: 18,
        ease: "none",
        repeat: -1,
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loaded]);

  return (
    <>
      {!loaded && <PageLoader onComplete={handleLoaderComplete} />}
      <SmoothScroll>
        <CustomCursor />
        <Navbar isReady={navReady} />
        <NavbarDropAnimation trigger={loaded} onComplete={handleNavAnimComplete} />
        <main ref={rootRef} className="overflow-hidden bg-[#090909] text-white">
          <Hero trigger={loaded} />
          <Marquee />

          <section id="about" className="section-wrap">
            <SectionTitle eyebrow="About" title="Selected detail, built for speed." />
            <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <p className="reveal text-2xl leading-snug text-white/78 sm:text-4xl">I design and build portfolio, product, and SaaS interfaces with a focus on clarity, premium motion, and reliable front-end systems.</p>
              <div className="reveal grid gap-4 text-base leading-8 text-white/56 sm:grid-cols-2">
                <p>Every interaction is tuned to support the content: loaders create rhythm, scroll reveals add depth, and hover states make the interface feel alive.</p>
                <p>The result is a site that feels polished on desktop while staying native, fast, and comfortable on mobile.</p>
              </div>
            </div>
          </section>

          <section id="projects" className="section-wrap">
            <SectionTitle eyebrow="Projects" title="Work with presence." />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {projects.map((project) => (
                <article key={project.title} className="project-card reveal rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/25" data-cursor>
                  <div className={`project-visual aspect-[4/3] rounded-[1rem] bg-gradient-to-br ${project.gradient}`} />
                  <div className="flex items-end justify-between gap-5 px-2 pb-2 pt-6">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/38">{project.type}</p>
                      <h3 className="project-title text-2xl font-semibold text-white">{project.title}</h3>
                    </div>
                    <ArrowUpRight className="shrink-0 text-white/50" size={22} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="stack" className="section-wrap">
            <SectionTitle eyebrow="Stack" title="Tools that stay sharp." />
            <div className="reveal mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["Next.js App Router", "TypeScript", "Tailwind CSS", "GSAP + ScrollTrigger", "Lenis", "React 19", "Responsive UX", "Performance"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section id="services" className="section-wrap">
            <SectionTitle eyebrow="Services" title="From blank page to polished launch." />
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {services.map(({ icon: Icon, title, copy }) => (
                <article key={title} className="reveal rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6" data-cursor>
                  <Icon className="mb-8 text-emerald-300" size={28} strokeWidth={1.6} />
                  <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
                  <p className="leading-7 text-white/55">{copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className="section-wrap">
            <SectionTitle eyebrow="Experience" title="Process with momentum." />
            <div className="mt-12 space-y-4">
              {["Discovery and visual direction", "Interface build and animation system", "Responsive QA and performance pass"].map((item, index) => (
                <div key={item} className="reveal flex flex-col justify-between gap-5 border-t border-white/10 py-7 sm:flex-row sm:items-center">
                  <span className="font-mono text-sm text-emerald-300/70">0{index + 1}</span>
                  <h3 className="text-2xl font-medium text-white">{item}</h3>
                  <p className="max-w-sm text-white/48">A focused stage that turns creative direction into a fast, elegant web experience.</p>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="section-wrap pb-24">
            <div className="reveal rounded-[2rem] border border-white/10 bg-white p-8 text-black sm:p-12">
              <p className="mb-5 text-sm uppercase tracking-[0.32em] text-black/45">Contact</p>
              <h2 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-7xl">Have a premium web experience in mind?</h2>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="mailto:hello@example.com" className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-emerald-700">
                  Start a project
                  <ArrowUpRight size={17} />
                </a>
                <a href="#projects" className="inline-flex items-center justify-center rounded-full border border-black/12 px-6 py-4 text-sm font-medium transition hover:bg-black/5">
                  See selected work
                </a>
              </div>
            </div>
          </section>
        </main>
        <BackToTop />
      </SmoothScroll>
    </>
  );
}
