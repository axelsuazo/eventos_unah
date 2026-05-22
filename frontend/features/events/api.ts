import {
  type EventImage,
  type EventItem,
  type EventsLoadResult,
  type PayloadListResponse,
  normalizeEvent,
} from "@/features/events/types";

type PayloadMedia = {
  id?: string | number;
  url?: string;
  alt?: string;
  filename?: string;
};

type PayloadEvent = {
  id?: string | number;
  _id?: string | number;
  title?: string;
  description?: string;
  date?: string;
  endDate?: string;
  location?: string;
  category?: string;
  organizer?: string;
  modality?: string;
  published?: boolean;
  image?: EventImage | PayloadMedia;
};

function getCmsUrl() {
  const rawUrl =
    process.env.CMS_URL ||
    process.env.NEXT_PUBLIC_CMS_URL ||
    "http://localhost:3001";

  return rawUrl.replace(/\/$/, "");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo conectar con Payload CMS.";
}

function mapPayloadEvent(event: PayloadEvent): EventItem {
  return normalizeEvent({
    id: String(event.id || event._id || ""),
    title: event.title,
    description: event.description,
    date: event.date,
    endDate: event.endDate,
    location: event.location,
    category: event.category,
    organizer: event.organizer,
    modality: event.modality,
    published: event.published,
    image: event.image || null,
  });
}

export async function getEventsResult(): Promise<EventsLoadResult> {
  const cmsUrl = getCmsUrl();

  try {
    const url = new URL("/api/events", cmsUrl);

    url.searchParams.set("where[published][equals]", "true");
    url.searchParams.set("sort", "date");
    url.searchParams.set("limit", "100");
    url.searchParams.set("depth", "1");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        events: [],
        error: `Payload respondió con error ${response.status} ${response.statusText}.`,
      };
    }

    const data = (await response.json()) as PayloadListResponse<PayloadEvent>;
    const events = (data.docs || []).map(mapPayloadEvent);

    return {
      events,
      error: null,
    };
  } catch (error) {
    return {
      events: [],
      error: getErrorMessage(error),
    };
  }
}

export async function getEvents(): Promise<EventItem[]> {
  const result = await getEventsResult();
  return result.events;
}
