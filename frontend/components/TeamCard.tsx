"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TeamMember } from "@/lib/api";

interface TeamCardProps {
  member: TeamMember;
  index: number;
  onClick: () => void;
}

/** LinkedIn SVG icon */
function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function TeamCard({ member, index, onClick }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-none bg-[#111] border border-[#222] overflow-hidden transition-all duration-300 hover:border-[#444]"
    >
      {/* Photo */}
      <div className="relative w-full aspect-square overflow-hidden bg-black">
        <Image
          src={member.photo_url}
          alt={member.name}
          fill
          className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          unoptimized
        />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-sm font-medium tracking-wide uppercase text-white">
          {member.name}
        </h3>
        <p className="text-xs text-[#D1D5DB] mt-1 tracking-wider">
          {member.role}
        </p>

        {/* Department tag */}
        <span className="inline-block mt-3 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em] text-[#D1D5DB] border border-[#333] rounded-none">
          {member.department}
        </span>

        {/* Bio preview – appears on hover */}
        <p className="text-[11px] text-[#6b7280] mt-3 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {member.bio}
        </p>

        {/* LinkedIn – fades in on hover */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[#6b7280] hover:text-white transition-colors"
            aria-label={`${member.name} LinkedIn`}
          >
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
