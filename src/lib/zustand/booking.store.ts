import { create } from 'zustand';

import { BookingCalendarDateType, BookingType } from '../types/booking.type';

interface BookingStoreState {
  selectedBooking: BookingCalendarDateType | null;
}

interface BookingStoreActions {
  setSelectedBooking: (booking: BookingCalendarDateType | null) => void;
}

interface BookingStore extends BookingStoreState, BookingStoreActions {}

export const useBookingStore = create<BookingStore>()((set) => ({
  selectedBooking: null,
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
}));
