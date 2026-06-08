import config from "@payload-config";
import { getPayload } from "payload";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { verifyJwtRequest } from "@/lib/auth/jwt";

const PLACEHOLDER_IMAGE_URL =
  "/eventos/placeholder-evento.svg";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RelatedCategory =
  | string
  | number
  | {
      id?: string | number;
      name?: string;
      title?: string;
      slug?: string;
    }
  | null
  | undefined;

type RelatedImage =
  | string
  | number
  | {
      id?: string | number;
      url?: string;
      alt?: string;
      filename?: string;
    }
  | null
  | undefined;

type PayloadEventDocument = {
  id?: string | number;
  title?: string;
  description?: string;
  date?: string;
  endDate?: string;
  location?: string;
  category?: RelatedCategory;
  organizer?: string;
  modality?: string;
  published?: boolean;
  image?: RelatedImage;
};

function getCategoryLabel(
  category: RelatedCategory
) {
  if (!category) {
    return "General";
  }

  if (
    typeof category === "string" ||
    typeof category === "number"
  ) {
    return String(category);
  }

  return (
    category.name ||
    category.title ||
    category.slug ||
    "General"
  );
}

function getPublicImage(
  image: RelatedImage,
  title: string
) {
  if (
    !image ||
    typeof image === "string" ||
    typeof image === "number"
  ) {
    return {
      url: PLACEHOLDER_IMAGE_URL,
      alt: `Imagen genérica para ${title}`,
    };
  }

  const url =
    image.url ||
    (
      image.filename
        ? `/api/media/file/${image.filename}`
        : ""
    );

  if (!url) {
    return {
      url: PLACEHOLDER_IMAGE_URL,
      alt: `Imagen genérica para ${title}`,
    };
  }

  return {
    url,
    alt: image.alt || title,
    filename: image.filename || "",
  };
}

function toPublicEvent(
  event: PayloadEventDocument
) {
  const title =
    event.title || "Evento sin título";

  return {
    id: String(event.id || ""),
    title,
    description:
      event.description ||
      "Sin descripción disponible.",
    date: event.date || "",
    endDate: event.endDate || "",
    location: event.location || "UNAH",
    category: getCategoryLabel(event.category),
    organizer: event.organizer || "UNAH",
    modality: event.modality || "presencial",
    published: event.published ?? true,
    image: getPublicImage(
      event.image,
      title
    ),
  };
}

function sortEvents(
  events: ReturnType<typeof toPublicEvent>[]
) {
  const now = new Date();

  return events.sort((a, b) => {
    const dateA =
      new Date(a.date).getTime();

    const dateB =
      new Date(b.date).getTime();

    const safeDateA =
      Number.isNaN(dateA) ? 0 : dateA;

    const safeDateB =
      Number.isNaN(dateB) ? 0 : dateB;

    const aIsPast =
      safeDateA < now.getTime();

    const bIsPast =
      safeDateB < now.getTime();

    if (aIsPast !== bIsPast) {
      return aIsPast ? 1 : -1;
    }

    return safeDateA - safeDateB;
  });
}

export async function GET(
  request: NextRequest
) {
  try {
    const verification =
      await verifyJwtRequest(request);

    if (!verification.ok) {
      return verification.response;
    }

    const payload =
      await getPayload({ config });

    const result = await payload.find({
      collection: "events",
      depth: 1,
      limit: 100,
      sort: "date",
      where: {
        published: {
          equals: true,
        },
      },
    });

    const docs = sortEvents(
      (
        result.docs as PayloadEventDocument[]
      ).map(toPublicEvent)
    );

    return NextResponse.json({
      docs,
      totalDocs: docs.length,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      pagingCounter:
        result.pagingCounter,
      hasPrevPage:
        result.hasPrevPage,
      hasNextPage:
        result.hasNextPage,
      prevPage:
        result.prevPage ?? null,
      nextPage:
        result.nextPage ?? null,
    });
  } catch (error) {
    console.error(
      "[API public/events]:",
      error
    );

    return NextResponse.json(
      {
        error:
          "INTERNAL_SERVER_ERROR",
        message:
          "No se pudieron cargar los eventos.",
      },
      {
        status: 500,
      }
    );
  }
}