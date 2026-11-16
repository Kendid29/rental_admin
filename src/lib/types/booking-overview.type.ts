interface BookingOverviewType {
  date: string;
  total_booking: number;
  total_check_in: number;
  total_check_out: number;
}

export interface BookingOverviewDetailType {
  guest_name: string;
  status: string;
  check_in_at: string;
  room_count: number;
  person_count: number;
  image: string;
}

export default BookingOverviewType;

