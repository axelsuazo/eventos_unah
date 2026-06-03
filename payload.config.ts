import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUrl = process.env.DATABASE_URL
const payloadSecret = process.env.PAYLOAD_SECRET

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL no está definida. Revisa el archivo .env.local del CMS.',
  )
}

if (!payloadSecret) {
  throw new Error(
    'PAYLOAD_SECRET no está definido. Revisa el archivo .env.local del CMS.',
  )
}

// Detectar URL de Vercel para evitar errores de CSRF en entornos de preview y producción
const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
const serverURL = (process.env.NEXT_PUBLIC_SERVER_URL || vercelUrl || 'http://localhost:3000').replace(/\/$/, '')
const frontendURL = (process.env.FRONTEND_URL || '').replace(/\/$/, '')

const allowedOrigins = [serverURL, frontendURL, vercelUrl].filter(Boolean)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Categories, Events],

  cors: allowedOrigins,
  csrf: allowedOrigins,

  editor: lexicalEditor(),

  secret: payloadSecret,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: databaseUrl,
  }),

  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: {
          prefix: 'eventos-unah',
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],

  sharp,
})