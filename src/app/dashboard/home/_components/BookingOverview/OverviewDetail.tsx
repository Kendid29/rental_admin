import { Avatar, Chip, Paper, Typography } from '@mui/material';

import { startCase } from 'lodash';
import { BedSingle, PackageOpen, UserRound } from 'lucide-react';
import { motion } from 'motion/react';

import { getBookingStatusColor } from '@/app/dashboard/booking/_utils';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { getRelativeTime } from '@/lib/utils';
import useGetBookingOverviewDetail from '@/services/dashboard/useGetBookingOverviewDetail';

import LoadingSkeleton from './LoadingSkeleton';

interface OverviewDetailProps {
  type: 'booking_detail' | 'check_in_detail' | 'check_out_detail';
  date: string;
}

const OverviewDetail = ({ type, date }: OverviewDetailProps) => {
  const { isZh, tStatus } = useTranslation();
  const { data, isLoading } = useGetBookingOverviewDetail({
    params: {
      type,
      date,
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex min-w-2xl flex-col gap-2"
    >
      <div className="flex w-full justify-between gap-2 px-4">
        <Typography className="font-semibold">{isZh ? '住客姓名' : "Guests Name's"}</Typography>
        <div className="flex gap-16">
          <Typography variant="body2">{isZh ? '客房' : 'Rooms'}</Typography>
          <Typography variant="body2">{isZh ? '人数' : 'Persons'}</Typography>
        </div>
      </div>

      {isLoading && Array.from({ length: 5 }).map((_, i) => <LoadingSkeleton key={i} />)}

      <div className="flex max-h-[342px] flex-col gap-2 overflow-y-auto">
        {data?.map((item, i) => (
          <Paper variant="outlined" key={i} className="flex justify-between gap-4 p-4">
            <div className="flex items-center gap-2">
              <Avatar src={item.image} />
              <div>
                <Typography variant="body1" className="font-semibold">
                  {item.guest_name}
                </Typography>
                <div className="flex items-center gap-2">
                  <Chip
                    size="small"
                    label={tStatus(item.status)}
                    color={getBookingStatusColor(item.status)}
                  />
                  {item.check_in_at && (
                    <Typography variant="caption" className="text-gray-500">
                      {getRelativeTime(item.check_in_at)}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-6">
              <Typography variant="body2" className="flex items-center gap-1">
                <BedSingle size="1rem" /> {item.room_count} {isZh ? '间房' : 'room(s)'}
              </Typography>
              <Typography variant="body2" className="flex items-center gap-1">
                <UserRound size="1rem" /> {item.person_count} {isZh ? '人' : 'person(s)'}
              </Typography>
            </div>
          </Paper>
        ))}
      </div>

      {data?.length === 0 && (
        <div className="flex h-[334px] w-full flex-col items-center justify-center gap-2">
          <Typography variant="body2" className="text-center">
            {isZh ? '暂无数据记录' : 'No data found'}
          </Typography>
        </div>
      )}
    </motion.div>
  );
};

export default OverviewDetail;
