import dayjs from 'dayjs';

import { getDateRangeArray } from '@/lib/utils';

const parseDateRangeToDatesBySelectedDate = (
  dateRange: string,
  selectedDates: Record<string, boolean>,
) => {
  const dates = dateRange.split(' to ');
  const selectedDaysArr = Object.values(selectedDates);

  return getDateRangeArray(dates[0], dates[1]).filter((date) => selectedDaysArr[dayjs(date).day()]);
};

export { parseDateRangeToDatesBySelectedDate };
