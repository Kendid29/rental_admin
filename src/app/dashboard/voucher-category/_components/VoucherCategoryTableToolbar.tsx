import { memo } from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import TextInput from '@/components/ui/form/TextInput';

export interface VoucherCategoryTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
}

const VoucherCategoryTableToolbar = ({ onSearch }: VoucherCategoryTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3" />
      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search..."
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

export default memo(VoucherCategoryTableToolbar);
