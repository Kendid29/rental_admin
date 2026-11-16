'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Divider, Popover } from '@mui/material';
import Button from '@mui/material/Button';
import Typograhy from '@mui/material/Typography';

import { ChevronRight } from 'lucide-react';

import { OverViewItem_2 } from '../nav_items';
import { useTranslation } from '@/lib/hooks/useTranslation';

const NavButton2 = ({ item }: { item: OverViewItem_2 }) => {
  const { tSidebar } = useTranslation();
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const id = open ? 'hover-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button
        variant={pathname === item.pathname ? 'ghost' : 'text'}
        color={pathname === item.pathname ? 'primary' : 'gray'}
        className="relative w-full justify-between px-3 !py-2 [&_p]:text-xs"
        LinkComponent={item.children ? undefined : Link}
        href={item.children ? undefined : item.pathname}
        onClick={handleClick}
      >
        <Typograhy variant="body1">{tSidebar(item.label)}</Typograhy>
        {item.children && <ChevronRight size="1rem" className="absolute right-1" />}
      </Button>
      {/* <Button
        LinkComponent={Link}
        href={child.pathname}
        key={i}
        className="justify-start"
        onClick={() => setAnchorEl(null)}
        color="gray"
      >
        {child.label}
      </Button> */}
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
          <div className="flex min-w-52 flex-col gap-1 p-2" role="menu" tabIndex={0}>
            {item.children?.map((child, i) => (
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
            ))}
          </div>
        </Popover>
      )}
    </>
  );
};

export default NavButton2;
