'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';
import useGetDiningTypes from '@/services/dining-type/useGetDiningTypes';

export interface DiningTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  dishType: string;
  onDishTypeChange: (value: string) => void;
}

const DiningTableToolbar = ({ onSearch, dishType, onDishTypeChange }: DiningTableToolbarProps) => {
  const { data: dishTypes, isLoading: isDishTypesLoading } = useGetDiningTypes();

  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="diningType"
          options={
            dishTypes?.data.map((_dishType) => ({
              label: _dishType.label,
              value: _dishType.value,
            })) || []
          }
          onChange={(_, value) => onDishTypeChange(value as string)}
          value={dishType}
          className="w-52"
          renderInputProps={{ label: 'Dining Type' }}
          loading={isDishTypesLoading}
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

export default DiningTableToolbar;
