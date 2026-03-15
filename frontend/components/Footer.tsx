"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Minimal black footer with logo, navigation links, and legal subtext.
 * Follows the high-tech Armatrix aesthetic.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] text-gray-400 py-12 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Logo and Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-8">
          <div className="flex items-center">
            <Image
              src="/Logo_white.png"
              alt="Armatrix Logo"
              width={140}
              height={40}
              className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-sm">
            <Link 
              href="#" 
              className="hover:text-white transition-colors tracking-wider"
            >
              Media Kit
            </Link>
            <Link 
              href="#" 
              className="hover:text-white transition-colors tracking-wider"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Bottom Section: Copyright and Status */}
        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-xs tracking-widest uppercase opacity-60">
            &copy; Armatrix 2026 All Rights Reserved
          </p>
          <p className="text-[10px] tracking-tight opacity-40">
            Products under development, currently not for sale
          </p>
        </div>
      </div>
    </footer>
  );
}
