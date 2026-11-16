'use client';

import { useEffect, useMemo, useRef } from 'react';

import { Button, InputAdornment, Typography } from '@mui/material';

import { CirclePlus, Trash2 } from 'lucide-react';
import {
    Control,
    FieldErrors,
    FieldValues,
    useFieldArray,
    UseFormSetValue,
    UseFormWatch,
} from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import { RoomTypeType } from '@/lib/types/room-type.type';
import { groupRoomTypesByVilla } from '../_utils';
import {
    defaultVillaRoomPricingForm,
    RoomsAndPricingFormType,
} from '../_utils/rooms-and-pricing-schema';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';

interface Props {
    watch: UseFormWatch<RoomsAndPricingFormType>;
    control: Control<RoomsAndPricingFormType, any, FieldValues>;
    setValue: UseFormSetValue<RoomsAndPricingFormType>;
    errors: FieldErrors<RoomsAndPricingFormType>;
    isEdit?: boolean;
}

const RoomsAndPricingRoomsForm = ({ watch, control, setValue, errors, isEdit }: Props) => {
    const { data: roomTypes, isLoading } = useGetRoomTypes();

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'rooms',
    });

    const selectedVillaUuid = watch('villa_class_uuid');
    const lastVillaUuidRef = useRef('');

    const roomTypesByVilla = useMemo(() => {
        return groupRoomTypesByVilla(roomTypes?.data || []);
    }, [roomTypes?.data]);

    const availableRoomTypes: RoomTypeType[] = selectedVillaUuid ? (roomTypesByVilla[selectedVillaUuid] || []) : [];

    useEffect(() => {
        if (isEdit) {
            return;
        }

        if (!selectedVillaUuid) {
            lastVillaUuidRef.current = '';
            return;
        }

        if (availableRoomTypes.length === 0) {
            return;
        }

        if (lastVillaUuidRef.current === selectedVillaUuid) {
            return;
        }

        replace(
            availableRoomTypes.map((roomType) => ({
                ...defaultVillaRoomPricingForm,
                room_type_uuid: roomType.uuid,
                max_adult: roomType.occupancy || 1,
                max_child: 0,
            })),
        );

        setValue('room_type_uuid', availableRoomTypes[0].uuid);
        lastVillaUuidRef.current = selectedVillaUuid;
    }, [availableRoomTypes, isEdit, replace, selectedVillaUuid, setValue]);

    return (
        <FormCard
            title="Villa Rooms"
            subTitle="Add and price each room inside the selected villa"
            cardHeaderComponent={
                <Button
                    variant="outlined"
                    color="black"
                    size="small"
                    className="h-fit"
                    startIcon={<CirclePlus size={'1rem'} />}
                    onClick={() =>
                        append({
                            ...defaultVillaRoomPricingForm,
                            max_adult: 1,
                            max_child: 0,
                        })
                    }
                    disabled={!selectedVillaUuid}
                >
                    Add Room
                </Button>
            }
        >
            {!selectedVillaUuid && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                    Select a villa first to load its rooms.
                </div>
            )}

            {selectedVillaUuid && fields.length === 0 && !isLoading && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                    No rooms found for the selected villa.
                </div>
            )}

            <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <Typography variant="subtitle2" className="font-semibold text-gray-800">
                                    Room {index + 1}
                                </Typography>
                                <Typography variant="caption" className="text-gray-500">
                                    Price and occupancy for this room inside the villa
                                </Typography>
                            </div>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => remove(index)}
                                className="h-10 min-w-10 px-3"
                                disabled={fields.length === 1}
                            >
                                <Trash2 size={'1rem'} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <AutoComplete
                                control={control}
                                name={`rooms.${index}.room_type_uuid`}
                                label="Room Type"
                                options={availableRoomTypes.map((roomType) => ({
                                    label: `${roomType.name} (${roomType.code})`,
                                    value: roomType.uuid,
                                }))}
                                loading={isLoading}
                                className="col-span-2"
                            />

                            <NumberInput
                                control={control}
                                name={`rooms.${index}.base_price`}
                                label="Base Price"
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                        size: 'small',
                                    },
                                }}
                            />
                            <NumberInput
                                control={control}
                                name={`rooms.${index}.selling_price`}
                                label="Selling Price"
                                size="small"
                                slotProps={{
                                    input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
                                }}
                            />
                            <NumberInput
                                control={control}
                                name={`rooms.${index}.agent_price`}
                                label="Agent Price"
                                size="small"
                                slotProps={{
                                    input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
                                }}
                            />

                            <NumberInput
                                control={control}
                                name={`rooms.${index}.max_adult`}
                                label="Max Adult"
                                size="small"
                            />
                            <NumberInput
                                control={control}
                                name={`rooms.${index}.max_child`}
                                label="Max Child"
                                size="small"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {errors.rooms && (
                <Typography variant="body2" className="mt-2 text-sm text-red-500">
                    {Array.isArray(errors.rooms) ? '' : errors.rooms.message}
                </Typography>
            )}
        </FormCard>
    );
};

export default RoomsAndPricingRoomsForm;