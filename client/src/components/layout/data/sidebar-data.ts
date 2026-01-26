import {
  IconLayoutDashboard,
  IconMessage,
  IconNotification,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { CalendarSync, ChartBarStacked, Command, HandPlatter, ImagePlus, ImageUp, MapPinHouse, MountainSnow, Flower, Soup, TentTree, WandSparkles, WavesLadder, MessageSquareQuote, ShoppingBag, ShoppingBasket, TruckElectric, Hotel } from 'lucide-react'
import { type SidebarData } from '../types'
import useAuth from '@/hooks/useAuth'
import type { AuthType } from '@/context/AuthProvider'
import { ROLES } from '@/utils/constants'

const roleDashboardMap: { [key: string]: string } = {
  [ROLES.MASTER_ADMIN]: '/masterAdmin',
  [ROLES.SUPER_ADMIN]: '/superAdmin',
  [ROLES.ADMIN]: '/dashboard',
  [ROLES.HOTEL]: '/hotel/dashboard'
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
  const isAdmin = hasRole(ROLES.ADMIN)
  const isHotel = hasRole(ROLES.HOTEL)

  const baseTeams = []
  if (isMasterAdmin) {
    baseTeams.push({ name: 'Master Admin', logo: Command, plan: 'Revenue Dashboard' })
  }
  if (isSuperAdmin) {
    baseTeams.push({ name: 'Super Admin', logo: Command, plan: 'Revenue Dashboard' })
  }
  if (isAdmin) {
    baseTeams.push({ name: 'Admin', logo: Command, plan: 'Dashboard' })
  }
  if (isHotel) {
    baseTeams.push({ name: 'Hotel', logo: Hotel, plan: 'Dashboard' })
  }

  // URLs based on roles
  const urls = {
    dashboard: dashboardUrl,
    users: `${dashboardUrl}/users`,
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

    ...(isAdmin
      ? [
        {
          title: 'Activities',
          icon: TentTree,
          items: [
            { title: 'Add Activity', url: '/activity/add', icon: ImagePlus },
            { title: 'Published Activities ', url: '/activity', icon: WavesLadder },
            { title: 'Upload Data', url: '/activity/upload', icon: ImageUp },
          ],
        },
        {
          title: 'Categories',
          icon: ChartBarStacked,
          url: '/category'
        },
        {
          title: 'Cuisines',
          icon: HandPlatter,
          items: [
            { title: 'Add Cuisine', url: '/cuisine/add', icon: ImagePlus },
            { title: 'Published Cuisines', url: '/cuisine', icon: Soup },
          ],
        },
        {
          title: 'Destinations',
          icon: MapPinHouse,
          items: [
            { title: 'Add Destination', url: '/destination/add', icon: ImagePlus },
            { title: 'Published Destinations ', url: '/destination', icon: MountainSnow },
            { title: 'Upload Data', url: '/destination/upload', icon: ImageUp },
          ],
        },
        {
          title: 'Events',
          icon: CalendarSync,
          items: [
            { title: 'Add Event', url: '/event/add', icon: ImagePlus },
            { title: 'Published Events ', url: '/event', icon: CalendarSync },
          ],
        },
        {
          title: 'Experiences of J&K',
          icon: WandSparkles,
          items: [
            { title: 'Add Experience', url: '/experiences/add', icon: ImagePlus },
            { title: 'Published Experiences ', url: '/experiences', icon: Flower },
          ],
        },
        {
          title: 'Feedbacks',
          icon: MessageSquareQuote,
          url: '/feedback'
        },
        {
          title: 'Shopping',
          icon: ShoppingBag,
          items: [
            { title: 'Add Shopping Location', url: '/shopping-location/add', icon: ShoppingBasket },
            { title: 'Published Shopping Locations ', url: '/shopping-location', icon: TruckElectric },
          ],
        },
        {
          title: 'Applied Hotels',
          icon: Hotel,
          url: '/dashboard/applied-hotels'
        }
      ]
      : []),

    ...(isHotel
      ? [
        {
          title: 'Hotel',
          icon: Hotel,
          items: [
            { title: 'Add Hotel', url: '/hotel/add', icon: ImagePlus },
            { title: 'Upload Data', url: '/hotel/upload', icon: ImageUp },
          ],
        },
      ]
      : [])

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
