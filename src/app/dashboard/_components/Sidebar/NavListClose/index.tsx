'use client';

import _ from 'lodash';

import { NavItem } from '../nav_items';
import NavButton from './NavButton';

const NavListClose = ({ nav_items, isLoading }: { nav_items: NavItem[]; isLoading: boolean }) => {
  return (
    <div className="flex h-full flex-col gap-2 overflow-auto pr-1">
      {isLoading
        ? Array.from({ length: 10 }).map((__, i) => (
            <div key={i} className="min-h-[63px] w-[73px] animate-pulse rounded-lg bg-gray-200" />
          ))
        : nav_items.map((item1) =>
            item1.items.flat().map((item2, j) => <NavButton key={j} item={item2} />),
          )}
    </div>
  );
};

export default NavListClose;
