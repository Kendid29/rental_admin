import { useEffect, useState } from 'react';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { File as FileIcon, X } from 'lucide-react';

import ImageContainer from '@/components/ImageContainer';

type Mixed = File | string;

const FilePreviewItem = ({
  file,
  onRemove,
  index,
}: {
  file: File;
  onRemove: (index: number) => void;
  index: number;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);

      setPreviewUrl(url);

      cleanup = () => {
        URL.revokeObjectURL(url);
      };
    }

    return cleanup;
  }, [file]);

  if (!file.type.startsWith('image/')) {
    return (
      <div className="relative flex size-20 items-center justify-center rounded-[0.6rem] bg-gray-100 p-3">
        <FileIcon size={48} strokeWidth={1.5} />
        <IconButton
          size="small"
          className="absolute top-1 right-1 size-fit bg-black/70 p-0.5 text-xs text-white hover:bg-black/50"
          onClick={() => onRemove(index)}
        >
          <X size={'1rem'} />
        </IconButton>
      </div>
    );
  }

  if (!previewUrl) {
    return <div className="relative size-20 animate-pulse rounded-[0.6rem] bg-gray-200" />;
  }

  return (
    <ImageContainer className="size-20 rounded-[0.6rem]" src={previewUrl} alt={file.name}>
      <IconButton
        size="small"
        className="absolute top-1 right-1 size-fit bg-black/70 p-0.5 text-xs text-white hover:bg-black/50"
        onClick={() => onRemove(index)}
      >
        <X size={'1rem'} />
      </IconButton>
    </ImageContainer>
  );
};

const FileLists = ({ files, onRemove }: { files: Mixed[]; onRemove: (index: number) => void }) => {
  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {files.map((file, index) => {
        return typeof file === 'string' ? (
          <Tooltip title={file} key={index} arrow>
            <div>
              <ImageContainer className="size-20 rounded-[0.6rem]" src={file} alt={file}>
                <IconButton
                  size="small"
                  className="absolute top-1 right-1 size-fit bg-black/70 p-0.5 text-xs text-white hover:bg-black/50"
                  onClick={() => onRemove(index)}
                >
                  <X size={'1rem'} />
                </IconButton>
              </ImageContainer>
            </div>
          </Tooltip>
        ) : (
          <Tooltip title={file.name} key={index} arrow>
            <div>
              <FilePreviewItem file={file} onRemove={onRemove} index={index} />
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default FileLists;
