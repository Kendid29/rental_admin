import { create } from 'zustand';

import { PackageTourCalendarDateType } from '../types/package-tour.type';

interface PackageTourPricingStoreState {
  selectedPackageTourPricing: PackageTourCalendarDateType | null;
}

interface PackageTourPricingStoreActions {
  setSelectedPackageTourPricing: (
    packageTourPricing: PackageTourCalendarDateType | null,
  ) => void;
}

interface PackageTourPricingStore
  extends PackageTourPricingStoreState, PackageTourPricingStoreActions {}

export const usePackageTourPricingStore = create<PackageTourPricingStore>()((set) => ({
  selectedPackageTourPricing: null,
  setSelectedPackageTourPricing: (packageTourPricing) =>
    set({ selectedPackageTourPricing: packageTourPricing }),
}));
