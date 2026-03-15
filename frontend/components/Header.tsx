"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Minimal high-tech site header.
 * Features the corporate logo on the left and navigation links on the right.
 * Uses tracking-widest uppercase typography for a premium feel.
 */
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-black/60 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo_white.png"
            alt="Armatrix Logo"
            width={120}
            height={32}
            className="h-23 w-auto opacity-90 hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Navigation Section */}
        <nav className="flex items-center gap-8 md:gap-12">
          {["CAREERS", "BLOG", "CONTACT"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[10px] md:text-xs tracking-[0.2em] font-medium text-gray-400 hover:text-white transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
