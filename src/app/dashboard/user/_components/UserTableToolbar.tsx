import { memo } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';

export interface UserTableToolbarProps extends GridToolbarProps {
  onSearch: (searchText: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Aktif', value: 'aktif' },
  { label: 'Tidak Aktif', value: 'tidak_aktif' },
];

const UserTableToolbar = ({ onSearch, status, onStatusChange }: UserTableToolbarProps) => {
  return (
    <Toolbar className="flex min-h-auto flex-wrap gap-3 border-b-0 p-3 sm:flex-nowrap">
      <div className="flex gap-3">
        <AutoComplete
          name="status"
          options={statusOptions}
          onChange={(_, value) => onStatusChange(value as string)}
          value={status}
          className="w-44"
          renderInputProps={{ label: 'Status' }}
        />
      </div>

      <TextInput
        size="small"
        name="search"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Cari nama, email, atau telepon user..."
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

export default memo(UserTableToolbar);
