import { type LucideIcon } from "lucide-react";

export function Badge({
  icon: Icon,
  children,
}: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border-2 border-blue-200 bg-blue-50 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-blue-800">
      <Icon className="size-3.5 sm:size-4 text-blue-600" aria-hidden="true" />
      {children}
    </span>
  );
}
