"use client";

import { ReactNode, useRef } from "react";

interface InfiniteMarqueeProps {
  items: ReactNode[];
  speed?: number; // px per second
  reverse?: boolean;
  className?: string;
  gap?: number; // gap in px between items
}

export default function InfiniteMarquee({
  items,
  speed = 18,
  reverse = false,
  className = "",
  gap = 64,
}: InfiniteMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate items 3× so the loop is seamless at all screen widths
  const row = [...items, ...items, ...items];
  const duration = `${(1000 / speed).toFixed(2)}s`;

  return (
    <div
      className={`infinite-marquee-root w-full overflow-hidden ${className}`}
      style={{ "--marquee-gap": `${gap}px` } as React.CSSProperties}
    >
      <div
        ref={trackRef}
        className="infinite-marquee-track"
        style={{
          display: "flex",
          width: "max-content",
          alignItems: "center",
          gap: gap,
          animation: `marquee-scroll ${duration} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          willChange: "transform",
        }}
      >
        {row.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center"
            aria-hidden={index >= items.length ? true : undefined}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
