import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { BookingDetailType } from '@/lib/types/booking.type';
import { ResponseWrapperType } from '@/lib/types/globals';

import fetchHelper from '../fetchHelper';

interface RoomPayloadItem {
  room_pricing_uuid: string;
  quantity: number;
  price: number;
  total_price: number;
  addons: Array<{
    room_pricing_addon_uuid: string;
    quantity: number;
    price: number;
    total_price: number;
  }>;
}

interface TourPayloadItem {
  // booking_type 'room': kirim full pricing info
  package_tour_pricing_uuid?: string;
  // booking_type 'full_villa': BE hanya butuh uuid + quantity (tanpa price)
  package_tour_uuid?: string;
  quantity: number;
  price?: number;
  total_price?: number;
}

export interface CreateBookingPayload {
  is_manual: true;
  booking_source: string;  // 'direct' | 'agent'
  booking_type: string;    // 'room' | 'full_villa'
  agent_uuid?: string;
  villa_uuid?: string;     // wajib jika booking_type = 'full_villa'
  check_in: string;
  check_out: string;
  adult_count: number;
  child_count: number;
  total_payment: number;
  total_discount: number;
  manual_discount: number;
  payment_type: string;
  payment_status: string;  // 'unpaid' | 'paid' | 'partial'
  status: string;
  guest_info: {
    name: string;
    email: string;
    phone_number: string;
  };
  rooms: RoomPayloadItem[];
  package_tours: TourPayloadItem[];
  vouchers: [];
  promos: [];
}

const useCreateBooking = (
  options?: UseMutationOptions<ResponseWrapperType<BookingDetailType>, Error, CreateBookingPayload>,
) => {
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: async (data: CreateBookingPayload) => {
      const res = await fetchHelper('/booking/create', 'POST', data);
      return res;
    },
  });
};

export default useCreateBooking;
