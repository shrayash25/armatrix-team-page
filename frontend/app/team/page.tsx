"use client";

import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { getTeamMembers, type TeamMember } from "@/lib/api";
import TeamGrid from "@/components/TeamGrid";
import TeamModal from "@/components/TeamModal";
import DepartmentFilter from "@/components/DepartmentFilter";

// Lazy-load the 3D robot scene for performance
const RobotScene = lazy(() => import("@/components/robot/RobotScene"));

/** Monochrome skeleton loader */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-black border border-white/10 overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-square bg-[#0a0a0a]" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-3/4 bg-[#1a1a1a] rounded" />
            <div className="h-2.5 w-1/2 bg-[#1a1a1a] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    getTeamMembers()
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => [...new Set(members.map((m) => m.department))].sort(),
    [members]
  );

  const filtered = useMemo(
    () =>
      selectedDept === "All"
        ? members
        : members.filter((m) => m.department === selectedDept),
    [members, selectedDept]
  );

  return (
    <main className="min-h-screen bg-black">
      {/* ── 3D Hero Section ── */}
      <section className="relative h-[calc(100vh-5rem)] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Robot arm 3D canvas */}
        <Suspense fallback={null}>
          <RobotScene />
        </Suspense>

        {/* Overlay text */}
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#6b7280] mb-6"
          >
            Armatrix Robotics
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-8xl font-light tracking-tight text-white"
          >
            MEET THE TEAM
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-sm md:text-base text-[#6b7280] max-w-md mx-auto tracking-wide"
          >
            The engineers behind Armatrix robotics
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[-120px]"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-12 bg-gradient-to-b from-[#333] to-transparent"
            />
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      {/* ── Team Content ── */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {/* Section header */}
        <div className="py-20 text-center">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#333] mb-4">
            [ TEAM ]
          </p>
          <div className="w-8 h-[1px] bg-[#333] mx-auto" />
        </div>

        {/* Department Filter */}
        {!loading && departments.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <DepartmentFilter
              departments={departments}
              selected={selectedDept}
              onSelect={setSelectedDept}
            />
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && <GridSkeleton />}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-[#6b7280] text-sm tracking-wider uppercase">
              Failed to load team data
            </p>
            <p className="text-[#333] text-xs mt-2 font-mono">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <TeamGrid members={filtered} onSelectMember={setSelectedMember} />
        )}
      </section>

      {/* ── Modal ── */}
      <TeamModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </main>
  );
}
