"use client";

import { useMemo, useState } from "react";
import EventCard from "@/app/Components/EventCard";
import EventCarousel from "@/app/Components/EventCarousel";
import { getEventsResult } from "@/features/events/api";
import {
  formatEventDate,
  getEventDay,
  getEventHour,
  getEventMonth,
  getEventWeek,
  getEventYear,
} from "@/features/events/date";
import { getImageUrl, type EventItem } from "@/features/events/types";

const EVENTS_PER_PAGE = 6;

const monthOptions = [
  { label: "Enero", value: "01" },
  { label: "Febrero", value: "02" },
  { label: "Marzo", value: "03" },
  { label: "Abril", value: "04" },
  { label: "Mayo", value: "05" },
  { label: "Junio", value: "06" },
  { label: "Julio", value: "07" },
  { label: "Agosto", value: "08" },
  { label: "Septiembre", value: "09" },
  { label: "Octubre", value: "10" },
  { label: "Noviembre", value: "11" },
  { label: "Diciembre", value: "12" },
];

type Filters = {
  search: string;
  year: string;
  month: string;
  week: string;
  day: string;
  hour: string;
  category: string;
};

const emptyFilters: Filters = {
  search: "",
  year: "",
  month: "",
  week: "",
  day: "",
  hour: "",
  category: "",
};

type EventManagerProps = {
  initialEvents: EventItem[];
  initialLoadError?: string | null;
};

export default function EventManager({
  initialEvents,
  initialLoadError = null,
}: EventManagerProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(initialLoadError);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const years = useMemo(() => {
    const values = events
      .map((event) => getEventYear(event.date))
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [events]);

  const categories = useMemo(() => {
    const values = events.map((event) => event.category).filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !normalizedSearch ||
        event.title.toLowerCase().includes(normalizedSearch) ||
        event.description.toLowerCase().includes(normalizedSearch) ||
        event.location.toLowerCase().includes(normalizedSearch) ||
        event.organizer.toLowerCase().includes(normalizedSearch) ||
        event.category.toLowerCase().includes(normalizedSearch) ||
        event.modality.toLowerCase().includes(normalizedSearch);

      const matchesYear =
        !filters.year || getEventYear(event.date) === filters.year;

      const matchesMonth =
        !filters.month || getEventMonth(event.date) === filters.month;

      const matchesWeek =
        !filters.week || getEventWeek(event.date) === filters.week;

      const matchesDay =
        !filters.day || getEventDay(event.date) === filters.day;

      const matchesHour =
        !filters.hour || getEventHour(event.date) === filters.hour;

      const matchesCategory =
        !filters.category || event.category === filters.category;

      return (
        matchesSearch &&
        matchesYear &&
        matchesMonth &&
        matchesWeek &&
        matchesDay &&
        matchesHour &&
        matchesCategory
      );
    });
  }, [events, filters]);

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

  function clearFilters() {
    setFilters(emptyFilters);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  }

  async function reloadEvents() {
    setIsLoading(true);

    try {
      const result = await getEventsResult();

      setEvents(result.events);
      setLoadError(result.error);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="eventos" className="bg-gray-50 px-6 py-14 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <EventCarousel events={events.slice(0, 6)} onOpen={setSelectedEvent} />

        <div className="mt-12 text-center">
          <h2 className="mt-3 text-3xl font-black text-[#183972] dark:text-slate-100 md:text-5xl">
            Eventos disponibles para la comunidad universitaria
          </h2>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-5 shadow-lg ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-700">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-black text-[#183972] dark:text-slate-100">
                Buscar evento
              </label>

              <input
                type="search"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Buscar por título, lugar, categoría u organizador"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#183972] dark:text-slate-100">
                Año
              </label>

              <select
                value={filters.year}
                onChange={(event) => updateFilter("year", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">Todos</option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#183972] dark:text-slate-100">
                Mes
              </label>

              <select
                value={filters.month}
                onChange={(event) => updateFilter("month", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">Todos</option>

                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#183972] dark:text-slate-100">
                Semana
              </label>

              <input
                type="week"
                value={filters.week}
                onChange={(event) => updateFilter("week", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#183972] dark:text-slate-100">
                Día
              </label>

              <input
                type="date"
                value={filters.day}
                onChange={(event) => updateFilter("day", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#183972] dark:text-slate-100">
                Hora
              </label>

              <select
                value={filters.hour}
                onChange={(event) => updateFilter("hour", event.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">Todas</option>

                {Array.from({ length: 24 }).map((_, index) => {
                  const hour = String(index).padStart(2, "0");

                  return (
                    <option key={hour} value={hour}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#183972] dark:text-slate-100">
                Categoría
              </label>

              <select
                value={filters.category}
                onChange={(event) =>
                  updateFilter("category", event.target.value)
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">Todas</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              Mostrando {paginationStart}-{paginationEnd} de{" "}
              {filteredEvents.length} eventos.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-black text-[#183972] transition hover:bg-gray-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Limpiar filtros
              </button>

              <button
                type="button"
                onClick={reloadEvents}
                disabled={isLoading}
                className="rounded-full bg-[#183972] px-5 py-2 text-sm font-black text-white transition hover:bg-[#8c0327] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-yellow-300 dark:text-[#183972] dark:hover:bg-yellow-200"
              >
                {isLoading ? "Actualizando..." : "Actualizar eventos"}
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-700"
              >
                <div className="h-52 animate-pulse rounded-2xl bg-gray-200 dark:bg-slate-800" />
                <div className="mt-5 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && loadError && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-900/60 dark:bg-red-950/40">
            <h3 className="text-xl font-black text-red-800 dark:text-red-200">
              No se pudo conectar con Payload CMS
            </h3>

            <p className="mt-3 text-sm leading-6 text-red-700 dark:text-red-100">
              {loadError}
            </p>

            <p className="mt-2 text-sm text-red-700 dark:text-red-100">
              Revise que el CMS esté activo y que la API responda.
            </p>
          </div>
        )}

        {!isLoading && !loadError && events.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-2xl font-black text-[#183972] dark:text-slate-100">
              No hay eventos publicados
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-slate-300">
              Cuando el administrador o co-administrador cree eventos
              publicados, aparecerán automáticamente en esta sección.
            </p>
          </div>
        )}

        {!isLoading &&
          !loadError &&
          events.length > 0 &&
          filteredEvents.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-2xl font-black text-[#183972] dark:text-slate-100">
                No hay eventos con esos filtros
              </h3>

              <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
                Intente limpiar los filtros o buscar con otro texto.
              </p>
            </div>
          )}

        {!isLoading && !loadError && filteredEvents.length > 0 && (
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
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-black text-[#183972] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
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
                        className={`h-10 w-10 rounded-full text-sm font-black transition ${isActive
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
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-black text-[#183972] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
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
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm font-black text-gray-500 dark:text-slate-300">
                Este evento no tiene imagen
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-black text-[#183972] shadow-lg transition hover:bg-[#f5c400] dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-yellow-300 dark:hover:text-[#183972]"
            aria-label="Cerrar detalle"
          >
            X
          </button>
        </div>

        <div className="p-6 md:p-8">
          <span className="rounded-full bg-[#183972]/10 px-3 py-1 text-xs font-black uppercase text-[#183972] dark:bg-yellow-300/15 dark:text-yellow-200">
            {event.category}
          </span>

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
              {event.modality}
            </p>
          </div>

          <p className="mt-6 whitespace-pre-line text-base leading-8 text-gray-700 dark:text-slate-300">
            {event.description}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 rounded-full bg-[#183972] px-6 py-3 text-sm font-black text-white transition hover:bg-[#f5c400] hover:text-[#183972] active:bg-[#f5c400] active:text-[#183972] dark:bg-yellow-300 dark:text-[#183972] dark:hover:bg-yellow-200"
          >
            Cerrar detalle
          </button>
        </div>
      </article>
    </div>
  );
}