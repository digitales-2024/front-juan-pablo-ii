import { Icon } from '@iconify/react';
import { SideNavItem } from '@/types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Inicio',
    path: '/dashboard',
    icon: <Icon icon="lucide:layout-dashboard" width="24" height="24" />,
  },
  {
    title: 'Usuarios',
    path: '/users',
    icon: <Icon icon="lucide:user" width="24" height="24" />,
  }
];
