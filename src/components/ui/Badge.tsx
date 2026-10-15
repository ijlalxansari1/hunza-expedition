import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "primary" | "accent" | "earth" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3 py-1 text-sm font-medium",
  };

  const variantStyles = {
    neutral: "bg-stone-100 text-stone-700 border border-stone-200/80",
    primary: "bg-[#12283a]/10 text-[#12283a] border border-[#12283a]/20",
    accent: "bg-[#b4532a]/10 text-[#b4532a] border border-[#b4532a]/20",
    earth: "bg-[#2e5a44]/10 text-[#2e5a44] border border-[#2e5a44]/20",
    outline: "border border-stone-300 text-stone-700 bg-white/80",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
