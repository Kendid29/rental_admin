import { BasicRelationType, CreatedUpdatedType, FileStorageType } from './globals';

export interface RoomsAndPricingType extends CreatedUpdatedType {
  uuid: string;
  date: string;
  selling_price: number;
  agent_price: number;
  base_price: number;
  quantity: number;
  is_high_recommendation: boolean;
  is_low_recommendation: boolean;
  facilities_count: number;
  room_type: BasicRelationType;
  max_adult: number;
  max_child: number;
  room_quantity: number;
  feature_highlight: {
    is_breakfast: boolean;
    occupancy: number;
    bed_type: string;
    total_bed: number;
  };
  photo: FileStorageType;
  facilities: BasicRelationType[];
  addons: {
    uuid: string;
    addon: {
      uuid: string;
      name: string;
      description: string;
    };
    price_tiers: {
      from_quantity: number;
      to_quantity: number;
      price: number;
      agent_price: number;
    }[];
    version: number;
  }[];
  is_rescheduleable: boolean;
  is_cancellable: boolean;
  is_published: boolean;
  version: number;
  villa_class?: BasicRelationType;
  villa_class_uuid?: string;
  villa_base_price?: number;
  villa_selling_price?: number;
  villa_agent_price?: number;
  villa_max_adult?: number;
  villa_max_child?: number;
  rooms?: {
    room_type: BasicRelationType;
    base_price: number;
    selling_price: number;
    agent_price: number;
    max_adult: number;
    max_child: number;
  }[];
}

export interface RoomsAndPricingCalendarDateType {
  date: string;
  total_room_pricing: number;
}

