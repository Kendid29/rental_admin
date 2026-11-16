'use client';

import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { useTranslation } from '@/lib/hooks/useTranslation';
import MuiSlideTransition from '../mui/SlideTransition';
import TextInput from './form/TextInput';

interface Props {
  onClose: () => void;
  open: boolean;
  onConfirm: ({ isApproved, remark }: { isApproved: boolean; remark: string }) => void;
  loading?: boolean;
  title?: string;
  content?: string;
  approval?: boolean;
  buttonLabel?: {
    approve?: string;
    reject?: string;
  };
}

const ApprovalConfirmationModal = ({
  title,
  content,
  loading,
  onClose,
  onConfirm,
  open,
  approval,
  buttonLabel,
}: Props) => {
  const { tCommon } = useTranslation();
  const [remark, setRemark] = useState('');

  const defaultTitle = tCommon(title || 'Approval Item');
  const defaultApproveLabel = tCommon(buttonLabel?.approve || 'Approve');
  const defaultRejectLabel = tCommon(buttonLabel?.reject || 'Reject');

  return (
    <Dialog
      open={open}
      slots={{
        transition: MuiSlideTransition,
      }}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{defaultTitle}</DialogTitle>
      <DialogContent dividers>
        {content && approval && <Typography>{tCommon(content)}</Typography>}
        {!approval && (
          <TextInput
            name="remark"
            multiline
            rows={3}
            label={tCommon('Remark')}
            fullWidth
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="gray" onClick={onClose}>
          {tCommon('Cancel')}
        </Button>
        <Button
          loading={loading}
          variant="contained"
          color={approval ? 'success' : 'error'}
          onClick={() => onConfirm({ isApproved: !!approval, remark })}
        >
          {approval ? defaultApproveLabel : defaultRejectLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApprovalConfirmationModal;
