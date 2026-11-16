'use client';

import React from 'react';

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

import dayjs from 'dayjs';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  User,
} from 'lucide-react';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import { ReimburseType } from '@/lib/types/reimburse.type';
import formatToRp from '@/lib/utils/formatToRp';

interface Props {
  open: boolean;
  onClose: () => void;
  reimburse: ReimburseType | null;
  onPayClick?: (reimburse: ReimburseType) => void;
}

const ReimburseDetailModal = ({ onClose, onPayClick, open, reimburse }: Props) => {
  if (!reimburse) return null;

  const isPaid = reimburse.status === 'sudah_dibayar';

  return (
    <Dialog
      open={open}
      slots={{
        transition: MuiSlideTransition,
      }}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <FileText size="1.2rem" className="text-primary-600" />
          <Typography variant="h6" className="font-bold text-slate-800">
            Rincian Pembayaran Reimburse
          </Typography>
        </div>
        <Chip
          size="small"
          label={isPaid ? 'Sudah Dibayar' : 'Belum Dibayar'}
          color={isPaid ? 'success' : 'warning'}
          variant="filled"
          className="font-semibold"
        />
      </DialogTitle>

      <DialogContent className="flex flex-col gap-5 pt-4">
        {/* Info Transaksi & Unit */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div>
            <span className="text-xs text-slate-500">Kode Transaksi Sewa</span>
            <Typography className="text-base font-bold text-slate-900">
              {reimburse.booking_number}
            </Typography>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={13} />
              <span>
                Diajukan: {dayjs(reimburse.created_at).format('DD MMMM YYYY, HH:mm [WIB]')}
              </span>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Unit Yang Disewa</span>
            <Typography className="font-semibold text-slate-800">
              {reimburse.unit?.name || 'Unit Rental'}
            </Typography>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                {reimburse.unit?.category || 'Kendaraan'}
              </span>
              {reimburse.unit?.plate_number && (
                <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800">
                  {reimburse.unit.plate_number}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Data Mitra & Rekening */}
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <Typography variant="subtitle2" className="mb-3 font-bold text-slate-800">
            Informasi Mitra & Rekening Penerima
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-slate-800">
                <User size={15} className="text-slate-400" />
                <span className="font-semibold">{reimburse.mitra.name}</span>
              </div>
              {reimburse.mitra.company && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Building2 size={14} className="text-slate-400" />
                  <span>{reimburse.mitra.company}</span>
                </div>
              )}
              {reimburse.mitra.phone_number && (
                <span className="pl-6 text-xs text-slate-500">{reimburse.mitra.phone_number}</span>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CreditCard size={14} className="text-primary-600" />
                <span>Rekening Bank Mitra:</span>
              </div>
              <div className="mt-1 text-sm font-bold text-slate-800">
                {reimburse.mitra.bank_name || 'Bank'} -{' '}
                <span className="font-mono">{reimburse.mitra.bank_account_number || '-'}</span>
              </div>
              <div className="text-xs text-slate-600">
                a/n {reimburse.mitra.bank_account_holder || reimburse.mitra.name}
              </div>
            </div>
          </div>
        </div>

        {/* Rincian Nominal */}
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <Typography variant="subtitle2" className="mb-2 font-bold text-slate-800">
            Rincian Perhitungan Reimburse
          </Typography>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-slate-700">
              <span>Total Pembayaran Transaksi Sewa</span>
              <span className="font-medium">{formatToRp(reimburse.total_transaction)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Potongan Biaya Layanan Platform (10%)</span>
              <span>- {formatToRp(reimburse.platform_fee)}</span>
            </div>
            <Divider className="my-1" />
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Nominal Bersih Reimburse ke Mitra</span>
              <span className="text-primary-600">{formatToRp(reimburse.nominal_reimburse)}</span>
            </div>
          </div>
        </div>

        {/* Status Bukti Pembayaran */}
        {isPaid ? (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Informasi Pembayaran Telah Selesai</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-500">Waktu Pembayaran:</span>
                <p className="font-semibold">
                  {reimburse.payment_date
                    ? dayjs(reimburse.payment_date).format('DD MMMM YYYY, HH:mm [WIB]')
                    : '-'}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Nomor Referensi Bank:</span>
                <p className="font-mono font-semibold">{reimburse.transfer_reference || '-'}</p>
              </div>
              {reimburse.notes && (
                <div className="col-span-2">
                  <span className="text-slate-500">Catatan:</span>
                  <p className="italic">{reimburse.notes}</p>
                </div>
              )}
            </div>

            {reimburse.transfer_proof_url && (
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-700">Bukti Transfer:</span>
                <div className="mt-1 flex items-center gap-3">
                  <a
                    href={reimburse.transfer_proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block overflow-hidden rounded-lg border border-slate-300"
                  >
                    <img
                      src={reimburse.transfer_proof_url}
                      alt="Bukti Transfer"
                      className="h-28 w-44 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-1 text-xs text-white">
                        <ExternalLink size={14} /> Lihat Penuh
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-800">
            <Clock size={16} className="shrink-0 text-amber-600" />
            <span>
              Pembayaran reimburse belum diproses. Silakan lakukan transfer ke rekening mitra di
              atas lalu unggah bukti transfer.
            </span>
          </div>
        )}
      </DialogContent>

      <DialogActions className="border-t border-slate-100 px-6 py-3">
        <Button variant="outlined" color="gray" onClick={onClose}>
          Tutup
        </Button>
        {!isPaid && onPayClick && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onClose();
              onPayClick(reimburse);
            }}
          >
            Tandai Sudah Dibayar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReimburseDetailModal;
