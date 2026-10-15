import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`py-3 text-xs sm:text-sm text-stone-500 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center hover:text-stone-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1 text-stone-400" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="inline-flex items-center">
              <ChevronRight className="w-3.5 h-3.5 mx-1 text-stone-300" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-stone-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-stone-900" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
