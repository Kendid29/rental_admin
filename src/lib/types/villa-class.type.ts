import { CreatedUpdatedType, FileStorageType } from './globals';

export interface VillaClassType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string | null;
  slug?: string;
  description: string | null;
  thumbnail?: FileStorageType | null;
  thumbnail_uuid?: string | null;
  images?: FileStorageType[] | any[] | null;
  address?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  max_guest?: number;
  check_in_time?: string | null;
  check_out_time?: string | null;
  is_active?: boolean;
  version: number;
}

export default VillaClassType;
