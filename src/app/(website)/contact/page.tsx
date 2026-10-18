'use client';

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Mail, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Travel Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Re-use safe enquiry pipeline
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferredContact: "email",
          selectedDestinations: ["General Inquiry"],
          specialRequests: `[Subject: ${formData.subject}] ${formData.message}`,
          privacyConsent: true,
          durationDays: 7,
          adultsCount: 1,
          dateFlexibility: "flexible_month",
          budgetCurrency: "USD",
          accommodationStyle: "flexible",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 sm:py-16">
      <Container>
        <Breadcrumbs items={[{ label: "Contact Us" }]} />

        {/* Header */}
        <div className="py-8 border-b border-stone-200/90 mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#12283a]">
            Contact Hunza Expeditions
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
            Have questions about seasonal timing, mountain road conditions, or private journey design? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#12283a]">UK-Based Planning Team</h3>
              <div className="space-y-4 text-sm text-stone-700">
                <p>
                  Our team is based in the United Kingdom and works with trusted local guides and suppliers in Gilgit-Baltistan.
                  Contact us by email or use the enquiry form to plan your trip.
                </p>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#b4532a] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Email Enquiries:</strong>
                    <span>enquiries@hunzaexpeditions.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#b4532a] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Response Times:</strong>
                    <span>We aim to reply within one to two UK business days.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-xs text-stone-600 space-y-2">
              <h4 className="font-bold text-stone-800">Looking for custom itinerary planning?</h4>
              <p>
                If you already have preferred travel dates, group size, and valleys in mind, use our guided multi-step form for a faster quotation.
              </p>
              <Button href="/plan-your-trip" variant="outline" size="sm" className="mt-2 text-xs">
                Open Journey Builder →
              </Button>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 subtle-shadow">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#12283a]">Message Sent Successfully</h3>
                  <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Our UK-based team will review your message and reply via email shortly.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" size="sm">
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-[#12283a]">Send a Direct Message</h3>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a]"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a]"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a]"
                        placeholder="+44 7700 900000"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 block">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a]"
                      >
                        <option value="General Travel Inquiry">General Travel Inquiry</option>
                        <option value="Custom Tour Planning">Custom Tour Planning</option>
                        <option value="Road Access & Weather Advice">Road Access & Weather Advice</option>
                        <option value="Private Departure Request">Private Departure Request</option>
                        <option value="Partnership / Guide Inquiry">Partnership / Guide Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist with your journey to northern Pakistan?"
                      className="w-full p-3.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a]"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    disabled={loading}
                    className="w-full sm:w-auto"
                    icon={<Send className="w-4 h-4 ml-1" />}
                  >
                    {loading ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
