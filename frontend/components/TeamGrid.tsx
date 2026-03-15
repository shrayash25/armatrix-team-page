"use client";

import type { TeamMember } from "@/lib/api";
import TeamCard from "./TeamCard";

interface TeamGridProps {
  members: TeamMember[];
  onSelectMember: (member: TeamMember) => void;
}

/**
 * Responsive team grid.
 * Desktop: 4 cols | Tablet: 2 cols | Mobile: 1 col
 */
export default function TeamGrid({ members, onSelectMember }: TeamGridProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6b7280] text-sm tracking-wider uppercase">
          No team members found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {members.map((member, index) => (
        <TeamCard
          key={member.id}
          member={member}
          index={index}
          onClick={() => onSelectMember(member)}
        />
      ))}
    </div>
  );
}
