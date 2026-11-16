export const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'checked_in':
      return 'warning';
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'cancelled':
      return 'error';
    default:
      return 'info';
  }
};

export const BOOKING_STATUS = [
  { label: 'Completed', value: 'completed' },
  { label: 'Checked In', value: 'checked_in' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
];
