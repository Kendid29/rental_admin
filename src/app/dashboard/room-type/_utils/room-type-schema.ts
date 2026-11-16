import { z } from 'zod';

import { maxFileSize } from '@/constant';

export interface RoomTypeFormType {
  room_category_uuid: string;
  name: string;
  code: string;
  description: string;
  bed_type: string;
  total_bed: number;
  occupancy: number;
  bath_type: string;
  room_size: number;
  actual_quantity: number;
  system_use_quantity: number;
  other_use_quantity: number;
  is_published_cms: boolean;
  room_type_has_facilities: Record<string, boolean>[];
  room_type_has_on_request_facilities: Record<string, boolean>[];
  room_type_images: any[];
  thumbnail_photo?: any;
  gallery_photos?: any;
  version?: number;
}

export const defaultRoomTypeForm: RoomTypeFormType = {
  room_category_uuid: '',
  name: '',
  code: '',
  description: '',
  bed_type: '',
  total_bed: 0,
  occupancy: 0,
  bath_type: '',
  room_size: 0,
  actual_quantity: 0,
  system_use_quantity: 0,
  other_use_quantity: 0,
  is_published_cms: false,
  room_type_has_facilities: [],
  room_type_has_on_request_facilities: [],
  room_type_images: [],
  thumbnail_photo: null,
  gallery_photos: [],
};

export const roomTypeFormSchema = z.object({
  room_category_uuid: z.string().min(1, 'Room category is required'),
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string(),
  bed_type: z.string().min(1, 'Bed type is required'),
  total_bed: z.number().min(1, 'Bed count must be at least 1'),
  occupancy: z.number().min(1, 'Occupancy must be at least 1'),
  bath_type: z.string().min(1, 'Bath type is required'),
  room_size: z.number().min(1, 'Room size must be at least 1 square meter'),
  actual_quantity: z.number().min(1, 'Actual quantity must be at least 1'),
  system_use_quantity: z.number(),
  other_use_quantity: z.number(),
  is_published_cms: z.boolean(),
  room_type_has_facilities: z.array(z.any()),
  room_type_has_on_request_facilities: z.array(z.any()),
  thumbnail_photo: z.any().optional(),
  gallery_photos: z.any().optional(),
  room_type_images: z.array(z.any()).optional().default([]),
  version: z.number().optional(),
});
