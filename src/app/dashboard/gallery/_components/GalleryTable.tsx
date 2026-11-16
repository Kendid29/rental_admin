'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import {
  Box,
  Card,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';

import { ImageUp, Pencil, Trash2 } from 'lucide-react';

import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useDeleteGallery from '@/services/gallery/useDeleteGallery';
import useGetGalleries from '@/services/gallery/useGetGalleries';
import useUpdateGallery from '@/services/gallery/useUpdateGallery';

import GalleryTableToolbar from './GalleryTableToolbar';

const GalleryTable = () => {
  const { isZh } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Fetch galleries via API
  const { data: resData, isLoading } = useGetGalleries({
    params: {
      status: statusFilter !== 'all' ? statusFilter : '',
    },
  });

  const galleryList = resData?.data || [];

  // Mutations
  const { mutate: deleteGallery } = useDeleteGallery();
  const {
    mutate: updateGallery,
    isPending: isUpdating,
    variables: updateVariables,
  } = useUpdateGallery();

  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete action
  const handleDeleteConfirm = () => {
    if (!deleteUuid) return;
    setIsDeleting(true);
    deleteGallery(deleteUuid, {
      onSuccess() {
        setDeleteUuid(null);
        setIsDeleting(false);
      },
      onError() {
        setIsDeleting(false);
      },
    });
  };

  // Toggle status inline
  const handleToggleStatus = (
    uuid: string,
    currentStatus: 'active' | 'inactive',
    image_uuid: string,
    version: number,
  ) => {
    const newActive = currentStatus === 'inactive';

    updateGallery({
      uuid,
      data: {
        image_uuid,
        is_active: newActive,
        version,
      },
    });
  };

  const handleImageUpdate = (
    uuid: string,
    file: File,
    currentStatus: 'active' | 'inactive',
    version: number,
  ) => {
    updateGallery({
      uuid,
      data: {
        image_uuid: file,
        is_active: currentStatus === 'active',
        version,
      },
    });
  };

  return (
    <>
      {/* Toolbar filters */}
      <div className="mb-6">
        <GalleryTableToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={(status) => setStatusFilter(status)}
        />
      </div>

      {/* Loading indicator */}
      {/* eslint-disable-next-line no-nested-ternary */}
      {isLoading ? (
        <Box className="flex items-center justify-center p-16">
          <CircularProgress color="primary" />
        </Box>
      ) : galleryList.length === 0 ? (
        <Card
          variant="outlined"
          className="flex flex-col items-center justify-center rounded-2xl bg-white p-16 text-center"
        >
          <Typography variant="h6" className="mb-2 text-gray-500">
            {isZh ? '暂无图库照片' : 'No gallery photos found'}
          </Typography>
          <Typography variant="body2" className="text-stone-400">
            {isZh
              ? '请尝试调整筛选条件或添加新照片。'
              : 'Try adjusting your filters or add a new photo.'}
          </Typography>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {galleryList.map((item) => (
            <div key={item.uuid} className="h-full">
              <Card
                variant="outlined"
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-lg"
              >
                {/* Image container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  {}
                  <img
                    src={item.imageurl || item.image?.url}
                    alt="Gallery photo"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Status Overlay Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <Chip
                      size="small"
                      label={item.status === 'active' ? 'Active' : 'Inactive'}
                      color={item.status === 'active' ? 'success' : 'default'}
                      sx={{
                        fontWeight: 600,
                        backgroundColor:
                          item.status === 'active'
                            ? 'rgba(30, 127, 30, 0.9)'
                            : 'rgba(100, 100, 100, 0.9)',
                        color: '#fff',
                      }}
                    />
                  </div>
                </div>

                {/* Card Content info */}
                <Box className="flex flex-grow flex-col p-4">
                  {/* Date row */}
                  <div className="mb-4 flex min-h-8 items-center justify-between gap-2">
                    <Typography variant="caption" className="text-stone-400">
                      Added on: {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                    <Tooltip title="Update Photo">
                      <span>
                        <IconButton
                          component="label"
                          size="small"
                          disabled={isUpdating && updateVariables?.uuid === item.uuid}
                          className="hover:text-primary-500 text-stone-500 hover:bg-stone-50"
                          aria-label="Update gallery photo"
                        >
                          {isUpdating &&
                          updateVariables?.uuid === item.uuid &&
                          updateVariables.data.image_uuid instanceof File ? (
                            <CircularProgress size={16} />
                          ) : (
                            <ImageUp size={16} />
                          )}
                          <input
                            hidden
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={(event) => {
                              const file = event.target.files?.[0];

                              if (file) {
                                handleImageUpdate(item.uuid, file, item.status, item.version);
                              }
                              event.target.value = '';
                            }}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3">
                    {/* Toggle Status switch */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={item.status === 'active'}
                          onChange={() =>
                            handleToggleStatus(
                              item.uuid,
                              item.status,
                              item.image_uuid || item.image?.uuid,
                              item.version,
                            )
                          }
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          Show on Web
                        </Typography>
                      }
                    />

                    {/* Actions block */}
                    <div className="flex gap-1">
                      <Tooltip title="Edit Photo">
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/dashboard/gallery/${item.uuid}`}
                          className="hover:text-primary-500 text-stone-500 hover:bg-stone-50"
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Photo">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteUuid(item.uuid)}
                          className="text-stone-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </Box>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation popup */}
      <DeleteConfirmationModal
        open={!!deleteUuid}
        onClose={() => setDeleteUuid(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Gallery Photo"
        content="Are you sure you want to delete this photo? This action cannot be undone."
      />
    </>
  );
};

export default GalleryTable;
