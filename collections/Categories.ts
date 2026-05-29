import type { Access, CollectionConfig } from 'payload'

const isAdminOrCoAdmin: Access = ({ req }) => {
  const user = req.user as { role?: string } | null | undefined

  return user?.role === 'admin' || user?.role === 'co-admin'
}

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
    defaultColumns: ['name', 'id', 'createdAt'],
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

        if (typeof data.id === 'string') {
          data.id = createSlug(data.id)
        }

        if (!data.id && typeof data.name === 'string') {
          data.id = createSlug(data.name)
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
      name: 'id',
      type: 'text',
      label: 'Identificador',
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
