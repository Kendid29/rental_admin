'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';
import useGetRoomTypes from '@/services/room-type/useGetRoomTypes';

import { BED_TYPE } from '../../room-type/_utils';

export interface RoomsAndPricingTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  roomType: string;
  onRoomTypeChange: (value: string) => void;
  bedType: string;
  onBedTypeChange: (value: string) => void;
}

const RoomsAndPricingTableToolbar = ({
  onSearch,
  onRoomTypeChange,
  roomType,
  bedType,
  onBedTypeChange,
}: RoomsAndPricingTableToolbarProps) => {
  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useGetRoomTypes();

  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="roomType"
          options={
            roomTypes?.data.map((_roomType) => ({
              label: _roomType.name,
              value: _roomType.uuid,
            })) || []
          }
          onChange={(_, value) => onRoomTypeChange(value as string)}
          value={roomType}
          className="w-52"
          renderInputProps={{ label: 'Room Type' }}
          loading={isLoadingRoomTypes}
        />
        <AutoComplete
          name="bedType"
          options={BED_TYPE}
          onChange={(_, value) => onBedTypeChange(value as string)}
          value={bedType}
          className="w-52"
          renderInputProps={{ label: 'Bed Type' }}
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

export default RoomsAndPricingTableToolbar;
