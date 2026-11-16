import { memo } from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import DatePicker from '@/components/ui/form/DatePicker';
import TextInput from '@/components/ui/form/TextInput';

export interface PaymentReportTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
  dateRange: string;
  onDateRangeChange: (dateRange: string) => void;
}

const BookingReportTableToolbar = ({
  onSearch,
  dateRange,
  onDateRangeChange,
}: PaymentReportTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <DatePicker
          name="date_range"
          value={dateRange}
          onChange={(value) => onDateRangeChange(value)}
          className="w-52"
          label="Date Range"
          slotProps={{
            textField: { size: 'small' },
          }}
          mode="range"
          disabled={{
            after: new Date(),
          }}
        />
      </div>
      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        fullWidth
        placeholder="Search..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={'1rem'} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Toolbar>
  );
};

export default memo(BookingReportTableToolbar);
