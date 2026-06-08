import {
  mongooseAdapter,
} from "@payloadcms/db-mongodb";

import {
  vercelBlobStorage,
} from "@payloadcms/storage-vercel-blob";

import {
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import path from "path";
import {
  buildConfig,
} from "payload";

import sharp from "sharp";

import {
  fileURLToPath,
} from "url";

import {
  Categories,
} from "./collections/Categories";

import {
  Events,
} from "./collections/Events";

import {
  Media,
} from "./collections/Media";

import {
  Users,
} from "./collections/Users";

const filename =
  fileURLToPath(import.meta.url);

const dirname =
  path.dirname(filename);

function requireEnvironmentVariable(
  name: string
) {
  const value =
    process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} no está definida.`
    );
  }

  return value;
}

function normalizeUrl(
  value: string | undefined,
  fallback: string
) {
  return (
    value?.trim() || fallback
  ).replace(/\/+$/, "");
}

function splitOrigins(
  value: string | undefined
) {
  return (value || "")
    .split(",")
    .map((origin) =>
      origin
        .trim()
        .replace(/\/+$/, "")
    )
    .filter(Boolean);
}

const databaseUrl =
  requireEnvironmentVariable(
    "DATABASE_URL"
  );

const payloadSecret =
  requireEnvironmentVariable(
    "PAYLOAD_SECRET"
  );

requireEnvironmentVariable(
  "CMS_STATIC_API_TOKEN"
);

const serverURL = normalizeUrl(
  process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
  "http://localhost:3001"
);

const frontendOrigins = [
  ...splitOrigins(
    process.env.FRONTEND_URL
  ),

  ...splitOrigins(
    process.env.NEXT_PUBLIC_FRONTEND_URL
  ),
];

if (frontendOrigins.length === 0) {
  frontendOrigins.push(
    "http://localhost:3000"
  );
}

const vercelURL =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
        .replace(/\/+$/, "")
    : "";

const vercelProductionURL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        .replace(/\/+$/, "")
    : "";

const allowedOrigins =
  Array.from(
    new Set(
      [
        serverURL,
        ...frontendOrigins,
        vercelURL,
        vercelProductionURL,
        "http://localhost:3000",
        "http://localhost:3001",
      ].filter(Boolean)
    )
  );

export default buildConfig({
  serverURL,

  admin: {
    user: Users.slug,

    importMap: {
      baseDir:
        path.resolve(dirname),
    },
  },

  collections: [
    Users,
    Media,
    Categories,
    Events,
  ],

  cors: allowedOrigins,
  csrf: allowedOrigins,

  editor: lexicalEditor(),

  secret: payloadSecret,

  typescript: {
    outputFile:
      path.resolve(
        dirname,
        "payload-types.ts"
      ),
  },

  db: mongooseAdapter({
    url: databaseUrl,
  }),

  plugins: [
    vercelBlobStorage({
      enabled: Boolean(
        process.env
          .BLOB_READ_WRITE_TOKEN
      ),

      collections: {
        media: {
          prefix: "eventos-unah",
        },
      },

      token:
        process.env
          .BLOB_READ_WRITE_TOKEN,
    }),
  ],

  sharp,
});