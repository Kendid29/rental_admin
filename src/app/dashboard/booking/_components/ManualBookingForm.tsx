'use client';

import React, { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs, { Dayjs } from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import useCreateBooking from '@/services/booking/useCreateBooking';
import useGetPackageTourPricings from '@/services/package-tour-pricing/useGetPackageTourPricings';
import useGetRoomsAndPricings from '@/services/rooms-and-pricing/useGetRoomsAndPricings';
import useGetVillaClasses from '@/services/villa-class/useGetVillaClasses';

import {
  defaultManualBookingForm,
  ManualBookingFormSchema,
  ManualBookingFormType,
} from '../_utils/manual-booking-schema';
import ManualBookingGuestForm from './ManualBookingGuestForm';
import ManualBookingItemsForm from './ManualBookingItemsForm';
import ManualBookingPeriodForm from './ManualBookingPeriodForm';
import ManualBookingSummaryForm from './ManualBookingSummaryForm';

const ManualBookingForm = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManualBookingFormType>({
    resolver: zodResolver(ManualBookingFormSchema) as any,
    defaultValues: defaultManualBookingForm,
  });

  const checkInDate = watch('check_in') as Dayjs;
  const checkOutDate = watch('check_out') as Dayjs;
  const roomsWatch = watch('rooms') || [];
  const toursWatch = watch('package_tours') || [];
  const manualDiscountWatch = watch('manual_discount') || 0;

  const agentUuid = watch('agent_uuid');
  const bookingType = watch('booking_type');
  const villaUuid = watch('villa_uuid');
  const isFullVilla = bookingType === 'full_villa';

  React.useEffect(() => {
    if (checkInDate && checkOutDate && !checkOutDate.isAfter(checkInDate)) {
      setValue('check_out', checkInDate.add(1, 'day'));
    }
  }, [checkInDate, checkOutDate, setValue]);

  const isDatesValid = useMemo(() => {
    return !!checkInDate && !!checkOutDate && checkOutDate.isAfter(checkInDate);
  }, [checkInDate, checkOutDate]);

  const { data: roomData, isLoading: isRoomLoading } = useGetRoomsAndPricings({
    params: {
      check_in: checkInDate?.format('YYYY-MM-DD') || '',
      check_out: checkOutDate?.format('YYYY-MM-DD') || '',
      has_quantity: 'true',
    },
    enabled: isDatesValid,
  });

  const { data: tourData, isLoading: isTourLoading } = useGetPackageTourPricings({
    params: {
      check_in: checkInDate?.format('YYYY-MM-DD') || '',
      check_out: checkOutDate?.format('YYYY-MM-DD') || '',
      has_quantity: 'true',
    },
    enabled: isDatesValid,
  });

  const { data: villaData, isLoading: isVillaLoading } = useGetVillaClasses();

  const { mutate, isPending } = useCreateBooking({
    onSuccess: () => {
      toast.success('Booking created successfully');
      router.push('/dashboard/booking');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err.message || 'Failed to create booking');
    },
  });

  React.useEffect(() => {
    const useAgentPrice = !!agentUuid && agentUuid !== '';

    if (roomsWatch.length > 0) {
      const updatedRooms = roomsWatch.map((room) => {
        const roomInfo = roomData?.data?.find((r) => r.uuid === room.room_pricing_uuid);
        if (roomInfo) {
          const price = useAgentPrice ? roomInfo.agent_price : roomInfo.selling_price;
          return { ...room, price: Number(price), total_price: Number(price) * room.quantity };
        }
        return room;
      });
      setValue('rooms', updatedRooms);
    }

    if (toursWatch.length > 0) {
      const updatedTours = toursWatch.map((tour) => {
        const tourInfo = tourData?.data?.find((t) => t.uuid === tour.package_tour_pricing_uuid);
        if (tourInfo) {
          const price = useAgentPrice
            ? tourInfo.price_ranges?.[0]?.agent_price || 0
            : tourInfo.price_ranges?.[0]?.price || 0;
          return { ...tour, price: Number(price), total_price: Number(price) * tour.quantity };
        }
        return tour;
      });
      setValue('package_tours', updatedTours);
    }
  }, [agentUuid, roomData, tourData]);

  React.useEffect(() => {
    if (bookingType === 'full_villa') {
      setValue('rooms', []);
    } else if (bookingType === 'package_tour') {
      setValue('rooms', []);
      setValue('villa_uuid', '');
    } else if (bookingType === 'room') {
      setValue('villa_uuid', '');
    }
  }, [bookingType, setValue]);

  const villaPrice = useMemo(() => {
    if (!isFullVilla || !villaUuid || !checkInDate || !checkOutDate || !roomData?.data) return 0;

    const useAgentPrice = !!agentUuid && agentUuid !== '';
    const start = dayjs(checkInDate);
    const end = dayjs(checkOutDate);
    const totalDays = end.diff(start, 'day');

    let total = 0;
    for (let i = 0; i < totalDays; i++) {
      const currentDateStr = start.add(i, 'day').format('YYYY-MM-DD');
      const matches = roomData.data.filter((r) => {
        const vUuid = r.villa_class_uuid || r.villa_class?.uuid;
        const rDateStr = dayjs(r.date).format('YYYY-MM-DD');
        return vUuid === villaUuid && rDateStr === currentDateStr;
      });
      const dailyRecord = matches.find((r) => r.villa_selling_price !== null && r.villa_selling_price !== undefined) || matches[0];

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
    return total;
  }, [isFullVilla, villaUuid, checkInDate, checkOutDate, roomData, agentUuid]);

  const accommodationSubtotal = useMemo(() => {
    if (isFullVilla) {
      return villaPrice;
    }
    return roomsWatch.reduce((acc, r) => {
      let roomTotal = (r.price || 0) * (r.quantity || 1);
      r.addons?.forEach((a) => {
        roomTotal += (a.price || 0) * (a.quantity || 1);
      });
      return acc + roomTotal;
    }, 0);
  }, [isFullVilla, villaPrice, roomsWatch]);

  const subTotal = useMemo(() => {
    let total = accommodationSubtotal;
    toursWatch.forEach((t) => {
      total += (t.price || 0) * (t.quantity || 1);
    });
    return total;
  }, [accommodationSubtotal, toursWatch]);

  const totalPayment = useMemo(() => {
    return Math.max(0, subTotal - manualDiscountWatch);
  }, [subTotal, manualDiscountWatch]);

  React.useEffect(() => {
    setValue('total_payment', totalPayment);
    setValue('total_discount', 0);
  }, [totalPayment, setValue]);

  const onSubmit = (data: ManualBookingFormType) => {
    const useAgentPrice = !!data.agent_uuid && data.agent_uuid !== '';

    const basePayload = {
      is_manual: true as const,
      booking_source: data.booking_source,
      booking_type: data.booking_type,
      check_in: dayjs(data.check_in).format('YYYY-MM-DD'),
      check_out: dayjs(data.check_out).format('YYYY-MM-DD'),
      adult_count: data.adult_count,
      child_count: data.child_count,
      total_payment: Number(data.total_payment || 0),
      total_discount: Number(data.total_discount || 0),
      manual_discount: Number(data.manual_discount || 0),
      payment_type: data.payment_type,
      payment_status: data.payment_status,
      status: data.status,
      guest_info: data.guest_info,
      vouchers: [] as [],
      promos: [] as [],
    };

    if (data.booking_source === 'agent' && useAgentPrice) {
      (basePayload as any).agent_uuid = data.agent_uuid;
    }

    if (data.booking_type === 'full_villa') {
      const payload = {
        ...basePayload,
        villa_uuid: data.villa_uuid,
        package_tours: data.package_tours.map((t) => {
          const tourInfo = tourData?.data?.find((td) => td.uuid === t.package_tour_pricing_uuid);
          return {
            package_tour_uuid: tourInfo?.package_tour?.uuid || t.package_tour_pricing_uuid,
            quantity: t.quantity,
          };
        }),
      };
      mutate(payload as any);
    } else if (data.booking_type === 'package_tour') {
      const payload = {
        ...basePayload,
        package_tours: data.package_tours.map((t) => ({
          package_tour_pricing_uuid: t.package_tour_pricing_uuid,
          quantity: t.quantity,
        })),
      };
      mutate(payload as any);
    } else {
      const payload = {
        ...basePayload,
        rooms: data.rooms.map((r) => ({
          room_pricing_uuid: r.room_pricing_uuid,
          quantity: r.quantity,
          price: r.price,
          total_price: r.total_price,
          addons: r.addons,
        })),
        package_tours: data.package_tours.map((t) => ({
          package_tour_pricing_uuid: t.package_tour_pricing_uuid,
          quantity: t.quantity,
          price: t.price,
          total_price: t.total_price,
        })),
      };
      mutate(payload as any);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    if (bookingType === 'full_villa') {
      return !villaUuid;
    }
    if (bookingType === 'package_tour') {
      return toursWatch.length === 0;
    }
    return roomsWatch.length === 0;
  }, [bookingType, villaUuid, roomsWatch, toursWatch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="form-container max-w-8xl relative mt-4 flex w-full flex-col items-start gap-8 lg:flex-row"
    >
      <div className="flex w-full flex-col gap-8">
        <ManualBookingPeriodForm control={control} errors={errors} checkInDate={checkInDate} />

        <ManualBookingGuestForm control={control} setValue={setValue} />

        <ManualBookingItemsForm
          control={control}
          setValue={setValue}
          roomData={roomData}
          isRoomLoading={isRoomLoading}
          tourData={tourData}
          isTourLoading={isTourLoading}
          villaData={villaData}
          isVillaLoading={isVillaLoading}
          agentUuid={agentUuid}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
        />
      </div>

      <ManualBookingSummaryForm
        control={control}
        accommodationSubtotal={accommodationSubtotal}
        subTotal={subTotal}
        totalPayment={totalPayment}
        isPending={isPending}
        isSubmitDisabled={isSubmitDisabled}
      />
    </form>
  );
};

export default ManualBookingForm;

