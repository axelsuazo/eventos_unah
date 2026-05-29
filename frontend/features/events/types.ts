export const categories = [
  "Académico",
  "Tecnología",
  "Cultura",
  "Deportes",
  "Investigación",
  "Conferencia",
  "Taller",
  "General",
];

export type EventImage =
  | string
  | {
      id?: string | number;
      url?: string;
      alt?: string;
      filename?: string;
    }
  | null
  | undefined;

export type EventItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  organizer: string;
  modality: string;
  published: boolean;
  image?: EventImage;
};

export type PayloadListResponse<T> = {
  docs?: T[];
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
};

export type EventsLoadResult = {
  events: EventItem[];
  error: string | null;
};

const fallbackEventImage = "/eventos/placeholder-evento.svg";

function getCmsPublicUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_CMS_URL ||
    process.env.CMS_URL ||
    "http://localhost:3001";

  return rawUrl.replace(/\/$/, "");
}

function withCmsUrl(path: string) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cmsUrl = getCmsPublicUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${cmsUrl}${normalizedPath}`;
}

function normalizeModality(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getImageUrl(image: EventImage) {
  if (!image) return withCmsUrl(fallbackEventImage);

  if (typeof image === "string") {
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    if (image.startsWith("/")) return withCmsUrl(image);
    return withCmsUrl(`/api/media/file/${image}`);
  }

  if (image.url) {
    return image.url.startsWith("/") ? withCmsUrl(image.url) : image.url;
  }

  if (image.filename) {
    return withCmsUrl(`/api/media/file/${image.filename}`);
  }

  return withCmsUrl(fallbackEventImage);
}

export function getModalityLabel(modality: string) {
  const normalized = normalizeModality(modality);

  if (normalized === "virtual") return "Virtual";
  if (normalized === "hibrido") return "Híbrido";

  return "Presencial";
}

export function getModalityBadgeClass(modality: string) {
  const normalized = normalizeModality(modality);

  if (normalized === "virtual") {
    return "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-400/15 dark:text-sky-100 dark:ring-sky-300/30";
  }

  if (normalized === "hibrido") {
    return "bg-violet-100 text-violet-800 ring-violet-200 dark:bg-violet-400/15 dark:text-violet-100 dark:ring-violet-300/30";
  }

  return "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-100 dark:ring-emerald-300/30";
}

export function normalizeEvent(event: Partial<EventItem>): EventItem {
  const title = event.title?.trim() || "Evento sin título";
  const date = event.date || "";

  return {
    id: String(event.id || `${title}-${date}`),
    title,
    category: event.category || "General",
    description: event.description || "Sin descripción disponible.",
    date,
    endDate: event.endDate || "",
    location: event.location || "UNAH",
    organizer: event.organizer || "UNAH",
    modality: event.modality || "presencial",
    published: event.published ?? true,
    image: event.image || null,
  };
}
