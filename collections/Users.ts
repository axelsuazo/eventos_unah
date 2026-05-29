import type {
  Access,
  CollectionConfig,
  FieldAccess,
  PayloadRequest,
} from 'payload'

type UserRole = 'admin' | 'co-admin' | 'viewer'

type AuthUser =
  | {
      id?: string | number
      role?: UserRole
    }
  | null
  | undefined

const getUserRole = (req: PayloadRequest): UserRole | undefined => {
  const user = req.user as AuthUser

  return user?.role
}

const isAdminUser = ({ req }: { req: PayloadRequest }): boolean => {
  return getUserRole(req) === 'admin'
}

const isAdminOrCoAdminUser = ({
  req,
}: {
  req: PayloadRequest
}): boolean => {
  const role = getUserRole(req)

  return role === 'admin' || role === 'co-admin'
}

/**
 * IMPORTANTE:
 * access.admin NO debe usar el tipo Access.
 * Debe devolver solamente true o false.
 */
const canUseAdminPanel = ({ req }: { req: PayloadRequest }): boolean => {
  return isAdminOrCoAdminUser({ req })
}

/**
 * Access de colección.
 * Aquí sí se puede usar el tipo Access.
 */
const canReadUsers: Access = ({ req }) => {
  // Los administradores pueden ver a todos
  if (isAdminUser({ req })) return true

  // Los usuarios autenticados pueden ver su propio perfil (necesario para /api/users/me)
  if (req.user) {
    return {
      id: {
        equals: req.user.id,
      },
    }
  }

  return false
}

const canCreateUsers: Access = async ({ req }) => {
  const totalUsers = await req.payload.count({
    collection: 'users',
  })

  if (totalUsers.totalDocs === 0) {
    return true
  }

  return isAdminUser({ req })
}

const canUpdateUsers: Access = ({ req }) => {
  return isAdminUser({ req })
}

const canDeleteUsers: Access = ({ req }) => {
  return isAdminUser({ req })
}


const canReadRoleField: FieldAccess = ({ req }) => {
  return isAdminUser({ req })
}

const canUpdateRoleField: FieldAccess = ({ req }) => {
  return isAdminUser({ req })
}

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
  },

  access: {
    admin: canUseAdminPanel,
    read: canReadUsers,
    create: canCreateUsers,
    update: canUpdateUsers,
    delete: canDeleteUsers,
  },

  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const totalUsers = await req.payload.count({
            collection: 'users',
          })

          if (totalUsers.totalDocs === 0) {
            return {
              ...data,
              role: 'admin',
            }
          }

          return {
            ...data,
            role: data?.role || 'viewer',
          }
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      saveToJWT: true,
      access: {
        read: canReadRoleField,
        create: canUpdateRoleField,
        update: canUpdateRoleField,
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Co-admin',
          value: 'co-admin',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
    },
  ],
}