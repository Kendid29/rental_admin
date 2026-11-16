'use client';

import { useState } from 'react';

import { Button } from '@mui/material';

import dayjs from 'dayjs';
import { FileText } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { downloadFile } from '@/lib/utils';
import useDownloadFile from '@/services/useDownloadFile';

import BookingReportTable from './_components/BookingReportTable';

const Page = () => {
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [dateRange, setDateRange] = useState(
    `${dayjs().format('YYYY-MM-01')} to ${dayjs().format('YYYY-MM-DD')}`,
  );
  const [status, setStatus] = useState('');

  const { mutate: downloadBookingReport, isPending } = useDownloadFile({
    onSuccess(data) {
      downloadFile(data, `booking-report-${dateRange}${status ? `-${status}` : ''}.xlsx`);
    },
  });

  const breadcrumbs = [
    {
      label: 'Booking Report',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Booking Report List"
          subTitle="Manage your booking reports here."
          breadcrumbs={breadcrumbs}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileText size={'1rem'} />}
            loading={isPending}
            onClick={() =>
              downloadBookingReport({
                url: `/report/export/booking?${new URLSearchParams({
                  with_pagination: 'true',
                  page: `${paginationModel.page + 1}`,
                  per_page: `${paginationModel.pageSize}`,
                  search_param: search,
                  updated_at_date_range: dateRange,
                  status,
                })}`,
                method: 'GET',
              })
            }
          >
            Download Booking Report
          </Button>
        </DashboardTitle>

        <BookingReportTable
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          search={search}
          setSearch={setSearch}
          dateRange={dateRange}
          setDateRange={setDateRange}
          status={status}
          setStatus={setStatus}
        />
      </div>
    </>
  );
};

export default Page;
