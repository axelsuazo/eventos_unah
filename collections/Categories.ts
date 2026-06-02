import type { Access, CollectionConfig } from 'payload'
import { isAdminOrCoAdmin } from './access' // Asegúrate de que esta función use req.user correctamente

const publicRead: Access = () => true

function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
  },

  access: {
    read: publicRead,
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

        if (typeof data.name === 'string') {
          data.name = data.name.trim()
        }

        if (typeof data.slug === 'string') {
          data.slug = createSlug(data.slug)
        }

        if (!data.slug && typeof data.name === 'string') {
          data.slug = createSlug(data.name)
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre de la categoría',
      required: true,
      unique: true,
      validate: (value: unknown): string | true => {
        if (typeof value !== 'string' || !value.trim()) {
          return 'El nombre de la categoría es obligatorio.'
        }

        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug / Identificador',
      required: true,
      unique: true,
      admin: {
        description:
          'Se genera automáticamente desde el nombre. Puede editarse si necesita un identificador específico.',
      },
      validate: (value: unknown): string | true => {
        if (typeof value !== 'string' || !value.trim()) {
          return 'El identificador de la categoría es obligatorio.'
        }

        return true
      },
    },
  ],
}
