import { CreatedUpdatedType } from './globals';

export interface RoomOnRequestFacilityType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
  icon_title: string;
}

