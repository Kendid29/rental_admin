import { Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import { DAYS } from '@/constant/tags';
import { useRoomsAndPricingStore } from '@/lib/zustand/rooms-and-pricing.store';

import RoomsAndPricingTable from './RoomsAndPricingTable';

interface Props {
  date?: string;
}

const CalendarDetailModal = ({ date }: Props) => {
  const { selectedRoomAndPricing, setSelectedRoomAndPricing } = useRoomsAndPricingStore();

  return (
    <Dialog
      open={!!selectedRoomAndPricing}
      onClose={() => setSelectedRoomAndPricing(null)}
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
            {dayjs(selectedRoomAndPricing?.date).format('DD')}
          </Typography>

          <IconButton onClick={() => setSelectedRoomAndPricing(null)} size="small">
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
            Room and Pricing List
          </Typography>
          <div className="flex items-center gap-2">
            <Typography className="font-semibold">
              {DAYS[dayjs(selectedRoomAndPricing?.date).day()]},{' '}
              {dayjs(selectedRoomAndPricing?.date).format('DD MMM YYYY')}
            </Typography>
            <Chip
              size="small"
              label={`${selectedRoomAndPricing?.total_room_pricing} room and pricing`}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RoomsAndPricingTable date={date} />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDetailModal;
