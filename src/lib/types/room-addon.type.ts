import { CreatedUpdatedType } from './globals';

export interface RoomAddonType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
}

export default RoomAddonType;

