'use client';

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";
import { Destination } from "@/types";
import { Button } from "../ui/Button";

interface JourneyBuilderProps {
  destinations: Destination[];
}

export function JourneyBuilder({ destinations }: JourneyBuilderProps) {
  const searchParams = useSearchParams();
  const preSelectedSlug = searchParams ? searchParams.get("destination") : null;
  const preSelectedList = searchParams ? searchParams.get("destinations") : null;

  const initialSelectedDestinations = React.useMemo(() => {
    if (preSelectedList) {
      return preSelectedList.split(",").map((s) => decodeURIComponent(s.trim())).filter(Boolean);
    }
    if (preSelectedSlug) {
      return destinations
        .filter((destination) => destination.slug === preSelectedSlug)
        .map((destination) => destination.name);
    }
    return [];
  }, [preSelectedList, preSelectedSlug, destinations]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Contact
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "email" as "email" | "whatsapp" | "phone",
    countryOfResidence: "",

    // Step 2: Preferences
    startDate: "",
    dateFlexibility: "flexible_few_days" as "exact" | "flexible_few_days" | "flexible_month",
    durationDays: 7,
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: "",
    budgetPerPerson: "",
    budgetCurrency: "USD" as "USD" | "EUR" | "GBP" | "PKR",
    accommodationStyle: "comfort_hotels" as "standard_guesthouse" | "comfort_hotels" | "heritage_boutique" | "flexible",

    // Step 3: Destinations
    selectedDestinations: initialSelectedDestinations,

    // Step 4: Interests
    selectedInterests: [] as string[],

    // Step 5: Special Requests & Consent
    specialRequests: "",
    privacyConsent: false,

    // Anti-spam honeypot
    website_field: "",
  });

  const interestOptions = [
    { id: "heritage", label: "Ancient Forts & Silk Route Heritage", desc: "Baltit, Altit, Shigar, and historical settlements" },
    { id: "hiking", label: "Active Day Hikes & Glacier Walks", desc: "Hopar, Passu, Minapin, and high valley trails" },
    { id: "photography", label: "Landscape & Peak Photography", desc: "Golden hour viewpoints, Passu Cones, Attabad Lake" },
    { id: "village", label: "Village Walks & Local Culture", desc: "Traditional water channels, stone orchards, local artisans" },
    { id: "cooking", label: "Local Food & Apricot Orchard Traditions", desc: "Authentic local culinary practices and seasonal harvests" },
    { id: "scenic", label: "Scenic Road Journey (Karakoram Highway)", desc: "Relaxed vehicular travel with scenic river viewpoints" },
  ];

  const handleDestinationToggle = (destName: string) => {
    setFormData((prev) => {
      const exists = prev.selectedDestinations.includes(destName);
      return {
        ...prev,
        selectedDestinations: exists
          ? prev.selectedDestinations.filter((d) => d !== destName)
          : [...prev.selectedDestinations, destName],
      };
    });
  };

  const handleInterestToggle = (label: string) => {
    setFormData((prev) => {
      const exists = prev.selectedInterests.includes(label);
      return {
        ...prev,
        selectedInterests: exists
          ? prev.selectedInterests.filter((i) => i !== label)
          : [...prev.selectedInterests, label],
      };
    });
  };

  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!formData.fullName.trim() || formData.fullName.length < 2) {
        setErrorMessage("Please enter your full name.");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        return false;
      }
    } else if (currentStep === 2) {
      if (formData.durationDays < 1) {
        setErrorMessage("Duration must be at least 1 day.");
        return false;
      }
      if (formData.adultsCount < 1) {
        setErrorMessage("Please indicate at least 1 adult traveller.");
        return false;
      }
    } else if (currentStep === 3) {
      if (formData.selectedDestinations.length === 0) {
        setErrorMessage("Please select at least one valley or destination you wish to visit.");
        return false;
      }
    } else if (currentStep === 6) {
      if (!formData.privacyConsent) {
        setErrorMessage("Please confirm that you agree to our privacy policy so we can process your enquiry.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit enquiry.");
      }

      setSubmissionSuccess(data.referenceId);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed. Please check your network connection.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION STATE
  if (submissionSuccess) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/90 p-8 sm:p-12 shadow-lg max-w-2xl mx-auto space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Enquiry Received
          </span>
          <h2 className="text-3xl font-bold text-[#12283a]">
            Thank You, {formData.fullName}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Your travel preferences have been logged in our system. Our local team in Gilgit-Baltistan will review your requested valleys, seasonal timing, and road feasibility.
          </p>
        </div>

        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/80 space-y-2 text-left">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Enquiry Reference:</span>
            <span className="font-mono font-bold text-[#12283a] text-sm bg-white px-2 py-0.5 rounded border border-stone-200">
              {submissionSuccess}
            </span>
          </div>
          <div className="text-xs text-stone-600 space-y-1 pt-2 border-t border-stone-200">
            <p><strong>Destinations:</strong> {formData.selectedDestinations.join(", ")}</p>
            <p><strong>Duration:</strong> {formData.durationDays} days | <strong>Party:</strong> {formData.adultsCount} adults{formData.childrenCount > 0 ? `, ${formData.childrenCount} children` : ""}</p>
            <p><strong>Contact Method:</strong> {formData.preferredContact} ({formData.email})</p>
          </div>
        </div>

        <div className="pt-2 text-xs text-stone-500 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-stone-400" />
          <span>Expected review time: typically within 24 to 48 business hours.</span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/destinations" variant="primary" size="md">
            Explore More Destinations
          </Button>
          <Button href="/" variant="outline" size="md">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-md overflow-hidden max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="bg-stone-50 border-b border-stone-200 px-6 py-5">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-stone-600">
          <span>Step {currentStep} of 6</span>
          <span className="text-[#12283a] uppercase tracking-wider">
            {currentStep === 1 && "Traveller Contact"}
            {currentStep === 2 && "Dates & Party"}
            {currentStep === 3 && "Select Destinations"}
            {currentStep === 4 && "Interests & Style"}
            {currentStep === 5 && "Special Requests"}
            {currentStep === 6 && "Review & Submit"}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#12283a] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
        {/* Honeypot field (hidden from real users) */}
        <input
          type="text"
          name="website_field"
          value={formData.website_field}
          onChange={(e) => setFormData({ ...formData, website_field: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CONTACT DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#12283a]">Traveller Information</h3>
              <p className="text-xs sm:text-sm text-stone-600">
                How should our travel planners reach you to discuss your proposed itinerary?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+44 7700 900077"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Preferred Contact Method
                </label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value as "email" | "whatsapp" | "phone" })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Country of Residence (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. United Kingdom, Australia, United States, Pakistan"
                  value={formData.countryOfResidence}
                  onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TRIP PREFERENCES */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#12283a]">Dates, Duration & Party</h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Help us estimate driving buffers, accommodation availability, and seasonal access.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Estimated Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Date Flexibility
                </label>
                <select
                  value={formData.dateFlexibility}
                  onChange={(e) => setFormData({ ...formData, dateFlexibility: e.target.value as "exact" | "flexible_few_days" | "flexible_month" })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                >
                  <option value="flexible_few_days">Flexible by ± few days (Recommended for flights)</option>
                  <option value="exact">Exact fixed dates</option>
                  <option value="flexible_month">Flexible across a chosen month / season</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Approximate Duration (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Number of Adults <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={formData.adultsCount}
                  onChange={(e) => setFormData({ ...formData, adultsCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Children (under 16)
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={formData.childrenCount}
                  onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  Accommodation Style
                </label>
                <select
                  value={formData.accommodationStyle}
                  onChange={(e) => setFormData({ ...formData, accommodationStyle: e.target.value as "standard_guesthouse" | "comfort_hotels" | "heritage_boutique" | "flexible" })}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
                >
                  <option value="comfort_hotels">Comfort Mountain Hotels (En-suite, quality heating)</option>
                  <option value="heritage_boutique">Heritage & Boutique (Restored forts, Serena / Serena-tier where available)</option>
                  <option value="standard_guesthouse">Traditional Guesthouses & Homestays (Authentic local immersion)</option>
                  <option value="flexible">Flexible / Best available per location</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DESTINATIONS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#12283a]">Select Desired Valleys</h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Choose the destinations you would like to include. We will assess driving distances and design a feasible route.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destinations.map((dest) => {
                const isSelected = formData.selectedDestinations.includes(dest.name);
                return (
                  <div
                    key={dest._id}
                    onClick={() => handleDestinationToggle(dest.name)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#12283a]/5 border-[#12283a] ring-2 ring-[#12283a]/20"
                        : "bg-stone-50 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-[#12283a] border-[#12283a] text-white"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#12283a]">{dest.name}</span>
                        <span className="text-[10px] text-stone-500 bg-stone-200/70 px-1.5 py-0.5 rounded">
                          {dest.region}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {dest.shortDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-stone-500 italic bg-amber-50 border border-amber-200/70 p-3.5 rounded-lg">
              Note: Mountain transit between valleys involves spectacular road passages along the Karakoram Highway. Our team will verify connecting road conditions for your dates.
            </div>
          </div>
        )}

        {/* STEP 4: INTERESTS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#12283a]">Interests & Travel Style</h3>
              <p className="text-xs sm:text-sm text-stone-600">
                What matters most to you during this journey?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {interestOptions.map((item) => {
                const isSelected = formData.selectedInterests.includes(item.label);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleInterestToggle(item.label)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#b4532a]/5 border-[#b4532a] ring-2 ring-[#b4532a]/20"
                        : "bg-stone-50 border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-[#b4532a] border-[#b4532a] text-white"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-[#12283a]">{item.label}</span>
                      <p className="text-xs text-stone-600">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: SPECIAL REQUESTS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#12283a]">Special Requests & Accessibility</h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Tell us about dietary needs, mobility considerations, or specific personal milestones.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                rows={5}
                placeholder="e.g. Vegetarian meals preferred, one traveller has knee sensitivity so gentle walks are preferred over steep staircases, interested in visiting a local school or cooperative..."
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full p-4 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12283a] focus:bg-white"
              />
              <p className="text-xs text-stone-500">
                Please do not submit sensitive financial details or passport numbers in this initial form.
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & SUBMIT */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#12283a]">Review Your Enquiry</h3>
              <p className="text-xs sm:text-sm text-stone-600">
                Review your selections before sending. We will confirm receipt with a unique reference code.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 block">Traveller</span>
                  <span className="font-bold text-stone-800">{formData.fullName} ({formData.email})</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Contact Preference</span>
                  <span className="font-medium text-stone-800 capitalize">{formData.preferredContact} {formData.phone && `• ${formData.phone}`}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Duration & Party</span>
                  <span className="font-medium text-stone-800">{formData.durationDays} days • {formData.adultsCount} Adults{formData.childrenCount > 0 ? `, ${formData.childrenCount} Children` : ""}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Accommodation Style</span>
                  <span className="font-medium text-stone-800 capitalize">{formData.accommodationStyle.replace("_", " ")}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-stone-500 block mb-1">Selected Destinations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.selectedDestinations.map((d) => (
                    <span key={d} className="bg-white border border-stone-200 px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#12283a]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {formData.selectedInterests.length > 0 && (
                <div>
                  <span className="text-xs text-stone-500 block mb-1">Interests:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.selectedInterests.map((i) => (
                      <span key={i} className="bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium text-[#b4532a]">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.specialRequests && (
                <div className="pt-2 border-t border-stone-200 text-xs">
                  <span className="text-stone-500 block">Special Notes:</span>
                  <p className="text-stone-700 italic mt-0.5">{formData.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Privacy consent checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="privacyConsent"
                required
                checked={formData.privacyConsent}
                onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                className="w-4 h-4 text-[#12283a] rounded border-stone-300 focus:ring-[#12283a] mt-0.5 cursor-pointer"
              />
              <label htmlFor="privacyConsent" className="text-xs text-stone-600 cursor-pointer leading-normal">
                I understand that this enquiry is submitted for manual review by Hunza Expeditions to prepare a custom itinerary and quotation. No automated payments or bookings are made at this stage.
              </label>
            </div>
          </div>
        )}

        {/* Action Navigation Buttons */}
        <div className="pt-6 border-t border-stone-200 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <Button
              type="button"
              onClick={handlePrev}
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4 mr-1" />}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <Button
              type="button"
              onClick={handleNext}
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isSubmitting}
              icon={<Send className="w-4 h-4 ml-1" />}
            >
              {isSubmitting ? "Submitting Enquiry..." : "Send Journey Enquiry"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
