import type { Access, CollectionConfig } from "payload";
import { isAdmin, isAdminOrCoAdmin } from "./access";

type UserRole = "admin" | "co-admin" | "viewer";

type UserWithRole = {
  id?: string | number;
  role?: UserRole;
};

function getRole(user: unknown): UserRole | undefined {
  return (user as UserWithRole | undefined)?.role;
}

const canUseAdminPanel: Access = ({ req: { user } }) => {
  const role = getRole(user);
  return role === "admin" || role === "co-admin";
};

const canReadUsers: Access = ({ req: { user } }) => {
  if (!user) return false;

  if (getRole(user) === "admin") return true;

  return {
    id: {
      equals: user.id,
    },
  };
};

const canCreateUsers: Access = async ({ req }) => {
  if (getRole(req.user) === "admin") return true;

  const existingUsers = await req.payload.find({
    collection: "users",
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  return existingUsers.totalDocs === 0;
};

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,

  labels: {
    singular: "Usuario",
    plural: "Usuarios",
  },

  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
  },

  access: {
    admin: canUseAdminPanel,
    read: canReadUsers,
    create: canCreateUsers,
    update: isAdmin,
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;

        const existingUsers = await req.payload.find({
          collection: "users",
          depth: 0,
          limit: 1,
          overrideAccess: true,
        });

        const requesterIsAdmin = getRole(req.user) === "admin";

        if (existingUsers.totalDocs === 0) {
          return {
            ...data,
            role: "admin",
          };
        }

        return {
          ...data,
          role: requesterIsAdmin ? data.role || "co-admin" : "viewer",
        };
      },
    ],
  },

  fields: [
    {
      name: "name",
      label: "Nombre",
      type: "text",
    },
    {
      name: "role",
      label: "Rol",
      type: "select",
      required: true,
      defaultValue: "viewer",
      options: [
        { label: "Administrador", value: "admin" },
        { label: "Co-administrador", value: "co-admin" },
        { label: "Visualizador", value: "viewer" },
      ],
      access: {
        create: isAdmin,
        update: isAdmin,
      },
      admin: {
        description:
          "Admin puede gestionar usuarios. Co-admin puede gestionar eventos y medios, pero no usuarios.",
      },
    },
  ],
};
