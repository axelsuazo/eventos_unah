import config from '@payload-config'
import { getPayload } from 'payload'

import { signApiToken } from '@/lib/auth/jwt'

type LoginBody = {
  email?: unknown
  password?: unknown
}

type AuthenticatedUser = {
  id?: string | number
  email?: string
  role?: string
}

function normalizeCredential(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  let body: LoginBody

  try {
    body = (await request.json()) as LoginBody
  } catch {
    return Response.json(
      {
        error: 'INVALID_BODY',
        message: 'El body debe enviarse en formato JSON.',
      },
      { status: 400 },
    )
  }

  // No aplicar trim ni lowercase a la contraseña, ya que los espacios y mayúsculas son válidos.
  const email = normalizeCredential(body.email).toLowerCase().trim()
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    return Response.json(
      {
        error: 'MISSING_CREDENTIALS',
        message: 'Debe enviar email y password.',
      },
      { status: 400 },
    )
  }

  try {
    console.log(`[Login Attempt]: Iniciando proceso para ${email}`)
    
    const payload = await getPayload({ config })

    // Verificación de seguridad para desarrollo: ¿Existen usuarios?
    const userCount = await payload.count({ collection: 'users' })
    if (userCount.totalDocs === 0) {
      console.error(`[Login Error]: No hay usuarios registrados en la base de datos. Vaya a /admin para crear el primero.`)
      return Response.json(
        { error: 'NO_USERS_EXIST', message: 'No hay usuarios en la base de datos.' },
        { status: 401 }
      )
    }

    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    
    const user = result.user as unknown as AuthenticatedUser

    if (!user || !user.id || !user.email) {
      console.warn(`[Login Failed]: Payload no devolvió datos de usuario válidos para ${email}`)
      return Response.json(
        {
          error: 'INVALID_CREDENTIALS',
          message: 'Credenciales inválidas.',
        },
        { status: 401 },
      )
    }

    const token = await signApiToken({
      sub: String(user.id),
      email: user.email,
      role: user.role || 'viewer',
    })

    return Response.json({
      token,
      tokenType: 'Bearer',
      expiresIn: '2h',
      user: {
        id: String(user.id),
        email: user.email,
        role: user.role || 'viewer',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthenticationError') {
      console.error(`[Login Error]: Contraseña incorrecta para ${email}`)
    } else {
      console.error('[Login Error]: Error inesperado durante el login:', error)
    }
    return Response.json(
      {
        error: 'INVALID_CREDENTIALS',
        message: 'Credenciales inválidas.',
      },
      { status: 401 },
    )
  }
}
