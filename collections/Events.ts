import type { CollectionConfig } from "payload";
import { isAdminOrCoAdmin } from "./access";

export const Events: CollectionConfig = {
  slug: "events",

  labels: {
    singular: "Evento",
    plural: "Eventos",
  },

  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "location", "category", "published"],
  },

  access: {
    read: () => true,
    create: isAdminOrCoAdmin,
    update: isAdminOrCoAdmin,
    delete: isAdminOrCoAdmin,
  },

  fields: [
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descripción",
      type: "textarea",
      required: true,
    },
    {
      name: "date",
      label: "Fecha y hora de inicio",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd/MM/yyyy HH:mm",
        },
      },
    },
    {
      name: "endDate",
      label: "Fecha y hora de finalización",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd/MM/yyyy HH:mm",
        },
      },
    },
    {
      name: "location",
      label: "Lugar",
      type: "text",
      required: true,
    },
    {
      name: "image",
      label: "Imagen",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "category",
      label: "Categoría",
      type: "select",
      required: true,
      defaultValue: "Académico",
      options: [
        { label: "Académico", value: "Académico" },
        { label: "Tecnología", value: "Tecnología" },
        { label: "Cultura", value: "Cultura" },
        { label: "Deportes", value: "Deportes" },
        { label: "Investigación", value: "Investigación" },
        { label: "Conferencia", value: "Conferencia" },
        { label: "Taller", value: "Taller" },
        { label: "General", value: "General" },
      ],
    },
    {
      name: "organizer",
      label: "Organizador",
      type: "text",
      defaultValue: "UNAH",
    },
    {
      name: "modality",
      label: "Modalidad",
      type: "select",
      defaultValue: "Presencial",
      options: [
        { label: "Presencial", value: "Presencial" },
        { label: "Híbrido", value: "Híbrido" },
        { label: "Virtual", value: "Virtual" },
      ],
    },
    {
      name: "published",
      label: "Publicado",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Solo los eventos publicados aparecen en el frontend público.",
      },
    },
  ],
};
