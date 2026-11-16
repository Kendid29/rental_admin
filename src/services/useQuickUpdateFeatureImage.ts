import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import TAGS from '@/constant/tags';
import uploadFile from '@/lib/utils/uploadFile';

import fetchHelper from './fetchHelper';

type ImageEntity = 'dining' | 'meeting-event' | 'package-tour' | 'room-type';

interface Variables {
  entity: ImageEntity;
  uuid: string;
  file: File;
}

const entityConfig = {
  dining: { tag: TAGS.DINING, label: 'Dining' },
  'meeting-event': { tag: TAGS.MEETING_EVENTS, label: 'Meeting room' },
  'package-tour': { tag: TAGS.PACKAGE_TOUR, label: 'Package tour' },
  'room-type': { tag: TAGS.ROOM_TYPE, label: 'Room type' },
};

const replacePrimaryImage = (imageUuid: string, images: any[] = []) => [
  imageUuid,
  ...images.slice(1).map((image) => image.uuid),
];

const useQuickUpdateFeatureImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ entity, uuid, file }: Variables) {
      const imageUuid = await uploadFile(file);

      if (entity === 'dining') {
        const detail = (await fetchHelper(`/master-data/dining/${uuid}`)).data;

        return fetchHelper(`/master-data/dining/${uuid}`, 'PUT', {
          name: detail.name,
          code: detail.code,
          description: detail.description,
          location: detail.location,
          operational_days: detail.operational_days,
          start_hour: detail.start_hour,
          end_hour: detail.end_hour,
          capacity: String(detail.capacity),
          dish_types: detail.dining_dish_types.map((dish: any) => ({ dish_type: dish.dish_type })),
          images: replacePrimaryImage(imageUuid, detail.photo).map((photoUuid) => ({
            photo_uuid: photoUuid,
          })),
          is_published_cms: Number(Boolean(detail.is_published_cms)),
          version: detail.version,
        });
      }

      if (entity === 'meeting-event') {
        const detail = (await fetchHelper(`/master-data/meeting-room/${uuid}`)).data;

        return fetchHelper(`/master-data/meeting-room/${uuid}`, 'PUT', {
          name: detail.name,
          code: detail.code,
          description: detail.description,
          location: detail.location,
          capacity: String(detail.capacity),
          rate: String(detail.rate),
          meeting_packages: detail.packages.map((item: any) => item.uuid),
          layouts: detail.layouts.map((item: any) => item.uuid),
          images: replacePrimaryImage(imageUuid, detail.photo),
          is_published_cms: Number(Boolean(detail.is_published_cms)),
          version: detail.version,
        });
      }

      if (entity === 'package-tour') {
        const detail = (await fetchHelper(`/master-data/package-tour/${uuid}`)).data;

        return fetchHelper(`/master-data/package-tour/${uuid}`, 'PUT', {
          name: detail.name,
          code: detail.code,
          quantity: detail.quantity,
          current_quantity: detail.current_quantity,
          description: detail.description,
          is_active: detail.is_active,
          image_uuid: imageUuid,
          version: detail.version,
        });
      }

      const detail = (await fetchHelper(`/room/type/${uuid}`)).data;

      return fetchHelper(`/room/type/${uuid}`, 'PUT', {
        villa_uuid: detail.room_category?.uuid || detail.villa?.uuid,
        name: detail.name,
        code: detail.code,
        description: detail.description,
        bed_type: detail.bed_type,
        total_bed: detail.total_bed,
        occupancy: detail.occupancy,
        bath_type: detail.bath_type,
        room_size: detail.room_size,
        actual_quantity: detail.actual_quantity,
        system_use_quantity: detail.system_use_quantity,
        other_use_quantity: detail.other_use_quantity,
        is_published_cms: detail.is_published_cms,
        room_type_has_facilities: detail.room_type_has_facilities.map((item: any) => item.uuid),
        room_type_has_on_request_facilities: detail.room_type_has_on_request_facilities.map(
          (item: any) => item.uuid,
        ),
        room_type_images: replacePrimaryImage(imageUuid, detail.room_type_images),
        version: detail.version,
      });
    },
    onSuccess(_data, variables) {
      const config = entityConfig[variables.entity];

      queryClient.invalidateQueries({ queryKey: [config.tag] });
      toast(`${config.label} image updated successfully`, { type: 'success' });
    },
    onError(error) {
      toast((error as any)?.response?.data?.message || 'Failed to update image', { type: 'error' });
    },
  });
};

export default useQuickUpdateFeatureImage;
