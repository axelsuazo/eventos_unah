import "server-only";

import {
  type EventImage,
  type EventItem,
  type EventsLoadResult,
  type PayloadListResponse,
  normalizeEvent,
} from "@/features/events/types";

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
  image?: EventImage;
};

function getCmsUrl() {
  const rawUrl = process.env.CMS_URL;

  if (!rawUrl) {
    throw new Error(
      "Falta CMS_URL en las variables de entorno del frontend."
    );
  }

  const url = rawUrl.trim().replace(/\/+$/, "");

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(
      "CMS_URL debe iniciar con http:// o https://."
    );
  }

  if (process.env.NODE_ENV === "production" && url.includes("localhost")) {
    throw new Error(
      "CMS_URL apunta a localhost en producción. Debe apuntar al backend desplegado."
    );
  }

  return url;
}

function getApiToken() {
  const token = process.env.CMS_STATIC_API_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "Falta CMS_STATIC_API_TOKEN en las variables de entorno del frontend."
    );
  }

  return token;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.name === "TimeoutError") {
    return "La conexión con Payload CMS excedió el tiempo máximo de espera.";
  }

  return error instanceof Error
    ? error.message
    : "No se pudo conectar con Payload CMS.";
}

async function readResponseError(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = (await response.json().catch(() => null)) as
      | {
          message?: string;
          error?: string;
        }
      | null;

    return data?.message || data?.error || response.statusText;
  }

  const text = await response.text().catch(() => "");

  if (
    response.status === 401 &&
    (
      text.includes("Authentication Required") ||
      text.includes("Vercel Authentication")
    )
  ) {
    return (
      "El dominio configurado en CMS_URL está protegido por Vercel. " +
      "Use el dominio de producción público del backend o configure " +
      "VERCEL_AUTOMATION_BYPASS_SECRET."
    );
  }

  return text.slice(0, 500) || response.statusText;
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
  try {
    const cmsUrl = getCmsUrl();
    const token = getApiToken();

    const vercelBypassSecret =
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();

    const url = new URL("/api/public/events", cmsUrl);

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (vercelBypassSecret) {
      headers["x-vercel-protection-bypass"] =
        vercelBypassSecret;
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      const responseError = await readResponseError(response);

      return {
        events: [],
        error: `Payload respondió con error ${response.status}: ${responseError}`,
      };
    }

    const data =
      (await response.json()) as PayloadListResponse<PayloadEvent>;

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