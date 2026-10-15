import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { HelpCircle, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Hunza Expeditions",
  description:
    "Common questions about traveling to Gilgit-Baltistan: road safety, visas, currency, mobile connectivity, altitude, and booking procedures.",
};

const faqs = [
  {
    q: "How does booking and payment work with Hunza Expeditions?",
    a: "We do not take immediate automated credit card payments online. You begin by submitting an enquiry with your dates, party size, and preferred valleys. Our operational team checks road access, vehicle availability, and hotel confirmations to send you an itemized quotation. Once you approve the itinerary, confirmed arrangements are locked with clear payment terms.",
  },
  {
    q: "Is traveling along the Karakoram Highway safe?",
    a: "The Karakoram Highway (N-35) is a marvel of engineering, paved and maintained year-round through Gilgit and Hunza. However, mountain roads are subject to variable weather and seasonal maintenance. We always allocate contingency buffers in our itineraries and use experienced, defensive mountain drivers.",
  },
  {
    q: "What is the best time of year to visit Hunza Valley?",
    a: "April is celebrated for apricot and cherry blossoms. June through August offers warm summer weather, open high passes, and accessible trekking trails. October is the world-renowned golden autumn season when poplar and apricot trees turn amber and copper. Winter (December to February) is quiet and cold, suitable for valley heritage visits but with some mountain passes closed.",
  },
  {
    q: "What kind of clothing and cultural etiquette should we follow?",
    a: "Gilgit-Baltistan is culturally welcoming, yet traditional and conservative. Modest clothing that covers shoulders and knees is expected in residential villages and around historical shrines. For outdoor exploration, pack sturdy walking shoes, warm fleece layers for cool evenings, high-SPF sunblock, and UV sunglasses.",
  },
  {
    q: "How does mobile connectivity and cash access work?",
    a: "Special communications network (SCOM) provides reliable 4G mobile data across Hunza and Gilgit. International roaming often works intermittently, so local SIM cards are recommended for longer stays. ATMs are available in major towns (Gilgit, Aliabad, Skardu), but carrying sufficient cash in Pakistani Rupees (PKR) is essential for village purchases and rural guesthouses.",
  },
];

export default function FAQPage() {
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
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200/90 p-6 subtle-shadow space-y-2.5"
            >
              <h3 className="font-bold text-base sm:text-lg text-[#12283a]">
                {faq.q}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                {faq.a}
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
