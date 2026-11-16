'use client';

import { useMemo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button, Typography } from '@mui/material';

import { useTranslation } from '@/lib/hooks/useTranslation';

import { OverViewItem_2 } from '../nav_items';
import NavChildrenWrapper from './NavChildrenWrapper';

interface Props {
  item: OverViewItem_2;
  last: boolean;
}

const NavButtonChildren = ({ item, last }: Props) => {
  const { tSidebar } = useTranslation();
  const pathname = usePathname();
  const isActive = useMemo(() => {
    return item.isHome
      ? pathname === item.pathname
      : pathname === `${item.pathname}` || pathname.startsWith(`${item.pathname}/`);
  }, [pathname]);

  return item.children ? (
    <NavChildrenWrapper item={item as any} depth={2} last={last} />
  ) : (
    <div className="relative w-full pl-6">
      <div className="absolute top-0 left-3 h-5 w-3 rounded-bl-lg border-2 border-t-0 border-r-0 border-gray-300" />
      {!last && <div className="absolute top-0 left-3 h-full w-[2px] bg-gray-300" />}
      <Button
        variant={isActive ? 'ghost' : 'text'}
        LinkComponent={Link}
        href={item.pathname}
        color="gray"
        className="mt-1 w-full justify-start px-3 !py-2 [&_p]:text-xs"
      >
        <Typography variant="body2" className="!m-0 !text-xs">
          {tSidebar(item.label)}
        </Typography>
      </Button>
    </div>
  );
};

export default NavButtonChildren;
