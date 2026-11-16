'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';

export interface ReimburseTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const REIMBURSE_STATUS_OPTIONS = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Belum Dibayar', value: 'belum_dibayar' },
  { label: 'Sudah Dibayar', value: 'sudah_dibayar' },
];

const ReimburseTableToolbar = ({
  onSearch,
  onStatusChange,
  status,
}: ReimburseTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-wrap gap-3 border-b-0 p-3 sm:flex-nowrap">
      <div className="flex gap-3">
        <AutoComplete
          name="status"
          options={REIMBURSE_STATUS_OPTIONS}
          onChange={(_, value) => onStatusChange(value as string)}
          value={status}
          className="w-52"
          renderInputProps={{ label: 'Status Reimburse' }}
        />
      </div>

      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Cari kode transaksi, nama mitra, atau unit..."
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

export default ReimburseTableToolbar;
