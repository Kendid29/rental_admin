import { BasicRelationType, CreatedUpdatedType } from './globals';

export interface MeetingEventsType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  location: string;
  capacity: number;
  rate: number;
  layouts: BasicRelationType[];
  packages: BasicRelationType[];
  start_hour: string;
  end_hour: string;
  photo: {
    uuid: string;
    url: string;
  }[];
  is_published_cms: boolean;
  version: number;
}

