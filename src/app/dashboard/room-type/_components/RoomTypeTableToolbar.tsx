'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';

import { BATH_TYPE, BED_TYPE } from '../_utils';

export interface RoomTypeTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  bedType: string;
  onBedTypeChange: (value: string) => void;
  bathType: string;
  onBathTypeChange: (value: string) => void;
}

const RoomTypeTableToolbar = ({
  onSearch,
  onBedTypeChange,
  bedType,
  bathType,
  onBathTypeChange,
}: RoomTypeTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="bedType"
          options={BED_TYPE}
          onChange={(_, value) => onBedTypeChange(value as string)}
          value={bedType}
          className="w-52"
          renderInputProps={{ label: 'Bed Type' }}
        />
        <AutoComplete
          name="bathType"
          options={BATH_TYPE}
          onChange={(_, value) => onBathTypeChange(value as string)}
          value={bathType}
          className="w-52"
          renderInputProps={{ label: 'Bath Type' }}
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
                <Search size={'1rem'} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Toolbar>
  );
};

export default RoomTypeTableToolbar;
