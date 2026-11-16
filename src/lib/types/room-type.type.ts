import { BasicRelationType, FileStorageType } from './globals';
import RoomFacilityType from './room-facility.type';

export interface RoomTypeType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  bed_type: string;
  total_bed: number;
  occupancy: number;
  bath_type: string;
  room_category: BasicRelationType;
  villa?: BasicRelationType;
  room_size: string;
  actual_quantity: number;
  system_use_quantity: number;
  other_use_quantity: number;
  is_published_cms: boolean;
  room_type_has_facilities: RoomFacilityType[];
  room_type_has_on_request_facilities: RoomFacilityType[];
  room_type_images: FileStorageType[];
  version: number;
}

