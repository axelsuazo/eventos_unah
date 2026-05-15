"use client";

import { useState, useEffect } from "react";
import type { EventItem } from "@/app/data/events";

type EventCarouselProps = {
  events: EventItem[];
  onOpen?: (event: EventItem) => void;
  autoPlayInterval?: number; // en milisegundos, default 5000
};

function formatEventDay(value: string) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-HN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export default function EventCarousel({ 
  events, 
  onOpen,
  autoPlayInterval = 2000 
}: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (events.length === 0) return null;


  useEffect(() => {
    if (isHovered) return; 

    const interval = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % events.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, events.length, autoPlayInterval]);

  const visibleEvents = Array.from(
    { length: Math.min(3, events.length) },
    (_, index) => events[(currentIndex + index) % events.length]
  );

  function previousEvent() {
    setCurrentIndex((index) => (index === 0 ? events.length - 1 : index - 1));
  }

  function nextEvent() {
    setCurrentIndex((index) => (index + 1) % events.length);
  }

  return (
    <div 
      className="rounded-3xl  p-8  "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
    

      <div className="grid gap-5 md:grid-cols-3">
        {visibleEvents.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onOpen?.(event)}
            className="overflow-hidden rounded-3xl bg-gray-50 text-left shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <img
              src={event.image}
              alt={event.title}
              className="h-100 w-full object-cover"
            />

            <div className="p-6">
              <h4 className="text-lg font-bold text-[#183972]">
                {event.title}
              </h4>

              <p className="mt-2 text-sm font-semibold capitalize text-gray-600">
                {formatEventDay(event.date)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}