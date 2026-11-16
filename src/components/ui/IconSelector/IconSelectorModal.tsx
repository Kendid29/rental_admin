import { memo, useMemo, useState } from 'react';

import Link from 'next/link';

import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from '@mui/material';

import { useDebounce } from '@uidotdev/usehooks';
import _ from 'lodash';
import { icons, Search, X } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import fastTokenFuzzySearch from '@/lib/utils/tokenFuzzySearch';

import TextInput from '../form/TextInput';

interface Props extends Omit<DialogProps, 'onSelect'> {
  onSelect: (icon: string) => void;
  value?: string;
}

type IconName = keyof typeof icons;

const iconKeys = Object.keys(icons) as IconName[];
const ROW_HEIGHT = 62; // Height of each icon button
const COLUMN_COUNT = 8;

const IconsList = memo(
  ({ search, onSelect }: { search: string; onSelect: (icon: string) => void }) => {
    const filteredIcons = useMemo(() => {
      return Array.from(new Set(fastTokenFuzzySearch(iconKeys, search)));
    }, [search]);

    const rowCount = Math.ceil(filteredIcons.length / COLUMN_COUNT);

    const rowRenderer = ({ index, key, style }: ListRowProps) => {
      const startIndex = index * COLUMN_COUNT;
      const rowIcons = filteredIcons.slice(startIndex, startIndex + COLUMN_COUNT);

      return (
        <div key={key} style={style} className="grid grid-cols-8 gap-2">
          {rowIcons.map((icon, iconIndex) => (
            <Tooltip
              arrow
              title={_.kebabCase(icon)}
              key={`${icon}-${startIndex + iconIndex}`}
              disableInteractive
            >
              <Button
                className="mb-2"
                variant="outlined"
                onClick={() => onSelect(_.kebabCase(icon))}
              >
                <DynamicIcon name={_.kebabCase(icon) as any} size={'1rem'} />
              </Button>
            </Tooltip>
          ))}
        </div>
      );
    };

    return (
      <div className="h-[400px] p-4">
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT}
              rowRenderer={rowRenderer}
              overscanRowCount={3}
            />
          )}
        </AutoSizer>
      </div>
    );
  },
);
const IconSelectorModal = ({ onSelect, value, ...props }: Props) => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      keepMounted
      slots={{ transition: MuiSlideTransition }}
      {...props}
    >
      <DialogTitle className="flex justify-between px-4 py-2 text-lg">
        <div className="flex flex-col">
          Select Icon
          <Typography variant="body2" className="-mt-1">
            For better search results, you can use reference from{' '}
            <Link
              href="https://lucide.dev/icons/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              here
            </Link>
            .
          </Typography>
        </div>
        <IconButton onClick={() => props.onClose?.({}, 'escapeKeyDown')}>
          <X size={'1rem'} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="p-0">
        <div className="w-full p-4 pb-0">
          <TextInput
            size="small"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={'1rem'} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <IconsList
          search={debouncedSearch}
          onSelect={(icon) => {
            onSelect(icon);
            props.onClose?.({}, 'escapeKeyDown');
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(IconSelectorModal);
