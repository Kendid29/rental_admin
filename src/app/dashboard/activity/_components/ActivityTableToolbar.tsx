'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import TextInput from '@/components/ui/form/TextInput';

export interface ActivityTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
}

const ActivityTableToolbar = ({ onSearch }: ActivityTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3 justify-end">
      <div className="w-64">
        <TextInput
          name="search"
          size="small"
          placeholder="Search activity..."
          onChange={(e) => onSearch(e.target.value)}
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

export default ActivityTableToolbar;
