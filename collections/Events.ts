import type { Access, CollectionConfig } from 'payload'
import { isAdminOrCoAdmin, canReadPublishedEvents } from './access'

type EventSiblingData = {
  date?: string | Date | null
}

export const Events: CollectionConfig = {
  slug: 'events',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location', 'category', 'published'],
  },

  access: {
    read: () => true,
    create: isAdminOrCoAdmin,
    update: isAdminOrCoAdmin,
    delete: isAdminOrCoAdmin,
  },

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }

        if (typeof data.title === 'string') {
          data.title = data.title.trim()
        }

        if (typeof data.description === 'string') {
          data.description = data.description.trim()
        }

        if (typeof data.location === 'string') {
          data.location = data.location.trim()
        }

        if (typeof data.organizer === 'string') {
          data.organizer = data.organizer.trim()
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Fecha y hora de inicio',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Fecha y hora de finalización',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      validate: (value, { siblingData }) => {
        const eventData = siblingData as EventSiblingData | undefined

        if (!value || !eventData?.date) {
          return true
        }

        const startDate = new Date(eventData.date)
        const endDate = new Date(value as string | Date)

        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
          return true
        }

        if (endDate < startDate) {
          return 'La fecha de finalización no puede ser menor que la fecha de inicio.'
        }

        return true
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lugar',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Imagen',
      relationTo: 'media',
      required: false,
      admin: {
        description:
          'Si no se asigna imagen, la API mostrará automáticamente la imagen genérica del servidor.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Categoría',
      relationTo: 'categories',
      required: true,
      admin: {
        description:
          'Seleccione una categoría. Puede crear o eliminar categorías desde la colección Categorías del CMS.',
      },
      validate: (value: unknown) => {
        if (!value) {
          return 'La categoría es obligatoria.'
        }

        return true
      },
    },
    {
      name: 'organizer',
      type: 'text',
      label: 'Organizador',
    },
    {
      name: 'modality',
      type: 'select',
      label: 'Modalidad',
      defaultValue: 'presencial',
      options: [
        {
          label: 'Presencial',
          value: 'presencial',
        },
        {
          label: 'Virtual',
          value: 'virtual',
        },
        {
          label: 'Híbrido',
          value: 'hibrido',
        },
      ],
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Publicado',
      defaultValue: true,
    },
  ],
}
