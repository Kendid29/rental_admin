interface DownloadMockParams {
  url: string;
  method?: string;
  body?: Record<string, any>;
}

const buildPdfBlob = (title: string, content: string) => {
  const lines = [
    title,
    '========================================',
    content,
    `Generated at: ${new Date().toISOString()}`,
  ].join('\n');

  return new Blob([lines], { type: 'application/pdf' });
};

export const handleDownloadMock = ({ url }: DownloadMockParams) => {
  const invoiceMatch = url.match(/^\/report\/pdf\/([^/]+)\/invoice$/u);
  if (invoiceMatch) {
    const bookingUuid = invoiceMatch[1];
    return buildPdfBlob('Mock Booking Invoice', `Booking UUID: ${bookingUuid}`);
  }

  const voucherMatch = url.match(/^\/report\/pdf\/([^/]+)\/voucher$/u);
  if (voucherMatch) {
    const bookingUuid = voucherMatch[1];
    return buildPdfBlob('Mock Booking Voucher', `Booking UUID: ${bookingUuid}`);
  }

  return new Blob(['Mock file'], { type: 'application/octet-stream' });
};
