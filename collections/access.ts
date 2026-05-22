import type { Access } from "payload";

type UserWithRole = {
  role?: "admin" | "co-admin" | "viewer";
};

function getRole(user: unknown) {
  return (user as UserWithRole | undefined)?.role;
}

export const isAdmin: Access = ({ req: { user } }) => {
  return getRole(user) === "admin";
};

export const isAdminOrCoAdmin: Access = ({ req: { user } }) => {
  const role = getRole(user);
  return role === "admin" || role === "co-admin";
};
