import type { CollectionConfig } from "payload";
import { isAdminOrCoAdmin } from "./access";

const publicRead = () => true;

export const Categories: CollectionConfig = {
  slug: "categories",

  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "createdAt"],
  },

  access: {
    read: publicRead,
    create: isAdminOrCoAdmin,
    update: isAdminOrCoAdmin,
    delete: isAdminOrCoAdmin,
  },

  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      admin: {
        description: "Ejemplo: academico, tecnologia, cultura, deportes.",
      },
    },
  ],
};