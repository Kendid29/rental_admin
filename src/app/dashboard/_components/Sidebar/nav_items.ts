import {
  BadgeDollarSign,
  Briefcase,
  CalendarSearch,
  ContactRound,
  Flag,
  History as HistoryIcon,
  KeyRound,
  Layers2,
  Package,
  ShieldAlert,
  UserRound,
} from 'lucide-react';

export interface OverViewItem_2 {
  label: string;
  pathname: string;
  isHome?: boolean;
  permission_module: string;
  children?: OverViewItem_2[];
}

interface WithChildren {
  label: string;
  pathname?: string;
  children?: OverViewItem_2[];
  icon?: any;
  permission_module: string;
}

interface WithoutChildren {
  label: string;
  pathname?: string;
  children: OverViewItem_2[];
  icon: any;
  permission_module?: string;
}

export type OverViewItem = WithChildren | WithoutChildren;

export interface NavItem {
  title: string;
  items: OverViewItem[];
}

const PENGGUNA_ITEMS: OverViewItem[] = [
  {
    label: 'ADMIN',
    pathname: '/dashboard/admin',
    icon: ContactRound,
    permission_module: 'admin',
  },
  {
    label: 'USER',
    pathname: '/dashboard/user',
    icon: UserRound,
    permission_module: 'user',
  },
  {
    label: 'PERMISSION',
    pathname: '/dashboard/permission',
    icon: KeyRound,
    permission_module: 'permission',
  },
];

const MITRA_ITEMS: OverViewItem[] = [
  {
    label: 'MASTER MITRA',
    pathname: '/dashboard/mitra',
    icon: Briefcase,
    permission_module: 'mitra',
  },
];

const MASTER_DATA_ITEMS: OverViewItem[] = [
  {
    label: 'Vehicle category',
    pathname: '/dashboard/vehicle-category',
    icon: Layers2,
    permission_module: 'vehicle_category',
  },
  {
    label: 'MASTER',
    pathname: '/dashboard/master',
    icon: Package,
    permission_module: 'master',
  },
  {
    label: 'RULES',
    pathname: '/dashboard/rules',
    icon: Flag,
    permission_module: 'rules',
  },
];

const TRANSAKSI_ITEMS: OverViewItem[] = [
  {
    label: 'TRANSAKSI',
    pathname: '/dashboard/transaksi',
    icon: CalendarSearch,
    permission_module: 'transaksi',
  },
  {
    label: 'REIMBURSE',
    pathname: '/dashboard/reimburse',
    icon: BadgeDollarSign,
    permission_module: 'reimburse',
  },
];

const LAINNYA_ITEMS: OverViewItem[] = [
  {
    label: 'UPDATE',
    pathname: '/dashboard/update',
    icon: HistoryIcon,
    permission_module: 'update',
  },
  {
    label: 'SUSPEND',
    pathname: '/dashboard/suspend',
    icon: ShieldAlert,
    permission_module: 'suspend',
  },
];

const NAV_ITEMS: NavItem[] = [
  {
    title: 'Pengguna',
    items: PENGGUNA_ITEMS,
  },
  {
    title: 'Mitra',
    items: MITRA_ITEMS,
  },
  {
    title: 'Master Data',
    items: MASTER_DATA_ITEMS,
  },
  {
    title: 'Transaksi',
    items: TRANSAKSI_ITEMS,
  },
  {
    title: 'Lainnya',
    items: LAINNYA_ITEMS,
  },
];

export default NAV_ITEMS;
