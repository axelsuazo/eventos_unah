import type { EventItem } from "@/app/data/events";

type EventCardProps = {
  event: EventItem;
  onOpen: (event: EventItem) => void;
};

function formatDate(value: string) {
  const [datePart, timePart] = value.split("T");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const months = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  const period = hour >= 12 ? "p. m." : "a. m.";

  let displayHour = hour % 12;
  if (displayHour === 0) {
    displayHour = 12;
  }

  const displayMinute = String(minute).padStart(2, "0");

  return `${day} ${months[month - 1]} ${year}, ${displayHour}:${displayMinute} ${period}`;
}

export default function EventCard({ event, onOpen }: EventCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={event.image}
        alt={event.title}
        className="h-48 w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#183972]/10 px-3 py-1 text-xs font-bold text-[#183972]">
            {event.category}
          </span>

          <span className="text-xs font-semibold text-gray-500">
            {event.modality}
          </span>
        </div>

        <h2 className="text-xl font-bold text-[#183972]">{event.title}</h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
          {event.description}
        </p>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p>
            <strong>Fecha:</strong> {formatDate(event.date)}
          </p>

          <p >
            <strong>Lugar:</strong> {event.location}
          </p>
        </div>
        <br />
        <button
          type="button"
          onClick={() => onOpen(event)}
          className="mt-auto w-full rounded-full bg-[#183972] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f5c400] hover:text-[#183972]"
        >
          Ver contenido completo
        </button>
      </div>
    </article>
  );
}