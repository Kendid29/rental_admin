import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import parseObjectRequest from '@/lib/utils/parseObjectRequest';

import fetchHelper from './fetchHelper';

export type StatusEntity =
  | 'activity'
  | 'dining'
  | 'meeting-event'
  | 'meeting-layout'
  | 'package-tour'
  | 'promotion'
  | 'villa-class'
  | 'voucher-category';

export interface QuickStatusVariables {
  entity: StatusEntity;
  item: any;
  value: boolean;
}

const config: Record<StatusEntity, { tag: string; success: string }> = {
  activity: { tag: TAGS.ACTIVITY, success: 'Activity status updated successfully' },
  dining: { tag: TAGS.DINING, success: 'Dining status updated successfully' },
  'meeting-event': {
    tag: TAGS.MEETING_EVENTS,
    success: 'Meeting room status updated successfully',
  },
  'meeting-layout': {
    tag: TAGS.MEETING_LAYOUTS,
    success: 'Meeting layout status updated successfully',
  },
  'package-tour': { tag: TAGS.PACKAGE_TOUR, success: 'Package tour status updated successfully' },
  promotion: { tag: TAGS.PROMOTION, success: 'Promotion status updated successfully' },
  'villa-class': { tag: TAGS.VILLA_CLASS, success: 'Villa status updated successfully' },
  'voucher-category': {
    tag: TAGS.VOUCHER_CATEGORY,
    success: 'Voucher category status updated successfully',
  },
};

const useQuickToggleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ entity, item, value }: QuickStatusVariables) {
      if (entity === 'activity') {
        return fetchHelper(`/activity/admin/${item.uuid}/edit`, 'PUT', {
          title: item.title,
          description: item.description,
          image_uuid: item.image?.uuid,
          is_active: value,
        });
      }

      if (entity === 'meeting-layout') {
        return fetchHelper(`/master-data/layout/${item.uuid}`, 'PUT', {
          name: item.name,
          code: item.code,
          description: item.description,
          photo_uuid: item.photo?.uuid,
          is_published_cms: Number(value),
          version: item.version,
        });
      }

      if (entity === 'voucher-category') {
        return fetchHelper(`/promo/voucher/category/${item.uuid}`, 'PUT', {
          name: item.name,
          code: item.code,
          queue: item.queue,
          description: item.description,
          is_published: Number(value),
          is_published_cms: Number(Boolean(item.is_published_cms)),
          version: item.version,
        });
      }

      if (entity === 'villa-class') {
        const detail = (await fetchHelper(`/villa/admin/${item.uuid}/detail`)).data;

        return fetchHelper(
          `/villa/admin/${item.uuid}/edit`,
          'PUT',
          await parseObjectRequest({
            name: detail.name,
            code: detail.code,
            description: detail.description,
            address: detail.address,
            latitude: detail.latitude,
            longitude: detail.longitude,
            max_guest: detail.max_guest,
            thumbnail_uuid: detail.thumbnail?.uuid,
            check_in_time: detail.check_in_time?.slice(0, 5) || null,
            check_out_time: detail.check_out_time?.slice(0, 5) || null,
            is_active: value,
            version: detail.version,
          }),
        );
      }

      if (entity === 'package-tour') {
        const detail = (await fetchHelper(`/master-data/package-tour/${item.uuid}`)).data;

        return fetchHelper(`/master-data/package-tour/${item.uuid}`, 'PUT', {
          name: detail.name,
          code: detail.code,
          quantity: detail.quantity,
          current_quantity: detail.current_quantity,
          description: detail.description,
          image_uuid: detail.image?.uuid || detail.image_uuid,
          is_active: value,
          version: detail.version,
        });
      }

      if (entity === 'dining') {
        const detail = (await fetchHelper(`/master-data/dining/${item.uuid}`)).data;

        return fetchHelper(`/master-data/dining/${item.uuid}`, 'PUT', {
          name: detail.name,
          code: detail.code,
          description: detail.description,
          location: detail.location,
          operational_days: detail.operational_days,
          start_hour: detail.start_hour,
          end_hour: detail.end_hour,
          version: detail.version,
          capacity: String(detail.capacity),
          dish_types: detail.dining_dish_types.map((dish: any) => ({ dish_type: dish.dish_type })),
          images: detail.photo.map((photo: any) => ({ photo_uuid: photo.uuid })),
          is_published_cms: Number(value),
        });
      }

      if (entity === 'meeting-event') {
        const detail = (await fetchHelper(`/master-data/meeting-room/${item.uuid}`)).data;

        return fetchHelper(`/master-data/meeting-room/${item.uuid}`, 'PUT', {
          name: detail.name,
          code: detail.code,
          description: detail.description,
          location: detail.location,
          capacity: String(detail.capacity),
          rate: String(detail.rate),
          version: detail.version,
          meeting_packages: detail.packages.map((pkg: any) => pkg.uuid),
          layouts: detail.layouts.map((layout: any) => layout.uuid),
          images: detail.photo.map((photo: any) => ({ photo_uuid: photo.uuid })),
          is_published_cms: Number(value),
        });
      }

      const detail = (await fetchHelper(`/promo/${item.uuid}/detail`)).data;
      const schedule = detail.promo_schedule_config;

      return fetchHelper(`/promo/${item.uuid}/edit`, 'PUT', {
        promo_category_uuid: detail.promo_category?.uuid,
        name: detail.name,
        code: detail.code || null,
        description: detail.description,
        terms_and_conditions: detail.terms_and_conditions,
        promo_type: detail.promo_type,
        discount_percentage: detail.promo_type === 'percentage' ? detail.discount_percentage : null,
        discount_nominal: detail.promo_type === 'nominal' ? detail.discount_nominal : null,
        minimum_spending: detail.minimum_spending,
        maximum_discount:
          detail.promo_type === 'percentage' ? detail.maximum_discount || null : null,
        room_type_uuids: detail.room_types?.map((room: any) => room.uuid) || [],
        villa_uuids: detail.villas?.map((villa: any) => villa.uuid) || [],
        booking_start_date: schedule?.booking_start_date,
        booking_finish_date: schedule?.booking_finish_date,
        booking_days: schedule?.booking_days || [],
        active_start_time: schedule?.active_start_time,
        active_finish_time: schedule?.active_finish_time,
        stay_start_date: schedule?.stay_start_date,
        stay_finish_date: schedule?.stay_finish_date,
        is_published: value,
        is_published_cms: detail.is_published_cms,
        version: detail.version,
      });
    },
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({ queryKey: [config[variables.entity].tag] });
      toast(config[variables.entity].success, { type: 'success' });
    },
    onError(error) {
      toast((error as any)?.response?.data?.message || 'Failed to update status', {
        type: 'error',
      });
    },
  });
};

export default useQuickToggleStatus;
