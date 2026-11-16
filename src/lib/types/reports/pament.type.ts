interface PaymentReportType {
  booking_number: string;
  payment_number: string;
  name: string;
  check_in: string;
  number_rooms: number;
  currency: string;
  invoice_amount: number;
  total: number;
  total_fee: number;
}

export default PaymentReportType;

