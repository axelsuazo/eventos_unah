"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import EventCard from "@/app/Components/EventCard";
import EventCarousel from "@/app/Components/EventCarousel";
import { formatEventDate } from "@/features/events/date";
import {
  getImageUrl,
  getModalityBadgeClass,
  getModalityLabel,
  type EventItem,
} from "@/features/events/types";

const EVENTS_PER_PAGE = 6;

type Filters = {
  search: string;
};

const emptyFilters: Filters = {
  search: "",
};

type EventManagerProps = {
  initialEvents: EventItem[];
  initialLoadError?: string | null;
};

export default function EventManager({
  initialEvents,
  initialLoadError = null,
}: EventManagerProps) {
  const [events] = useState<EventItem[]>(initialEvents);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [searchInput, setSearchInput] = useState(emptyFilters.search);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [loadError] = useState<string | null>(initialLoadError);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return events.filter((event) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        event.title.toLowerCase().includes(normalizedSearch) ||
        event.description.toLowerCase().includes(normalizedSearch) ||
        event.location.toLowerCase().includes(normalizedSearch) ||
        event.organizer.toLowerCase().includes(normalizedSearch) ||
        event.category.toLowerCase().includes(normalizedSearch) ||
        event.modality.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [events, filters.search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / EVENTS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedEvents = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;

    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, safeCurrentPage]);

  const paginationStart =
    filteredEvents.length === 0
      ? 0
      : (safeCurrentPage - 1) * EVENTS_PER_PAGE + 1;

  const paginationEnd = Math.min(
    safeCurrentPage * EVENTS_PER_PAGE,
    filteredEvents.length
  );

  function updateFilter(name: keyof Filters, value: string) {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));

    setCurrentPage(1);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilter("search", searchInput);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  }

  return (
    <section id="eventos" className="bg-gray-50 px-6 py-12 dark:bg-slate-950 md:py-14">
      <div className="mx-auto max-w-7xl">
        <EventCarousel events={events.slice(0, 6)} onOpen={setSelectedEvent} />

        <div className="mt-10 text-center">
          <h2 className="text-3xl font-black text-[#183972] dark:text-slate-100 md:text-5xl">
            Eventos disponibles para la comunidad universitaria
          </h2>
        </div>

        <form
          onSubmit={submitSearch}
          className="mt-5 rounded-[0.5rem] bg-white p-5 shadow-lg ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-700"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
            

              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Buscar por título, lugar, categoría u organizador"
                className="w-full rounded-[0.5rem] border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-[0.5rem] bg-[#183972] px-6 py-3 text-sm font-black text-white transition hover:bg-[#FFCC00] dark:bg-yellow-300 dark:text-[#183972] dark:hover:bg-yellow-200"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
            Mostrando {paginationStart}-{paginationEnd} de {filteredEvents.length}{" "}
            eventos.
          </p>

          {filters.search && (
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              Búsqueda aplicada: <span className="font-black">{filters.search}</span>
            </p>
          )}
        </div>

        {loadError && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-900/60 dark:bg-red-950/40">
            <h3 className="text-xl font-black text-red-800 dark:text-red-200">
              No se pudo conectar con Payload CMS
            </h3>

            <p className="mt-3 text-sm leading-6 text-red-700 dark:text-red-100">
              {loadError}
            </p>

            <p className="mt-2 text-sm text-red-700 dark:text-red-100">
              Revise que el CMS esté activo y que la API protegida responda.
            </p>
          </div>
        )}

        {!loadError && events.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-2xl font-black text-[#183972] dark:text-slate-100">
              No hay eventos publicados
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-slate-300">
              Cuando el administrador o co-administrador cree eventos publicados,
              aparecerán automáticamente en esta sección.
            </p>
          </div>
        )}

        {!loadError && events.length > 0 && filteredEvents.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-2xl font-black text-[#183972] dark:text-slate-100">
              No hay eventos con esa búsqueda
            </h3>

            <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
              Escriba otro texto en el buscador y presione Buscar.
            </p>
          </div>
        )}

        {!loadError && filteredEvents.length > 0 && (
          <>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onOpen={setSelectedEvent}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-black text-[#183972] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    const isActive = page === safeCurrentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`h-10 w-10 rounded-full text-sm font-black transition ${
                          isActive
                            ? "bg-[#183972] text-white dark:bg-yellow-300 dark:text-[#183972]"
                            : "border border-gray-300 text-[#183972] hover:bg-gray-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => goToPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-black text-[#183972] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}

function EventDetailModal({
  event,
  onClose,
}: {
  event: EventItem;
  onClose: () => void;
}) {
  const imageUrl = getImageUrl(event.image);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <article
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-72 w-full overflow-hidden bg-gray-100 dark:bg-slate-800 md:h-96">
          <img
            src={imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md bg-white px-4 py-2 text-sm font-black text-[#183972] shadow-lg transition hover:bg-[#f5c400] dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-yellow-300 dark:hover:text-[#183972]"
            aria-label="Cerrar detalle"
          >
            X
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#183972]/10 px-3 py-1 text-xs font-black uppercase text-[#183972] dark:bg-yellow-300/15 dark:text-yellow-200">
              {event.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${getModalityBadgeClass(
                event.modality,
              )}`}
            >
              {getModalityLabel(event.modality)}
            </span>
          </div>

          <h3 className="mt-4 text-3xl font-black text-[#183972] dark:text-slate-100">
            {event.title}
          </h3>

          <div className="mt-6 grid gap-3 text-sm text-gray-700 dark:text-slate-300 md:grid-cols-2">
            <p className="rounded-2xl bg-gray-50 p-4 dark:bg-slate-950">
              <strong className="block text-[#183972] dark:text-yellow-200">
                Fecha y hora
              </strong>
              {formatEventDate(event.date)}
            </p>

            <p className="rounded-2xl bg-gray-50 p-4 dark:bg-slate-950">
              <strong className="block text-[#183972] dark:text-yellow-200">
                Lugar
              </strong>
              {event.location}
            </p>

            <p className="rounded-2xl bg-gray-50 p-4 dark:bg-slate-950">
              <strong className="block text-[#183972] dark:text-yellow-200">
                Organizador
              </strong>
              {event.organizer}
            </p>

            <p className="rounded-2xl bg-gray-50 p-4 dark:bg-slate-950">
              <strong className="block text-[#183972] dark:text-yellow-200">
                Modalidad
              </strong>
              {getModalityLabel(event.modality)}
            </p>
          </div>

          <p className="mt-6 whitespace-pre-line text-base leading-8 text-gray-700 dark:text-slate-300">
            {event.description}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 rounded-md bg-[#183972] px-6 py-3 text-sm font-black text-white transition hover:bg-[#f5c400] hover:text-[#183972] active:bg-[#f5c400] active:text-[#183972] dark:bg-yellow-300 dark:text-[#183972] dark:hover:bg-yellow-200"
          >
            Cerrar detalle
          </button>
        </div>
      </article>
    </div>
  );
}
