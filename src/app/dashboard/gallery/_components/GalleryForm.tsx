'use client';

import React, { useEffect } from 'react';

import Link from 'next/link';

import { Box, Button, Card } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import FileDropzone from '@/components/ui/form/FileDropzone';
import SwitchCard from '@/components/ui/form/SwitchCard';

import { defaultGalleryForm, galleryFormSchema, GalleryFormType } from '../_utils/gallery-schema';

interface Props {
  initialValues?: GalleryFormType;
  onSubmit: (data: GalleryFormType) => void;
  isLoading?: boolean;
}

const GalleryForm = ({ onSubmit, initialValues, isLoading = false }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitted },
  } = useForm<GalleryFormType>({
    defaultValues: initialValues || defaultGalleryForm,
    resolver: zodResolver(galleryFormSchema),
  });

  useEffect(() => {
    if (!isSubmitted) {
      reset(initialValues || defaultGalleryForm);
    }
  }, [isSubmitted, initialValues, reset]);

  return (
    <Card variant="outlined" className="form-container p-6 bg-white rounded-2xl mt-8">
      <form
        onSubmit={handleSubmit((d) => onSubmit(d))}
        className="flex flex-col gap-6"
      >
        {/* Dropzone Upload */}
        <FileDropzone
          control={control}
          name="image_uuid"
          label="Photo File"
          options={{
            multiple: false,
            accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
          }}
        />

        {/* CMS Published Status Card Switch */}
        <SwitchCard
          control={control}
          name="is_active"
          label="CMS Published Status"
          description="Make this photo visible in CMS"
        />

        <Box className="flex justify-end gap-3 border-t border-stone-100 pt-6 mt-2">
          <Button
            variant="outlined"
            color="inherit"
            LinkComponent={Link}
            href="/dashboard/gallery"
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
            loading={isLoading}
          >
            {initialValues ? 'Save Changes' : 'Add Photo'}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default GalleryForm;
