import { CreatedUpdatedType } from './globals';

export interface RoomLayoutType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  bed_type: 'single' | 'double' | 'queen' | 'king';
  bed_count: number;
  max_occupancy: number;
  room_size: number; // in square meters
  version: number;
}

