import React, { useMemo } from 'react';

import { Button, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Control, useWatch } from 'react-hook-form';

import AutoComplete from '@/components/ui/form/AutoComplete';
import FormCard from '@/components/ui/form/FormCard';
import NumberInput from '@/components/ui/form/NumberInput';

import { ManualBookingFormType } from '../_utils/manual-booking-schema';

interface Props {
  control: Control<ManualBookingFormType, any>;
  accommodationSubtotal: number;
  subTotal: number;
  totalPayment: number;
  isPending: boolean;
  isSubmitDisabled: boolean;
}

const ManualBookingSummaryForm = ({
  control,
  accommodationSubtotal,
  subTotal,
  totalPayment,
  isPending,
  isSubmitDisabled,
}: Props) => {
  const rooms = useWatch({ control, name: 'rooms' }) || [];
  const tours = useWatch({ control, name: 'package_tours' }) || [];
  const agentUuid = useWatch({ control, name: 'agent_uuid' });
  const checkIn = useWatch({ control, name: 'check_in' });
  const checkOut = useWatch({ control, name: 'check_out' });

  const toursSubtotal = useMemo(() => {
    return tours.reduce((acc, t) => acc + (t.price || 0) * (t.quantity || 1), 0);
  }, [tours]);

  const stayDuration = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const diff = dayjs(checkOut).diff(dayjs(checkIn), 'day');
    return diff > 0 ? `${diff} Night${diff > 1 ? 's' : ''}` : null;
  }, [checkIn, checkOut]);

  return (
    <div className="sticky top-24 flex h-fit w-full min-w-[300px] flex-col gap-8 lg:w-[400px] 2xl:min-w-[500px]">
      <FormCard title="Payment & Status">
        {/* Date Summary */}
        {(checkIn || checkOut) && (
          <div className="mb-4 rounded-lg bg-gray-50 p-3">
            <div className="flex justify-between items-center mb-1">
              <Typography variant="caption" className="font-bold text-gray-500 uppercase">Stay Duration</Typography>
              <Typography variant="body2" className="font-bold color-primary">{stayDuration || '-'}</Typography>
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <Typography variant="caption" color="textSecondary" className="block">Check In</Typography>
                <Typography variant="body2" className="font-medium">{checkIn ? dayjs(checkIn).format('DD MMM YYYY') : '-'}</Typography>
              </div>
              <div className="flex-1 text-right">
                <Typography variant="caption" color="textSecondary" className="block">Check Out</Typography>
                <Typography variant="body2" className="font-medium">{checkOut ? dayjs(checkOut).format('DD MMM YYYY') : '-'}</Typography>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Section */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <Typography variant="body2" color="textSecondary">
              Accommodation Total
            </Typography>
            <Typography variant="body2">Rp {accommodationSubtotal.toLocaleString()}</Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="body2" color="textSecondary">
              Package Tours Total
            </Typography>
            <Typography variant="body2">Rp {toursSubtotal.toLocaleString()}</Typography>
          </div>
          {agentUuid && (
            <div className="mt-1 rounded-md bg-blue-50 p-2 text-center border border-blue-100">
              <Typography variant="caption" color="primary" className="font-medium italic">
                * Using Agent Special Pricing
              </Typography>
            </div>
          )}
        </div>

        <Divider className="mb-4" />

        <div className="mb-2 flex justify-between">
          <Typography variant="body2" color="textSecondary">
            Subtotal
          </Typography>
          <Typography variant="body2" className="font-semibold text-gray-700">
            Rp {subTotal.toLocaleString()}
          </Typography>
        </div>

        <NumberInput
          control={control}
          name="manual_discount"
          label="Manual Discount (Rp)"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
          className="mb-4"
        />

        <Divider className="my-4 border-dashed" />

        <div className="mb-6 flex justify-between items-center">
          <Typography variant="h6" className="font-bold text-gray-800">Total Payment</Typography>
          <Typography variant="h5" color="primary" className="font-black">
            Rp {totalPayment.toLocaleString()}
          </Typography>
        </div>

        <Divider className="mb-6" />

        <AutoComplete
          control={control}
          name="payment_type"
          label="Payment Method"
          size="small"
          options={[
            { label: 'Cash', value: 'cash' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'E-Wallet', value: 'e_wallet' },
          ]}
          renderInputProps={{ InputLabelProps: { shrink: true } }}
          className="mb-4"
        />

        <AutoComplete
          control={control}
          name="payment_status"
          label="Payment Status"
          size="small"
          options={[
            { label: 'Unpaid', value: 'unpaid' },
            { label: 'Paid', value: 'paid' },
            { label: 'Partial', value: 'partial' },
          ]}
          renderInputProps={{ InputLabelProps: { shrink: true } }}
          className="mb-4"
        />

        <AutoComplete
          control={control}
          name="status"
          label="Booking Status"
          size="small"
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Checked In', value: 'checked_in' },
          ]}
          renderInputProps={{ InputLabelProps: { shrink: true } }}
          className="mb-6"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isPending || isSubmitDisabled}
          sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px' }}
        >
          {isPending ? 'Creating...' : 'Create Booking'}
        </Button>
      </FormCard>
    </div>
  );
};

export default ManualBookingSummaryForm;

