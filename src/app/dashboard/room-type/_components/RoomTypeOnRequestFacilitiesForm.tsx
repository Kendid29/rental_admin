import { useMemo } from 'react';

import { Chip, Typography } from '@mui/material';

import { Control, FieldErrors, FieldValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import SafeDynamicIcon from '@/components/ui/SafeDynamicIcon';
import CheckboxCard from '@/components/ui/form/CheckboxCard';
import FormCard from '@/components/ui/form/FormCard';
import { RoomOnRequestFacilityType } from '@/lib/types/room-on-request-facility.type';
import useGetRoomOnRequestFacilities from '@/services/room-on-request-facilities/useGetRoomOnRequestFacilities';

import { RoomTypeFormType } from '../_utils/room-type-schema';
import { RoomTypeFacilitiesLoadingSkeleton } from './RoomTypeFacilitiesForm';

interface Props {
  watch: UseFormWatch<RoomTypeFormType>;
  control: Control<RoomTypeFormType, any, FieldValues>;
  setValue: UseFormSetValue<RoomTypeFormType>;
  errors: FieldErrors<RoomTypeFormType>;
  initialValues?: RoomTypeFormType;
}

const RoomTypeOnRequestFacilitiesForm = ({
  watch,
  control,
  setValue,
  errors,
  initialValues,
}: Props) => {
  const { data: facilities, isLoading: isLoadingFacilities } = useGetRoomOnRequestFacilities();

  const mergedFacilities = useMemo(() => {
    if (!facilities?.data) return [];

    if (!initialValues) return facilities?.data;

    const existingFacility = initialValues?.room_type_has_on_request_facilities.map(
      (f) => Object.keys(f)[0],
    );

    const filteredFacilities = facilities.data.filter((facility) => {
      return !existingFacility.includes(facility.uuid);
    });

    return [
      ...existingFacility
        .map((f) => facilities.data.find((facility) => facility.uuid === f))
        .filter((facility): facility is RoomOnRequestFacilityType => facility !== undefined),
      ...filteredFacilities,
    ];
  }, [facilities, initialValues]);

  return (
    <FormCard
      title="Room Type On Request Facilities"
      subTitle="Select the facilities that can be requested for the room type"
      cardHeaderComponent={<Chip size="small" label="Optional" color="primary" />}
    >
      <div className="grid grid-cols-2 gap-3">
        {isLoadingFacilities
          ? Array.from({ length: 4 }).map((_, index) => (
              <RoomTypeFacilitiesLoadingSkeleton key={index} />
            ))
          : mergedFacilities?.map((facility, index) => (
              <CheckboxCard
                key={facility.uuid}
                name={`room_type_has_on_request_facilities.${index}.${facility.uuid}`}
                control={control}
                label={
                  <div className="flex items-center gap-2">
                    {facility.icon_title && (
                      <div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-gray-200/60 text-gray-500">
                        <SafeDynamicIcon name={facility.icon_title} size={'1rem'} />
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <Typography variant="body1" className="-mb-1 flex items-center gap-1">
                        {facility.name}
                      </Typography>
                      {facility.description && (
                        <Typography className="truncate" variant="body2">
                          {facility.description}
                        </Typography>
                      )}
                    </div>
                  </div>
                }
              />
            ))}
      </div>
    </FormCard>
  );
};

export default RoomTypeOnRequestFacilitiesForm;
