import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Events } from "./collections/Events";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const payloadSecret =
  process.env.PAYLOAD_SECRET || "eventos-unah-dev-secret-cambiar-en-produccion";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida. Revisa el archivo .env.local del CMS.");
}

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

export default buildConfig({
  serverURL,
  cors: [serverURL, frontendURL],
  csrf: [serverURL, frontendURL],

  routes: {
    admin: "/admin",
    api: "/api",
    graphQL: "/api/graphql",
    graphQLPlayground: "/api/graphql-playground",
  },

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(
        dirname,
        "app",
        "(payload)",
        "admin",
        "importMap.js"
      ),
    },
    meta: {
      titleSuffix: " - Eventos UNAH CMS",
      icons: [
        {
          rel: "icon",
          url: "/UNAH-escudo.png",
        },
      ],
    },
  },

  collections: [Users, Media, Events],

  editor: lexicalEditor(),

  secret: payloadSecret,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: mongooseAdapter({
    url: databaseUrl,
  }),

  sharp,
});
