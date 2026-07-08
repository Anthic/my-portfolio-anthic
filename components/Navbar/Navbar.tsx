"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "Work", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Credentials", href: "#stack" },
];

type NavbarProps = {
  isReady?: boolean;
};

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="whitespace-nowrap rounded-full px-3 xl:px-4 py-2 text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px] font-semibold uppercase tracking-widest text-black/60 transition-colors duration-200 hover:bg-black/5 hover:text-black"
      style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}
    >
      {label}
    </a>
  );
}
function HireBtn({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#contact"
      onClick={onClick}
      className="group flex shrink-0 items-center overflow-hidden rounded-full bg-[#607456] transition-all duration-300 hover:bg-[#4f6146] hover:shadow-[0_0_15px_rgba(96,116,86,0.3)]"
    >
      <span
        className="whitespace-nowrap px-4 xl:px-5 py-2 text-[11px] lg:text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F6F0F0]"
        style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}
      >
        Hire Me
      </span>
      <span className="mr-1 flex h-8 w-8 lg:h-9 lg:w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
        <ArrowRight size={11} className="text-[#F6F0F0]" />
      </span>
    </a>
  );
}

export default function Navbar({ isReady = true }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 hidden w-full justify-center px-3 pt-4 md:flex" aria-label="Primary navigation">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 28,
          }}
          className="flex h-15 w-[calc(100vw-24px)] max-w-[95%] sm:max-w-160 md:max-w-190 lg:max-w-230 xl:max-w-270 2xl:max-w-310 items-center overflow-hidden rounded-full border border-black/10 bg-[#F6F0F0]/94 px-4 lg:px-5 shadow-[0_18px_42px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all duration-300"
          style={{
            backgroundColor: scrolled ? "rgba(246, 240, 240, 0.88)" : "rgba(246, 240, 240, 0.94)",
            borderColor: scrolled ? "rgba(9, 9, 9, 0.15)" : "rgba(9, 9, 9, 0.08)",
            boxShadow: scrolled
              ? "0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)"
              : "0 18px 42px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <a
            href="#home"
            aria-label="Anthic Kumar Singh portfolio home"
            className="mr-3 flex w-30 shrink-0 items-center md:w-33.75 lg:w-37.5 xl:w-41.25 2xl:w-45"
          >
            <Image
              src="/logos/navbar logo.png"
              alt="Anthic Kumar Singh"
              width={150}
              height={30}
              priority
              className="h-full w-auto object-cover"
            />
          </a>

         

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
            {navItems.map((item) => (
              <NavLink key={item.label} label={item.label} href={item.href} />
            ))}
          </div>

          

          <HireBtn />
        </motion.div>
      </nav>

      <nav className="fixed left-0 top-0 z-50 w-full px-4 pt-4 md:hidden" aria-label="Mobile navigation">
        <div className="flex items-center justify-between gap-3">
          <a
            href="#home"
            aria-label="Anthic Kumar Singh portfolio home"
            className="flex h-14 w-[clamp(140px,42vw,172px)] shrink-0 items-center overflow-hidden rounded-full border border-black/10 bg-[#F6F0F0]/94 p-1.5 shadow-[0_6px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            <div className="relative h-full w-full">
              <Image
                src="/logos/navbar logo.png"
                alt="Anthic Kumar Singh"
                fill
                priority
                className="h-full w-full object-cover"
                sizes="(max-width: 770px) 180px, 0px"
              />
            </div>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#F6F0F0]/94 text-black shadow-[0_6px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 rounded-[28px] border border-black/10 bg-[#F6F0F0]/96 px-5 pb-6 pt-5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
            >
              <div className="flex flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-black/8 py-3.5 text-[clamp(1.35rem,6vw,1.8rem)] font-black tracking-[-0.04em] text-black"
                    style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={18} className="text-black/30" />
                  </a>
                ))}

                <div className="pt-6">
                  <HireBtn onClick={() => setMobileOpen(false)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
