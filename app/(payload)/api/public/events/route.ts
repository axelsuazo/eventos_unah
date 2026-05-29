import config from '@payload-config'
import { getPayload } from 'payload'

import { withJwtAuth } from '@/lib/auth/jwt'

const PLACEHOLDER_IMAGE_URL = '/eventos/placeholder-evento.svg'

type RelatedCategory =
  | string
  | number
  | {
      id?: string | number
      name?: string
      title?: string
      slug?: string
    }
  | null
  | undefined

type RelatedImage =
  | string
  | number
  | {
      id?: string | number
      url?: string
      alt?: string
      filename?: string
    }
  | null
  | undefined

type PayloadEventDocument = {
  id?: string | number
  title?: string
  description?: string
  date?: string
  endDate?: string
  location?: string
  category?: RelatedCategory
  organizer?: string
  modality?: string
  published?: boolean
  image?: RelatedImage
}

function getCategoryLabel(category: RelatedCategory) {
  if (!category) {
    return 'General'
  }

  if (typeof category === 'string' || typeof category === 'number') {
    return String(category)
  }

  return category.name || category.title || category.slug || 'General'
}

function getPublicImage(image: RelatedImage, title: string) {
  if (!image || typeof image === 'string' || typeof image === 'number') {
    return {
      url: PLACEHOLDER_IMAGE_URL,
      alt: `Imagen genérica para ${title}`,
    }
  }

  const url = image.url || (image.filename ? `/api/media/file/${image.filename}` : '')

  if (!url) {
    return {
      url: PLACEHOLDER_IMAGE_URL,
      alt: `Imagen genérica para ${title}`,
    }
  }

  return {
    url,
    alt: image.alt || title,
  }
}

function toPublicEvent(event: PayloadEventDocument) {
  const title = event.title || 'Evento sin título'

  return {
    id: String(event.id || ''),
    title,
    description: event.description || 'Sin descripción disponible.',
    date: event.date || '',
    endDate: event.endDate || '',
    location: event.location || 'UNAH',
    category: getCategoryLabel(event.category),
    organizer: event.organizer || 'UNAH',
    modality: event.modality || 'presencial',
    published: event.published ?? true,
    image: getPublicImage(event.image, title),
  }
}

export const GET = withJwtAuth(async () => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 100,
    sort: 'date',
    where: {
      published: {
        equals: true,
      },
    },
  })

  const docs = (result.docs as PayloadEventDocument[]).map(toPublicEvent)

  return Response.json({
    docs,
    totalDocs: docs.length,
    limit: result.limit,
    totalPages: result.totalPages,
    page: result.page,
    pagingCounter: result.pagingCounter,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage ?? null,
    nextPage: result.nextPage ?? null,
  })
})
