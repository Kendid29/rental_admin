import { BasicRelationType, CreatedUpdatedType, FileStorageType } from './globals';

interface VoucherType extends CreatedUpdatedType {
  uuid: string;
  photo: FileStorageType;
  name: string;
  code: string;
  description: string;
  voucher_category: BasicRelationType;
  start_at: string;
  finish_at: string;
  minimum_spending: number;
  maximum_discount: number;
  quantity: number;
  rooms: BasicRelationType[];
  villas?: BasicRelationType[];
  villa_classes?: BasicRelationType[];
  package_tours?: BasicRelationType[];
  voucher_type: string;
  discount_percentage: number;
  discount_nominal: number;
  terms_and_conditions: string;
  is_published: boolean | number;
  is_published_cms: boolean | number;
  version: number;
  voucher_schedule_config: {
    booking_start_date: string;
    booking_finish_date: string;
    booking_days: string[];
    active_start_time: string;
    active_finish_time: string;
    stay_start_date: string;
    stay_finish_date: string;
  };
}

export default VoucherType;

