'use client';

import { useMemo, useState } from 'react';

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import { Check, Clock, Code2, Copy, ExternalLink, Globe, Monitor, User, X } from 'lucide-react';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import { ActivityLogItem } from '@/lib/types/activity-log.type';

import { getActionColor, getMethodColor } from '../_utils';

interface Props {
  open: boolean;
  onClose: () => void;
  logItem: ActivityLogItem | null;
}

const ActivityLogDetailModal = ({ open, onClose, logItem }: Props) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const changesList = useMemo(() => {
    if (!logItem?.changes) return [];
    const oldObj = logItem.changes.old || {};
    const newObj = logItem.changes.new || {};
    const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));

    return allKeys.map((key) => {
      const oldVal = oldObj[key];
      const newVal = newObj[key];
      const isChanged = JSON.stringify(oldVal) !== JSON.stringify(newVal);

      return {
        key,
        oldVal: oldVal !== undefined ? JSON.stringify(oldVal, null, 2) : '(none)',
        newVal: newVal !== undefined ? JSON.stringify(newVal, null, 2) : '(none)',
        isChanged,
      };
    });
  }, [logItem?.changes]);

  if (!logItem) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{
        transition: MuiSlideTransition,
      }}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle className="flex items-start justify-between border-b pb-3">
        <div className="flex flex-col gap-1 pr-4">
          <div className="flex items-center gap-2">
            <Chip
              size="small"
              label={logItem.action.toUpperCase()}
              color={getActionColor(logItem.action)}
              className="text-xs font-semibold tracking-wider uppercase"
            />
            <Typography variant="subtitle2" className="text-xs text-slate-500">
              Module: <span className="font-semibold text-slate-700">{logItem.module}</span>
            </Typography>
          </div>
          <Typography variant="h6" className="font-semibold text-slate-800">
            {logItem.description}
          </Typography>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size="0.875rem" />
              {logItem.created_at}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              UUID: {logItem.uuid}
              <Tooltip title={copiedKey === 'log_uuid' ? 'Copied!' : 'Copy UUID'}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(logItem.uuid, 'log_uuid')}
                  className="p-0.5 text-slate-400 hover:text-slate-700"
                >
                  {copiedKey === 'log_uuid' ? (
                    <Check size="0.75rem" className="text-emerald-600" />
                  ) : (
                    <Copy size="0.75rem" />
                  )}
                </IconButton>
              </Tooltip>
            </span>
          </div>
        </div>
        <IconButton onClick={onClose} size="small" className="text-slate-400 hover:text-slate-700">
          <X size="1.25rem" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="space-y-5 bg-slate-50/50 p-6">
        {/* Row 1: Actor & Resource Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Actor Info */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-slate-700">
              <User size="1rem" className="text-primary-600" />
              <Typography variant="subtitle2" className="font-semibold">
                Actor / Pelaku
              </Typography>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-800">{logItem.actor?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-800">{logItem.actor?.email || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className="font-medium text-slate-800 capitalize">
                  {logItem.actor?.type || '-'}
                </span>
              </div>
              {logItem.actor?.uuid && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Actor UUID:</span>
                  <span className="max-w-[180px] truncate text-slate-700">
                    {logItem.actor.uuid}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Target Resource */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-slate-700">
              <ExternalLink size="1rem" className="text-primary-600" />
              <Typography variant="subtitle2" className="font-semibold">
                Target Resource
              </Typography>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Label / Name:</span>
                <span className="font-medium text-slate-800">{logItem.resource?.label || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Table:</span>
                <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-700">
                  {logItem.resource?.table || logItem.metadata?.table || '-'}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Model:</span>
                <span className="font-medium text-slate-800">{logItem.metadata?.model || '-'}</span>
              </div>
              {logItem.resource?.uuid && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Resource UUID:</span>
                  <span className="max-w-[180px] truncate text-slate-700">
                    {logItem.resource.uuid}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Request & Network Card */}
        {logItem.request && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-slate-700">
              <Globe size="1rem" className="text-primary-600" />
              <Typography variant="subtitle2" className="font-semibold">
                HTTP Request & Network
              </Typography>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  size="small"
                  label={logItem.request.method}
                  color={getMethodColor(logItem.request.method)}
                  className="text-[11px] font-semibold uppercase"
                  sx={{ minWidth: 48, height: 22 }}
                />
                <code className="rounded bg-slate-100 px-1.5 py-0.5 break-all text-slate-800">
                  {logItem.request.path}
                </code>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Globe size="0.875rem" className="text-slate-400" />
                  <span className="text-slate-500">IP Address:</span>
                  <span className="font-medium text-slate-800">
                    {logItem.request.ip_address || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Monitor size="0.875rem" className="text-slate-400" />
                  <span className="text-slate-500">User Agent:</span>
                  <span
                    className="max-w-[280px] truncate text-slate-700"
                    title={logItem.request.user_agent}
                  >
                    {logItem.request.user_agent || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Row 3: Changes Diff Viewer */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="subtitle2" className="font-semibold text-slate-800">
              Perubahan Data (Changes: Old vs New)
            </Typography>
            {changesList.length > 0 && (
              <span className="text-xs font-medium text-slate-500">
                {changesList.length} field terdeteksi
              </span>
            )}
          </div>

          {changesList.length === 0 ? (
            <div className="rounded border border-dashed border-slate-200 py-6 text-center text-xs text-slate-500">
              Tidak ada data perubahan tersimpan pada aksi ini.
            </div>
          ) : (
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-600">
                  <tr>
                    <th className="w-1/4 px-3 py-2">Field / Properti</th>
                    <th className="w-3/8 px-3 py-2 text-rose-700">Sebelum (Old)</th>
                    <th className="w-3/8 px-3 py-2 text-emerald-700">Sesudah (New)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {changesList.map((item) => (
                    <tr
                      key={item.key}
                      className={
                        item.isChanged ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'
                      }
                    >
                      <td className="px-3 py-2 align-top font-medium text-slate-800">
                        {item.key}
                        {item.isChanged && (
                          <span className="py-0.2 ml-1.5 inline-block rounded bg-amber-100 px-1 text-[10px] font-semibold text-amber-800">
                            diubah
                          </span>
                        )}
                      </td>
                      <td className="bg-rose-50/30 px-3 py-2 align-top break-all whitespace-pre-wrap text-rose-800">
                        {item.oldVal}
                      </td>
                      <td className="bg-emerald-50/30 px-3 py-2 align-top break-all whitespace-pre-wrap text-emerald-800">
                        {item.newVal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Row 4: Raw JSON Viewer Toggle */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <Code2 size="1rem" className="text-primary-600" />
              {showRawJson ? 'Sembunyikan Raw JSON Payload' : 'Lihat Raw JSON Payload'}
            </button>
            {showRawJson && (
              <Button
                size="small"
                variant="outlined"
                startIcon={
                  copiedKey === 'raw_json' ? <Check size="0.875rem" /> : <Copy size="0.875rem" />
                }
                onClick={() => handleCopy(JSON.stringify(logItem, null, 2), 'raw_json')}
                className="text-xs"
              >
                {copiedKey === 'raw_json' ? 'Tersalin' : 'Salin JSON'}
              </Button>
            )}
          </div>

          {showRawJson && (
            <div className="mt-3">
              <pre className="max-h-72 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
                {JSON.stringify(logItem, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions className="border-t bg-slate-50 p-4">
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityLogDetailModal;
