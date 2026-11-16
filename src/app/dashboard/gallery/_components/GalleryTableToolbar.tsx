'use client';

import React from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { useTranslation } from '@/lib/hooks/useTranslation';

export interface GalleryTableToolbarProps {
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive') => void;
}

const GalleryTableToolbar = ({
  statusFilter,
  onStatusFilterChange,
}: GalleryTableToolbarProps) => {
  const { isZh } = useTranslation();

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4 items-center py-2 px-0">
      {/* Status Filter Select */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="gallery-toolbar-status-filter-label">
          {isZh ? '状态' : 'Status'}
        </InputLabel>
        <Select
          labelId="gallery-toolbar-status-filter-label"
          value={statusFilter}
          label={isZh ? '状态' : 'Status'}
          onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'inactive')}
        >
          <MenuItem value="all">{isZh ? '全部状态' : 'All Status'}</MenuItem>
          <MenuItem value="active">{isZh ? '仅启用' : 'Active Only'}</MenuItem>
          <MenuItem value="inactive">{isZh ? '仅禁用' : 'Inactive Only'}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default GalleryTableToolbar;
