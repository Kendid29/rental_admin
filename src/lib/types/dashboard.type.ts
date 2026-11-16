import { BasicRelationType } from './globals';

export interface BookingChartOverviewType {
  booking_date: string;
  month: string;
  total_bookings: number;
}

export interface PromoPerformanceType {
  booking_date: string;
  voucher_category: BasicRelationType;
  total_bookings: number;
}

export interface BusinessOverviewType {
  room_night: {
    total: number;
    growth_percentage: number;
  };
  average_daily_rate: {
    total: number;
    growth_percentage: number;
  };
  revenue: {
    total: number;
    growth_percentage: number;
  };
}

export interface CustomerDataType {
  label: string;
  value: string;
}

