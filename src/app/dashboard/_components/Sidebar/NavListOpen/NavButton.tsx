'use client';

import { useMemo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Button from '@mui/material/Button';
import Typograhy from '@mui/material/Typography';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { cn } from '@/lib/utils';

import { OverViewItem } from '../nav_items';
import NavChildrenWrapper from './NavChildrenWrapper';

const NavButton = ({ item, className }: { item: OverViewItem; className?: string }) => {
  const { tSidebar } = useTranslation();
  const pathname = usePathname();
  const isActive = useMemo(() => {
    return (
      pathname === item.pathname ||
      (pathname.startsWith(`${item.pathname}/`) && !pathname.startsWith(`${item.pathname}-`))
    );
  }, [pathname]);

  return item.children ? (
    <NavChildrenWrapper item={item} className={className} last={false} />
  ) : (
    <Button
      variant={isActive ? 'ghost' : 'text'}
      color={isActive ? 'primary' : 'gray'}
      className={cn(
        'w-full justify-start px-3 py-2 transition-all duration-300 [&_p]:text-sm',
        isActive && 'border-primary-500 rounded-l-none border-l-4 pl-2',
        className,
      )}
      LinkComponent={Link}
      href={item.pathname}
    >
      <Typograhy variant="body1" className="flex items-center gap-2 font-normal">
        <item.icon size="1rem" />
        {tSidebar(item.label)}
      </Typograhy>
    </Button>
  );
};

export default NavButton;
