import { Chip, Typography } from '@mui/material';

import dayjs from 'dayjs';
import {
  Ban,
  CalendarCheck2,
  Car,
  CheckCircle2,
  Clock,
  History as HistoryIcon,
  Send,
} from 'lucide-react';

import FormCard from '@/components/ui/form/FormCard';
import { TransaksiTimelineItem } from '@/lib/types/booking.type';
import { cn } from '@/lib/utils';

interface Props {
  timeline?: TransaksiTimelineItem[];
}

const getTimelineIcon = (status: string) => {
  switch (status) {
    case 'menunggu_konfirmasi':
      return <Clock size={16} className="text-amber-600" />;
    case 'terkonfirmasi':
      return <CheckCircle2 size={16} className="text-blue-600" />;
    case 'diteruskan_mitra':
      return <Send size={16} className="text-purple-600" />;
    case 'berjalan':
      return <Car size={16} className="text-indigo-600" />;
    case 'selesai':
      return <CalendarCheck2 size={16} className="text-emerald-600" />;
    case 'dibatalkan':
      return <Ban size={16} className="text-rose-600" />;
    default:
      return <HistoryIcon size={16} className="text-slate-500" />;
  }
};

const getTimelineBadgeColor = (
  status: string,
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'menunggu_konfirmasi':
      return 'warning';
    case 'terkonfirmasi':
      return 'info';
    case 'diteruskan_mitra':
      return 'secondary';
    case 'berjalan':
      return 'primary';
    case 'selesai':
      return 'success';
    case 'dibatalkan':
      return 'error';
    default:
      return 'default';
  }
};

const TransaksiTimeline = ({ timeline = [] }: Props) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  return (
    <FormCard
      title={
        <Typography className="flex items-center gap-1.5 text-lg font-semibold text-slate-800">
          <History size={'1.1rem'} className="text-primary-600" />
          Riwayat Progres Transaksi
        </Typography>
      }
      className="-mt-2 flex flex-col"
    >
      <div className="relative pl-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-slate-200">
        {timeline.map((item, index) => {
          const isLatest = index === timeline.length - 1;

          return (
            <div key={`${item.timestamp}-${index}`} className="relative mb-6 last:mb-0">
              {/* Dot / Icon */}
              <div
                className={cn(
                  'absolute top-0 -left-[30px] flex size-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow-xs',
                  isLatest && 'ring-primary-500 ring-2 ring-offset-1',
                )}
              >
                {getTimelineIcon(item.status)}
              </div>

              {/* Content Card */}
              <div className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                    <Chip
                      size="small"
                      label={item.status.replace(/_/gu, ' ')}
                      color={getTimelineBadgeColor(item.status)}
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem', textTransform: 'capitalize' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    {dayjs(item.timestamp).format('DD MMM YYYY, HH:mm [WIB]')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Oleh: <strong className="text-slate-800">{item.actor}</strong>
                  </span>
                  {item.notes && <span className="text-slate-500 italic">{item.notes}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FormCard>
  );
};

export default TransaksiTimeline;
