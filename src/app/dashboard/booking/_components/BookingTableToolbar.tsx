'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';

import { BOOKING_STATUS } from '../_utils';

export interface BookingTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const BookingTableToolbar = ({ onSearch, onStatusChange, status }: BookingTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="status"
          options={BOOKING_STATUS}
          onChange={(_, value) => onStatusChange(value as string)}
          value={status}
          className="w-52"
          renderInputProps={{ label: 'Status' }}
        />
      </div>

      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search..."
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size="1rem" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Toolbar>
  );
};

export default BookingTableToolbar;
