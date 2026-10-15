'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, Mail, MapPin, Compass, ShieldCheck } from "lucide-react";
import { Container } from "../ui/Container";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="bg-[#0b1622] text-stone-300 border-t border-stone-800">
      <Container className="py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-amber-300">
                <Mountain className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                HUNZA EXPEDITIONS
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              Helping travellers plan and arrange well-organised journeys through northern Pakistan,
              combining its dramatic mountain landscapes and living heritage with carefully arranged
              experiences involving local communities.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400/90 shrink-0" />
                <span>Karimabad, Hunza Valley, Gilgit-Baltistan, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400/90 shrink-0" />
                <span>enquiries@hunzaexpeditions.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Explore Destinations
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/destinations/hunza-valley" className="hover:text-white transition-colors">
                  Hunza Valley
                </Link>
              </li>
              <li>
                <Link href="/destinations/nagar-valley" className="hover:text-white transition-colors">
                  Nagar Valley
                </Link>
              </li>
              <li>
                <Link href="/destinations/skardu-baltistan" className="hover:text-white transition-colors">
                  Skardu & Baltistan
                </Link>
              </li>
              <li>
                <Link href="/destinations/passu-gojal" className="hover:text-white transition-colors">
                  Passu & Gojal
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-amber-400 hover:underline">
                  All Destinations →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Travel Planning */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              Planning & Tours
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Browse Tours
                </Link>
              </li>
              <li>
                <Link href="/plan-your-trip" className="hover:text-white transition-colors">
                  Custom Journey Builder
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-white transition-colors">
                  Community Experiences
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-white transition-colors">
                  Practical Travel Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Travel FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Practice */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
              About & Values
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Hunza Expeditions
                </Link>
              </li>
              <li>
                <Link href="/responsible-travel" className="hover:text-white transition-colors">
                  Responsible Travel Code
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-xs text-stone-400 hover:text-white underline">
                  Sanity Studio (CMS)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Operational Clarification Note */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-400 leading-normal">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Operational Policy:</strong> Hunza Expeditions operates on a transparent, enquiry-based planning process. We do not process live card transactions without a confirmed, manually reviewed itinerary and verified supplier arrangements.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Mountain Travel Advisory:</strong> High-altitude road conditions along the Karakoram Highway and mountain valleys vary by season. All proposed routes and travel times are estimated and subject to local weather and road maintenance.
            </p>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Hunza Expeditions. All rights reserved. Gilgit-Baltistan, Pakistan.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">
              Terms & Booking Policy
            </Link>
            <Link href="/responsible-travel" className="hover:text-stone-300 transition-colors">
              Responsible Travel
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
