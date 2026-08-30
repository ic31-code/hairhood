"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { BookingBarber, ServiceListing } from "../../sanity/lib/queries";
import { bookingDays, randomReference, slotsForDay } from "../lib/booking";
import { ActionButton, Button, ServiceRow, Tag } from "./ui";

type Step = "barber" | "service" | "addons" | "time" | "details" | "review" | "done" | "declined";

const STEP_TITLES: Record<Step, string> = {
  barber: "Choose a barber",
  service: "Choose a service",
  addons: "Add-ons",
  time: "Pick a date & time",
  details: "Your details",
  review: "Review & confirm",
  done: "You're in.",
  declined: "Can't book online",
};

const STEP_ORDER: Step[] = ["barber", "service", "addons", "time", "details", "review"];

type BookState = {
  step: Step;
  history: Step[];
  filterServiceId: string | null;
  barberId: string | null;
  serviceId: string | null;
  addOnIds: string[];
  day: number;
  time: string | null;
  name: string;
  phone: string;
  email: string;
  timeConflict: boolean;
  altTimes: string[];
  ref: string | null;
};

function initialState(initialServiceId: string | null, initialBarberId: string | null): BookState {
  return {
    step: initialBarberId ? "service" : "barber",
    history: [],
    filterServiceId: initialServiceId,
    barberId: initialBarberId,
    serviceId: null,
    addOnIds: [],
    day: 0,
    time: null,
    name: "",
    phone: "",
    email: "",
    timeConflict: false,
    altTimes: [],
    ref: null,
  };
}

export function BookingFlow({
  services,
  barbers,
  initialServiceId,
  initialBarberId,
}: {
  services: ServiceListing[];
  barbers: BookingBarber[];
  initialServiceId: string | null;
  initialBarberId: string | null;
}) {
  const router = useRouter();
  const [book, setBook] = useState<BookState>(() => initialState(initialServiceId, initialBarberId));

  const serviceById = useMemo(() => new Map(services.map((s) => [s._id, s])), [services]);

  function pricingFor(barberId: string, serviceId: string) {
    return barbers.find((b) => b._id === barberId)?.pricing?.find((p) => p.serviceId === serviceId);
  }

  function eligibleBarbers(serviceId: string): BookingBarber[] {
    const priced = barbers.filter((b) => b.pricing?.some((p) => p.serviceId === serviceId));
    return priced.length > 0 ? priced : barbers;
  }

  function minPrice(serviceId: string): number | null {
    const priced = barbers
      .map((b) => pricingFor(b._id, serviceId)?.price)
      .filter((p): p is number => typeof p === "number");
    return priced.length > 0 ? Math.min(...priced) : null;
  }

  function priceAndDuration(barberId: string | null, serviceId: string): { price: string; duration: string } {
    const service = serviceById.get(serviceId);
    if (barberId && barberId !== "any") {
      const p = pricingFor(barberId, serviceId);
      if (p) return { price: `£${p.price}`, duration: `${p.durationMinutes} min` };
    }
    const min = minPrice(serviceId);
    if (min !== null) return { price: `from £${min}`, duration: "varies by barber" };
    return { price: service?.displayPrice ?? "", duration: service?.durationRange ?? "" };
  }

  function eligibleAddOns(serviceId: string, barberId: string | null) {
    const service = serviceById.get(serviceId);
    if (!service?.addOns?.length) return [];
    if (!barberId || barberId === "any") {
      const elig = eligibleBarbers(serviceId).map((b) => b._id);
      return service.addOns.filter((a) => a.eligibleBarberIds.some((id) => elig.includes(id)));
    }
    return service.addOns.filter((a) => a.eligibleBarberIds.includes(barberId));
  }

  function resolvedBarberName(): string {
    if (book.barberId && book.barberId !== "any") {
      return barbers.find((b) => b._id === book.barberId)?.name ?? "—";
    }
    if (!book.serviceId) return "—";
    const elig = eligibleBarbers(book.serviceId);
    const name = elig[0]?.name ?? "—";
    return book.barberId === "any" ? `First available (${name})` : name;
  }

  function goTo(step: Step) {
    setBook((s) => ({ ...s, step, history: [...s.history, s.step] }));
  }

  function back() {
    if (book.history.length === 0) {
      router.push("/");
      return;
    }
    setBook((s) => {
      const h = [...s.history];
      const prev = h.pop();
      if (!prev) return s;
      return { ...s, step: prev, history: h };
    });
  }

  function pickBarber(barberId: string) {
    if (book.filterServiceId) {
      const hasAddons = eligibleAddOns(book.filterServiceId, barberId).length > 0;
      setBook((s) => ({
        ...s,
        barberId,
        serviceId: book.filterServiceId,
        history: [...s.history, "barber"],
        step: hasAddons ? "addons" : "time",
      }));
    } else {
      setBook((s) => ({ ...s, barberId, history: [...s.history, "barber"], step: "service" }));
    }
  }

  function pickService(serviceId: string) {
    const hasAddons = eligibleAddOns(serviceId, book.barberId).length > 0;
    setBook((s) => ({
      ...s,
      serviceId,
      addOnIds: [],
      history: [...s.history, "service"],
      step: hasAddons ? "addons" : "time",
    }));
  }

  function toggleAddOn(id: string) {
    setBook((s) => ({
      ...s,
      addOnIds: s.addOnIds.includes(id) ? s.addOnIds.filter((x) => x !== id) : [...s.addOnIds, id],
    }));
  }

  function confirmBooking() {
    if (!book.timeConflict && Math.random() < 0.25) {
      const alts = ["09:45", "13:30", "16:30"].filter((t) => t !== book.time);
      setBook((s) => ({ ...s, timeConflict: true, altTimes: alts }));
      return;
    }
    if (Math.random() < 0.12) {
      setBook((s) => ({ ...s, history: [...s.history, "review"], step: "declined" }));
      return;
    }
    setBook((s) => ({ ...s, step: "done", ref: randomReference() }));
  }

  const days = bookingDays();
  const currentDay = days[book.day];
  const closedToday = currentDay?.weekday === "Sunday";
  const slots = slotsForDay(book.day, closedToday);
  const hasSlots = slots.some((s) => !s.taken);

  const barberChoices = book.filterServiceId ? eligibleBarbers(book.filterServiceId) : barbers;
  const hasAnyOption = !book.filterServiceId || eligibleBarbers(book.filterServiceId).length > 0;

  const availableServices = book.barberId && book.barberId !== "any"
    ? services.filter((s) => barbers.find((b) => b._id === book.barberId)?.pricing?.some((p) => p.serviceId === s._id))
    : services;

  const addOnChoices = book.serviceId ? eligibleAddOns(book.serviceId, book.barberId) : [];
  const basePrice = book.serviceId
    ? (book.barberId && book.barberId !== "any" ? pricingFor(book.barberId, book.serviceId)?.price : null) ??
      minPrice(book.serviceId) ??
      0
    : 0;
  const addOnsTotal = book.addOnIds.reduce((sum, id) => {
    const addon = services.flatMap((s) => s.addOns ?? []).find((a) => a._id === id);
    return sum + (addon?.price ?? 0);
  }, 0);
  const runningTotal = basePrice + addOnsTotal;

  const stepIdx = STEP_ORDER.indexOf(book.step);
  const progress =
    book.step === "done" || book.step === "declined"
      ? "100%"
      : `${Math.round(((stepIdx + 1) / STEP_ORDER.length) * 100)}%`;

  const showNav = ["addons", "time", "details", "review"].includes(book.step);
  const nextLabel =
    book.step === "details" ? "Review booking" : book.step === "review" ? "Confirm booking" : "Continue";
  const nextDisabled =
    book.step === "time"
      ? !book.time
      : book.step === "details"
      ? !book.name.trim() || !book.phone.trim()
      : book.step === "review"
      ? book.timeConflict
      : false;

  function next() {
    if (book.step === "addons") goTo("time");
    else if (book.step === "time") goTo("details");
    else if (book.step === "details") goTo("review");
    else if (book.step === "review") confirmBooking();
  }

  return (
    <main>
      <section className="hh-inverse bg-black px-5 pt-6 pb-6">
        <button onClick={back} className="hh-back-link">
          ← Back
        </button>
        <span className="hh-eyebrow mt-3.5 block">Book a chair</span>
        <h1 className="hh-display mt-2 text-[clamp(32px,10vw,44px)] leading-[.9] uppercase text-white">
          {STEP_TITLES[book.step]}
        </h1>
        <div className="relative mt-4 h-[3px] bg-[var(--hh-ink-700)]">
          <i
            className="absolute inset-y-0 left-0 block bg-[var(--hh-brass-500)] transition-[width] duration-200"
            style={{ width: progress }}
          />
        </div>
      </section>

      <section className="bg-[var(--hh-bone-050)] px-5 pt-6 pb-10">
        {book.step === "barber" && (
          <div className="grid grid-cols-2 gap-3">
            {hasAnyOption && (
              <button
                onClick={() => pickBarber("any")}
                className="flex flex-col border border-[var(--border-hairline,rgba(0,0,0,.12))] text-left"
              >
                <div className="flex aspect-[3/4] items-end bg-[var(--hh-ink-800)] p-2.5">
                  <span className="hh-ui text-[9px] uppercase tracking-[.1em] text-[var(--hh-ink-300)]">
                    Any barber
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 p-3">
                  <div className="hh-ui text-sm uppercase tracking-[.02em]">Any barber</div>
                  <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    First free chair
                  </div>
                  <div className="hh-ui mt-1.5 bg-[var(--hh-black)] py-2.5 text-center text-[10px] uppercase tracking-[.06em] text-white">
                    Choose
                  </div>
                </div>
              </button>
            )}
            {barberChoices.map((b) => (
              <button
                key={b._id}
                onClick={() => pickBarber(b._id)}
                className="flex flex-col border border-[var(--border-hairline,rgba(0,0,0,.12))] text-left"
              >
                <div className="flex aspect-[3/4] items-end bg-[var(--hh-bone-100)] p-2.5">
                  <span className="hh-ui text-[9px] uppercase tracking-[.1em]" style={{ color: "var(--text-muted)" }}>
                    {b.name} photo
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 p-3">
                  <div className="hh-ui text-sm uppercase tracking-[.02em]">{b.name}</div>
                  {b.note && (
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {b.note}
                    </div>
                  )}
                  <div className="hh-ui mt-1.5 bg-[var(--hh-black)] py-2.5 text-center text-[10px] uppercase tracking-[.06em] text-white">
                    Choose
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {book.step === "service" && (
          <div className="flex flex-col">
            {availableServices.map((s) => {
              const { price, duration } = priceAndDuration(book.barberId, s._id);
              return (
                <ServiceRow key={s._id} name={s.name} duration={duration} price={price} onClick={() => pickService(s._id)} />
              );
            })}
          </div>
        )}

        {book.step === "addons" && (
          <div>
            <p className="mb-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
              Optional — skip if you don&apos;t need them.
            </p>
            <div className="flex flex-col">
              {addOnChoices.map((a) => {
                const selected = book.addOnIds.includes(a._id);
                return (
                  <button
                    key={a._id}
                    onClick={() => toggleAddOn(a._id)}
                    className="flex items-center justify-between gap-3 border-t border-[var(--border-hairline,rgba(0,0,0,.12))] py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-5 w-5 shrink-0 border-[1.5px] border-[var(--hh-black)]"
                        style={{ background: selected ? "var(--hh-black)" : "transparent" }}
                      />
                      <div className="hh-ui text-sm uppercase tracking-[.02em]">{a.name}</div>
                    </div>
                    <div className="hh-ui text-sm">+£{a.price}</div>
                  </button>
                );
              })}
            </div>
            <div className="hh-ui mt-5 flex justify-between border-t-2 border-[var(--hh-black)] pt-3 text-[13px] uppercase tracking-[.02em]">
              <span>Running total</span>
              <span>£{runningTotal}</span>
            </div>
          </div>
        )}

        {book.step === "time" && (
          <div>
            <span className="hh-eyebrow">Pick a day</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {days.map((d) => (
                <Tag key={d.index} selected={book.day === d.index} onClick={() => setBook((s) => ({ ...s, day: d.index, time: null }))}>
                  {d.label}
                </Tag>
              ))}
            </div>
            <div className="mt-7 border-t-2 border-[var(--hh-black)] pt-4">
              <span className="hh-eyebrow">Pick a time</span>
              {hasSlots ? (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.taken}
                      onClick={() => setBook((s) => ({ ...s, time: slot.time }))}
                      className={`hh-ui h-10 text-[13px] uppercase tracking-[.02em] transition-colors ${
                        slot.taken
                          ? "cursor-not-allowed border border-[var(--hh-ink-100)] text-[var(--text-subtle)]"
                          : book.time === slot.time
                          ? "border border-[var(--hh-black)] bg-[var(--hh-black)] text-white"
                          : "border border-[var(--hh-ink-100)] text-[var(--hh-black)]"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  Nothing left on this day. Try tomorrow.
                </p>
              )}
            </div>
          </div>
        )}

        {book.step === "details" && (
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="hh-eyebrow">Name</span>
              <input
                value={book.name}
                onChange={(e) => setBook((s) => ({ ...s, name: e.target.value }))}
                placeholder="Your name"
                className="h-11 border border-[var(--hh-ink-100)] bg-white px-3 text-[16px]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="hh-eyebrow">Mobile</span>
              <input
                value={book.phone}
                onChange={(e) => setBook((s) => ({ ...s, phone: e.target.value }))}
                type="tel"
                inputMode="tel"
                placeholder="07…"
                className="h-11 border border-[var(--hh-ink-100)] bg-white px-3 text-[16px]"
              />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                We&apos;ll text you the day before.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="hh-eyebrow">Email (optional)</span>
              <input
                value={book.email}
                onChange={(e) => setBook((s) => ({ ...s, email: e.target.value }))}
                type="email"
                placeholder="you@email.com"
                className="h-11 border border-[var(--hh-ink-100)] bg-white px-3 text-[16px]"
              />
            </label>
          </div>
        )}

        {book.step === "review" && (
          <div>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between border-t-2 border-[var(--hh-black)] pt-3">
                <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                  Barber
                </span>
                <span className="hh-ui text-[13px] uppercase">{resolvedBarberName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                  Service
                </span>
                <span className="hh-ui text-[13px] uppercase">
                  {book.serviceId ? serviceById.get(book.serviceId)?.name : "—"}
                </span>
              </div>
              {book.addOnIds.length > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    Add-ons
                  </span>
                  <span className="hh-ui text-right text-[13px] uppercase">
                    {addOnChoices
                      .filter((a) => book.addOnIds.includes(a._id))
                      .map((a) => a.name)
                      .join(", ")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                  When
                </span>
                <span className="hh-ui text-[13px] uppercase">
                  {[currentDay?.label, book.time].filter(Boolean).join(" · ")}
                </span>
              </div>
              <div className="mt-1.5 flex justify-between border-t-2 border-[var(--hh-black)] pt-3">
                <span className="hh-ui text-sm uppercase tracking-[.02em]">Total (in-shop)</span>
                <span className="hh-ui text-xl">£{runningTotal}</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                Payment is taken in the shop. This just holds your chair.
              </p>
            </div>

            {book.timeConflict && (
              <div className="mt-6 border-t-2 border-[var(--hh-black)] pt-3.5">
                <div className="hh-ui text-[13px] uppercase tracking-[.02em]">That time just got taken</div>
                <p className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  Nearest times still open:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {book.altTimes.map((t) => (
                    <Tag key={t} onClick={() => setBook((s) => ({ ...s, time: t, timeConflict: false, altTimes: [] }))}>
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {book.step === "done" && (
          <div>
            <div className="hh-script text-[clamp(30px,8vw,40px)] leading-[1.05] text-[var(--hh-black)]">
              Welcome to my hood
            </div>
            <p className="mt-4 text-[15px] leading-normal" style={{ color: "var(--text-body)" }}>
              {[currentDay?.label, book.time].filter(Boolean).join(" · ")} with {resolvedBarberName()}. We&apos;ll
              text you the day before.
            </p>
            <div className="hh-ui mt-4 border-t-2 border-[var(--hh-black)] pt-3 text-[13px] uppercase tracking-[.02em]" style={{ color: "var(--text-muted)" }}>
              Reference <span className="text-[var(--hh-black)]">{book.ref}</span>
            </div>
            <div className="mt-7 flex flex-col gap-3">
              <Button href="/" full>
                Back to the shop
              </Button>
              <ActionButton variant="secondary" full onClick={() => setBook(initialState(null, null))}>
                Book another
              </ActionButton>
            </div>
          </div>
        )}

        {book.step === "declined" && (
          <div>
            <div className="border-t-2 border-[var(--hh-black)] pt-3.5">
              <div className="hh-ui text-sm uppercase tracking-[.02em]">Unable to complete this booking online</div>
              <p className="mt-2.5 text-sm leading-normal" style={{ color: "var(--text-body)" }}>
                Please call the shop to finish booking your chair.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="tel:+447307453917" full>
                Call the shop
              </Button>
              <Button href="/" variant="secondary" full>
                Back to the shop
              </Button>
            </div>
          </div>
        )}

        {showNav && (
          <div className="mt-8 flex flex-col gap-3">
            <ActionButton size="lg" full disabled={nextDisabled} onClick={next}>
              {nextLabel}
            </ActionButton>
            {book.step === "addons" && (
              <ActionButton variant="ghost" full onClick={() => goTo("time")}>
                Skip
              </ActionButton>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
