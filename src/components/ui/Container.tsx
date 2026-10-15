import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}

export function Container({
  children,
  className = "",
  size = "default",
}: ContainerProps) {
  const maxWidths = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-screen-2xl",
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${maxWidths[size]} ${className}`}>
      {children}
    </div>
  );
}
