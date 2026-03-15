"use client";

import { useEffect, useRef } from "react";

/**
 * Custom white glowing dot cursor that follows the mouse.
 * Rendered as a fixed-position div with CSS glow.
 */
export default function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on mobile/touch devices
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center"
      style={{ left: "-100px", top: "-100px" }}
    >
      {/* 
        Inner bright core + Multi-layered box-shadow glow.
        Using box-shadow is much more effective than blur-md for intense glows.
      */}
      <div 
        className="w-2 h-2 rounded-full bg-white relative"
        style={{
          boxShadow: `
            0 0 10px 2px rgba(255, 255, 255, 0.8),
            0 0 20px 4px rgba(255, 255, 255, 0.4),
            0 0 40px 8px rgba(255, 255, 255, 0.2)
          `
        }}
      >
        {/* Subtle breathing outer halo */}
        <div className="absolute inset-[-4px] rounded-full border border-white/20 blur-[2px]" />
      </div>
    </div>
  );
}
