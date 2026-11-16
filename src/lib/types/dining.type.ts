import { CreatedUpdatedType, FileStorageType } from './globals';

interface DiningType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  location: string;
  dining_dish_types: {
    uuid: string;
    dish_type: string;
  }[];
  operational_days: string;
  start_hour: string;
  end_hour: string;
  capacity: number;
  is_published_cms: boolean;
  photo: FileStorageType[];
  version: number;
}

export interface DiningTypeType extends CreatedUpdatedType {
  value: string;
  label: string;
}

export default DiningType;

