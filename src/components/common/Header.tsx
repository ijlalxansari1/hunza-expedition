'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, SlidersHorizontal, Mountain } from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isStudio = pathname?.startsWith("/studio");
  if (isStudio) {
    return null; // Don't show public header inside Sanity Studio
  }

  const navLinks = [
    { label: "Destinations", href: "/destinations" },
    { label: "Tours", href: "/tours" },
    { label: "Experiences", href: "/experiences" },
    { label: "Travel Guides", href: "/guides" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Banner with operating note */}
      <div className="bg-[#12283a] text-stone-200 text-xs py-1.5 px-4 text-center font-normal tracking-wide">
        <span>Curated mountain journeys & cultural experiences in Gilgit-Baltistan, Pakistan</span>
        <span className="hidden sm:inline mx-2 text-stone-400">•</span>
        <Link
          href="/plan-your-trip"
          className="hidden sm:inline underline hover:text-white transition-colors"
        >
          Enquire for 2026 custom itineraries
        </Link>
      </div>

      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#12283a] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-[#12283a] flex items-center justify-center text-white shadow-sm group-hover:bg-[#1a3850] transition-colors">
              <Mountain className="w-5 h-5 text-amber-300/90" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#12283a] leading-none">
                HUNZA EXPEDITIONS
              </span>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium mt-1">
                Gilgit-Baltistan • Pakistan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors py-1 ${
                    isActive
                      ? "text-[#12283a] font-semibold border-b-2 border-[#12283a]"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-md border border-stone-200 hover:bg-stone-50 transition-colors"
              title="Open Sanity Content Studio to manage tours, destinations, and enquiries"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span>Studio CMS</span>
            </Link>

            <Button
              href="/plan-your-trip"
              variant="accent"
              size="sm"
              icon={<Compass className="w-4 h-4 ml-1" />}
            >
              Plan Your Trip
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              href="/plan-your-trip"
              variant="accent"
              size="sm"
              className="text-xs px-3 py-1.5"
            >
              Plan Trip
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#12283a] rounded-md"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <Container className="py-5 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-stone-100 text-[#12283a] font-semibold"
                        : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-stone-100 flex flex-col gap-2.5">
              <Button
                href="/plan-your-trip"
                variant="accent"
                className="w-full justify-center"
                onClick={() => setIsOpen(false)}
              >
                Plan a Custom Journey
              </Button>
              <Link
                href="/studio"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 text-xs text-stone-600 hover:text-stone-900 py-2.5 border border-stone-200 rounded-lg hover:bg-stone-50"
              >
                <SlidersHorizontal className="w-4 h-4 text-stone-500" />
                <span>Sanity Studio (CMS Editor)</span>
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
