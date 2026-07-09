"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { BrandScroller, BrandScrollerReverse } from "@/components/ui/brand-scroller";
import MagneticEffect from "@/components/ui/MagneticEffect";
import { portfolioData } from "@/data/portfolio";

export function AboutMeScrollSequence() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const techRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.8,
  });

  const leadInOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const leadInY = useTransform(smoothProgress, [0, 0.12], [0, -40]);

  const shortStoryOpacity = useTransform(smoothProgress, [0.08, 0.2], [0, 1]);
  const shortStoryY = useTransform(smoothProgress, [0.08, 0.2], [40, 0]);

  const imageOpacity = useTransform(smoothProgress, [0.18, 0.32], [0, 1]);
  const imageScale = useTransform(smoothProgress, [0.18, 0.32], [0.92, 1]);
  const imageY = useTransform(smoothProgress, [0.18, 0.32], [80, 0]);

  const titleOpacity = useTransform(smoothProgress, [0.3, 0.44], [0, 1]);
  const titleY = useTransform(smoothProgress, [0.3, 0.44], [50, 0]);

  const bioOpacity = useTransform(smoothProgress, [0.36, 0.5], [0, 1]);
  const bioY = useTransform(smoothProgress, [0.36, 0.5], [30, 0]);

  const techOpacity = useTransform(smoothProgress, [0.5, 0.64], [0, 1]);
  const techY = useTransform(smoothProgress, [0.5, 0.64], [30, 0]);

  const leadItems = [
    <span key="lead-1" className="text-[10rem] md:text-[16rem] font-black uppercase tracking-tighter mx-12 text-black dark:text-white leading-none">
      ABOUT ME
    </span>,
    <div key="lead-2" className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-[#D1FF4D] flex items-center justify-center mx-10">
      <ArrowUpRight className="w-12 h-12 text-black" />
    </div>,
  ];

  const storyItems = [
    <span key="story-1" className="text-[7rem] md:text-[12rem] font-black uppercase tracking-tighter mx-10 text-black dark:text-white leading-none">
      My Short Story
    </span>,
    <span key="story-2" className="text-[7rem] md:text-[12rem] font-black uppercase tracking-tighter mx-10 text-zinc-500 dark:text-zinc-400 leading-none">
      AI Engineer
    </span>,
  ];

const stackItems = [
  {
    name: "TensorFlow",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "Scikit-learn",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  {
    name: "LangChain",
    image: "https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white",
  },
  {
    name: "PyTorch",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  {
    name: "OpenCV",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
  },
  {
    name: "Python",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "TypeScript",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "React",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Node.js",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
];

  return (
    <section ref={sectionRef} className="relative w-full bg-background dark:bg-black overflow-hidden">
      <div className="relative min-h-[420vh]">
        <motion.div
          style={{ opacity: leadInOpacity, y: leadInY }}
          className="sticky top-0 z-10 h-screen flex items-center justify-center"
        >
          <div className="w-full max-w-[1400px] px-6 md:px-10">
            <div className="flex flex-col items-center justify-center gap-8">
              <MagneticEffect>
                <button className="group flex items-center gap-3 rounded-full bg-black dark:bg-white px-8 py-4 text-white dark:text-black shadow-2xl transition-all duration-500 hover:bg-[#c1e44a] hover:text-black">
                  <span className="text-lg font-bold uppercase tracking-[0.2em]">About Me</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c1e44a] text-black transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </button>
              </MagneticEffect>

              <div className="flex items-center gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.18em]">
                <span className="animate-bounce">↓</span>
                <span>Scroll to Explore</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: shortStoryOpacity, y: shortStoryY }}
          className="sticky top-0 z-20 h-screen flex items-center justify-center pointer-events-none"
        >
          <div className="w-full overflow-hidden">
            <InfiniteMarquee
              items={storyItems}
              speed={18}
              className="w-full"
              itemClassName="py-10"
            />
          </div>
        </motion.div>

        <motion.div
          ref={imageRef}
          style={{ opacity: imageOpacity, y: imageY, scale: imageScale }}
          className="sticky top-0 z-30 h-screen flex items-center justify-center px-4 md:px-8"
        >
          <div className="relative w-full max-w-[1500px] h-[86vh] overflow-hidden rounded-[32px] md:rounded-[48px] shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
            <Image
              src={portfolioData.personal.avatar}
              alt="Profile"
              fill
              priority
              className="object-cover object-bottom"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
        </motion.div>

        <motion.div
          ref={textRef}
          style={{ opacity: titleOpacity, y: titleY }}
          className="sticky top-0 z-40 h-screen flex items-end justify-center px-6 md:px-12 pb-20 md:pb-28"
        >
          <div className="w-full max-w-[1700px] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
            <div className="md:col-span-7">
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] text-black dark:text-white">
                Architecting Scalable Systems
                <br />
                <span className="text-zinc-500 dark:text-zinc-400">
                  Where Intelligence Meets Engineering
                </span>
              </h3>
            </div>

            <motion.div
              style={{ opacity: bioOpacity, y: bioY }}
              className="md:col-span-5 pt-2"
            >
              <p className="text-[14px] md:text-[16px] leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-xl">
                As an Information Technology student specializing in Artificial Intelligence and Software Engineering, I focus on building systems that bridge research foundations with production-ready implementation. My work combines algorithmic thinking, backend engineering, and scalable architecture to deliver solutions that are intelligent, reliable, and built for real-world impact.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          ref={techRef}
          style={{ opacity: techOpacity, y: techY }}
          className="sticky top-0 z-50 h-screen flex items-end justify-center pb-14 md:pb-20"
        >
          <div className="w-full max-w-[1700px] px-6 md:px-12">
            <div className="mb-6">
              <h4 className="text-lg md:text-xl uppercase tracking-[0.15em] font-bold text-zinc-500 dark:text-zinc-400">
                Tech Stack & Ecosystem
              </h4>
            </div>

            <InfiniteMarquee
<div className="flex items-center gap-4 overflow-hidden">
  {stackItems.map((item) => (
    <div key={item.name} className="flex items-center gap-3 mx-6">
      <img
        src={item.image}
        alt={item.name}
        className="w-10 h-10 md:w-12 md:h-12 object-contain"
      />
      <span className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white">
        {item.name}
      </span>
    </div>
  ))}
</div>
            />

            <div className="mt-6">
              <BrandScroller />
              <BrandScrollerReverse />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}