'use client';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import DatePicker from '@/components/ui/form/DatePicker';
import TextInput from '@/components/ui/form/TextInput';
import { ACTION_OPTIONS } from '../_utils';

export interface ActivityLogTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
  action: string;
  onActionChange: (action: string) => void;
  dateRange: string;
  onDateRangeChange: (dateRange: string) => void;
}

const ActivityLogTableToolbar = ({
  onSearch,
  action,
  onActionChange,
  dateRange,
  onDateRangeChange,
}: ActivityLogTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-wrap items-center gap-3 border-b-0 p-3">
      <div className="flex flex-wrap items-center gap-3">
        <DatePicker
          name="date_range"
          value={dateRange}
          onChange={(value) => onDateRangeChange(value)}
          className="w-56"
          label="Date Range"
          slotProps={{
            textField: { size: 'small' },
          }}
          mode="range"
          disabled={{
            after: new Date(),
          }}
        />

        <AutoComplete
          name="action_filter"
          options={ACTION_OPTIONS}
          onChange={(_, value) => onActionChange((value as string) || '')}
          value={action}
          className="w-48"
          renderInputProps={{ label: 'Filter Action', size: 'small' }}
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <TextInput
          size="small"
          name="search"
          onChange={(e) => onSearch(e.target.value)}
          fullWidth
          placeholder="Cari deskripsi, pelaku, atau modul..."
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
      </div>
    </Toolbar>
  );
};

export default ActivityLogTableToolbar;
