import { timingSafeEqual } from "node:crypto";
import {
  jwtVerify,
  SignJWT,
  errors as joseErrors,
} from "jose";

export type ApiTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

type JwtVerificationResult =
  | {
      ok: true;
      payload: ApiTokenPayload;
    }
  | {
      ok: false;
      response: Response;
    };

const JWT_ALGORITHM = "HS256";
const TOKEN_EXPIRATION = "2h";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim().length < 32) {
    throw new Error(
      "JWT_SECRET no está definido o es demasiado corto. " +
        "Defínalo con al menos 32 caracteres."
    );
  }

  return new TextEncoder().encode(secret);
}

function jsonError(
  status: number,
  code: string,
  message: string
) {
  return Response.json(
    {
      error: code,
      message,
    },
    {
      status,
    }
  );
}

export const jwtErrorResponses = {
  missing: () =>
    jsonError(
      401,
      "TOKEN_MISSING",
      "Token ausente. Envíe el header Authorization: Bearer <token>."
    ),

  invalid: () =>
    jsonError(
      401,
      "TOKEN_INVALID",
      "Token inválido. Inicie sesión nuevamente y envíe un token válido."
    ),

  expired: () =>
    jsonError(
      401,
      "TOKEN_EXPIRED",
      "Token expirado. Inicie sesión nuevamente para obtener un token nuevo."
    ),
};

function getBearerToken(request: Request) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token, ...extraParts] =
    authorization.trim().split(/\s+/);

  if (
    scheme?.toLowerCase() !== "bearer" ||
    !token ||
    extraParts.length > 0
  ) {
    return null;
  }

  return token.trim();
}

function secretsMatch(
  received: string,
  expected: string
) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    expectedBuffer
  );
}

export async function signApiToken(
  payload: ApiTokenPayload
) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({
      alg: JWT_ALGORITHM,
    })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(getJwtSecret());
}

export async function verifyJwtRequest(
  request: Request
): Promise<JwtVerificationResult> {
  const token = getBearerToken(request);

  if (!token) {
    return {
      ok: false,
      response: jwtErrorResponses.missing(),
    };
  }

  const staticKey =
    process.env.CMS_STATIC_API_TOKEN?.trim();

  if (
    staticKey &&
    secretsMatch(token, staticKey)
  ) {
    return {
      ok: true,
      payload: {
        sub: "static-api-client",
        email: "api-frontend@unah.edu.hn",
        role: "public-reader",
      },
    };
  }

  try {
    const result = await jwtVerify(
      token,
      getJwtSecret(),
      {
        algorithms: [JWT_ALGORITHM],
      }
    );

    const payload = result.payload;

    if (
      !payload.sub ||
      !payload.email ||
      !payload.role
    ) {
      return {
        ok: false,
        response: jwtErrorResponses.invalid(),
      };
    }

    return {
      ok: true,
      payload: {
        sub: String(payload.sub),
        email: String(payload.email),
        role: String(payload.role),
      },
    };
  } catch (error) {
    if (error instanceof joseErrors.JWTExpired) {
      return {
        ok: false,
        response: jwtErrorResponses.expired(),
      };
    }

    return {
      ok: false,
      response: jwtErrorResponses.invalid(),
    };
  }
}

export function withJwtAuth<Context = unknown>(
  handler: (
    request: Request,
    context: Context,
    tokenPayload: ApiTokenPayload
  ) => Response | Promise<Response>
) {
  return async (
    request: Request,
    context: Context
  ) => {
    const verification =
      await verifyJwtRequest(request);

    if (!verification.ok) {
      return verification.response;
    }

    return handler(
      request,
      context,
      verification.payload
    );
  };
}