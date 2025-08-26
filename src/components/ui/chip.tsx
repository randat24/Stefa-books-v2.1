"use client";

import { cn } from "@/lib/cn";

export function Chip({
  active,
  count,
  children,
  className,
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  active?: boolean; 
  count?: number; 
}) {
  return (
    <button
      {...p}
      className={cn(
        "h-11 px-4 rounded-full border text-sm transition inline-flex items-center gap-2",
        active
          ? "bg-[--ink] text-white border-[--ink] shadow-soft"
          : "bg-white text-[--ink] border-[--line] hover:bg-black/[.03]",
        className
      )}
    >
      <span>{children}</span>
      {typeof count === "number" && (
        <span className={cn(
          "text-xs rounded-full px-2 py-0.5",
          active ? "bg-white/20" : "bg-black/[.06] text-[--ink]"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
