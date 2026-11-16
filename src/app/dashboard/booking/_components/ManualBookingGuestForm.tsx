import React from 'react';

import { Divider } from '@mui/material';
import { Control, useWatch, UseFormSetValue } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import TextInput from '@/components/ui/form/TextInput';
import useGetAgents from '@/services/agent/useGetAgents';

import { ManualBookingFormType } from '../_utils/manual-booking-schema';

interface Props {
  control: Control<ManualBookingFormType, any>;
  setValue: UseFormSetValue<ManualBookingFormType>;
}

const BOOKING_SOURCE_OPTIONS = [
  { label: 'Direct (Tamu Langsung)', value: 'customer' },
  { label: 'Agent', value: 'agent' },
];

const BOOKING_TYPE_OPTIONS = [
  { label: 'Per Kamar (Room Only)', value: 'room' },
  { label: 'Full Villa', value: 'full_villa' },
  { label: 'Package Tour Only', value: 'package_tour' },
];

const ManualBookingGuestForm = ({ control, setValue }: Props) => {
  const { data: agentData, isLoading: isAgentLoading } = useGetAgents();

  const bookingSource = useWatch({ control, name: 'booking_source' });
  const isAgent = bookingSource === 'agent';

  React.useEffect(() => {
    if (bookingSource !== 'agent') {
      setValue('agent_uuid', '');
    }
  }, [bookingSource, setValue]);

  return (
    <FormCard title="Booking Configuration & Guest Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Booking Source */}
        <AutoComplete
          control={control}
          name="booking_source"
          label="Booking Source"
          size="small"
          options={BOOKING_SOURCE_OPTIONS}
          renderInputProps={{ InputLabelProps: { shrink: true } }}
        />

        {/* Booking Type */}
        <AutoComplete
          control={control}
          name="booking_type"
          label="Booking Type"
          size="small"
          options={BOOKING_TYPE_OPTIONS}
          renderInputProps={{ InputLabelProps: { shrink: true } }}
        />

        {/* Agent — hanya muncul jika booking_source = 'agent' */}
        {isAgent && (
          <AutoComplete
            control={control}
            name="agent_uuid"
            label="Pilih Agent"
            size="small"
            className="col-span-1 md:col-span-2"
            options={
              agentData?.data?.map((agent) => ({
                label: `${agent.name} — ${agent.company}`,
                value: agent.uuid,
              })) || []
            }
            loading={isAgentLoading}
            renderInputProps={{ InputLabelProps: { shrink: true } }}
          />
        )}
      </div>

      <Divider className="my-4" />

      {/* Guest Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          control={control}
          name="guest_info.name"
          label="Guest Name"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextInput
          control={control}
          name="guest_info.phone_number"
          label="Phone Number"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextInput
          control={control}
          name="guest_info.email"
          type="email"
          label="Email (Optional)"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
          className="md:col-span-2"
        />
      </div>
    </FormCard>
  );
};

export default ManualBookingGuestForm;

