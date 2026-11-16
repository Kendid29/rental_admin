import { CreatedUpdatedType } from '../globals';

interface BookingReportType extends CreatedUpdatedType {
  uuid: string;
  booking_number: string;
  guest_name: string;
  booking_time: string;
  check_in: string;
  check_out: string;
  duration: number;
  currency: string;
  status: string;
  member_type: string;
  total_add_ons_price: number;
  total_rooms_price: number;
  grand_total: string;
  room_details: {
    rome_rate_plan: string;
    addon_details: string;
    total_discount: number;
  };
}

export default BookingReportType;

