import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Practical Travel Guides & Advice | Hunza Expeditions",
  description:
    "Factual, realistic guidance for travelling in Gilgit-Baltistan and northern Pakistan: seasons, road access, cultural etiquette, and packing.",
};

const articles = [
  {
    title: "Best Time to Visit Hunza & Gilgit-Baltistan: Seasonal Reality Guide",
    category: "Seasons & Weather",
    excerpt: "A factual month-by-month analysis distinguishing between apricot spring blossoms (April), summer high-pass touring (July-August), and golden poplar autumn (October).",
    readTime: "5 min read",
    imageUrl: "/images/hunza-hero.jpg",
    slug: "best-time-to-visit-hunza",
  },
  {
    title: "Traveling the Karakoram Highway: Access, Flights & Buffer Days",
    category: "Transport & Logistics",
    excerpt: "What to realistically expect when traveling from Islamabad via Gilgit or Skardu. Flight weather contingency rules and defensive mountain driving standards.",
    readTime: "6 min read",
    imageUrl: "/images/passu-cones.jpg",
    slug: "traveling-karakoram-highway-guide",
  },
  {
    title: "Cultural Etiquette, Modesty & Photography in Northern Pakistan",
    category: "Responsible Travel",
    excerpt: "Respectful guidelines for walking through conservative mountain villages, visiting religious shrines, and asking permission before photographing local residents.",
    readTime: "4 min read",
    imageUrl: "/images/baltit-fort.jpg",
    slug: "cultural-etiquette-northern-pakistan",
  },
];

export default function GuidesPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumbs items={[{ label: "Travel Guides" }]} />

        {/* Header */}
        <div className="py-8 border-b border-stone-200/90 mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-[#1f6b85] text-xs font-semibold tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practical Field Knowledge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Travel Guides & Mountain Advice
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
            Honest, verified information to help you prepare for the high Karakorams. We write from real mountain experience, not generic internet summaries.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div
              key={art.slug}
              className="bg-white rounded-xl border border-stone-200/90 overflow-hidden subtle-shadow subtle-shadow-hover transition-all flex flex-col"
            >
              <div className="relative h-52 w-full bg-stone-100">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-white/95 text-stone-800 text-[11px] font-semibold">
                    {art.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="text-xs text-stone-500">{art.readTime}</span>
                  <h3 className="text-lg font-bold text-[#12283a] leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <span className="inline-flex items-center text-xs font-bold text-[#12283a] hover:text-[#b4532a] gap-1">
                    <span>Read full guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
