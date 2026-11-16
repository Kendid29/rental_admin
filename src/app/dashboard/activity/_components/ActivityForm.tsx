'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Box, Button, Card } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import FileDropzone from '@/components/ui/form/FileDropzone';
import SwitchCard from '@/components/ui/form/SwitchCard';
import TextInput from '@/components/ui/form/TextInput';

import { defaultActivityForm, activityFormSchema, ActivityFormType } from '../_utils/activity-schema';

interface Props {
  initialData?: ActivityFormType;
  onSubmit: (data: ActivityFormType) => void;
  isLoading?: boolean;
}

const ActivityForm = ({ onSubmit, initialData, isLoading = false }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitted },
  } = useForm<ActivityFormType>({
    defaultValues: initialData || defaultActivityForm,
    resolver: zodResolver(activityFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted && initialData) {
      reset(initialData);
    }
  }, [isSubmitted, initialData, reset]);

  return (
    <Card variant="outlined" className="form-container p-6 bg-white rounded-2xl mt-8 shadow-sm">
      <form
        onSubmit={handleSubmit((d) => onSubmit(d))}
        className="flex flex-col gap-6"
      >
        <TextInput
          control={control}
          name="title"
          label="Activity Title"
          placeholder="e.g. Island Activities"
        />

        <TextInput
          control={control}
          name="description"
          label="Description"
          placeholder="Enter a brief description of the activity"
          multiline
          rows={4}
        />

        <FileDropzone
          control={control}
          name="image"
          label="Activity Photo"
          options={{
            multiple: false,
            accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
          }}
        />

        <SwitchCard
          control={control}
          name="is_active"
          label="CMS Published Status"
          description="Make this activity visible on the public landing page"
        />

        <Box className="flex justify-end gap-3 border-t border-gray-100 pt-6 mt-2">
          <Button
            variant="outlined"
            color="inherit"
            LinkComponent={Link}
            href="/dashboard/activity"
            sx={{ textTransform: 'none' }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
            disabled={isLoading}
          >
            {initialData ? 'Save Changes' : 'Create Activity'}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default ActivityForm;
