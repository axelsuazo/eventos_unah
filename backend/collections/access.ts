import type { Access } from "payload";

type AppUser = {
  role?: "admin" | "coadmin" | "editor" | "user" | null;
};

function getUserRole(user: unknown) {
  const typedUser = user as AppUser | null | undefined;
  return typedUser?.role;
}

export const isLoggedIn: Access = ({ req }) => {
  return Boolean(req.user);
};

export const isAdmin: Access = ({ req }) => {
  if (!req.user) return false;

  const role = getUserRole(req.user);

  /*
    Esto ayuda si tu usuario fue creado antes de agregar el campo role.
    Si no tiene role, temporalmente se trata como admin.
  */
  if (!role) return true;

  return role === "admin";
};

export const isAdminOrCoAdmin: Access = ({ req }) => {
  if (!req.user) return false;

  const role = getUserRole(req.user);


  if (!role) return true;

  return role === "admin" || role === "coadmin";
};

export const canReadPublishedEvents: Access = ({ req }) => {
  if (req.user) {
    return true;
  }

  return {
    published: {
      equals: true,
    },
  };
};