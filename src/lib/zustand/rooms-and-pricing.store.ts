import { create } from 'zustand';

import { RoomsAndPricingCalendarDateType } from '../types/rooms-and-pricing.type';

interface RoomsAndPricingStoreState {
  selectedRoomAndPricing: RoomsAndPricingCalendarDateType | null;
}

interface RoomsAndPricingStoreActions {
  setSelectedRoomAndPricing: (roomAndPricing: RoomsAndPricingCalendarDateType | null) => void;
}

interface RoomsAndPricingStore extends RoomsAndPricingStoreState, RoomsAndPricingStoreActions {}

export const useRoomsAndPricingStore = create<RoomsAndPricingStore>()((set) => ({
  selectedRoomAndPricing: null,
  setSelectedRoomAndPricing: (roomAndPricing) => set({ selectedRoomAndPricing: roomAndPricing }),
}));
