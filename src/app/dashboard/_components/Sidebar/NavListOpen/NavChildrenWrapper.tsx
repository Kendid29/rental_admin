'use client';

import { useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import { Button, Collapse, Typography } from '@mui/material';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useNavigationStore } from '@/lib/zustand/navigation.store';

import { OverViewItem } from '../nav_items';
import NavButtonChildren from './NavButtonChildren';

interface Props {
  item: OverViewItem;
  className?: string;
  depth?: number;
  last?: boolean;
}

const NavChildrenWrapper = ({ item, className, depth = 1, last }: Props) => {
  const { tSidebar } = useTranslation();
  const { activeMenu, setActiveMenu } = useNavigationStore();

  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = useMemo(() => {
    return (
      pathname === item.pathname ||
      (pathname.startsWith(`${item.pathname}/`) && !pathname.startsWith(`${item.pathname}-`))
    );
  }, [pathname]);

  const onButtonClick = () => {
    if (depth === 1) {
      setActiveMenu(item.pathname === activeMenu ? '' : item.pathname || '');
    } else {
      setOpen(!open);
    }
  };

  const isOpen = useMemo(() => {
    return depth === 1 ? activeMenu === item.pathname : open;
  }, [activeMenu, open]);

  return (
    <div className={cn('relative w-full', depth === 2 && 'pl-6', last && 'mb-2')}>
      {depth !== 1 && (
        <>
          <div className="absolute top-0 left-3 h-5 w-3 rounded-bl-lg border-2 border-t-0 border-r-0 border-gray-300" />
          {!last && <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-300" />}
        </>
      )}
      <Button
        variant={isOpen || isActive ? 'ghost' : 'text'}
        // eslint-disable-next-line no-nested-ternary -- no nested ternary
        color={isActive ? 'primary' : isOpen ? 'black' : 'gray'}
        className={cn(
          'w-full items-center justify-between transition-all duration-300',
          depth === 1 ? 'px-3 py-2 [&_p]:text-sm' : 'mt-1 px-3 !py-2 [&_p]:text-xs',
          isActive && depth === 1 && 'border-l-4 border-primary-500 rounded-l-none pl-2',
          className,
        )}
        onClick={onButtonClick}
      >
        <Typography
          variant={depth === 1 ? 'body1' : 'body2'}
          className={cn('flex items-center gap-2', depth === 1 ? 'font-normal' : '')}
        >
          {item.icon && <item.icon size="1rem" />}
          {tSidebar(item.label)}
        </Typography>
        <ChevronRight
          size="1rem"
          className={cn('transform transition-transform', { 'rotate-90': isOpen })}
        />
      </Button>
      <Collapse in={isOpen}>
        {item.children?.map((child, index) => (
          <NavButtonChildren
            key={child.label}
            item={child}
            last={index === (item.children || []).length - 1}
          />
        ))}
      </Collapse>
    </div>
  );
};

export default NavChildrenWrapper;
