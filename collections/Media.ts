import type { CollectionConfig } from "payload";
import { isAdminOrCoAdmin } from "./access";

const publicRead = () => true;

export const Media: CollectionConfig = {
  slug: "media",

  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "mimeType", "filesize", "createdAt"],
  },

  access: {
    read: publicRead,
    create: isAdminOrCoAdmin,
    update: isAdminOrCoAdmin,
    delete: isAdminOrCoAdmin,
  },

  upload: {
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: "card",
        width: 600,
        height: 400,
        position: "centre",
      },
      {
        name: "hero",
        width: 1200,
        height: 700,
        position: "centre",
      },
    ],
  },

  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
    },
  ],
};