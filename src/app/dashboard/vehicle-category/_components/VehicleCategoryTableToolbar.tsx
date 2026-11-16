import { memo } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';

export interface VehicleCategoryTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
  type: string;
  onTypeChange: (type: string) => void;
}

const typeOptions = [
  { label: 'Semua Tipe', value: '' },
  { label: 'Mobil', value: 'mobil' },
  { label: 'Motor', value: 'motor' },
  { label: 'Barang / Outdoor', value: 'barang' },
];

const VehicleCategoryTableToolbar = ({
  onSearch,
  type,
  onTypeChange,
}: VehicleCategoryTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-wrap gap-3 border-b-0 p-3 sm:flex-nowrap">
      <div className="flex gap-3">
        <AutoComplete
          name="type"
          options={typeOptions}
          onChange={(_, value) => onTypeChange(value as string)}
          value={type}
          className="w-48"
          renderInputProps={{ label: 'Tipe Utama' }}
        />
      </div>

      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Cari nama kategori atau deskripsi..."
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

export default memo(VehicleCategoryTableToolbar);
