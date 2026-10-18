import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { HelpCircle, Compass } from "lucide-react";
import { getPublishedFAQs } from "@/lib/editorialContent";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Hunza Expeditions",
  description:
    "Common questions about traveling to Gilgit-Baltistan: road safety, visas, currency, mobile connectivity, altitude, and booking procedures.",
};

export const revalidate = 30;

export default async function FAQPage() {
  const faqs = await getPublishedFAQs();
  return (
    <div className="py-8 sm:py-16">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "FAQs" }]} />

        <div className="py-8 border-b border-stone-200/90 mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-[#1f6b85] text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Essential facts, operational policies, and practical advice for planning your trip to northern Pakistan.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-stone-200/90 p-6 subtle-shadow space-y-2.5"
            >
              <h3 className="font-bold text-base sm:text-lg text-[#12283a]">
                {faq.question}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center space-y-4">
          <h3 className="font-bold text-xl text-[#12283a]">Have a question not answered here?</h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Contact our local team directly or begin an enquiry to discuss your specific travel requirements.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button href="/contact" variant="primary" size="md">
              Contact Office
            </Button>
            <Button href="/plan-your-trip" variant="accent" size="md" icon={<Compass className="w-4 h-4 ml-1" />}>
              Build Itinerary
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
