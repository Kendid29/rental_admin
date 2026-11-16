import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

export interface ManualBookingGuestInfoType {
  name: string;
  email: string;
  phone_number: string;
}

export const defaultManualBookingGuestInfo: ManualBookingGuestInfoType = {
  name: '',
  email: '',
  phone_number: '',
};

export const ManualBookingGuestInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone_number: z.string().min(1, 'Phone number is required'),
});

export interface ManualBookingRoomAddonType {
  room_pricing_addon_uuid: string;
  quantity: number;
  price: number;
  total_price: number;
}

export const ManualBookingRoomAddonSchema = z.object({
  room_pricing_addon_uuid: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  total_price: z.number(),
});

export interface ManualBookingRoomType {
  room_pricing_uuid: string;
  quantity: number;
  price: number;
  total_price: number;
  addons: ManualBookingRoomAddonType[];
}

export const ManualBookingRoomSchema = z.object({
  room_pricing_uuid: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  total_price: z.number(),
  addons: z.array(ManualBookingRoomAddonSchema),
});

export interface ManualBookingTourType {
  package_tour_pricing_uuid: string;
  quantity: number;
  price: number;
  total_price: number;
}

export const ManualBookingTourSchema = z.object({
  package_tour_pricing_uuid: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  total_price: z.number(),
});

// booking_source: 'direct' = tamu langsung, 'agent' = melalui agen
// booking_type: 'room' = pesan per kamar, 'full_villa' = sewa satu villa penuh

export interface ManualBookingFormType {
  check_in: Dayjs | null;
  check_out: Dayjs | null;
  adult_count: number;
  child_count: number;
  guest_info: ManualBookingGuestInfoType;
  booking_source: string; // 'direct' | 'agent'
  booking_type: string;   // 'room' | 'full_villa'
  agent_uuid?: string;
  villa_uuid?: string;
  rooms: ManualBookingRoomType[];
  package_tours: ManualBookingTourType[];
  total_payment: number;
  total_discount: number;
  manual_discount: number;
  payment_type: string;
  payment_status: string; // 'unpaid' | 'paid' | 'partial'
  status: string;
}

export const defaultManualBookingForm: ManualBookingFormType = {
  check_in: dayjs(),
  check_out: dayjs().add(1, 'day'),
  adult_count: 2,
  child_count: 0,
  guest_info: defaultManualBookingGuestInfo,
  booking_source: 'customer',
  booking_type: 'room',
  agent_uuid: '',
  villa_uuid: '',
  rooms: [],
  package_tours: [],
  total_payment: 0,
  total_discount: 0,
  manual_discount: 0,
  payment_type: 'cash',
  payment_status: 'unpaid',
  status: 'pending',
};

export const ManualBookingFormSchema = z.object({
  check_in: z.any().refine((val) => val !== null, 'Check in is required'),
  check_out: z.any().refine((val) => val !== null, 'Check out is required'),
  adult_count: z.number().min(1, 'Adult count must be at least 1'),
  child_count: z.number().min(0),
  guest_info: ManualBookingGuestInfoSchema,
  booking_source: z.string().min(1, 'Booking source is required'),
  booking_type: z.string().min(1, 'Booking type is required'),
  agent_uuid: z.string().optional(),
  villa_uuid: z.string().optional(),
  rooms: z.array(ManualBookingRoomSchema).optional(),
  package_tours: z.array(ManualBookingTourSchema).optional(),
  total_payment: z.number().min(0),
  total_discount: z.number().min(0),
  manual_discount: z.number().min(0),
  payment_type: z.string().min(1, 'Payment type is required'),
  payment_status: z.string().min(1, 'Payment status is required'),
  status: z.string().min(1, 'Status is required'),
});
