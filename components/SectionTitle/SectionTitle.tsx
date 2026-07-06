"use client";

import clsx from "clsx";

export default function SectionTitle({ eyebrow, title, className }: { eyebrow: string; title: string; className?: string }) {
  return (
    <div className={clsx("section-title", className)}>
      <p className="mb-4 text-xs uppercase tracking-[0.38em] text-emerald-300/70">{eyebrow}</p>
      <h2 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">
        {title.split("").map((char, index) => (
          <span key={`${char}-${index}`} className="title-char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>
    </div>
  );
}
