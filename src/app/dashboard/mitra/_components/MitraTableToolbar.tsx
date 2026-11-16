import { memo } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';

export interface MitraTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Aktif', value: 'aktif' },
  { label: 'Tidak Aktif', value: 'tidak_aktif' },
  { label: 'Ditangguhkan', value: 'ditangguhkan' },
];

const MitraTableToolbar = ({ onSearch, status, onStatusChange }: MitraTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-wrap gap-3 border-b-0 p-3 sm:flex-nowrap">
      <div className="flex gap-3">
        <AutoComplete
          name="cooperation_status"
          options={statusOptions}
          onChange={(_, value) => onStatusChange(value as string)}
          value={status}
          className="w-48"
          renderInputProps={{ label: 'Status Kerja Sama' }}
        />
      </div>

      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Cari nama mitra, kota, email, atau kontak..."
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

export default memo(MitraTableToolbar);
