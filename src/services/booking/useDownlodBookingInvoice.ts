import { UseMutationOptions } from '@tanstack/react-query';

import { downloadFile } from '@/lib/utils';

import useDownloadFile from '../useDownloadFile';

interface MutateType {
  booking_uuid: string;
  title: string;
}

const useDownlodBookingInvoice = (options?: UseMutationOptions<any, unknown, any, unknown>) => {
  const { mutate, ...rest } = useDownloadFile(options);

  return {
    ...rest,
    mutate(data: MutateType) {
      mutate(
        {
          url: `/report/pdf/${data.booking_uuid}/invoice`,
          method: 'GET',
        },
        {
          onSuccess(d) {
            downloadFile(d, `${data.title}.pdf`);
          },
        },
      );
    },
  };
};

export default useDownlodBookingInvoice;
