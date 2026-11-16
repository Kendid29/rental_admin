import { z } from 'zod';

export interface AddonPriceTierType {
  from_quantity: number;
  to_quantity: number;
  price: number;
  agent_price: number;
}

export interface VillaRoomPricingFormType {
  room_type_uuid: string;
  base_price: number;
  selling_price: number;
  agent_price: number;
  max_adult: number;
  max_child: number;
}

export const defaultVillaRoomPricingForm: VillaRoomPricingFormType = {
  room_type_uuid: '',
  base_price: 0,
  selling_price: 0,
  agent_price: 0,
  max_adult: 1,
  max_child: 0,
};

export interface RoomAddonFormType {
  room_pricing_addon_uuid?: string;
  addon_uuid: string;
  price_tiers: AddonPriceTierType[];
  version?: number;
}

export const defaultRoomAddonForm: RoomAddonFormType = {
  addon_uuid: '',
  price_tiers: [{ from_quantity: 1, to_quantity: 1, price: 0, agent_price: 0 }],
};

export const roomAddonFormSchema = z.object({
  room_pricing_addon_uuid: z.string().optional(),
  addon_uuid: z.string().min(1, 'Addon UUID is required'),
  price_tiers: z
    .array(
      z.object({
        from_quantity: z.number().min(1, 'From quantity must be at least 1'),
        to_quantity: z.number().min(1, 'To quantity must be at least 1'),
        price: z.number().min(1, 'Price is required'),
        agent_price: z.number().min(0, 'Agent Price is required'),
      }),
    )
    .min(1, 'At least one price tier is required'),
  version: z.number().optional(),
});

export interface RoomDateFormType {
  date: string;
  repeat_on: string;
  quantity: number;
}

export const defaultRoomDateForm: RoomDateFormType = {
  date: '',
  repeat_on: '',
  quantity: 0,
};

export const roomDateFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  repeat_on: z.string().min(1, 'Repeat On is required'),
  quantity: z.number().min(1, 'Quantity is required'),
});

export interface RoomsAndPricingFormType {
  pricing_type: 'villa' | 'room_type';
  villa_class_uuid?: string;
  room_type_uuid?: string;
  date?: string;
  dates: RoomDateFormType[];
  base_price: number;
  selling_price: number;
  agent_price: number;
  max_adult: number;
  max_child: number;
  rooms?: VillaRoomPricingFormType[];
  is_breakfast: boolean;
  is_cancellable: boolean;
  is_rescheduleable: boolean;
  is_published: boolean;
  addons: RoomAddonFormType[];
  version?: number;
}

export const defaultRoomsAndPricingForm: RoomsAndPricingFormType = {
  pricing_type: 'villa',
  villa_class_uuid: '',
  room_type_uuid: '',
  dates: [defaultRoomDateForm],
  base_price: 0,
  selling_price: 0,
  agent_price: 0,
  max_adult: 0,
  max_child: 0,
  rooms: [],
  is_breakfast: false,
  is_cancellable: false,
  is_rescheduleable: false,
  is_published: false,
  addons: [],
};

export const roomsAndPricingFormSchema = z
  .object({
    pricing_type: z.enum(['villa', 'room_type']),
    villa_class_uuid: z.string().optional(),
    room_type_uuid: z.string().optional(),
    date: z.string().optional(),
    dates: z.array(roomDateFormSchema).min(1, 'Dates are required'),
    base_price: z.number().min(1, 'Base Price is required'),
    selling_price: z.number().min(0, 'Selling Price is required'),
    agent_price: z.number().min(0, 'Agent Price is required'),
    // selling_price: z.number().min(500_000, 'Selling Price must be at least Rp 500,000'),
    max_adult: z.number().min(1, 'Max Adult is required'),
    max_child: z.number(),
    rooms: z
      .array(
        z.object({
          room_type_uuid: z.string().min(1, 'Room Type is required'),
          base_price: z.number().min(1, 'Base Price is required'),
          selling_price: z.number().min(0, 'Selling Price is required'),
          agent_price: z.number().min(0, 'Agent Price is required'),
          max_adult: z.number().min(1, 'Max Adult is required'),
          max_child: z.number(),
        }),
      )
      .optional(),
    is_breakfast: z.boolean(),
    is_cancellable: z.boolean(),
    is_rescheduleable: z.boolean(),
    is_published: z.boolean(),
    addons: z.array(roomAddonFormSchema),
    version: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pricing_type === 'villa') {
      if (!data.villa_class_uuid || data.villa_class_uuid.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['villa_class_uuid'],
          message: 'Villa is required',
        });
      }
      if (!data.rooms || data.rooms.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rooms'],
          message: 'At least one room is required',
        });
      }
    } else {
      if (!data.room_type_uuid || data.room_type_uuid.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['room_type_uuid'],
          message: 'Room Type is required',
        });
      }
    }
  });
