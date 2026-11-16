import { VillaClassType } from './villa-class.type';
import { RoomAddonType } from './room-addon.type';
import { CreatedUpdatedType, FileStorageType } from './globals';

export interface PackageTourType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  quantity: number;
  current_quantity: number;
  is_active: boolean;
  image: FileStorageType;
  image_uuid: string;
  version: number;
}

export interface PackageTourCalendarDateType {
  date: string;
  total_pricing: number;
}

export interface PackageTourPricingRangeType {
  from_quantity: number;
  to_quantity: number;
  price: number;
  agent_price: number;
}

export interface PackageTourPricingType {
  uuid: string;
  date: string;
  quantity: number;
  package_tour: PackageTourType;
  villa_class: VillaClassType;
  min_qty: number;
  description: string;
  price_ranges: PackageTourPricingRangeType[];
  addons: {
    uuid: string;
    addon: RoomAddonType;
    price_tiers?: any[];
  }[];
  is_cancellable: boolean;
  is_rescheduleable: boolean;
  is_published: boolean;
  is_refundable: boolean;
  is_transferable: boolean;
  version: number;
  base_price?: number;
  selling_price?: number;
  agent_price?: number;
}

export default PackageTourType;
