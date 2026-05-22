import type { CollectionConfig } from "payload";
import { isAdminOrCoAdmin } from "./access";

export const Media: CollectionConfig = {
  slug: "media",

  labels: {
    singular: "Medio",
    plural: "Medios",
  },

  upload: {
    mimeTypes: ["image/*"],
  },

  access: {
    read: () => true,
    create: isAdminOrCoAdmin,
    update: isAdminOrCoAdmin,
    delete: isAdminOrCoAdmin,
  },

  admin: {
    useAsTitle: "alt",
  },

  fields: [
    {
      name: "alt",
      label: "Texto alternativo",
      type: "text",
      required: true,
    },
  ],
};
