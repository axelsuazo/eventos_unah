import type { KeyboardEvent } from "react";
import type { EventItem } from "@/features/events/types";
import { getImageUrl } from "@/features/events/types";
import { formatEventDate } from "@/features/events/date";

type EventCardProps = {
  event: EventItem;
  onOpen: (event: EventItem) => void;
};

export default function EventCard({ event, onOpen }: EventCardProps) {
  function handleKeyDown(keyboardEvent: KeyboardEvent<HTMLElement>) {
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault();
      onOpen(event);
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(event)}
      onKeyDown={handleKeyDown}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#183972]/20 dark:bg-slate-900 dark:ring-slate-700"
      aria-label={`Abrir información del evento ${event.title}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(event.image)}
          alt={event.title}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#183972] shadow-sm dark:bg-slate-950/90 dark:text-slate-100">
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#183972]/10 px-3 py-1 text-xs font-bold text-[#183972] dark:bg-yellow-300/15 dark:text-yellow-200">
            {event.modality}
          </span>

          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            Clic para abrir
          </span>
        </div>

        <h2 className="text-xl font-bold text-[#183972] dark:text-slate-100">
          {event.title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-slate-300">
          {event.description}
        </p>

        <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-slate-300">
          <p>
            <strong>Fecha:</strong> {formatEventDate(event.date)}
          </p>

          <p>
            <strong>Lugar:</strong> {event.location}
          </p>
        </div>

        <div className="mt-auto pt-5 text-sm font-black text-[#183972] transition group-hover:text-[#FDC300] dark:text-yellow-200 ">
          Ver información completa →
        </div>
      </div>
    </article>
  );
}
