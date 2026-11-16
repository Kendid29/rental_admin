import { z } from 'zod';

export interface PackageTourPricingDateFormType {
  date: string;
  repeat_on: string;
  quantity: number;
}

export const defaultPackageTourPricingDateForm: PackageTourPricingDateFormType = {
  date: '',
  repeat_on: '',
  quantity: 0,
};

export const PackageTourPricingDateFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  repeat_on: z.string().min(1, 'Repeat On is required'),
  quantity: z.number().min(1, 'Quantity is required'),
});

export interface PackageTourPricingRangeFormType {
  from_quantity: number;
  to_quantity: number;
  price: number;
  agent_price: number;
}

export const defaultPackageTourPricingRangeForm: PackageTourPricingRangeFormType = {
  from_quantity: 1,
  to_quantity: 1,
  price: 0,
  agent_price: 0,
};

export const PackageTourPricingRangeFormSchema = z.object({
  from_quantity: z.number().min(1, 'From quantity must be at least 1'),
  to_quantity: z.number().min(1, 'To quantity must be at least 1'),
  price: z.number().min(0, 'Price must be at least 0'),
  agent_price: z.number().min(0, 'Agent Price must be at least 0'),
});

export interface PackageTourPricingFormType {
  package_tour_pricing_uuid?: string;
  package_tour_uuid: string;
  villa_class_uuid: string;
  min_qty: number;
  quantity: number;
  description: string;
  price_ranges: PackageTourPricingRangeFormType[];
  dates: PackageTourPricingDateFormType[];
  date: string;
  is_published: boolean;
  is_refundable: boolean;
  is_transferable: boolean;
  is_cancellable: boolean;
  is_rescheduleable: boolean;
  version?: number | null;
  base_price?: number;
  selling_price?: number;
  agent_price?: number;
}

export const defaultPackageTourPricingForm: PackageTourPricingFormType = {
  package_tour_pricing_uuid: '',
  package_tour_uuid: '',
  villa_class_uuid: '',
  min_qty: 1,
  quantity: 1,
  description: '',
  price_ranges: [defaultPackageTourPricingRangeForm],
  dates: [defaultPackageTourPricingDateForm],
  date: '',
  is_published: false,
  is_refundable: false,
  is_transferable: false,
  is_cancellable: false,
  is_rescheduleable: false,
  version: undefined,
  base_price: 0,
  selling_price: 0,
  agent_price: 0,
};

export const PackageTourPricingFormSchema = z.object({
  package_tour_pricing_uuid: z.string().optional(),
  package_tour_uuid: z.string().min(1, 'Package Tour is required'),
  villa_class_uuid: z.string().min(1, 'Villa Class is required'),
  min_qty: z.number().min(1, 'Minimum Quantity is required'),
  quantity: z.number().min(1, 'Total Quantity is required'),
  description: z.string().optional(),
  price_ranges: z.array(PackageTourPricingRangeFormSchema).min(1, 'Price ranges are required'),
  date: z.string().optional(),
  dates: z.array(PackageTourPricingDateFormSchema).min(1, 'Dates are required'),
  is_published: z.boolean(),
  is_refundable: z.boolean(),
  is_transferable: z.boolean(),
  is_cancellable: z.boolean(),
  is_rescheduleable: z.boolean(),
  version: z.number().nullish(),
  base_price: z.number().optional(),
  selling_price: z.number().optional(),
  agent_price: z.number().optional(),
});
