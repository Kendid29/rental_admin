import {
  BadgeDollarSign,
  BedDouble,
  Briefcase,
  Calendar,
  CalendarSearch,
  ChartBarBig,
  ContactRound,
  Flag,
  HandPlatter,
  History,
  Image as ImageIcon,
  KeyRound,
  Layers2,
  MonitorCog,
  MonitorDown,
  Package,
  Presentation,
  Tags,
  TicketPercent,
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

const OVERVIEW_ITEMS: OverViewItem[] = [
  {
    label: 'Analytics',
    pathname: '/dashboard/home',
    icon: ChartBarBig,
    permission_module: 'dashboard',
  },
];

const USERMANAGEMENT_ITEMS: OverViewItem[] = [
  {
    label: 'Staff',
    pathname: '/dashboard/staff',
    icon: ContactRound,
    permission_module: 'user',
  },
  {
    label: 'Role',
    pathname: '/dashboard/role',
    icon: KeyRound,
    permission_module: 'role',
  },
];

const MEMBERSHIP_ITEMS: OverViewItem[] = [
  {
    label: 'Member',
    pathname: '/dashboard/member',
    icon: UserRound,
    permission_module: 'user',
  },
  {
    label: 'Agent',
    pathname: '/dashboard/agent',
    icon: Briefcase,
    permission_module: 'user',
  },
];

const RESERVATION_ITEMS: OverViewItem[] = [
  {
    label: 'Booking',
    pathname: '/dashboard/booking',
    icon: CalendarSearch,
    permission_module: 'booking',
  },
  // {
  //   label: 'Pending Bookings',
  //   pathname: '/dashboard/pending-bookings',
  //   icon: CalendarClock,
  //   permission_module: 'booking',
  // },
];

const ROOM_ITEMS: OverViewItem[] = [
  // {
  //   label: 'Room',
  //   pathname: '/dashboard/room',
  //   icon: Bed,
  //   permission_module: 'room',
  // },
  {
    label: 'Facilities',
    pathname: '/dashboard/room-facilities',
    icon: MonitorCog,
    permission_module: 'facility',
  },
  {
    label: 'On Request Facilities',
    pathname: '/dashboard/room-on-request-facilities',
    icon: MonitorDown,
    permission_module: 'room_on_request_facility',
  },
  {
    label: 'Villa Classes',
    pathname: '/dashboard/villa-class',
    icon: Layers2,
    permission_module: 'villa',
  },
  {
    label: 'Room Types',
    pathname: '/dashboard/room-type',
    icon: BedDouble,
    permission_module: 'room_type',
  },
  {
    label: 'Room Addons',
    pathname: '/dashboard/room-addon',
    icon: Package,
    permission_module: 'addon',
  },
  {
    label: 'Rooms and Pricing',
    pathname: '/dashboard/rooms-and-pricing',
    icon: BadgeDollarSign,
    permission_module: 'room_pricing',
  },
];

const TOUR_MANAGEMENT_ITEMS: OverViewItem[] = [
  {
    label: 'Package Tour',
    pathname: '/dashboard/tour-management/package-tour',
    icon: TicketPercent,
    permission_module: 'package_tour',
  },
  {
    label: 'Package Tour Pricing',
    pathname: '/dashboard/tour-management/package-tour-pricing',
    icon: BadgeDollarSign,
    permission_module: 'package_tour_pricing',
  },
];

const SERVICES_ITEMS: OverViewItem[] = [
  {
    label: 'Dining',
    pathname: '/dashboard/dining',
    icon: HandPlatter,
    permission_module: 'dining',
    // children: [
    //   {
    //     label: 'Dining List',
    //     pathname: '/dashboard/dining',
    //     permission_module: 'dining',
    //   },
    //   {
    //     label: 'Dining Type',
    //     pathname: '/dashboard/dining-type',
    //     permission_module: 'dining_type',
    //   },
    // ],
  },
  {
    label: 'Meeting & Events',
    pathname: '/dashboard/meeting-event',
    icon: Presentation,
    permission_module: 'meeting_room',
    children: [
      {
        label: 'Meeting Layout',
        pathname: '/dashboard/meeting-layout',
        permission_module: 'layout',
      },
      {
        label: 'Meeting Room',
        pathname: '/dashboard/meeting-event',
        permission_module: 'meeting_room',
      },
    ],
  },
];

const MARKETING_ITEMS: OverViewItem[] = [
  {
    label: 'Promo',
    pathname: '/dashboard/promotion',
    icon: Tags,
    permission_module: 'promo',
    children: [
      {
        label: 'Promo Category',
        pathname: '/dashboard/promotion-category',
        permission_module: 'promo_category',
      },
      {
        label: 'Promo List',
        pathname: '/dashboard/promotion',
        permission_module: 'promo',
      },
    ],
  },
  {
    label: 'Vouchers',
    pathname: '/dashboard/voucher',
    icon: TicketPercent,
    permission_module: 'voucher',
    children: [
      {
        label: 'Voucher Category',
        pathname: '/dashboard/voucher-category',
        permission_module: 'voucher_category',
      },
      {
        label: 'Voucher List',
        pathname: '/dashboard/voucher',
        permission_module: 'voucher',
      },
    ],
  },
];

const REPORT_ITEMS: OverViewItem[] = [
  {
    label: 'Booking Report',
    pathname: '/dashboard/booking-report',
    icon: Flag,
    permission_module: 'report',
  },
  {
    label: 'Payment Report',
    pathname: '/dashboard/payment-report',
    icon: Flag,
    permission_module: 'report',
  },
];

const CONTENT_MANAGEMENT_ITEMS: OverViewItem[] = [
  {
    label: 'Gallery',
    pathname: '/dashboard/gallery',
    icon: ImageIcon,
    permission_module: 'gallery',
  },
  {
    label: 'Activities',
    pathname: '/dashboard/activity',
    icon: Flag, // reusing Flag or another icon if needed, let's use Flag
    permission_module: 'gallery', // just reusing gallery permission for now since we haven't created activity permission
  },
];

const SYSTEM_LOG_ITEMS: OverViewItem[] = [
  {
    label: 'Activity Log',
    pathname: '/dashboard/activity-log',
    icon: History,
    permission_module: 'activity_log',
  },
];

const NAV_ITEMS: NavItem[] = [
  {
    title: 'Overview',
    items: OVERVIEW_ITEMS,
  },
  {
    title: 'Content Management',
    items: CONTENT_MANAGEMENT_ITEMS,
  },
  {
    title: 'User Management',
    items: USERMANAGEMENT_ITEMS,
  },
  {
    title: 'Member & Agent Management',
    items: MEMBERSHIP_ITEMS,
  },
  {
    title: 'Reservation',
    items: RESERVATION_ITEMS,
  },
  {
    title: 'Room Management',
    items: ROOM_ITEMS,
  },
  {
    title: 'Tour Management',
    items: TOUR_MANAGEMENT_ITEMS,
  },
  {
    title: 'Services Management',
    items: SERVICES_ITEMS,
  },
  {
    title: 'Marketing Management',
    items: MARKETING_ITEMS,
  },
  {
    title: 'Report',
    items: REPORT_ITEMS,
  },
  {
    title: 'System Log',
    items: SYSTEM_LOG_ITEMS,
  },
];

export default NAV_ITEMS;
