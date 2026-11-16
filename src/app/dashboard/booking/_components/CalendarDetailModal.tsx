import { Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import { DAYS } from '@/constant/tags';
import { useBookingStore } from '@/lib/zustand/booking.store';

import BookingTable from './BookingTable';

interface Props {
  date?: string;
}

const CalendarDetailModal = ({ date }: Props) => {
  const { selectedBooking, setSelectedBooking } = useBookingStore();

  return (
    <Dialog
      open={!!selectedBooking}
      onClose={() => setSelectedBooking(null)}
      fullWidth
      maxWidth="lg"
      slots={{
        transition: MuiSlideTransition,
      }}
      keepMounted
    >
      <DialogTitle>
        <div className="flex justify-between">
          <Typography className="font-semibold">
            {dayjs(selectedBooking?.date).format('DD')}
          </Typography>

          <IconButton onClick={() => setSelectedBooking(null)} size="small">
            <X size={'1rem'} />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 flex justify-between"
        >
          <Typography variant="body1" className="text-lg font-semibold">
            Booking List
          </Typography>
          <div className="flex items-center gap-2">
            <Typography className="font-semibold">
              {DAYS[dayjs(selectedBooking?.date).day()]},{' '}
              {dayjs(selectedBooking?.date).format('DD MMM YYYY')}
            </Typography>
            <Chip
              size="small"
              label={`${Object.keys(selectedBooking?.total_bookings || {}).reduce((acc, key) => acc + (selectedBooking?.total_bookings?.[key as keyof typeof selectedBooking.total_bookings] || 0), 0)} bookings`}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BookingTable date={date} />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDetailModal;
