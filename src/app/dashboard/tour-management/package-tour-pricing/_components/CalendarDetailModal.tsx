import { Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import { DAYS } from '@/constant/tags';
import { usePackageTourPricingStore } from '@/lib/zustand/package-tour-pricing.store';

import PackageTourPricingTable from './PackageTourPricingTable';

interface Props {
  date?: string;
}

const CalendarDetailModal = ({ date }: Props) => {
  const { selectedPackageTourPricing, setSelectedPackageTourPricing } =
    usePackageTourPricingStore();

  return (
    <Dialog
      open={!!selectedPackageTourPricing}
      onClose={() => setSelectedPackageTourPricing(null)}
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
            {dayjs(selectedPackageTourPricing?.date).format('DD')}
          </Typography>

          <IconButton onClick={() => setSelectedPackageTourPricing(null)} size="small">
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
            Package Tour List
          </Typography>
          <div className="flex items-center gap-2">
            <Typography className="font-semibold">
              {DAYS[dayjs(selectedPackageTourPricing?.date).day()]},{' '}
              {dayjs(selectedPackageTourPricing?.date).format('DD MMM YYYY')}
            </Typography>
            <Chip
              size="small"
              label={`${selectedPackageTourPricing?.total_pricing} Package Tour`}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PackageTourPricingTable date={date} />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDetailModal;
