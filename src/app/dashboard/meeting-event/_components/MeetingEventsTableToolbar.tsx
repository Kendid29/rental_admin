'use client';

import React from 'react';

import { InputAdornment } from '@mui/material';
import { GridToolbarProps, Toolbar } from '@mui/x-data-grid';

import { Search } from 'lucide-react';

import AutoComplete from '@/components/ui/form/AutoComplete';
import TextInput from '@/components/ui/form/TextInput';
import useGetMeetingLayouts from '@/services/meeting-layout/useGetMeetingLayouts';
import useGetMeetingPackages from '@/services/meeting-package/useGetMeetingPackages';

export interface MeetingEventsTableToolbarProps extends GridToolbarProps {
  onSearch: (value: string) => void;
  meetingPackage?: string;
  onMeetingPackageChange: (value: string) => void;
  meetingLayout?: string;
  onMeetingLayoutChange: (value: string) => void;
}

const MeetingEventsTableToolbar = ({
  onSearch,
  meetingPackage,
  onMeetingPackageChange,
  meetingLayout,
  onMeetingLayoutChange,
}: MeetingEventsTableToolbarProps) => {
  const { data: packages } = useGetMeetingPackages();
  const { data: layouts } = useGetMeetingLayouts();

  return (
    <Toolbar className="flex min-h-auto flex-nowrap gap-3 border-b-0 p-3">
      <div className="flex gap-3">
        <AutoComplete
          name="package"
          options={
            packages?.data?.map((d) => ({
              label: d.name,
              value: d.uuid,
            })) || []
          }
          onChange={(_, value) => onMeetingPackageChange(value as string)}
          value={meetingPackage}
          className="w-52"
          renderInputProps={{ label: 'Meeting Package' }}
        />
        <AutoComplete
          name="layout"
          options={
            layouts?.data?.map((d) => ({
              label: d.name,
              value: d.uuid,
            })) || []
          }
          onChange={(_, value) => onMeetingLayoutChange(value as string)}
          value={meetingLayout}
          className="w-52"
          renderInputProps={{ label: 'Meeting Layout' }}
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

export default MeetingEventsTableToolbar;
