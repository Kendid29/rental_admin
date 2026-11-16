'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

import { Building2, CreditCard, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import TextInput from '@/components/ui/form/TextInput';
import { ReimburseType } from '@/lib/types/reimburse.type';
import formatToRp from '@/lib/utils/formatToRp';
import usePayReimburse from '@/services/reimburse/usePayReimburse';

interface Props {
  open: boolean;
  onClose: () => void;
  reimburse: ReimburseType | null;
  onSuccess?: () => void;
}

const PayReimburseModal = ({ onClose, onSuccess, open, reimburse }: Props) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [transferReference, setTransferReference] = useState('');
  const [transferProofUrl, setTransferProofUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [previewName, setPreviewName] = useState('');

  useEffect(() => {
    if (open) {
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setTransferReference(`TRX-RK-${Date.now().toString().slice(-6)}`);
      setTransferProofUrl('');
      setNotes('');
      setPreviewName('');
    }
  }, [open]);

  const { isPending, mutate: payReimburse } = usePayReimburse({
    onSuccess() {
      onSuccess?.();
      onClose();
    },
  });

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreviewName(file.name);
    const reader = new FileReader();

    reader.onloadend = () => {
      setTransferProofUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reimburse) return;

    if (!paymentDate) {
      toast('Tanggal pembayaran wajib diisi', { type: 'error' });
      return;
    }

    if (!transferReference.trim()) {
      toast('Nomor referensi transfer wajib diisi', { type: 'error' });
      return;
    }

    if (!transferProofUrl) {
      toast('Bukti transfer wajib diunggah', { type: 'error' });
      return;
    }

    payReimburse({
      uuid: reimburse.uuid,
      data: {
        payment_date: paymentDate,
        transfer_reference: transferReference.trim(),
        transfer_proof_url: transferProofUrl,
        notes: notes.trim(),
      },
    });
  };

  if (!reimburse) return null;

  return (
    <Dialog
      open={open}
      slots={{
        transition: MuiSlideTransition,
      }}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex items-center gap-2 border-b border-slate-100 font-bold text-slate-800">
          <CreditCard size="1.2rem" className="text-primary-600" />
          Tandai Reimburse Sudah Dibayar
        </DialogTitle>

        <DialogContent className="flex flex-col gap-4 pt-4">
          {/* Info Card */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-slate-500">Transaksi Sewa</span>
                <Typography className="font-semibold text-slate-800">
                  {reimburse.booking_number}
                </Typography>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                  <Building2 size={14} className="text-slate-400" />
                  <span>{reimburse.mitra.name}</span>
                  {reimburse.mitra.company && <span>({reimburse.mitra.company})</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Nominal Transfer ke Mitra</span>
                <Typography variant="h6" className="text-primary-600 font-bold">
                  {formatToRp(reimburse.nominal_reimburse)}
                </Typography>
              </div>
            </div>

            <Divider className="my-2.5" />

            <div className="text-xs text-slate-700">
              <span>Rekening Tujuan: </span>
              <strong>{reimburse.mitra.bank_name || 'Bank'}</strong> -{' '}
              <span>{reimburse.mitra.bank_account_number || '-'}</span> a/n{' '}
              <strong>{reimburse.mitra.bank_account_holder || reimburse.mitra.name}</strong>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              type="date"
              label="Tanggal Bayar"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextInput
              label="Nomor Referensi Transfer"
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              placeholder="Contoh: TRX-BCA-98127391"
              fullWidth
            />
          </div>

          {/* Bukti Transfer Upload */}
          <div className="flex flex-col gap-1.5">
            <Typography variant="body2" className="font-medium text-slate-700">
              Unggah Bukti Transfer <span className="text-red-500">*</span>
            </Typography>
            <div className="hover:border-primary-500 hover:bg-primary-50/20 relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <UploadCloud size={28} className="mb-1 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">
                {previewName || 'Klik atau geser file bukti transfer ke sini'}
              </span>
              <span className="text-xs text-slate-500">Format gambar: JPG, PNG, WEBP</span>
            </div>

            {transferProofUrl && (
              <Box className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2">
                <img
                  src={transferProofUrl}
                  alt="Bukti Transfer Preview"
                  className="size-16 rounded border border-slate-200 object-cover"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-xs font-semibold text-slate-800">
                    {previewName || 'Bukti Transfer'}
                  </span>
                  <span className="text-xs text-emerald-600">File siap dikirim</span>
                </div>
              </Box>
            )}
          </div>

          <TextInput
            multiline
            rows={2}
            label="Catatan Tambahan (Opsional)"
            placeholder="Catatan mengenai bukti transfer atau pengiriman dana..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions className="border-t border-slate-100 px-6 py-3">
          <Button variant="outlined" color="gray" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" variant="contained" color="primary" loading={isPending}>
            Konfirmasi Sudah Dibayar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PayReimburseModal;
