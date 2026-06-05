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
  const rawUrl = process.env.CMS_URL || process.env.NEXT_PUBLIC_CMS_URL;

  if (!rawUrl) {
    throw new Error(
      "Falta CMS_URL o NEXT_PUBLIC_CMS_URL en las variables de entorno del frontend."
    );
  }

  const url = rawUrl.trim().replace(/\/+$/, "");

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(
      "CMS_URL debe iniciar con http:// o https://. Revisa las variables de entorno del frontend."
    );
  }

  if (process.env.NODE_ENV === "production" && url.includes("localhost")) {
    throw new Error(
      "CMS_URL apunta a localhost en producción. Debe apuntar al backend desplegado en Vercel."
    );
  }

  return url;
}

function getApiToken() {
  const token = process.env.CMS_STATIC_API_TOKEN || process.env.CMS_API_TOKEN;

  if (!token) {
    throw new Error(
      "Falta CMS_STATIC_API_TOKEN o CMS_API_TOKEN en las variables de entorno del frontend."
    );
  }

  return token.trim();
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
  try {
    const cmsUrl = getCmsUrl();
    const token = getApiToken();
    // Token de bypass de Vercel para saltar la protección de despliegue
    const vercelBypassToken = process.env.VERCEL_AUTOMATION_BYPASS_TOKEN;

    const url = new URL("/api/public/events", cmsUrl);

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Si el token de bypass existe, se añade la cabecera requerida por Vercel
    if (vercelBypassToken) {
      headers["x-vercel-protection-bypass"] = vercelBypassToken;
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");

      return {
        events: [],
        error:
          response.status === 404
            ? "No se encontró el endpoint /api/public/events. Verifica que la ruta exista en el backend."
            : `Payload respondió con error ${response.status}: ${
                errorText || response.statusText
              }`,
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