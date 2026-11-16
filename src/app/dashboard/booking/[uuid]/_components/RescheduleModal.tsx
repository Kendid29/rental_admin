import { useState, useMemo } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { BookingDetailType } from '@/lib/types/booking.type';
import useRescheduleBooking from '@/services/booking/useRescheduleBooking';
import useGetRoomsAndPricings from '@/services/rooms-and-pricing/useGetRoomsAndPricings';

interface Props {
  open: boolean;
  onClose: () => void;
  booking: BookingDetailType;
}

export default function RescheduleModal({ open, onClose, booking }: Props) {
  const originalTotal = booking.invoice?.grand_total ?? booking.total_payment ?? 0;

  const [checkIn, setCheckIn] = useState<Dayjs | null>(dayjs(booking.check_in));
  const [checkOut, setCheckOut] = useState<Dayjs | null>(dayjs(booking.check_out));

  const isDatesValid = useMemo(() => {
    return !!checkIn && !!checkOut && checkOut.isAfter(checkIn);
  }, [checkIn, checkOut]);

  // Fetch rooms availability for new dates
  const { data: roomData, isLoading } = useGetRoomsAndPricings({
    params: {
      check_in: checkIn?.format('YYYY-MM-DD') || '',
      check_out: checkOut?.format('YYYY-MM-DD') || '',
      has_quantity: 'true',
    },
    enabled: isDatesValid && open,
  });

  const { mutate: reschedule, isPending: isSaving } = useRescheduleBooking(booking.uuid, {
    onSuccess() {
      onClose();
    },
  });

  const checkResult = useMemo(() => {
    if (!isDatesValid || !roomData?.data || !booking.rooms) {
      return { isAvailable: false, pricingUuids: [] as string[], newPrice: 0, roomStatus: [] };
    }

    const start = dayjs(checkIn);
    const end = dayjs(checkOut);
    const totalNights = end.diff(start, 'day');
    const pricingUuids: string[] = [];
    let isAvailable = true;
    let newPrice = 0;

    const roomStatus = booking.rooms.map((bookedRoom) => {
      let minQty = Infinity;
      let priceSum = 0;
      let roomAvailable = true;

      for (let i = 0; i < totalNights; i++) {
        const dateStr = start.add(i, 'day').format('YYYY-MM-DD');
        const matches = roomData.data.filter(
          (r) =>
            r.room_type?.uuid === bookedRoom.room_type?.uuid &&
            dayjs(r.date).format('YYYY-MM-DD') === dateStr,
        );
        const match = matches[0];

        if (match) {
          minQty = Math.min(minQty, match.quantity);
          pricingUuids.push(match.uuid);
          const price = booking.membership ? match.agent_price : match.selling_price;
          priceSum += Number(price);
        } else {
          minQty = 0;
          roomAvailable = false;
        }
      }

      if (minQty < bookedRoom.quantity) {
        roomAvailable = false;
      }

      newPrice += priceSum * bookedRoom.quantity;

      return {
        roomTypeUuid: bookedRoom.room_type?.uuid,
        name: bookedRoom.room_type?.name,
        bookedQty: bookedRoom.quantity,
        availableQty: minQty === Infinity ? 0 : minQty,
        isAvailable: roomAvailable,
      };
    });

    // Check if overall is available
    isAvailable = roomStatus.every((status) => status.isAvailable);

    // Add package tours price if any
    if (booking.package_tours) {
      for (const tour of booking.package_tours) {
        newPrice += Number(tour.total_price || 0);
      }
    }

    return { isAvailable, pricingUuids, newPrice, roomStatus };
  }, [checkIn, checkOut, isDatesValid, roomData, booking]);

  const handleConfirm = () => {
    if (!checkIn || !checkOut || !checkResult.isAvailable) return;

    reschedule({
      check_in: checkIn.format('YYYY-MM-DD'),
      check_out: checkOut.format('YYYY-MM-DD'),
      version: booking.version,
      room_pricings: checkResult.pricingUuids,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reschedule Booking</DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col gap-4 py-2">
          <Typography variant="body2" color="textSecondary">
            Current Booking: {dayjs(booking.check_in).format('DD MMM YYYY')} to{' '}
            {dayjs(booking.check_out).format('DD MMM YYYY')} ({booking.duration} nights)
          </Typography>

          <Box className="grid grid-cols-2 gap-4 mt-2">
            <DatePicker
              label="New Check In"
              value={checkIn}
              onChange={(val) => setCheckIn(val)}
              format="DD MMM YYYY"
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
            <DatePicker
              label="New Check Out"
              value={checkOut}
              onChange={(val) => setCheckOut(val)}
              format="DD MMM YYYY"
              minDate={checkIn || undefined}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Box>

          {isLoading && (
            <Box className="flex justify-center items-center py-4">
              <CircularProgress size={24} className="mr-2" />
              <Typography variant="body2">Checking room availability...</Typography>
            </Box>
          )}

          {!isLoading && isDatesValid && (
            <Box className="mt-2 flex flex-col gap-4">
              <Box className="border border-zinc-200 rounded p-3 bg-zinc-50/50">
                <Typography variant="subtitle2" className="font-semibold mb-2">
                  Room Availability Details:
                </Typography>
                <Box className="flex flex-col gap-2">
                  {checkResult.roomStatus.map((status, index) => (
                    <Box
                      key={index}
                      className="flex justify-between items-center bg-white p-2.5 rounded border border-zinc-100 shadow-sm"
                    >
                      <Box>
                        <Typography variant="body2" className="font-medium text-zinc-800">
                          {status.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Booked: {status.bookedQty} room{status.bookedQty > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Box className="text-right">
                        <Typography
                          variant="body2"
                          className={`font-semibold ${
                            status.isAvailable ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {status.isAvailable ? 'Available' : 'Unavailable'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {status.availableQty} room{status.availableQty !== 1 ? 's' : ''} left
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {checkResult.isAvailable ? (
                <Box className="flex flex-col gap-2">
                  <Alert severity="success">Rooms are available for the selected dates.</Alert>
                  <Box className="bg-zinc-50 p-3 rounded border border-zinc-200 mt-2">
                    <Typography variant="subtitle2" className="font-semibold">
                      Price Comparison:
                    </Typography>
                    <Box className="flex justify-between mt-1">
                      <Typography variant="body2">Original Total:</Typography>
                      <Typography variant="body2" className="font-medium">
                        IDR {originalTotal.toLocaleString('id-ID')}
                      </Typography>
                    </Box>
                    <Box className="flex justify-between">
                      <Typography variant="body2">New Estimated Total:</Typography>
                      <Typography variant="body2" className="font-medium">
                        IDR {checkResult.newPrice?.toLocaleString('id-ID')}
                      </Typography>
                    </Box>
                    <Divider className="my-2" />
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="font-semibold">
                        Difference:
                      </Typography>
                      <Typography
                        variant="body2"
                        className={`font-semibold ${
                          checkResult.newPrice - originalTotal > 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {checkResult.newPrice - originalTotal > 0 ? '+' : ''}
                        IDR {(checkResult.newPrice - originalTotal).toLocaleString('id-ID')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Alert severity="error">
                  The requested rooms are not available or fully booked for the selected dates.
                  Please try other dates.
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          disabled={!checkResult.isAvailable || isSaving || isLoading}
          loading={isSaving}
        >
          Confirm Reschedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}
