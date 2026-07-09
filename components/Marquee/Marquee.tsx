"use client";

const items = [
  "Next.js",
  "TypeScript",
  "GSAP",
  "Lenis",
  "Tailwind CSS",
  "UX Motion",
  "Performance",
  "Responsive UI",
];

export default function Marquee() {
  const row = [...items, ...items, ...items];

  return (
    <div
      className="marquee border-y border-white/10 bg-white/[0.03] py-5"
      data-cursor
    >
      <div className="marquee-track flex w-max gap-10">
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="text-xl font-medium uppercase tracking-[0.24em] text-white/42"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
