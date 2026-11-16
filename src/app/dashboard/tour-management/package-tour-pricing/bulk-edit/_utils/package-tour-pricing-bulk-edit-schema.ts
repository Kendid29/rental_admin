import { z } from 'zod';

export interface PackageTourPricingBulkEditFormType {
  package_tour_uuid: string;
  base_price: number;
  selling_price: number;
  quantity: number;
  is_published: boolean;
  date_range: string;
  selected_days: Record<string, boolean>;
}

export const defaultPackageTourPricingBulkEditForm: PackageTourPricingBulkEditFormType = {
  package_tour_uuid: '',
  base_price: 0,
  selling_price: 0,
  quantity: 0,
  is_published: false,
  date_range: '',
  selected_days: {
    Sunday: true,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
  },
};

export const packageTourPricingBulkEditFormSchema = z.object({
  package_tour_uuid: z.string().min(1, 'Package Tour is required'),
  base_price: z.number().min(0, 'Base price must be at least 0'),
  selling_price: z.number().min(0, 'Selling price must be at least 0'),
  quantity: z.number().min(0, 'Quantity must be at least 0'),
  is_published: z.boolean(),
  date_range: z.string().min(1, 'Date range is required'),
  selected_days: z.record(z.string(), z.any()),
});
