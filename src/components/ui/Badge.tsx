import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function Badge({
  icon: Icon,
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "border-blue-200 bg-blue-50 text-blue-800",
    secondary: "border-gray-200 bg-gray-50 text-gray-800", 
    outline: "border-gray-300 bg-transparent text-gray-700"
  };

  return (
    <span className={cn(
      "inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border-2 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm",
      variants[variant],
      className
    )}>
      {Icon && <Icon className="size-3.5 sm:size-4" aria-hidden="true" />}
      {children}
    </span>
  );
}