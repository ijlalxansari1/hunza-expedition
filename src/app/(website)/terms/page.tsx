import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Booking Policy | Hunza Expeditions",
  description: "Terms and conditions, booking workflow, cancellation policies, and mountain travel liability disclosures.",
};

export default function TermsPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "Terms & Conditions" }]} />

        <div className="py-8 border-b border-stone-200/90 mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#12283a]">
            Terms of Service & Booking Policy
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm">
            Last Updated: October 2026 • Please review these terms prior to confirming any journey arrangements.
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#12283a]">1. Enquiry-Based Booking Procedure</h2>
            <p>
              Submission of a trip preferences form or enquiry through hunzaexpeditions.com does not constitute a legally binding contract or confirmed booking. An agreement is established only after Hunza Expeditions has issued a formal itemized quotation, the traveller has accepted the itinerary in writing, and the agreed advance deposit has been processed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#12283a]">2. Mountain Road Conditions & Itinerary Flexibility</h2>
            <p>
              Travel in northern Pakistan and along the Karakoram Highway traverses dynamic high-altitude alpine terrain. Road closures resulting from seasonal landslides, snowfall, rockfall clearance, or government road maintenance may necessitate sudden route alterations. Hunza Expeditions will make every reasonable effort to provide alternative itineraries of comparable standard; however, extra expenses incurred by unforeseen natural disruptions are the traveller&apos;s responsibility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#12283a]">3. Mandatory Travel Insurance</h2>
            <p>
              All travellers booking multi-day tours with Hunza Expeditions must possess valid comprehensive travel and medical insurance that includes coverage for high-altitude mountain travel and medical evacuation. Proof of insurance coverage may be requested prior to departure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#12283a]">4. Cancellations & Refunds</h2>
            <p>
              Because hotels and private mountain drivers in Gilgit-Baltistan require advance deposits to secure peak-season dates, cancellations are subject to fee schedules outlined in your specific confirmed quotation document.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
