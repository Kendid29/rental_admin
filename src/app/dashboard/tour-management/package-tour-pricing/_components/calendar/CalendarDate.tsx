import { ButtonBase, Chip, Paper, PaperProps, Typography } from '@mui/material';

import dayjs, { Dayjs } from 'dayjs';
import { motion } from 'motion/react';

import { PackageTourCalendarDateType } from '@/lib/types/package-tour.type';
import { cn } from '@/lib/utils';

interface Props extends PaperProps {
  date: Dayjs;
  PackageTourPricingData?: PackageTourCalendarDateType;
}

const CalendarDate = ({ date, PackageTourPricingData, onClick, ...props }: Props) => {
  return (
    <motion.div
      layoutId={date.format('YYYY-MM-DD')}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 40,
        duration: 0.4,
      }}
      style={{
        gridColumnStart: date.day() + 1,
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Paper
        variant="outlined"
        className={cn(
          'flex h-28 w-full flex-col items-start justify-start p-2 text-inherit transition hover:bg-gray-100',
          date.isSame(dayjs(), 'day') && 'bg-primary-400/10 hover:bg-primary-400/15',
        )}
        component={ButtonBase}
        {...props}
      >
        <motion.div className="flex w-full justify-between">
          <Typography className="font-semibold">{date.format('DD')}</Typography>

          {!!PackageTourPricingData?.total_pricing && (
            <Chip size="small" color="primary" label={PackageTourPricingData.total_pricing} />
          )}
        </motion.div>
      </Paper>
    </motion.div>
  );
};

export default CalendarDate;
