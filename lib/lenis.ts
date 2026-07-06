"use client";

import Lenis from "lenis";

export type LenisInstance = Lenis;

let activeLenis: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  activeLenis = lenis;
}

export function getLenisInstance() {
  return activeLenis;
}
