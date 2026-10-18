'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useBookingCart } from './BookingCartProvider';

type PaymentPreference = 'card' | 'bank_transfer' | 'discuss';
type ContactPreference = 'email' | 'whatsapp' | 'phone';

const inputClass = 'mt-1.5 min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15';
const labelClass = 'block text-xs font-semibold text-stone-700';

export function CheckoutPage() {
  const { items, isReady, storageError, removeTour, clearCart } = useBookingCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryOfResidence: '',
    startDate: '',
    dateFlexibility: 'flexible_few_days',
    adultsCount: 2,
    childrenCount: 0,
    childrenAges: '',
    preferredContact: 'email' as ContactPreference,
    paymentPreference: 'card' as PaymentPreference,
    specialRequests: '',
    privacyConsent: false,
    website_field: '',
  });

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const goForward = () => {
    setError(null);
    if (step === 1) {
      if (form.fullName.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError('Enter your name and a valid email address to continue.');
        return;
      }
      if (form.adultsCount < 1 || form.adultsCount + form.childrenCount > 30) {
        setError('Please enter between 1 and 30 travellers.');
        return;
      }
    }
    if (step === 2 && !form.privacyConsent) {
      setError('Please agree to the privacy notice before continuing.');
      return;
    }
    setStep((current) => Math.min(current + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.privacyConsent || form.fullName.trim().length < 2 || items.length === 0) {
      setError('Please review your details and consent before sending your request.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tours: items.map((item) => item.slug),
        }),
      });
      const data: { success?: boolean; referenceId?: string; message?: string } = await response.json();
      if (!response.ok || !data.success || !data.referenceId) {
        throw new Error(data.message || 'We could not send your booking request. Please try again.');
      }
      setReference(data.referenceId);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'We could not send your request.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return <Container className="py-20 text-center text-sm text-stone-500">Loading your booking…</Container>;
  }

  if (reference) {
    return (
      <div className="min-h-[70vh] bg-stone-50 py-12 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-stone-200 bg-white p-7 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><CheckCircle2 className="h-8 w-8" /></div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Request received</p>
            <h1 className="mt-2 text-3xl font-bold text-[#01411c]">Your journey starts here.</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
              Our team will check availability, travel logistics, and your preferred payment option, then contact you with a confirmed itinerary and itemised quote. Your trip is not booked and no payment has been taken yet.
            </p>
            <div className="mt-7 rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <span className="block text-xs text-stone-500">Booking request reference</span>
              <span className="mt-1 block font-mono text-xl font-bold tracking-wider text-[#01411c]">{reference}</span>
            </div>
            <ol className="mt-7 grid gap-3 text-left sm:grid-cols-3">
              {['We review your dates', 'You receive a confirmed quote', 'Choose payment after approval'].map((label, index) => (
                <li key={label} className="rounded-xl border border-stone-100 p-4 text-xs leading-5 text-stone-600">
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 font-bold text-emerald-900">{index + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
            <Link href="/tours" className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#01411c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#176b3a]">
              Explore more tours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] bg-stone-50 py-16">
        <Container>
          <div className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-[#01411c]">Your trip basket is empty</h1>
            <p className="mt-2 text-sm text-stone-600">Add one or more tours before starting checkout.</p>
            <Link href="/tours" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#01411c] px-5 py-3 text-sm font-semibold text-white">Browse tours <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </Container>
      </div>
    );
  }

  const passengerCount = form.adultsCount + form.childrenCount;
  const totalDays = items.reduce((sum, item) => sum + item.durationDays, 0);
  const pricedItems = items.filter((item) => item.price !== undefined);

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <Container>
        <div className="mx-auto max-w-6xl">
          <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-900">
            <ArrowLeft className="h-4 w-4" /> Back to trip basket
          </Link>
          <div className="mb-8 mt-5">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Booking request</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#01411c] sm:text-4xl">Let&apos;s plan your trip</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Three quick steps to share your plans. You&apos;ll review everything before sending, with no payment taken at this stage.</p>
          </div>

          <div className="mb-7 grid grid-cols-3 gap-2" aria-label="Checkout progress">
            {['Your trip', 'Payment preference', 'Review & send'].map((title, index) => {
              const number = index + 1;
              const active = step === number;
              const complete = step > number;
              return (
                <div key={title} className={`flex items-center gap-2 border-b-2 pb-3 text-[11px] font-semibold sm:text-sm ${active || complete ? 'border-emerald-800 text-emerald-900' : 'border-stone-200 text-stone-400'}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${active || complete ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-500'}`}>
                    {complete ? <Check className="h-4 w-4" /> : number}
                  </span>
                  <span>{title}</span>
                </div>
              );
            })}
          </div>

          {storageError && <p role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">{storageError}</p>}

          <form onSubmit={submitBooking} className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
              {step === 1 && (
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#01411c]">Your details & travel dates</h2>
                    <p className="mt-1 text-xs leading-5 text-stone-500">We&apos;ll use these to check availability and prepare your itinerary.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>Full name *
                      <input autoComplete="name" required minLength={2} maxLength={100} className={inputClass} value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} />
                    </label>
                    <label className={labelClass}>Email address *
                      <input autoComplete="email" type="email" required className={inputClass} value={form.email} onChange={(event) => setField('email', event.target.value)} />
                    </label>
                    <label className={labelClass}>Phone (optional)
                      <input autoComplete="tel" type="tel" maxLength={30} className={inputClass} value={form.phone} onChange={(event) => setField('phone', event.target.value)} />
                    </label>
                    <label className={labelClass}>Country of residence
                      <input autoComplete="country-name" maxLength={80} className={inputClass} value={form.countryOfResidence} onChange={(event) => setField('countryOfResidence', event.target.value)} />
                    </label>
                    <label className={labelClass}>Preferred start date
                      <input type="date" min={new Date().toISOString().slice(0, 10)} className={inputClass} value={form.startDate} onChange={(event) => setField('startDate', event.target.value)} />
                    </label>
                    <label className={labelClass}>Date flexibility
                      <select className={inputClass} value={form.dateFlexibility} onChange={(event) => setField('dateFlexibility', event.target.value)}>
                        <option value="exact">These dates are fixed</option>
                        <option value="flexible_few_days">Flexible by a few days</option>
                        <option value="flexible_month">Flexible within the month</option>
                      </select>
                    </label>
                    <label className={labelClass}>Adults
                      <input type="number" min={1} max={30} required className={inputClass} value={form.adultsCount} onChange={(event) => setField('adultsCount', Number(event.target.value))} />
                    </label>
                    <label className={labelClass}>Children
                      <input type="number" min={0} max={20} className={inputClass} value={form.childrenCount} onChange={(event) => setField('childrenCount', Number(event.target.value))} />
                    </label>
                    {form.childrenCount > 0 && (
                      <label className={`${labelClass} sm:col-span-2`}>Children&apos;s ages
                        <input maxLength={100} placeholder="For example, 6 and 10" className={inputClass} value={form.childrenAges} onChange={(event) => setField('childrenAges', event.target.value)} />
                      </label>
                    )}
                    <fieldset className="sm:col-span-2">
                      <legend className={labelClass}>How should we contact you?</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(['email', 'whatsapp', 'phone'] as const).map((method) => (
                          <label key={method} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-semibold capitalize ${form.preferredContact === method ? 'border-emerald-800 bg-emerald-50 text-emerald-950' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                            <input type="radio" name="preferredContact" className="sr-only" checked={form.preferredContact === method} onChange={() => setField('preferredContact', method)} />
                            {method}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#01411c]">Choose how you&apos;d prefer to pay</h2>
                    <p className="mt-1 text-xs leading-5 text-stone-500">This is a preference only. We&apos;ll confirm the quote first and send payment instructions afterwards.</p>
                  </div>
                  <div className="space-y-3">
                    {([
                      { id: 'card', title: 'Credit or debit card', detail: 'Request Visa or Mastercard; available payment options will be confirmed with your quote.', Icon: CreditCard },
                      { id: 'bank_transfer', title: 'Bank transfer', detail: 'We’ll share verified bank details and payment terms with your quote.', Icon: Banknote },
                      { id: 'discuss', title: 'Discuss payment options', detail: 'Our trip specialist can talk you through the options available for your booking.', Icon: ShieldCheck },
                    ] as const).map(({ id, title, detail, Icon }) => (
                      <label key={id} className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition ${form.paymentPreference === id ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'}`}>
                        <input type="radio" name="paymentPreference" className="mt-1 accent-emerald-800" checked={form.paymentPreference === id} onChange={() => setField('paymentPreference', id)} />
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-900 shadow-sm"><Icon className="h-5 w-5" /></span>
                        <span>
                          <span className="block text-sm font-bold text-stone-900">{title}</span>
                          <span className="mt-1 block text-xs leading-5 text-stone-600">{detail}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-950">
                    <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
                    <p><strong>No card data is collected on this site.</strong> Card-payment availability and instructions will be confirmed with your final itinerary and price.</p>
                  </div>
                  <label className={`${labelClass} mt-5`}>Anything else we should know?
                    <textarea rows={4} maxLength={1500} className={inputClass} placeholder="Dietary needs, accessibility, room preferences, or questions…" value={form.specialRequests} onChange={(event) => setField('specialRequests', event.target.value)} />
                  </label>
                  <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-stone-600">
                    <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-800" checked={form.privacyConsent} onChange={(event) => setField('privacyConsent', event.target.checked)} />
                    <span>I agree that Hunza Expeditions may use my details to review this trip request and contact me about it. *</span>
                  </label>
                </section>
              )}

              {step === 3 && (
                <section>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#01411c]">Review your request</h2>
                    <p className="mt-1 text-xs leading-5 text-stone-500">Check the details below. You can go back to make any changes before sending.</p>
                  </div>
                  <div className="space-y-5">
                    <div className="rounded-xl bg-stone-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">Travellers & dates</h3>
                          <p className="mt-2 text-xs leading-5 text-stone-600">{form.fullName} · {form.email}</p>
                          <p className="text-xs leading-5 text-stone-600">{passengerCount} travellers ({form.adultsCount} adults{form.childrenCount ? `, ${form.childrenCount} children` : ''})</p>
                          <p className="text-xs leading-5 text-stone-600">{form.startDate || 'Dates to be arranged'} · {form.dateFlexibility.replaceAll('_', ' ')}</p>
                        </div>
                        <button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-emerald-900 hover:underline">Edit</button>
                      </div>
                    </div>
                    <div className="rounded-xl bg-stone-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">Payment preference</h3>
                          <p className="mt-2 text-xs capitalize text-stone-600">{form.paymentPreference.replace('_', ' ')}</p>
                          <p className="mt-1 text-xs leading-5 text-stone-500">No payment is due with this request.</p>
                        </div>
                        <button type="button" onClick={() => setStep(2)} className="text-xs font-semibold text-emerald-900 hover:underline">Edit</button>
                      </div>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs leading-5 text-emerald-950">
                      Sending this request does not confirm a booking. We&apos;ll contact you with availability, a final itemised price, cancellation terms, and secure payment instructions.
                    </div>
                    <input
                      aria-hidden="true"
                      autoComplete="off"
                      tabIndex={-1}
                      className="absolute -left-[10000px] h-px w-px"
                      value={form.website_field}
                      onChange={(event) => setField('website_field', event.target.value)}
                    />
                  </div>
                </section>
              )}

              {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-900">{error}</p>}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => step === 1 ? router.push('/cart') : setStep((current) => current - 1)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-stone-600 hover:bg-stone-50">
                  <ArrowLeft className="h-4 w-4" /> {step === 1 ? 'Back to basket' : 'Back'}
                </button>
                {step < 3 ? (
                  <button type="button" onClick={goForward} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#01411c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#176b3a]">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#01411c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#176b3a] disabled:cursor-wait disabled:opacity-60">
                    {isSubmitting ? 'Sending request…' : 'Send booking request'} {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#01411c]">Your trip</h2>
                <Link href="/cart" className="text-xs font-semibold text-emerald-900 hover:underline">Edit basket</Link>
              </div>
              <div className="mt-4 space-y-4">
                {items.map((item) => (
                  <div key={item.slug} className="flex gap-3">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      <Image src={item.imageUrl} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/tours/${item.slug}`} className="line-clamp-2 text-xs font-bold text-stone-900 hover:text-emerald-800">{item.title}</Link>
                      <p className="mt-1 text-[11px] text-stone-500">{item.durationDays} days</p>
                    </div>
                    <button type="button" onClick={() => removeTour(item.slug)} aria-label={`Remove ${item.title}`} className="h-fit rounded p-1 text-stone-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-stone-100 pt-4 text-xs">
                <div className="flex justify-between text-stone-600"><span>Travellers</span><span>{passengerCount}</span></div>
                <div className="flex justify-between text-stone-600"><span>Trip duration*</span><span>{totalDays} days</span></div>
                {pricedItems.map((item) => (
                  <div key={item.slug} className="flex justify-between gap-3 text-stone-600">
                    <span className="truncate">{item.title}</span>
                    <span className="shrink-0">{item.currency} {item.price?.toLocaleString()} / person*</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-stone-100 pt-3 font-bold text-stone-900"><span>Due now</span><span>£0.00</span></div>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-stone-500">*Indicative tour prices and combined duration are for guidance only. Final itinerary and pricing will be confirmed by our team.</p>
              <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-4 text-[11px] text-stone-500">
                <LockKeyhole className="h-3.5 w-3.5 text-emerald-800" /> Your request is private and secure
              </div>
            </aside>
          </form>
        </div>
      </Container>
    </div>
  );
}
