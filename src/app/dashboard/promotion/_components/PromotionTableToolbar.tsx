'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';
import useGetPromotionCategories from '@/services/promotion-category/useGetPromotionCategories';

export interface PromotionTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  promoCategory: string;
  onPromoCategoryChange: (value: string) => void;
  promoType: string;
  onPromoTypeChange: (value: string) => void;
}

const PROMO_TYPE = [
  {
    label: 'Percentage',
    value: 'percentage',
  },
  {
    label: 'Nominal',
    value: 'nominal',
  },
];

const PromotionTableToolbar = ({
  onSearch,
  promoCategory,
  onPromoCategoryChange,
  promoType,
  onPromoTypeChange,
}: PromotionTableToolbarProps) => {
  const { data: promoCategories, isLoading: isPromoCategoriesLoading } =
    useGetPromotionCategories();

  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="promoCategory"
          options={
            promoCategories?.data.map((_promoCategory) => ({
              label: _promoCategory.name,
              value: _promoCategory.uuid,
            })) || []
          }
          onChange={(_, value) => onPromoCategoryChange(value as string)}
          value={promoCategory}
          className="w-52"
          renderInputProps={{ label: 'Promo Category' }}
          loading={isPromoCategoriesLoading}
        />

        <AutoComplete
          name="promoType"
          options={PROMO_TYPE}
          onChange={(_, value) => onPromoTypeChange(value as string)}
          value={promoType}
          className="w-52"
          renderInputProps={{ label: 'Promo Type' }}
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

export default PromotionTableToolbar;
