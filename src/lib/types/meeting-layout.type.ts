import { CreatedUpdatedType, FileStorageType } from './globals';

export interface MeetingLayoutType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  photo: FileStorageType;
  is_published_cms: boolean;
  version: number;
}

export default MeetingLayoutType;

