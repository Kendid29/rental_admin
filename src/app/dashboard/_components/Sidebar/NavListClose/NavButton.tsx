'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Divider, Popover, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Typograhy from '@mui/material/Typography';

import { ChevronRight } from 'lucide-react';

import { OverViewItem } from '../nav_items';
import NavButton2 from './NavButton2';
import { useTranslation } from '@/lib/hooks/useTranslation';

const NavButton = ({ item }: { item: OverViewItem }) => {
  const { tSidebar } = useTranslation();
  const pathname = '';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const id = open ? 'hover-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isActive = useMemo(() => {
    return (
      pathname === item.pathname ||
      (pathname.startsWith(`${item.pathname}/`) && !pathname.startsWith(`${item.pathname}-`))
    );
  }, [pathname]);

  return (
    <>
      <Tooltip title={tSidebar(item.label)} arrow placement="right">
        <Button
          variant={isActive ? 'ghost' : 'text'}
          color={isActive ? 'primary' : 'gray'}
          className="relative w-full min-w-0 flex-col px-2! py-3"
          LinkComponent={item.children ? undefined : Link}
          href={item.children ? undefined : item.pathname}
          onClick={handleClick}
        >
          <Typograhy variant="body1" className="flex flex-col items-center gap-1 text-xs">
            <item.icon size="1rem" />
            {/* {item.label} */}
          </Typograhy>
          {item.children && <ChevronRight size="1rem" className="absolute top-3 right-0" />}
        </Button>
      </Tooltip>
      {item.children && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              variant: 'outlined',
            },
          }}
          onClose={() => setAnchorEl(null)}
        >
          <Typograhy variant="body1" className="px-4 py-2 text-sm">
            {tSidebar(item.label)}
          </Typograhy>
          <Divider className="m-0" />
          <div className="flex min-w-52 flex-col gap-1 p-1" role="menu" tabIndex={0}>
            {item.children?.map((child, i) =>
              child.children && child.children.length > 0 ? (
                <NavButton2 item={child} key={i} />
              ) : (
                <Button
                  LinkComponent={Link}
                  href={child.pathname}
                  key={i}
                  className="justify-start px-3 !py-2 text-xs"
                  onClick={() => setAnchorEl(null)}
                  color="gray"
                >
                  {tSidebar(child.label)}
                </Button>
              ),
            )}
          </div>
        </Popover>
      )}
    </>
  );
};

export default NavButton;
