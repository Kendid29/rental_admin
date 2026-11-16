import { CircularProgress, IconButton, Tooltip } from '@mui/material';

import { ImageUp } from 'lucide-react';

import ImageContainer from '@/components/ImageContainer';

interface InlineImageUploadProps {
  imageUrl?: string;
  alt: string;
  loading?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onUpload: (file: File) => void;
}

const InlineImageUpload = ({
  imageUrl,
  alt,
  loading = false,
  disabled = false,
  onUpload,
}: InlineImageUploadProps) => (
  <div className="flex h-full items-center gap-2 py-1">
    <div className="flex size-12 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
      {imageUrl ? (
        <ImageContainer src={imageUrl} alt={alt} className="size-full object-cover" />
      ) : (
        <ImageUp className="text-gray-400" size="1.1rem" />
      )}
    </div>
    <Tooltip title="Update image">
      <span>
        <IconButton
          component="label"
          size="small"
          disabled={loading || disabled}
          aria-label={`Update image for ${alt}`}
        >
          {loading ? <CircularProgress size={16} /> : <ImageUp size="1rem" />}
          <input
            hidden
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) onUpload(file);
              event.target.value = '';
            }}
          />
        </IconButton>
      </span>
    </Tooltip>
  </div>
);

export default InlineImageUpload;
