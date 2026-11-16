'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Button, Chip, Typography } from '@mui/material';

import { Ban, CheckCircle2, DollarSign, KeyRound, PlayCircle, Send } from 'lucide-react';

import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';
import FormCard from '@/components/ui/form/FormCard';
import { BookingType } from '@/lib/types/booking.type';
import { usePermission } from '@/services/permission/usePermission';
import useCancelTransaksi from '@/services/transaksi/useCancelTransaksi';
import useConfirmTransaksi from '@/services/transaksi/useConfirmTransaksi';
import useCreateReimburse from '@/services/transaksi/useCreateReimburse';
import useFinishTransaksi from '@/services/transaksi/useFinishTransaksi';
import useForwardTransaksi from '@/services/transaksi/useForwardTransaksi';
import useStartTransaksi from '@/services/transaksi/useStartTransaksi';

import { getBookingStatusColor, getBookingStatusLabel } from '../../_utils';

interface Props {
  booking?: BookingType;
  onRefresh?: () => void;
}

const BookingStatusActions = ({ booking, onRefresh }: Props) => {
  const checkPermission = usePermission();
  const canUpdate = checkPermission('transaksi', 'Update');

  const status = booking?.status.value || '';

  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);

  const { mutate: confirmTransaksi, isPending: isConfirming } = useConfirmTransaksi({
    onSuccess: () => onRefresh?.(),
  });
  const { mutate: forwardTransaksi, isPending: isForwarding } = useForwardTransaksi({
    onSuccess: () => onRefresh?.(),
  });
  const { mutate: startTransaksi, isPending: isStarting } = useStartTransaksi({
    onSuccess: () => onRefresh?.(),
  });
  const { mutate: finishTransaksi, isPending: isFinishing } = useFinishTransaksi({
    onSuccess: () => onRefresh?.(),
  });
  const { mutate: cancelTransaksi, isPending: isCancelling } = useCancelTransaksi({
    onSuccess() {
      setIsOpenCancelModal(false);
      onRefresh?.();
    },
  });
  const { mutate: createReimburse, isPending: isCreatingReimburse } = useCreateReimburse({
    onSuccess: () => onRefresh?.(),
  });

  const statusLabel = useMemo(() => getBookingStatusLabel(status), [status]);
  const statusColor = useMemo(() => getBookingStatusColor(status), [status]);

  return (
    <>
      <FormCard
        title="Status & Aksi Alur Sewa"
        className="-mt-2 gap-4"
        cardHeaderComponent={
          <Chip
            label={statusLabel}
            color={statusColor}
            variant="filled"
            className="text-xs font-semibold"
          />
        }
      >
        <div className="flex flex-col gap-3">
          {/* 1. Menunggu Konfirmasi: Konfirmasi Pembayaran / Batalkan */}
          {status === 'menunggu_konfirmasi' && (
            <>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={!canUpdate}
                startIcon={<CheckCircle2 size="1rem" />}
                loading={isConfirming}
                onClick={() => confirmTransaksi({ uuid: booking?.uuid || '' })}
              >
                Konfirmasi Pembayaran
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                disabled={!canUpdate}
                startIcon={<Ban size="1rem" />}
                onClick={() => setIsOpenCancelModal(true)}
              >
                Batalkan Transaksi
              </Button>
            </>
          )}

          {/* 2. Terkonfirmasi: Teruskan ke Mitra / Batalkan */}
          {status === 'terkonfirmasi' && (
            <>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={!canUpdate}
                startIcon={<Send size="1rem" />}
                loading={isForwarding}
                onClick={() => forwardTransaksi({ uuid: booking?.uuid || '' })}
              >
                Teruskan ke Mitra
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                disabled={!canUpdate}
                startIcon={<Ban size="1rem" />}
                onClick={() => setIsOpenCancelModal(true)}
              >
                Batalkan Transaksi
              </Button>
            </>
          )}

          {/* 3. Diteruskan ke Mitra: Mulai Sewa / Batalkan */}
          {status === 'diteruskan_mitra' && (
            <>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={!canUpdate}
                startIcon={<KeyRound size="1rem" />}
                loading={isStarting}
                onClick={() => startTransaksi({ uuid: booking?.uuid || '' })}
              >
                Mulai Sewa (Serah Unit)
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                disabled={!canUpdate}
                startIcon={<Ban size="1rem" />}
                onClick={() => setIsOpenCancelModal(true)}
              >
                Batalkan Transaksi
              </Button>
            </>
          )}

          {/* 4. Berjalan: Selesai Sewa */}
          {status === 'berjalan' && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              disabled={!canUpdate}
              startIcon={<PlayCircle size="1rem" />}
              loading={isFinishing}
              onClick={() => finishTransaksi({ uuid: booking?.uuid || '' })}
            >
              Selesai Sewa (Unit Kembali)
            </Button>
          )}

          {/* 5. Selesai: Buat Reimburse Mitra */}
          {status === 'selesai' && (
            <div className="flex flex-col gap-2">
              <Button
                fullWidth
                variant="contained"
                color="warning"
                disabled={!canUpdate || booking?.reimburse_status === 'sudah_dibayar'}
                startIcon={<DollarSign size="1rem" />}
                loading={isCreatingReimburse}
                onClick={() => createReimburse({ uuid: booking?.uuid || '' })}
              >
                {booking?.reimburse_status === 'sudah_dibayar'
                  ? 'Reimburse Sudah Dibayar'
                  : 'Buat Reimburse Mitra'}
              </Button>
              <Button
                component={Link}
                href="/dashboard/reimburse"
                fullWidth
                variant="outlined"
                color="inherit"
                size="small"
              >
                Lihat Modul Reimburse
              </Button>
            </div>
          )}

          {/* 6. Dibatalkan */}
          {status === 'dibatalkan' && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-700">
              Transaksi ini telah dibatalkan. Tidak ada tindakan lanjutan yang tersedia.
            </div>
          )}

          {!canUpdate && (
            <Typography variant="caption" className="text-center text-slate-400">
              Anda hanya memiliki izin melihat transaksi (Read-only).
            </Typography>
          )}
        </div>
      </FormCard>

      <DeleteConfirmationModal
        open={isOpenCancelModal}
        onClose={() => setIsOpenCancelModal(false)}
        onConfirm={() =>
          cancelTransaksi({
            uuid: booking?.uuid || '',
            reason: 'Dibatalkan oleh admin melalui panel detail transaksi.',
          })
        }
        loading={isCancelling}
        title="Batalkan Transaksi"
        content="Apakah Anda yakin ingin membatalkan transaksi sewa ini? Status akan diubah menjadi Dibatalkan secara permanen."
        buttonLabel="Ya, Batalkan Transaksi"
      />
    </>
  );
};

export default BookingStatusActions;
