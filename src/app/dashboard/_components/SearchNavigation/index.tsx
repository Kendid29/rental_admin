import { memo, useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';

import _ from 'lodash';
import { Search } from 'lucide-react';

import MuiSlideTransition from '@/components/mui/SlideTransition';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useGetUserSession from '@/services/auth/useGetUserSession';
import { usePermission } from '@/services/permission/usePermission';

import NAV_ITEMS, { NavItem } from '../Sidebar/nav_items';

type Props = DialogProps;

interface NavigationItemType {
  app: string;
  label: string;
  parent: string;
  permission_module: string;
  pathname: string;
}

const SearchNavigation = ({ ...props }: Props) => {
  const { isZh, tSidebar } = useTranslation();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkPermission = usePermission();

  const { data: user } = useGetUserSession();

  const items: NavigationItemType[] = useMemo(() => {
    const flattedItems: any[] = _.flatMap(NAV_ITEMS, (item: NavItem) => {
      if (item.items) {
        const temp = item.items.map((child: any) => ({ ...child, parent: [item.title] }));

        return _.flatMap(temp, (child: any) => {
          if (child.children) {
            return child.children.map((child2: any) => {
              return {
                ...child2,
                parent: item.title,
              };
            });
          }

          return child;
        });
      }

      return item;
    }).flatMap((item: any) => {
      if (item.children) {
        return item.children.map((d: any) => ({
          ...d,
          parent: item.parent,
        }));
      }
      return item;
    });

    return flattedItems.filter((item) => {
      return checkPermission(item.permission_module, 'Read');
    });
  }, [user, checkPermission]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (search === '') return true;
      const translatedLabel = tSidebar(item.label);

      return (
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        translatedLabel.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [items, search, tSidebar]);

  useEffect(() => {
    if (props.open) {
      focusTimerRef.current = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }

    return () => {
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
        focusTimerRef.current = null;
      }
    };
  }, [props.open]);

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      TransitionComponent={MuiSlideTransition}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
          marginTop: '8rem',
        },
      }}
      {...props}
    >
      <DialogTitle className="flex items-center py-6">
        <Input
          value={search}
          inputRef={inputRef}
          size="medium"
          fullWidth
          className="before:border-0 after:border-0"
          placeholder={isZh ? '搜索导航与菜单...' : 'Search...'}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <Search size={'1rem'} />
            </InputAdornment>
          }
        />
        <kbd className="px-2 text-sm">Esc</kbd>
      </DialogTitle>
      <DialogContent dividers className="flex h-96 flex-col gap-2">
        {filteredItems.map((item) => (
          <Button
            key={item.pathname}
            className="justify-between border-dashed p-2 px-4"
            LinkComponent={Link}
            href={item.pathname}
            variant="outlined"
            onClick={() => {
              props?.onClose?.({}, 'backdropClick');
            }}
          >
            <div className="flex h-fit flex-col justify-center">
              <Typography variant="body2" className="-mb-1 font-semibold">
                {tSidebar(item.label)}
              </Typography>
              <Typography variant="caption">{item.pathname}</Typography>
            </div>

            <div className="flex flex-col items-end gap-1">
              <Chip size="small" label={tSidebar(item.parent)} />
            </div>
          </Button>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default memo(SearchNavigation);
