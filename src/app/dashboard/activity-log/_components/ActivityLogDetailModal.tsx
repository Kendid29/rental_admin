'use client';

import { useMemo, useState } from 'react';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  Check,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  Globe,
  Monitor,
  User,
  X,
} from 'lucide-react';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import { ActivityLogItem } from '@/lib/types/activity-log.type';
import { getActionColor, getMethodBadgeClass } from '../_utils';

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
              className="font-semibold uppercase tracking-wider text-xs"
            />
            <Typography variant="subtitle2" className="text-stone-500 text-xs">
              Module: <span className="font-semibold text-stone-700">{logItem.module}</span>
            </Typography>
          </div>
          <Typography variant="h6" className="font-semibold text-stone-800">
            {logItem.description}
          </Typography>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock size="0.875rem" />
              {logItem.created_at}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              UUID: {logItem.uuid}
              <Tooltip title={copiedKey === 'log_uuid' ? 'Copied!' : 'Copy UUID'}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(logItem.uuid, 'log_uuid')}
                  className="p-0.5 text-stone-400 hover:text-stone-700"
                >
                  {copiedKey === 'log_uuid' ? <Check size="0.75rem" className="text-emerald-600" /> : <Copy size="0.75rem" />}
                </IconButton>
              </Tooltip>
            </span>
          </div>
        </div>
        <IconButton onClick={onClose} size="small" className="text-stone-400 hover:text-stone-700">
          <X size="1.25rem" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="space-y-5 bg-stone-50/50 p-6">
        {/* Row 1: Actor & Resource Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Actor Info */}
          <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-stone-700">
              <User size="1rem" className="text-primary-600" />
              <Typography variant="subtitle2" className="font-semibold">
                Actor / Pelaku
              </Typography>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Name:</span>
                <span className="font-medium text-stone-800">{logItem.actor?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Email:</span>
                <span className="font-medium text-stone-800">{logItem.actor?.email || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Type:</span>
                <span className="font-medium capitalize text-stone-800">{logItem.actor?.type || '-'}</span>
              </div>
              {logItem.actor?.uuid && (
                <div className="flex justify-between font-mono">
                  <span className="text-stone-500">Actor UUID:</span>
                  <span className="text-stone-700 truncate max-w-[180px]">{logItem.actor.uuid}</span>
                </div>
              )}
            </div>
          </div>

          {/* Target Resource */}
          <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-stone-700">
              <ExternalLink size="1rem" className="text-primary-600" />
              <Typography variant="subtitle2" className="font-semibold">
                Target Resource
              </Typography>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Label / Name:</span>
                <span className="font-medium text-stone-800">{logItem.resource?.label || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Table:</span>
                <code className="rounded bg-stone-100 px-1 py-0.5 text-stone-700">
                  {logItem.resource?.table || logItem.metadata?.table || '-'}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Model:</span>
                <span className="font-medium text-stone-800">{logItem.metadata?.model || '-'}</span>
              </div>
              {logItem.resource?.uuid && (
                <div className="flex justify-between font-mono">
                  <span className="text-stone-500">Resource UUID:</span>
                  <span className="text-stone-700 truncate max-w-[180px]">{logItem.resource.uuid}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Request & Network Card */}
        {logItem.request && (
          <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2 text-stone-700">
              <Globe size="1rem" className="text-primary-600" />
              <Typography variant="subtitle2" className="font-semibold">
                HTTP Request & Network
              </Typography>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold border ${getMethodBadgeClass(
                    logItem.request.method,
                  )}`}
                >
                  {logItem.request.method}
                </span>
                <code className="rounded bg-stone-100 px-1.5 py-0.5 text-stone-800 break-all">
                  {logItem.request.path}
                </code>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Globe size="0.875rem" className="text-stone-400" />
                  <span className="text-stone-500">IP Address:</span>
                  <span className="font-mono font-medium text-stone-800">{logItem.request.ip_address || '-'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Monitor size="0.875rem" className="text-stone-400" />
                  <span className="text-stone-500">User Agent:</span>
                  <span className="truncate max-w-[280px] text-stone-700" title={logItem.request.user_agent}>
                    {logItem.request.user_agent || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Row 3: Changes Diff Viewer */}
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="subtitle2" className="font-semibold text-stone-800">
              Perubahan Data (Changes: Old vs New)
            </Typography>
            {changesList.length > 0 && (
              <span className="text-xs text-stone-500 font-medium">
                {changesList.length} field terdeteksi
              </span>
            )}
          </div>

          {changesList.length === 0 ? (
            <div className="rounded border border-dashed border-stone-200 py-6 text-center text-xs text-stone-500">
              Tidak ada data perubahan tersimpan pada aksi ini.
            </div>
          ) : (
            <div className="overflow-x-auto rounded border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="px-3 py-2 w-1/4">Field / Properti</th>
                    <th className="px-3 py-2 w-3/8 text-rose-700">Sebelum (Old)</th>
                    <th className="px-3 py-2 w-3/8 text-emerald-700">Sesudah (New)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {changesList.map((item) => (
                    <tr
                      key={item.key}
                      className={item.isChanged ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-stone-50'}
                    >
                      <td className="px-3 py-2 font-sans font-medium text-stone-800 align-top">
                        {item.key}
                        {item.isChanged && (
                          <span className="ml-1.5 inline-block rounded bg-amber-100 px-1 py-0.2 text-[10px] text-amber-800 font-sans font-semibold">
                            diubah
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-rose-800 bg-rose-50/30 align-top whitespace-pre-wrap break-all">
                        {item.oldVal}
                      </td>
                      <td className="px-3 py-2 text-emerald-800 bg-emerald-50/30 align-top whitespace-pre-wrap break-all">
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
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
            >
              <Code2 size="1rem" className="text-primary-600" />
              {showRawJson ? 'Sembunyikan Raw JSON Payload' : 'Lihat Raw JSON Payload'}
            </button>
            {showRawJson && (
              <Button
                size="small"
                variant="outlined"
                startIcon={copiedKey === 'raw_json' ? <Check size="0.875rem" /> : <Copy size="0.875rem" />}
                onClick={() => handleCopy(JSON.stringify(logItem, null, 2), 'raw_json')}
                className="text-xs"
              >
                {copiedKey === 'raw_json' ? 'Tersalin' : 'Salin JSON'}
              </Button>
            )}
          </div>

          {showRawJson && (
            <div className="mt-3">
              <pre className="max-h-72 overflow-auto rounded bg-stone-900 p-3 text-xs text-stone-100 font-mono">
                {JSON.stringify(logItem, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>

      <DialogActions className="p-4 bg-stone-50 border-t">
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityLogDetailModal;
