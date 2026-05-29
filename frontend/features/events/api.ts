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

type LoginResponse = {
  token?: string;
  tokenType?: string;
  expiresIn?: string;
};

function getCmsUrl() {
  const rawUrl =
    process.env.CMS_URL ||
    process.env.NEXT_PUBLIC_CMS_URL ||
    "http://localhost:3001";

  return rawUrl.replace(/\/$/, "");
}

function getApiCredentials() {
  const email = process.env.CMS_API_EMAIL;
  const password = process.env.CMS_API_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Faltan CMS_API_EMAIL y CMS_API_PASSWORD en el entorno del frontend.",
    );
  }

  return { email, password };
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

async function getApiAccessToken(cmsUrl: string) {
  const credentials = getApiCredentials();
  // Usar el endpoint personalizado que genera el token compatible con la protección JWT
  const response = await fetch(`${cmsUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new Error(
      `Error de autenticación (401). Verifique que CMS_API_EMAIL (${credentials.email}) y la contraseña en su .env.local sean correctos y que el usuario exista en el CMS.`
    );
  }

  if (!response.ok) {
    throw new Error(
      `No se pudo iniciar sesión en la API protegida (${response.status}).`,
    );
  }

  const data = (await response.json()) as LoginResponse;

  if (!data.token) {
    throw new Error("La API no devolvió un token JWT.");
  }

  return data.token;
}

export async function getEventsResult(): Promise<EventsLoadResult> {
  const cmsUrl = getCmsUrl();

  try {
    const token = await getApiAccessToken(cmsUrl);
    const url = new URL("/api/public/events", cmsUrl);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
