'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, SlidersHorizontal, Mountain, ShoppingBag } from "lucide-react";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { useBookingCart } from "@/components/booking/BookingCartProvider";

import { WeatherMarquee } from "./WeatherMarquee";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useBookingCart();

  const navLinks = [
    { label: "Places", href: "/places" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Live Gilgit-Baltistan Weather Marquee */}
      <WeatherMarquee />

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#dce5dc] transition-all">
      {/* Top Banner with operating note */}
      <div className="bg-[#01411c] text-stone-200 text-xs py-1.5 px-4 text-center font-normal tracking-wide">
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
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#176b3a] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-[#01411c] flex items-center justify-center text-white shadow-sm group-hover:bg-[#176b3a] transition-colors">
              <Mountain className="w-5 h-5 text-green-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-[#01411c] leading-none">
                HUNZA EXPEDITIONS
              </span>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium mt-1">
                UK-Based Travel Planning
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
                      ? "text-[#01411c] font-semibold border-b-2 border-[#176b3a]"
                      : "text-stone-600 hover:text-[#01411c]"
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
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-700 transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-900"
              aria-label={`Trip basket${items.length ? `, ${items.length} ${items.length === 1 ? "tour" : "tours"}` : ""}`}
            >
              <ShoppingBag className="h-4 w-4" />
              {items.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#01411c] px-1 text-[10px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#01411c] px-3 py-1.5 rounded-md border border-stone-200 hover:bg-green-50 transition-colors"
              title="Open Payload admin to manage destinations, places, tours, experiences, guides, and enquiries"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-green-700" />
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
            <Link
              href="/cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-700"
              aria-label={`Trip basket${items.length ? `, ${items.length} ${items.length === 1 ? "tour" : "tours"}` : ""}`}
            >
              <ShoppingBag className="h-4 w-4" />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#01411c] px-1 text-[9px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </Link>
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
              className="p-2 text-stone-700 hover:text-[#01411c] focus:outline-none focus:ring-2 focus:ring-[#176b3a] rounded-md"
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
                        ? "bg-green-100 text-[#01411c] font-semibold"
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
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 text-xs text-stone-600 hover:text-[#01411c] py-2.5 border border-stone-200 rounded-lg hover:bg-green-50"
              >
                <SlidersHorizontal className="w-4 h-4 text-green-700" />
                <span>Payload Admin</span>
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
    </>
  );
}
