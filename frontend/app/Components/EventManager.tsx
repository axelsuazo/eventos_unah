"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import EventCard from "@/app/Components/EventCard";

import { formatEventDate } from "@/features/events/date";
import {
  getImageUrl,
  getModalityBadgeClass,
  getModalityLabel,
  type EventItem,
} from "@/features/events/types";

const EVENTS_PER_PAGE = 6;

type DateRangeFilter =
  | "all"
  | "today"
  | "tomorrow"
  | "next7days"
  | "thisWeek"
  | "nextWeek"
  | "day"
  | "month";

type Filters = {
  search: string;
  dateRange: DateRangeFilter;
  exactDate: string;
  exactMonth: string;
  category: string;
  modality: string;
  location: string;
};

const emptyFilters: Filters = {
  search: "",
  dateRange: "all",
  exactDate: "",
  exactMonth: "",
  category: "",
  modality: "",
  location: "",
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

  const categoryOptions = useMemo(() => {
    return getUniqueOptions(events.map((event) => event.category));
  }, [events]);

  const modalityOptions = useMemo(() => {
    return getUniqueOptions(events.map((event) => event.modality));
  }, [events]);

  const locationOptions = useMemo(() => {
    return getUniqueOptions(events.map((event) => event.location));
  }, [events]);

  const hasAdvancedFilters =
    filters.dateRange !== "all" ||
    Boolean(filters.exactDate) ||
    Boolean(filters.exactMonth) ||
    Boolean(filters.category) ||
    Boolean(filters.modality) ||
    Boolean(filters.location);

  const showAdvancedFilters =
    Boolean(searchInput.trim()) ||
    Boolean(filters.search.trim()) ||
    hasAdvancedFilters;

  const filteredEvents = useMemo(() => {
    const normalizedSearch = normalizeText(filters.search);

    return events.filter((event) => {
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(event.title).includes(normalizedSearch) ||
        normalizeText(event.description).includes(normalizedSearch) ||
        normalizeText(event.location).includes(normalizedSearch) ||
        normalizeText(event.organizer).includes(normalizedSearch) ||
        normalizeText(event.category).includes(normalizedSearch) ||
        normalizeText(event.modality).includes(normalizedSearch);

      const matchesDate = matchesDateRange(
        event.date,
        filters.dateRange,
        filters.exactDate,
        filters.exactMonth
      );

      const matchesCategory =
        !filters.category || event.category === filters.category;

      const matchesModality =
        !filters.modality || event.modality === filters.modality;

      const matchesLocation =
        !filters.location || event.location === filters.location;

      return (
        matchesSearch &&
        matchesDate &&
        matchesCategory &&
        matchesModality &&
        matchesLocation
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

  function updateFilter<K extends keyof Filters>(name: K, value: Filters[K]) {
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

  function clearFilters() {
    setSearchInput("");
    setFilters(emptyFilters);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  }

  return (
    <section
      id="eventos"
      className="bg-gray-50 px-4 py-10 dark:bg-slate-950 sm:px-6 md:py-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f5c400]">
            Agenda universitaria
          </p>

          <h2 className="mt-3 text-3xl font-black leading-tight text-[#183972] dark:text-slate-100 sm:text-4xl md:text-5xl">
        UNAH Eventos 
          </h2>
        </div>

        <form onSubmit={submitSearch} className="mt-8 w-full">
          <div className="mx-auto w-full max-w-5xl">
            <div className="rounded-[2rem] border border-gray-100 bg-white/90 p-3 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="relative mx-auto flex w-full max-w-2xl items-center">
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Buscar eventos por nombre, lugar, categoría..."
                  className="h-12 w-full min-w-0 rounded-full border border-gray-200 bg-white px-5 pr-14 text-sm font-semibold text-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 sm:px-7 sm:pr-16 sm:text-base"
                />

                <button
                  type="submit"
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#183972] text-white shadow-md transition-all duration-300 hover:bg-[#f5c400] hover:text-[#183972] active:scale-95 dark:bg-yellow-300 dark:text-[#183972] dark:hover:bg-yellow-200 sm:right-1.5"
                  aria-label="Buscar eventos"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m1.1-5.4a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                    />
                  </svg>
                </button>
              </div>

              {showAdvancedFilters && (
                <div className="mt-5 animate-[fadeIn_.35s_ease-in-out] rounded-3xl border border-gray-100 bg-gray-50/90 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <FilterSelect
                      label="Fecha"
                      value={filters.dateRange}
                      onChange={(value) => {
                        const dateRange = value as DateRangeFilter;

                        updateFilter("dateRange", dateRange);

                        if (dateRange !== "day") {
                          updateFilter("exactDate", "");
                        }

                        if (dateRange !== "month") {
                          updateFilter("exactMonth", "");
                        }
                      }}
                      options={[
                        { value: "all", label: "Todas las fechas" },
                        { value: "today", label: "Hoy" },
                        { value: "tomorrow", label: "Mañana" },
                        { value: "next7days", label: "Próximos 7 días" },
                        { value: "thisWeek", label: "Esta semana" },
                        { value: "nextWeek", label: "Próxima semana" },
                        { value: "day", label: "Escoger día" },
                        { value: "month", label: "Escoger mes" },
                      ]}
                    />

                    {filters.dateRange === "day" && (
                      <FilterInput
                        label="Día"
                        type="date"
                        value={filters.exactDate}
                        onChange={(value) => updateFilter("exactDate", value)}
                      />
                    )}

                    {filters.dateRange === "month" && (
                      <FilterInput
                        label="Mes"
                        type="month"
                        value={filters.exactMonth}
                        onChange={(value) => updateFilter("exactMonth", value)}
                      />
                    )}

                    <FilterSelect
                      label="Categoría"
                      value={filters.category}
                      onChange={(value) => updateFilter("category", value)}
                      options={[
                        { value: "", label: "Todas" },
                        ...categoryOptions.map((category) => ({
                          value: category,
                          label: category,
                        })),
                      ]}
                    />

                    <FilterSelect
                      label="Modalidad"
                      value={filters.modality}
                      onChange={(value) => updateFilter("modality", value)}
                      options={[
                        { value: "", label: "Todas" },
                        ...modalityOptions.map((modality) => ({
                          value: modality,
                          label: getModalityLabel(
                            modality as EventItem["modality"]
                          ),
                        })),
                      ]}
                    />

                    <FilterSelect
                      label="Lugar"
                      value={filters.location}
                      onChange={(value) => updateFilter("location", value)}
                      options={[
                        { value: "", label: "Todos" },
                        ...locationOptions.map((location) => ({
                          value: location,
                          label: location,
                        })),
                      ]}
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">
                      {filteredEvents.length} eventos encontrados
                    </p>

                    {(filters.search || hasAdvancedFilters) && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="w-full rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-black text-[#183972] transition hover:bg-[#183972] hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-yellow-300 dark:hover:text-[#183972] sm:w-auto"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-white/70 px-4 py-3 text-center shadow-sm dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
            Mostrando {paginationStart}-{paginationEnd} de{" "}
            {filteredEvents.length} eventos.
          </p>

          {(filters.search || hasAdvancedFilters) && (
            <p className="text-sm font-black text-[#183972] dark:text-yellow-200">
              Filtros aplicados
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
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-10">
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
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-10">
            <h3 className="text-2xl font-black text-[#183972] dark:text-slate-100">
              No hay eventos con esos filtros
            </h3>

            <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
              Cambie la búsqueda o limpie los filtros para ver más eventos.
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
                <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => goToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    className="min-w-[7rem] rounded-full border border-gray-300 px-4 py-2 text-sm font-black text-[#183972] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
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
                    className="min-w-[7rem] rounded-full border border-gray-300 px-4 py-2 text-sm font-black text-[#183972] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-gray-400 dark:text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-700 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterInput({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: "date" | "month";
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-gray-400 dark:text-slate-500">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-700 outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />
    </label>
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
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4 md:p-8"
      onClick={onClose}
    >
      <article
        className="max-h-[92dvh] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 sm:max-w-3xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-800 sm:h-72 md:h-96">
          <img
            src={imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-[#183972] shadow-lg transition hover:bg-[#f5c400] dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-yellow-300 dark:hover:text-[#183972] sm:right-4 sm:top-4"
            aria-label="Cerrar detalle"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(92dvh-12rem)] overflow-y-auto p-4 sm:max-h-[calc(92dvh-18rem)] sm:p-6 md:max-h-[calc(92dvh-24rem)] md:p-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="rounded-full bg-[#183972]/10 px-3 py-1 text-xs font-black uppercase text-[#183972] dark:bg-yellow-300/15 dark:text-yellow-200">
              {event.category}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${getModalityBadgeClass(
                event.modality
              )}`}
            >
              {getModalityLabel(event.modality)}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-black leading-tight text-[#183972] dark:text-slate-100 sm:text-3xl">
            {event.title}
          </h3>

          <div className="mt-5 grid gap-3 text-sm text-gray-700 dark:text-slate-300 sm:grid-cols-2 md:mt-6">
            <InfoBox label="Fecha y hora" value={formatEventDate(event.date)} />
            <InfoBox label="Lugar" value={event.location} />
            <InfoBox label="Organizador" value={event.organizer} />
            <InfoBox
              label="Modalidad"
              value={getModalityLabel(event.modality)}
            />
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-slate-300 sm:mt-6 sm:text-base sm:leading-8">
            {event.description}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-7 w-full rounded-xl bg-[#183972] px-6 py-3 text-sm font-black text-white transition hover:bg-[#f5c400] hover:text-[#183972] active:bg-[#f5c400] active:text-[#183972] dark:bg-yellow-300 dark:text-[#183972] dark:hover:bg-yellow-200 sm:w-auto"
          >
            Cerrar detalle
          </button>
        </div>
      </article>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <p className="rounded-2xl bg-gray-50 p-4 dark:bg-slate-950">
      <strong className="mb-1 block text-[#183972] dark:text-yellow-200">
        {label}
      </strong>
      <span className="break-words">{value}</span>
    </p>
  );
}

function getUniqueOptions(values: string[]) {
  return Array.from(
    new Set(values.filter((value) => Boolean(value && value.trim())))
  ).sort((a, b) => a.localeCompare(b));
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesDateRange(
  eventDate: string,
  dateRange: DateRangeFilter,
  exactDate: string,
  exactMonth: string
) {
  if (dateRange === "all") {
    return true;
  }

  const date = new Date(eventDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const eventDay = startOfDay(date);
  const today = startOfDay(new Date());

  if (dateRange === "today") {
    return isSameDay(eventDay, today);
  }

  if (dateRange === "tomorrow") {
    return isSameDay(eventDay, addDays(today, 1));
  }

  if (dateRange === "next7days") {
    const lastDay = addDays(today, 6);

    return eventDay >= today && eventDay <= lastDay;
  }

  if (dateRange === "thisWeek") {
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);

    return eventDay >= weekStart && eventDay <= weekEnd;
  }

  if (dateRange === "nextWeek") {
    const nextWeekStart = addDays(startOfWeek(today), 7);
    const nextWeekEnd = addDays(endOfWeek(today), 7);

    return eventDay >= nextWeekStart && eventDay <= nextWeekEnd;
  }

  if (dateRange === "day") {
    if (!exactDate) {
      return true;
    }

    const selectedDay = startOfDay(new Date(`${exactDate}T00:00:00`));

    return isSameDay(eventDay, selectedDay);
  }

  if (dateRange === "month") {
    if (!exactMonth) {
      return true;
    }

    const eventYear = date.getFullYear();
    const eventMonth = String(date.getMonth() + 1).padStart(2, "0");
    const eventYearMonth = `${eventYear}-${eventMonth}`;

    return eventYearMonth === exactMonth;
  }

  return true;
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);

  return result;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return firstDate.getTime() === secondDate.getTime();
}

function startOfWeek(date: Date) {
  const result = startOfDay(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);

  return result;
}

function endOfWeek(date: Date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);

  return result;
}