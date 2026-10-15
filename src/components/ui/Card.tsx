import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = "",
  hoverEffect = false,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-stone-200/90 overflow-hidden ${
        hoverEffect
          ? "transition-all duration-200 hover:-translate-y-1 subtle-shadow-hover"
          : "subtle-shadow"
      } ${className}`}
    >
      {children}
    </div>
  );
}
