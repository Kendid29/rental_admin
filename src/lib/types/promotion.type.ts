import { BasicRelationType, CreatedUpdatedType } from './globals';

interface PromotionType extends CreatedUpdatedType {
  uuid: string;
  promo_category: {
    uuid: string;
    name: string;
  };
  name: string;
  code: string | null;
  description: string;
  terms_and_conditions: string;
  promo_type: string;
  discount_percentage: number;
  discount_nominal: number;
  minimum_spending: number;
  maximum_discount: number | null;
  is_published: boolean;
  is_published_cms: boolean;
  version: number;
  promo_schedule_config: {
    booking_start_date: string;
    booking_finish_date: string;
    booking_days: string[];
    active_start_time: string;
    active_finish_time: string;

    stay_start_date: string;
    stay_finish_date: string;
  };

  room_types: BasicRelationType[];
  villas?: BasicRelationType[];
  package_tours?: BasicRelationType[];
}

export default PromotionType;
