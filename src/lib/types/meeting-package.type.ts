import { CreatedUpdatedType } from './globals';

export interface MeetingPackageType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
}

export default MeetingPackageType;

