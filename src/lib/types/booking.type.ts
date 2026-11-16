import { BasicRelationType } from './globals';
import UserType from './user.type';

export interface BookingCalendarDateType {
  date: string;
  total_bookings: {
    pending: number;
    confirmed: number;
    checked_in: number;
    completed: number;
    cancelled: number;
  };
}

interface BookingGuestInfoType {
  name: string;
  email: string;
  phone_number: string;
}

interface BookingAddonType {
  uuid: string;
  addon: BasicRelationType;
  quantity: number;
  price: string;
  total_price: string;
}

interface BookingInvoiceType {
  number: string;
  subtotal: number;
  discount: number;
  grand_total: number;
}

export interface BookingType {
  uuid: string;
  booking_number: string;
  booking_date: string;
  status: {
    label: string;
    value: string;
  };
  check_in: string;
  check_out: string;
  checked_in_at: string;
  checked_out_at: string;
  duration: number;
  total_payment: number;
  total_discount: number;
  guest_info: BookingGuestInfoType;
  guest_count: {
    adults: number;
    children: number;
  };
  invoice?: BookingInvoiceType;
}

interface BookingRoomType {
  uuid: string;
  quantity: number;
  price: number;
  total_price: number;
  room_type: BasicRelationType;
  addons: BookingAddonType[];
  is_cancellable: boolean;
  per_night_promos: BookingPerNightPromoType[];
}

interface BookingPerNightPromoType {
  date: string;
  original_price: number;
  discount: number;
  selling_price: number;
  applied_promo?: any;
}

interface BookingVoucherType {
  uuid: string;
  discount: string;
  voucher: {
    uuid: string;
    name: string;
  };
}

interface BookingPackageTourType {
  uuid: string;
  package_tour: {
    uuid: string;
    name: string;
  };
  price: string;
  total_price: string;
  quantity: number;
}

export interface BookingDetailType {
  uuid: string;
  booking_number: string;
  booking_date: string;
  check_in: string;
  check_out: string;
  checked_in_at: string;
  checked_out_at: string;
  duration: number;
  total_payment: number;
  total_discount: number;
  payment_type: string;
  rooms: BookingRoomType[];
  package_tours: BookingPackageTourType[];
  vouchers: BookingVoucherType[];
  status: {
    label: string;
    value: string;
  };
  guest_info: BookingGuestInfoType;
  guest_count: {
    adults: number;
    children: number;
  };
  membership: BasicRelationType;
  version: number;
  invoice?: BookingInvoiceType;
}
