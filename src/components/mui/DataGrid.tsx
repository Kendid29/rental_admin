// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair -- use of MuiDataGrid from @mui/x-data-grid
/* eslint-disable new-cap -- use of MuiDataGrid from @mui/x-data-grid */
import React, { cloneElement, isValidElement, useEffect, useMemo, useRef, useState } from 'react';

import { DataGrid as MuiDataGrid, DataGridProps, GridPaginationMeta } from '@mui/x-data-grid';

import { ChevronDown, ChevronUp, Ellipsis, Eye, EyeOff, Filter } from 'lucide-react';

import { PaginationType } from '@/lib/types/globals';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface Props extends DataGridProps {
  paginationResponse?: PaginationType;
}

const CustomIcon = (IconComponent: any) =>
  function CustomIconWrapper(props: any) {
    return <IconComponent size={'1rem'} {...props} />;
  };

const DataGrid = ({
  className,
  slotProps,
  slots,
  paginationResponse,
  columns,
  ...props
}: Props) => {
  const { tCommon } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const rowCountRef = useRef(paginationResponse?.total_data || 0);
  const paginationMetaRef = useRef<GridPaginationMeta>(undefined);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rowCount = useMemo(() => {
    if (paginationResponse?.total_data !== undefined) {
      rowCountRef.current = paginationResponse.total_data;
    }
    return rowCountRef.current;
  }, [paginationResponse?.total_data]);

  const paginationMeta = useMemo(() => {
    if (!paginationResponse?.next_page || typeof props.paginationModel?.page === 'undefined')
      return { hasNextPage: false };

    const hasNextPage = !(paginationResponse.total_page - 1 === props.paginationModel?.page);

    if (hasNextPage !== undefined && paginationMetaRef.current?.hasNextPage !== hasNextPage) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [paginationResponse]);

  if (!isMounted) {
    return (
      <div className={cn('flex w-full min-w-0 flex-grow border-stone-300 bg-white', className)} />
    );
  }

  return (
    <MuiDataGrid
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
            ...props.paginationModel,
          },
        },
      }}
      pageSizeOptions={[5, 10, 20, 50]}
      rowCount={props.paginationMode === 'server' ? rowCount : undefined}
      // paginationMode={memoizedPaginationResponse ? 'server' : 'client'}
      paginationMeta={props.paginationMode === 'server' ? paginationMeta : undefined}
      rowHeight={48}
      columnHeaderHeight={48}
      density="standard"
      checkboxSelection
      disableRowSelectionOnClick
      disableColumnSorting
      getRowClassName={
        (params) => cn()
        // 'bg-white hover:bg-gray-100',
        // params.indexRelativeToCurrentPage % 2 !== 0 && 'bg-primary-100 bg-opacity-20',
      }
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'linear-progress',
        },
        columnsManagement: {
          getTogglableColumns: () =>
            columns.filter((col) => !col.disableColumnMenu).map((col) => col.field),
        },
        ...(props.paginationMode === 'server'
          ? {
              pagination: {
                nextIconButtonProps: {
                  disabled: props.loading || !paginationMeta?.hasNextPage,
                },
                backIconButtonProps: {
                  disabled: props.loading || props.paginationModel?.page === 0,
                },
              },
            }
          : {}),
        ...slotProps,
      }}
      slots={{
        columnSortedAscendingIcon: CustomIcon(ChevronUp),
        columnMenuSortAscendingIcon: CustomIcon(ChevronUp),
        columnSortedDescendingIcon: CustomIcon(ChevronDown),
        columnMenuSortDescendingIcon: CustomIcon(ChevronDown),
        columnMenuManageColumnsIcon: CustomIcon(Eye),
        columnMenuHideIcon: CustomIcon(EyeOff),
        columnMenuFilterIcon: CustomIcon(Filter),
        columnFilteredIcon: CustomIcon(Filter),
        columnMenuIcon: CustomIcon(Ellipsis),
        ...slots,
      }}
      sx={{ borderRadius: '0.6rem' }}
      className={cn('flex w-full min-w-0 flex-grow border-stone-300 bg-white', className)}
      columns={columns.map((col) => {
        const translatedHeader = col.headerName ? tCommon(col.headerName) : col.headerName;
        const originalRenderCell = col.renderCell;
        let enhancedRenderCell = originalRenderCell;

        if (originalRenderCell) {
          enhancedRenderCell = (params: any) => {
            const rendered = originalRenderCell(params);

            if (typeof rendered === 'string') {
              return tCommon(rendered);
            }

            if (isValidElement(rendered)) {
              const el = rendered as React.ReactElement<any>;

              if (el.props?.label && typeof el.props.label === 'string') {
                return cloneElement(el, {
                  label: tCommon(el.props.label),
                });
              }
            }

            return rendered;
          };
        } else if (col.valueGetter) {
          enhancedRenderCell = (params: any) => {
            const val = col.valueGetter
              ? (col.valueGetter as any)(params.value, params.row, col, {} as any)
              : params.value;

            if (typeof val === 'string') {
              return tCommon(val);
            }

            return val;
          };
        }

        return {
          minWidth: col.width ? 0 : 100 * (col.flex || 1),
          ...col,
          headerName: translatedHeader,
          renderCell: enhancedRenderCell,
        };
      })}
      {...props}
    />
  );
};

export default DataGrid;
