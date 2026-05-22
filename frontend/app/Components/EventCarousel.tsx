"use client";

import { useEffect, useMemo, useState } from "react";
import type { EventItem } from "@/features/events/types";
import { getImageUrl } from "@/features/events/types";
import { formatEventDate } from "@/features/events/date";

type EventCarouselProps = {
  events: EventItem[];
  onOpen?: (event: EventItem) => void;
};

export default function EventCarousel({ events, onOpen }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validEvents = useMemo(() => events.filter(Boolean), [events]);
  const currentEvent = validEvents[currentIndex] || validEvents[0];

  useEffect(() => {
    if (validEvents.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % validEvents.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [validEvents.length]);

  useEffect(() => {
    if (currentIndex > validEvents.length - 1) {
      setCurrentIndex(0);
    }
  }, [currentIndex, validEvents.length]);

  if (!currentEvent) return null;

  const backgroundImage = getImageUrl(currentEvent.image);

  function previousEvent() {
    setCurrentIndex((index) => (index === 0 ? validEvents.length - 1 : index - 1));
  }

  function nextEvent() {
    setCurrentIndex((index) => (index + 1) % validEvents.length);
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[#183972] p-5 shadow-2xl ring-1 ring-white/20 md:p-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 blur-sm scale-105"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#183972] via-[#183972]/90 to-[#183972]/40" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="text-white">

          <h3 className="mt-5 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            {currentEvent.title}
          </h3>

          <div className="mt-6 grid gap-3 text-sm font-semibold text-blue-50 sm:grid-cols-2">
            <p className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <span className="block text-yellow-200">Fecha y hora</span>
              {formatEventDate(currentEvent.date)}
            </p>
            <p className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
              <span className="block text-yellow-200">Lugar</span>
              {currentEvent.location}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpen?.(currentEvent)}
          className="group overflow-hidden rounded-[1.5rem] bg-white/10 p-2 text-left shadow-2xl ring-1 ring-white/20"
        >
          <img
            src={backgroundImage}
            alt={currentEvent.title}
            className="h-80 w-full rounded-[1.15rem] object-cover transition duration-500 group-hover:scale-[1.03] md:h-[26rem]"
          />
        </button>
      </div>

      <div className="relative mt-6 flex justify-center gap-2">
        {validEvents.map((event, index) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ver evento ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${index === currentIndex ? "w-10 bg-yellow-300" : "w-2.5 bg-white/50 hover:bg-white"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
