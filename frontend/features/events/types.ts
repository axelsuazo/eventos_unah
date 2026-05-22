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

export function getImageUrl(image: EventImage) {
  if (!image) return "/UNAH-escudo.png";

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

  return "/UNAH-escudo.png";
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
    modality: event.modality || "Presencial",
    published: event.published ?? true,
    image: event.image || null,
  };
}
