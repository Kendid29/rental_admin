'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';
import useGetVoucherCategories from '@/services/voucher-category/useGetVoucherCategories';

export interface VoucherTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  voucherCategory: string;
  onVoucherCategoryChange: (value: string) => void;
  voucherType: string;
  onVoucherTypeChange: (value: string) => void;
}

const VOUCHER_TYPE = [
  {
    label: 'Percentage',
    value: 'percentage',
  },
  {
    label: 'Nominal',
    value: 'nominal',
  },
];

const VoucherTableToolbar = ({
  onSearch,
  voucherCategory,
  onVoucherCategoryChange,
  voucherType,
  onVoucherTypeChange,
}: VoucherTableToolbarProps) => {
  const { data: voucherCategories, isLoading: isVoucherCategoriesLoading } =
    useGetVoucherCategories();

  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="voucherCategory"
          options={
            voucherCategories?.data.map((_voucherCategory) => ({
              label: _voucherCategory.name,
              value: _voucherCategory.uuid,
            })) || []
          }
          onChange={(_, value) => onVoucherCategoryChange(value as string)}
          value={voucherCategory}
          className="w-52"
          renderInputProps={{ label: 'Voucher Category' }}
          loading={isVoucherCategoriesLoading}
        />
        <AutoComplete
          name="voucherType"
          options={VOUCHER_TYPE}
          onChange={(_, value) => onVoucherTypeChange(value as string)}
          value={voucherType}
          className="w-52"
          renderInputProps={{ label: 'Voucher Type' }}
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

export default VoucherTableToolbar;
