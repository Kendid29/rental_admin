import { useMemo, useState } from 'react';

import { Button, Chip } from '@mui/material';

import dayjs from 'dayjs';
import { CheckCircle2, LogIn, LogOut } from 'lucide-react';

import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import FormCard from '@/components/ui/form/FormCard';
import { BookingDetailType } from '@/lib/types/booking.type';
import useCancelBooking from '@/services/booking/useCancelBooking';
import useCheckInBooking from '@/services/booking/useCheckInBooking';
import useCheckOutBooking from '@/services/booking/useCheckOutBooking';
import useConfirmBooking from '@/services/booking/useConfirmBooking';

import { getBookingStatusColor } from '../../_utils';

interface Props {
  booking?: BookingDetailType;
}

const BookingStatusActions = ({ booking }: Props) => {
  const { mutate: checkInBooking, isPending: isCheckingIn } = useCheckInBooking(
    booking?.uuid || '',
  );

  const { mutate: checkOutBooking, isPending: isCheckingOut } = useCheckOutBooking(
    booking?.uuid || '',
  );

  const { mutate: confirmBooking, isPending: isConfirming } = useConfirmBooking(
    booking?.uuid || '',
  );

  const isCanConfirm = useMemo(() => {
    if (!booking) return false;

    return booking.status.value?.toLowerCase() === 'pending';
  }, [booking]);

  const isValidForCheckIn = useMemo(() => {
    if (!booking) return false;

    return (
      booking?.status.value?.toLowerCase() === 'confirmed' &&
      (dayjs(booking.check_in).isSame(dayjs()) ||
        dayjs(booking.check_in).add(booking.duration, 'day').isAfter(dayjs()))
    );
  }, [booking]);

  const isValidForCheckOut = useMemo(() => {
    if (!booking) return false;

    return booking?.status.value?.toLowerCase() === 'checked_in';
  }, [booking]);

  const isCanCancel = useMemo(() => {
    if (!booking) return false;

    const status = booking?.status.value?.toLowerCase();

    return (
      (status === 'pending' || status === 'confirmed') &&
      booking?.rooms.every((room) => room.is_cancellable)
    );
  }, [booking]);

  const [isOpenCancelBooking, setIsOpenCancelBooking] = useState(false);

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking(booking?.uuid || '');

  return (
    <>
      <FormCard
        title="Status & Actions"
        className="-mt-2 gap-4"
        cardHeaderComponent={
          <Chip
            label={booking?.status.label}
            color={getBookingStatusColor(booking?.status.value || '')}
          />
        }
      >
        <div className="flex flex-col gap-4">
          {isCanConfirm && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<CheckCircle2 size="1rem" />}
              loading={isConfirming}
              onClick={() =>
                confirmBooking({
                  version: booking?.version || 0,
                })
              }
            >
              Confirm Booking
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              fullWidth
              disabled={!isValidForCheckIn}
              variant="contained"
              color="primary"
              startIcon={<LogIn size="1rem" />}
              size="small"
              onClick={() =>
                checkInBooking({
                  version: booking?.version || 0,
                })
              }
              loading={isCheckingIn}
            >
              Check In
            </Button>

            <Button
              fullWidth
              disabled={!isValidForCheckOut}
              variant="contained"
              color="primary"
              startIcon={<LogOut size="1rem" />}
              size="small"
              onClick={() =>
                checkOutBooking({
                  version: booking?.version || 0,
                })
              }
              loading={isCheckingOut}
            >
              Check Out
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              fullWidth
              variant="outlined"
              color="error"
              disabled={!isCanCancel}
              onClick={() => setIsOpenCancelBooking(true)}
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </FormCard>

      <DeleteConfirmationModal
        open={isOpenCancelBooking}
        onClose={() => setIsOpenCancelBooking(false)}
        onConfirm={() => {
          cancelBooking(
            { version: booking?.version || 0 },
            {
              onSuccess() {
                setIsOpenCancelBooking(false);
              },
            },
          );
        }}
        loading={isCancelling}
        title="Cancel Booking"
        content="Are you sure want to cancel this booking?"
        buttonLabel="Cancel Booking"
      />
    </>
  );
};

export default BookingStatusActions;
