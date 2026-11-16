import { z } from 'zod';

export interface RoomsAndPricingBulkEditFormType {
  room_type_uuids: string[];
  dates?: string[];
  date_range: string;
  base_price: number;
  selling_price: number;
  quantity: number;
  selected_days: Record<string, boolean>;
  is_published: boolean;
}

export const defaultRoomsAndPricingBulkEditForm: RoomsAndPricingBulkEditFormType = {
  room_type_uuids: [],
  dates: [],
  date_range: '',
  base_price: 0,
  selling_price: 0,
  quantity: 0,
  selected_days: {},
  is_published: false,
};

export const roomsAndPricingBulkEditFormSchema = z.object({
  room_type_uuids: z.array(z.string()).min(1, 'Room Type UUIDs are required'),
  dates: z.array(z.string()).optional(),
  date_range: z.string().min(1, 'Date range is required'),
  base_price: z.number().min(1, 'Base Price is required'),
  selling_price: z.number().min(0, 'Selling Price is required'),
  // selling_price: z.number().min(500_000, 'Selling Price must be at least Rp 500,000'),
  quantity: z.number().min(1, 'Quantity is required'),
  selected_days: z.record(z.string(), z.any()),
  is_published: z.boolean(),
});
