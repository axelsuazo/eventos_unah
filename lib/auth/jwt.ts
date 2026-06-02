import { jwtVerify, SignJWT, errors as joseErrors } from 'jose'

export type ApiTokenPayload = {
  sub: string
  email: string
  role: string
}

type JwtVerificationResult =
  | {
      ok: true
      payload: ApiTokenPayload
    }
  | {
      ok: false
      response: Response
    }

const JWT_ALGORITHM = 'HS256'
const TOKEN_EXPIRATION = '2h'

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret || secret.trim().length < 32) {
    throw new Error(
      'JWT_SECRET no está definido o es demasiado corto. Defínalo en .env.local con al menos 32 caracteres.',
    )
  }

  return new TextEncoder().encode(secret)
}

function jsonError(status: number, code: string, message: string) {
  return Response.json(
    {
      error: code,
      message,
    },
    { status },
  )
}

export const jwtErrorResponses = {
  missing: () =>
    jsonError(
      401,
      'TOKEN_MISSING',
      'Token ausente. Envíe el header Authorization: Bearer <token>.',
    ),
  invalid: () =>
    jsonError(
      401,
      'TOKEN_INVALID',
      'Token inválido. Inicie sesión nuevamente y envíe un token válido.',
    ),
  expired: () =>
    jsonError(
      401,
      'TOKEN_EXPIRED',
      'Token expirado. Inicie sesión nuevamente para obtener un token nuevo.',
    ),
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get('authorization')

  if (!authorization) {
    return null
  }

  const parts = authorization.split(' ')

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1].trim()
}

export async function signApiToken(payload: ApiTokenPayload) {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(getJwtSecret())
}

export async function verifyJwtRequest(
  request: Request,
): Promise<JwtVerificationResult> {
  const token = getBearerToken(request)

  if (!token) {
    return {
      ok: false,
      response: jwtErrorResponses.missing(),
    }
  }

  // 1. Verificar si el token es el API_KEY estático (Shared Secret)
  const staticKey = process.env.CMS_STATIC_API_TOKEN
  if (staticKey && token === staticKey) {
    return {
      ok: true,
      payload: {
        sub: 'static-api-client',
        email: 'api-frontend@unah.edu.hn',
        role: 'admin', // El frontend actuará con permisos de admin para ver eventos publicados
      },
    }
  }

  try {
    const result = await jwtVerify(token, getJwtSecret(), {
      algorithms: [JWT_ALGORITHM],
    })

    const payload = result.payload

    if (!payload.sub || !payload.email || !payload.role) {
      return {
        ok: false,
        response: jwtErrorResponses.invalid(),
      }
    }

    return {
      ok: true,
      payload: {
        sub: String(payload.sub),
        email: String(payload.email),
        role: String(payload.role),
      },
    }
  } catch (error) {
    if (error instanceof joseErrors.JWTExpired) {
      return {
        ok: false,
        response: jwtErrorResponses.expired(),
      }
    }

    return {
      ok: false,
      response: jwtErrorResponses.invalid(),
    }
  }
}

export function withJwtAuth<Context = unknown>(
  handler: (
    request: Request,
    context: Context,
    tokenPayload: ApiTokenPayload,
  ) => Response | Promise<Response>,
) {
  return async (request: Request, context: Context) => {
    const verification = await verifyJwtRequest(request)

    if (!verification.ok) {
      return verification.response
    }

    return handler(request, context, verification.payload)
  }
}
