"use client";

import { useEffect, useRef } from "react";

/**
 * Custom white glowing dot cursor that follows the mouse.
 * Rendered as a fixed-position div with CSS glow.
 */
export default function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{ left: "-100px", top: "-100px" }}
    >
      {/* Inner bright core */}
      <div className="w-3 h-3 rounded-full bg-white" />
      {/* Outer glow */}
      <div className="absolute inset-0 w-3 h-3 rounded-full bg-white blur-md opacity-60" />
    </div>
  );
}
