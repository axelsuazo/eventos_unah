import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

import { verifyJwtRequest } from '@/lib/auth/jwt'

const payloadAuthPublicPaths = new Set([
  'users/login',
  'users/logout',
  'users/refresh-token',
  'users/forgot-password',
  'users/reset-password',
  'users/first-register',
  'users/me',
])

function getApiPath(request: Request) {
  const url = new URL(request.url)
  return url.pathname.replace(/^\/api\//, '').replace(/^\//, '')
}

function isPublicApiException(request: Request) {
  const path = getApiPath(request)

  return (
    path.startsWith('auth/login') ||
    path.startsWith('media/file/') ||
    payloadAuthPublicPaths.has(path)
  )
}

function withApiProtection<Context = unknown>(
  handler: (request: Request, context: Context) => Response | Promise<Response>,
) {
  return async (request: Request, context: Context) => {
    const path = getApiPath(request)

    // 1. Excepciones públicas (Login, archivos de media, etc.)
    if (isPublicApiException(request)) {
      return handler(request, context)
    }

    // 2. Solo aplicamos la protección estricta de JWT a rutas que empiecen con 'public/'
    // El resto (categories, users, events) usarán la sesión de Payload (Cookies)
    if (!path.startsWith('public/')) {
      return handler(request, context)
    }

    // 3. Verificación de JWT para la API pública
    const verification = await verifyJwtRequest(request)

    if (!verification.ok) {
      return verification.response
    }

    return handler(request, context)
  }
}

export const GET = withApiProtection(REST_GET(config))
export const POST = withApiProtection(REST_POST(config))
export const DELETE = withApiProtection(REST_DELETE(config))
export const PATCH = withApiProtection(REST_PATCH(config))
export const PUT = withApiProtection(REST_PUT(config))
