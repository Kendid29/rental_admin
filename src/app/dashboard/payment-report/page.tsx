'use client';

import { useState } from 'react';

import { Button } from '@mui/material';

import dayjs from 'dayjs';
import { FileText } from 'lucide-react';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';
import useTablePagination from '@/lib/hooks/useTablePagination';
import { downloadFile } from '@/lib/utils';
import useDownloadFile from '@/services/useDownloadFile';

import PaymentReportTable from './_components/PaymentReportTable';

const Page = () => {
  const { paginationModel, setPaginationModel, search, setSearch } = useTablePagination();
  const [dateRange, setDateRange] = useState(
    `${dayjs().format('YYYY-MM-01')} to ${dayjs().format('YYYY-MM-DD')}`,
  );

  const { mutate: downloadPaymentReport, isPending } = useDownloadFile({
    onSuccess(data) {
      downloadFile(data, `payment-report-${dateRange}.xlsx`);
    },
  });

  const breadcrumbs = [
    {
      label: 'Payment Report',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Payment Report List"
          subTitle="Manage your payment reports here."
          breadcrumbs={breadcrumbs}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileText size={'1rem'} />}
            loading={isPending}
            onClick={() =>
              downloadPaymentReport({
                url: `/report/export/payment?${new URLSearchParams({
                  with_pagination: 'true',
                  page: `${paginationModel.page + 1}`,
                  per_page: `${paginationModel.pageSize}`,
                  search_param: search,
                  updated_at_date_range: dateRange,
                })}`,
                method: 'GET',
              })
            }
          >
            Download Payment Report
          </Button>
        </DashboardTitle>

        <PaymentReportTable
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          search={search}
          setSearch={setSearch}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
    </>
  );
};

export default Page;
