import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  icon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-[#01411c] text-white hover:bg-[#176b3a] focus:ring-[#176b3a] shadow-sm",
    secondary:
      "bg-stone-100 text-stone-900 hover:bg-stone-200 focus:ring-stone-400",
    outline:
      "border border-stone-300 text-stone-800 hover:bg-stone-50 focus:ring-stone-400",
    ghost:
      "text-stone-700 hover:bg-stone-100 focus:ring-stone-300",
    accent:
      "bg-[#176b3a] text-white hover:bg-[#01411c] focus:ring-[#176b3a] shadow-sm",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
}
