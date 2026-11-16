import React from 'react';

import { Button, Card, CardContent, Divider, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Control, useFieldArray, UseFormSetValue, useWatch } from 'react-hook-form';

import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';
import { PackageTourPricingType } from '@/lib/types/package-tour.type';
import { RoomsAndPricingType } from '@/lib/types/rooms-and-pricing.type';
import { VillaClassType } from '@/lib/types/villa-class.type';

import { ManualBookingFormType } from '../_utils/manual-booking-schema';

interface Props {
  control: Control<ManualBookingFormType, any>;
  setValue: UseFormSetValue<ManualBookingFormType>;
  roomData?: { data: RoomsAndPricingType[] };
  isRoomLoading: boolean;
  tourData?: { data: PackageTourPricingType[] };
  isTourLoading: boolean;
  villaData?: { data: VillaClassType[] };
  isVillaLoading: boolean;
  agentUuid?: string;
  checkInDate?: Dayjs | null;
  checkOutDate?: Dayjs | null;
}

interface FlatRoomItem {
  pricingUuid: string;
  roomTypeName: string;
  sellingPrice: number;
  agentPrice: number;
}

const ManualBookingItemsForm = ({
  control,
  setValue,
  roomData,
  isRoomLoading,
  tourData,
  isTourLoading,
  villaData,
  isVillaLoading,
  agentUuid,
  checkInDate,
  checkOutDate,
}: Props) => {
  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: 'rooms',
  });

  const {
    fields: tourFields,
    append: appendTour,
    remove: removeTour,
  } = useFieldArray({
    control,
    name: 'package_tours',
  });

  const bookingType = useWatch({ control, name: 'booking_type' });
  const selectedVillaUuid = useWatch({ control, name: 'villa_uuid' });
  const isFullVilla = bookingType === 'full_villa';

  const useAgentPrice = !!agentUuid && agentUuid !== '';

  const uniqueTours = React.useMemo(() => {
    if (!tourData?.data) return [];
    const checkIn = checkInDate ? dayjs(checkInDate).format('YYYY-MM-DD') : null;
    const checkOut = checkOutDate ? dayjs(checkOutDate).format('YYYY-MM-DD') : null;

    const seen = new Set<string>();
    return tourData.data
      .filter((pricing) => {
        if (checkIn && checkOut) {
          const pricingDateStr = dayjs(pricing.date).format('YYYY-MM-DD');
          if (pricingDateStr < checkIn || pricingDateStr >= checkOut) return false;
        }
        return true;
      })
      .filter((pricing) => {
        const tourUuid = pricing.package_tour?.uuid;
        if (!tourUuid || seen.has(tourUuid)) return false;
        seen.add(tourUuid);
        return true;
      });
  }, [tourData, checkInDate, checkOutDate]);

  const availableVillaUuids = React.useMemo(() => {
    if (!roomData?.data) return new Set<string>();
    const uuids = new Set<string>();
    roomData.data.forEach((pricing) => {
      const villaUuid = pricing.villa_class_uuid || pricing.villa_class?.uuid;
      if (villaUuid) {
        uuids.add(villaUuid);
      }
    });
    return uuids;
  }, [roomData]);

  const filteredVillas = React.useMemo(() => {
    if (!villaData?.data) return [];
    if (bookingType === 'full_villa') {
      return villaData.data.filter((v) => availableVillaUuids.has(v.uuid));
    }
    return villaData.data;
  }, [villaData, bookingType, availableVillaUuids]);

  const villaPrices = React.useMemo(() => {
    const prices: Record<string, number> = {};
    if (!roomData?.data || !checkInDate || !checkOutDate) return prices;

    const start = dayjs(checkInDate);
    const end = dayjs(checkOutDate);
    const totalDays = end.diff(start, 'day');

    availableVillaUuids.forEach((villaUuid) => {
      let total = 0;
      for (let i = 0; i < totalDays; i++) {
        const currentDateStr = start.add(i, 'day').format('YYYY-MM-DD');
        const matches = roomData.data.filter((r) => {
          const vUuid = r.villa_class_uuid || r.villa_class?.uuid;
          const rDateStr = dayjs(r.date).format('YYYY-MM-DD');
          return vUuid === villaUuid && rDateStr === currentDateStr;
        });

        const dailyRecord =
          matches.find(
            (r) => r.villa_selling_price !== null && r.villa_selling_price !== undefined,
          ) || matches[0];

        if (dailyRecord) {
          const price = useAgentPrice
            ? (dailyRecord.villa_agent_price ??
               dailyRecord.agent_price ??
               dailyRecord.villa_selling_price ??
               dailyRecord.selling_price ??
               dailyRecord.villa_base_price ??
               dailyRecord.base_price ??
               0)
            : (dailyRecord.villa_selling_price ??
               dailyRecord.selling_price ??
               dailyRecord.villa_base_price ??
               dailyRecord.base_price ??
               0);
          total += Number(price);
        }
      }
      prices[villaUuid] = total;
    });

    return prices;
  }, [roomData, checkInDate, checkOutDate, availableVillaUuids, useAgentPrice]);

  const flatRooms: FlatRoomItem[] = React.useMemo(() => {
    if (!roomData?.data) return [];
    const result: FlatRoomItem[] = [];
    roomData.data.forEach((pricing) => {
      if (pricing.rooms && pricing.rooms.length > 0) {
        pricing.rooms.forEach((r) => {
          result.push({
            pricingUuid: pricing.uuid,
            roomTypeName: r.room_type?.name || 'Room',
            sellingPrice: Number(r.selling_price) || 0,
            agentPrice: Number(r.agent_price) || 0,
          });
        });
      } else {
        result.push({
          pricingUuid: pricing.uuid,
          roomTypeName: pricing.room_type?.name || 'Room',
          sellingPrice: Number(pricing.selling_price) || 0,
          agentPrice: Number(pricing.agent_price) || 0,
        });
      }
    });
    return result;
  }, [roomData]);

  const handleAddRoom = (item: FlatRoomItem) => {
    const price = useAgentPrice ? item.agentPrice : item.sellingPrice;
    appendRoom({
      room_pricing_uuid: item.pricingUuid,
      quantity: 1,
      price,
      total_price: price,
      addons: [],
    });
  };

  const handleAddTour = (tourId: string) => {
    const selectedTour = tourData?.data?.find((t) => t.uuid === tourId);
    if (!selectedTour) return;

    const basePrice = useAgentPrice
      ? selectedTour.price_ranges?.[0]?.agent_price || 0
      : selectedTour.price_ranges?.[0]?.price || 0;

    appendTour({
      package_tour_pricing_uuid: selectedTour.uuid,
      quantity: 1,
      price: Number(basePrice) || 0,
      total_price: Number(basePrice) || 0,
    });
  };

  const handleSelectVilla = (villaUuid: string) => {
    setValue('villa_uuid', villaUuid);
  };

  return (
    <FormCard title="Rooms & Tours Selection">
      {isFullVilla && (
        <div className="mb-4">
          <Typography variant="subtitle1" className="mb-2 font-medium">
            Available Villas
          </Typography>
          <div className="flex flex-wrap gap-2">
            {isVillaLoading && <Typography variant="body2">Loading villas...</Typography>}
            {!isVillaLoading && !filteredVillas.length && (
              <Typography variant="body2" color="textSecondary">
                No villas available for these dates.
              </Typography>
            )}
            {filteredVillas.map((villa) => {
              const isSelected = selectedVillaUuid === villa.uuid;
              const price = villaPrices[villa.uuid] || 0;
              return (
                <Button
                  key={villa.uuid}
                  variant={isSelected ? 'contained' : 'outlined'}
                  size="small"
                  color={isSelected ? 'primary' : 'inherit'}
                  onClick={() => handleSelectVilla(villa.uuid)}
                  startIcon={isSelected ? <Check size="1rem" /> : <Plus size="1rem" />}
                >
                  {villa.name} {price > 0 && `(Rp ${price.toLocaleString()})`}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {bookingType === 'room' && (
        <div className="mb-4">
          <Typography variant="subtitle1" className="mb-2 font-medium">
            Available Rooms
          </Typography>
          <div className="flex flex-wrap gap-2">
            {isRoomLoading && <Typography variant="body2">Loading rooms...</Typography>}
            {!isRoomLoading && flatRooms.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                No rooms available for these dates.
              </Typography>
            )}
            {flatRooms.map((item, idx) => {
              const displayPrice = useAgentPrice ? item.agentPrice : item.sellingPrice;
              return (
                <Button
                  key={`${item.pricingUuid}-${idx}`}
                  variant="outlined"
                  size="small"
                  onClick={() => handleAddRoom(item)}
                  startIcon={<Plus size="1rem" />}
                >
                  {item.roomTypeName} (Rp {Number(displayPrice).toLocaleString()})
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TOUR: selalu tampil untuk semua booking type ── */}
      <div className="mb-4">
        <Typography variant="subtitle1" className="mb-2 font-medium">
          Available Package Tours
        </Typography>
        <div className="flex flex-wrap gap-2">
          {isTourLoading && <Typography variant="body2">Loading tours...</Typography>}
          {!isTourLoading && uniqueTours.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No tours available for these dates.
            </Typography>
          )}
          {uniqueTours.map((tour) => {
            const basePrice = useAgentPrice
              ? tour.price_ranges?.[0]?.agent_price || 0
              : tour.price_ranges?.[0]?.price || 0;
            return (
              <Button
                key={tour.uuid}
                variant="outlined"
                size="small"
                onClick={() => handleAddTour(tour.uuid)}
                startIcon={<Plus size="1rem" />}
              >
                {tour.package_tour?.name || 'Tour'} (Rp {Number(basePrice).toLocaleString()})
              </Button>
            );
          })}
        </div>
      </div>

      <Divider className="my-4" />

      {/* ── SELECTED ITEMS ── */}
      <Typography variant="subtitle1" className="mb-4 font-medium">
        Selected Items
      </Typography>

      {roomFields.length === 0 && tourFields.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No items selected.
        </Typography>
      )}

      {bookingType === 'room' &&
        roomFields.map((field, index) => {
          const matchedFlat = flatRooms.find((r) => r.pricingUuid === field.room_pricing_uuid);
          const roomName = matchedFlat?.roomTypeName || 'Selected Room';
          return (
            <Card variant="outlined" key={field.id} className="mb-2">
              <CardContent className="flex items-center justify-between p-3 pb-3">
                <div>
                  <Typography variant="body2" className="font-semibold">
                    {roomName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Price: Rp {Number(field.price).toLocaleString()}
                    {useAgentPrice && (
                      <span className="ml-2 font-medium text-blue-600">(Agent Price)</span>
                    )}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <NumberInput
                    control={control}
                    name={`rooms.${index}.quantity`}
                    label="Qty"
                    size="small"
                    sx={{ width: 80 }}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setValue(`rooms.${index}.total_price`, val * field.price);
                    }}
                  />
                  <Button
                    color="error"
                    onClick={() => removeRoom(index)}
                    sx={{ minWidth: '40px', padding: '6px' }}
                  >
                    <Trash2 size="1rem" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

      {/* Tour terpilih */}
      {tourFields.map((field, index) => {
        const tourInfo = tourData?.data?.find((t) => t.uuid === field.package_tour_pricing_uuid);
        return (
          <Card variant="outlined" key={field.id} className="mb-2">
            <CardContent className="flex items-center justify-between p-3 pb-3">
              <div>
                <Typography variant="body2" className="font-semibold">
                  {tourInfo?.package_tour?.name || 'Selected Tour'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Price: Rp {Number(field.price).toLocaleString()}
                  {useAgentPrice && (
                    <span className="ml-2 font-medium text-blue-600">(Agent Price)</span>
                  )}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <NumberInput
                  control={control}
                  name={`package_tours.${index}.quantity`}
                  label="Qty"
                  size="small"
                  sx={{ width: 80 }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setValue(`package_tours.${index}.total_price`, val * field.price);
                  }}
                />
                <Button
                  color="error"
                  onClick={() => removeTour(index)}
                  sx={{ minWidth: '40px', padding: '6px' }}
                >
                  <Trash2 size="1rem" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </FormCard>
  );
};

export default ManualBookingItemsForm;

