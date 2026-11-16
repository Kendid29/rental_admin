import { Box, Button, Dialog, Typography } from '@mui/material';
import { Trash2 } from 'lucide-react';

import { useTranslation } from '@/lib/hooks/useTranslation';
import MuiSlideTransition from '../mui/SlideTransition';

interface Props {
  onClose: () => void;
  open: boolean;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  content?: string;
  buttonLabel?: string;
}

const DeleteConfirmationModal = ({
  title,
  content,
  buttonLabel,
  loading,
  onClose,
  onConfirm,
  open,
}: Props) => {
  const { tCommon } = useTranslation();
  const displayTitle = tCommon(title || 'Delete Item');
  const displayContent = tCommon(content || 'Are you sure want to delete this item?');
  const displayButtonLabel = tCommon(buttonLabel || 'Delete');
  return (
    <Dialog
      open={open}
      TransitionComponent={MuiSlideTransition}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          pt: 4,
          px: 3,
          pb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            color: '#dc2626',
            mb: 2.5,
            border: '1px solid rgba(220, 38, 38, 0.15)',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Trash2 size={24} strokeWidth={2} />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            fontSize: '1.35rem',
            color: '#1e2939',
            mb: 1.5,
            lineHeight: 1.3,
          }}
        >
          {displayTitle}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#4a5565',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            mb: 3.5,
            maxWidth: '300px',
          }}
        >
          {displayContent}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            color="gray"
            onClick={onClose}
            sx={{
              flex: 1,
              borderRadius: '8px',
              py: 1.25,
              borderColor: 'rgba(106, 114, 130, 0.3)',
              color: '#6a7282',
              fontWeight: 500,
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'rgba(106, 114, 130, 0.5)',
                backgroundColor: 'rgba(106, 114, 130, 0.05)',
              },
            }}
          >
            {tCommon('Cancel')}
          </Button>
          <Button
            loading={loading}
            variant="contained"
            color="error"
            onClick={onConfirm}
            sx={{
              flex: 1,
              borderRadius: '8px',
              py: 1.25,
              backgroundColor: '#dc2626',
              color: '#fff',
              fontWeight: 500,
              textTransform: 'none',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#b91c1c',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
              },
            }}
          >
            {displayButtonLabel}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
