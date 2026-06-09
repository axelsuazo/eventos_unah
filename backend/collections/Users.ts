import type { CollectionConfig } from "payload";
import { isAdmin, isLoggedIn } from "./access";

export const Users: CollectionConfig = {
  slug: "users",

  auth: true,

  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "createdAt"],
  },

  access: {
    read: isLoggedIn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  fields: [
    {
      name: "role",
      type: "select",
      label: "Rol",
      required: true,
      defaultValue: "admin",
      options: [
        {
          label: "Administrador",
          value: "admin",
        },
        {
          label: "Co-administrador",
          value: "coadmin",
        },
        {
          label: "Editor",
          value: "editor",
        },
        {
          label: "Usuario",
          value: "user",
        },
      ],
      admin: {
        description:
          "El administrador y co-administrador pueden crear eventos, categorías e imágenes.",
      },
    },
  ],
};