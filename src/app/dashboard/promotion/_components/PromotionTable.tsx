'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import { Chip, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import DataGrid from '@/components/mui/DataGrid';
import Menu from '@/components/mui/Menu';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import InlineStatusToggle from '@/components/ui/InlineStatusToggle';
import { environment } from '@/constant';
import useTablePagination from '@/lib/hooks/useTablePagination';
import formatToRp from '@/lib/utils/formatToRp';
import useDeletePromotion from '@/services/promotion/useDeletePromotion';
import useGetPromotions from '@/services/promotion/useGetPromotions';
import useQuickToggleStatus from '@/services/useQuickToggleStatus';

import PromotionTableToolbar, { PromotionTableToolbarProps } from './PromotionTableToolbar';

const PromotionTable = () => {
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [uuid, setUuid] = useState('');
  const [promoCategory, setPromoCategory] = useState('');
  const [promoType, setPromoType] = useState('');

  const { data: rawData, isLoading } = useGetPromotions({
    params: {
      with_pagination: 'true',
      page: `${paginationModel.page + 1}`,
      per_page: `${paginationModel.pageSize}`,
      search_param: search,
      promo_category_uuid: promoCategory,
      promo_type: promoType,
    },
  });

  const { mutate, isPending } = useDeletePromotion();
  const {
    mutate: toggleStatus,
    isPending: isToggling,
    variables: toggleVariables,
  } = useQuickToggleStatus();

  const data = useMemo(() => {
    return rawData
      ? rawData.data.map((item) => ({
          ...item,
          id: item.uuid,
        }))
      : [];
  }, [rawData]);

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: 'name',
      headerName: 'Name',
      hideable: false,
      flex: 3,
      valueGetter: (_, row) => row.name,
    },
    {
      field: 'promo_category',
      headerName: 'Category',
      flex: 2,
      valueGetter: (_, row) => row.promo_category.name || '-',
    },
    {
      field: 'promo_type',
      headerName: 'Type',
      flex: 1,
      renderCell(params) {
        return (
          <Chip
            label={params.row.promo_type}
            size="small"
            color={params.row.promo_type === 'percentage' ? 'info' : 'success'}
          />
        );
      },
    },
    {
      field: 'discount_amount',
      headerName: 'Discount Amount',
      flex: 1,
      valueGetter: (_, row) =>
        row.promo_type === 'percentage' && row.discount_percentage
          ? `${Number(row.discount_percentage).toFixed(2)}%`
          : formatToRp(row.discount_nominal),
    },

    {
      field: 'is_published',
      headerName: 'Is Published',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <InlineStatusToggle
          checked={Boolean(params.row.is_published)}
          loading={isToggling && toggleVariables?.item.uuid === params.row.uuid}
          label={`Published status for ${params.row.name}`}
          onChange={(value) => toggleStatus({ entity: 'promotion', item: params.row, value })}
        />
      ),
    },
    {
      field: 'uuid',
      headerName: '',
      width: 50,
      sortable: false,
      resizable: false,
      disableColumnMenu: true,
      type: 'actions',
      renderCell(params) {
        return (
          <Menu
            Button={IconButton}
            buttonProps={{
              children: <EllipsisVertical size={'1rem'} />,
            }}
          >
            <MenuItem
              component={Link}
              href={`/dashboard/promotion/${params.row.uuid}`}
              className="gap-2"
            >
              <ListItemIcon>
                <Pencil size="1rem" />
              </ListItemIcon>
              Edit
            </MenuItem>
            {environment !== 'prod' && (
              <React.Fragment>
                <Divider key="promotion-divider" className="-mx-4 my-1" />
                <MenuItem
                  key="promotion-delete"
                  className="gap-2 text-red-500"
                  onClick={() => setUuid(params.row.uuid)}
                >
                  <ListItemIcon>
                    <Trash2 size="1rem" className="text-red-500" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </React.Fragment>
            )}
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex h-1 flex-grow flex-col pb-16">
        <DataGrid
          rows={data}
          columns={columns}
          checkboxSelection={false}
          slotProps={{
            toolbar: {
              onSearch: (val) => setSearch(val),
              promoCategory,
              onPromoCategoryChange: setPromoCategory,
              promoType,
              onPromoTypeChange: setPromoType,
            } as PromotionTableToolbarProps,
          }}
          slots={{
            toolbar: PromotionTableToolbar as any,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationResponse={rawData?.pagination}
          paginationMode="server"
          showToolbar
          loading={isLoading}
        />
      </div>
      <DeleteConfirmationModal
        open={!!uuid}
        onClose={() => setUuid('')}
        onConfirm={() =>
          mutate(
            { uuid, version: data.find((item) => item.uuid === uuid)?.version || 0 },
            {
              onSuccess() {
                setUuid('');
              },
            },
          )
        }
        loading={isPending}
        title="Delete Promotion"
        content="Are you sure you want to delete this promotion? This action cannot be undone."
      />
    </>
  );
};

export default PromotionTable;
