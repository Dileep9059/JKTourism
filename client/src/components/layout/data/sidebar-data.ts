import {
  IconDatabasePlus,
  IconEyePlus,
  IconLayoutDashboard,
  IconMessage,
  IconNotification,
  IconPlus,
  IconSettings,
  IconSubtask,
  IconTool,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'
import useAuth from '@/hooks/useAuth'
import type { AuthType } from '@/context/AuthProvider'

const ROLES = {
  MASTER_ADMIN: "ROLE_MASTER_ADMIN",
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  DISTRICT_ADMIN: "ROLE_DISTRICT_ADMIN",
  TEHSILDAR: "ROLE_TEHSILDAR",
  NAIB_TEHSILDAR: "ROLE_NAIB_TEHSILDAR",
  PATWARI: "ROLE_PATWARI"
}

const roleDashboardMap: { [key: string]: string } = {
  [ROLES.MASTER_ADMIN]: '/masterAdmin',
  [ROLES.SUPER_ADMIN]: '/superAdmin',
  [ROLES.DISTRICT_ADMIN]: '/districtAdmin',
  [ROLES.TEHSILDAR]: '/tehsildar',
  [ROLES.NAIB_TEHSILDAR]: '/naibTehsildar',
  [ROLES.PATWARI]: '/patwari',
}


export function getSidebarData(): SidebarData {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { auth } = useAuth() as { auth: AuthType }
  const roles = auth?.roles ?? []
  const hasRole = (role: string) => roles.includes(role)

  const dashboardUrl =
    roles.find((role) => roleDashboardMap[role])
      ? roleDashboardMap[roles.find((role) => roleDashboardMap[role])!]
      : ''

  const isMasterAdmin = hasRole(ROLES.MASTER_ADMIN)
  const isSuperAdmin = hasRole(ROLES.SUPER_ADMIN)
  const isDistrictAdmin = hasRole(ROLES.DISTRICT_ADMIN)
  const isTehsildar = hasRole(ROLES.TEHSILDAR)
  const isNaibTehsildar = hasRole(ROLES.NAIB_TEHSILDAR)
  const isPatwari = hasRole(ROLES.PATWARI)

  const baseTeams = []
  if (isMasterAdmin) {
    baseTeams.push({ name: 'Master Admin', logo: Command, plan: 'Revenue Dashboard' })
  }
  if (isSuperAdmin) {
    baseTeams.push({ name: 'Super Admin', logo: Command, plan: 'Revenue Dashboard' })
  }
  if (isDistrictAdmin) {
    baseTeams.push({ name: 'District Admin', logo: Command, plan: 'Revenue Dashboard' })
  }
  if (isTehsildar) {
    baseTeams.push({ name: 'Tehsildar', logo: Command, plan: 'Revenue Dashboard' })
  }
  if (isNaibTehsildar) {
    baseTeams.push({ name: 'Naib Tehsildar', logo: Command, plan: 'Revenue Dashboard' })
  }
  if (isPatwari) {
    baseTeams.push({ name: 'Patwari', logo: Command, plan: 'Revenue Dashboard' })
  }

  // URLs based on roles
  const urls = {
    dashboard: dashboardUrl,
    users: `${dashboardUrl}/users`,
    mutation: `${dashboardUrl}/mutation`,
    tasks: `${dashboardUrl}/tasks`,
    chats: `${dashboardUrl}/chats`,
  }


  const navItems = [
    {
      title: 'Dashboard',
      url: urls.dashboard,
      icon: IconLayoutDashboard,
    },

    ...(isMasterAdmin ? [
      {
        title: 'Create Users',
        url: urls.users,
        icon: IconUsers,
      },
      {
        title: 'Mutation',
        url: urls.mutation,
        icon: IconDatabasePlus,
      },
      {
        title: 'Tasks',
        url: urls.tasks,
        icon: IconSubtask,
      },
      {
        title: 'Chats',
        url: urls.chats,
        icon: IconMessage,
      },
    ] : []),

    ...(isSuperAdmin
      ? [
        {
          title: 'Create Users',
          url: urls.users,
          icon: IconUsers,
        },
      ]
      : []),

    ...(isDistrictAdmin
      ? [
        {
          title: 'Create Users',
          url: urls.users,
          icon: IconUsers,
        },
      ]
      : []),

    ...(isTehsildar
      ? [
        // {
        //   title: 'Mutation',
        //   url: urls.mutation,
        //   icon: IconDatabasePlus,
        // },
      ]
      : []),

    ...(isNaibTehsildar
      ? [
        // {
        //   title: 'Mutation',
        //   url: urls.mutation,
        //   icon: IconDatabasePlus,
        // },
      ]
      : []),

    ...(isPatwari
      ? [
        {
          title: 'Mutation',
          url: urls.mutation,
          icon: IconDatabasePlus,
        },
      ]
      : []),
  ]

  return {
    teams: baseTeams,
    navGroups: [
      {
        title: 'General',
        items: navItems,
      },
      {
        title: 'Other',
        items: [
          {
            title: 'Settings',
            icon: IconSettings,
            items: [
              { title: 'Profile', url: '/profile', icon: IconUserCog },
              { title: 'Account', url: '/profile/account', icon: IconTool },
              { title: 'Notifications', url: '/profile/notifications', icon: IconNotification },
            ],
          },
        ],
      },
    ],
  }
}
