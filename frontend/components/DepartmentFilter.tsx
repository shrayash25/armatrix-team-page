"use client";

import { motion } from "framer-motion";

interface DepartmentFilterProps {
  departments: string[];
  selected: string;
  onSelect: (department: string) => void;
}

/**
 * Minimal department filter with monochrome pill buttons.
 */
export default function DepartmentFilter({
  departments,
  selected,
  onSelect,
}: DepartmentFilterProps) {
  const all = ["All", ...departments];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {all.map((dept) => {
        const isActive = dept === selected;
        return (
          <motion.button
            key={dept}
            onClick={() => onSelect(dept)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`
              px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] transition-all duration-200 border
              ${
                isActive
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-[#6b7280] border-[#333] hover:border-[#666] hover:text-white"
              }
            `}
          >
            {dept}
          </motion.button>
        );
      })}
    </div>
  );
}
