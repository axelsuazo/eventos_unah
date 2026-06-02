import type { Access } from "payload";

type UserWithRole = {
  role?: "admin" | "co-admin" | "viewer";
};

export type AppRole = NonNullable<UserWithRole["role"]>;

export function getRole(user: unknown): AppRole | undefined {
  if (!user || typeof user !== 'object') return undefined
  // Forzamos la lectura de role incluso si el tipado es estricto
  const u = user as any
  return u.role
}

export function hasAdminAccess(user: unknown) {
  return getRole(user) === "admin";
}

export function hasEditorAccess(user: unknown) {
  const role = getRole(user);
  return role === "admin" || role === "co-admin";
}

export const isAdmin: Access = ({ req: { user } }) => {
  return hasAdminAccess(user);
};

export const isAdminOrCoAdmin: Access = ({ req: { user } }) => {
  return hasEditorAccess(user);
};

export const canReadPublishedEvents: Access = ({ req: { user } }) => {
  if (hasEditorAccess(user)) return true;

  return {
    published: {
      equals: true,
    },
  };
};
