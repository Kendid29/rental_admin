'use client';

import { useState } from 'react';

import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { ChevronRight } from 'lucide-react';

import { useTranslation } from '@/lib/hooks/useTranslation';
import { NavItem } from '../nav_items';
import NavButton from './NavButton';

const NavItemOpen = ({ navItem }: { navItem: NavItem }) => {
  const [open, setOpen] = useState(true);
  const { tSidebar } = useTranslation();

  return (
    <div>
      <Typography
        variant="caption"
        className="group mb-1 flex w-fit cursor-pointer items-center text-xs uppercase duration-200 hover:text-inherit"
        onClick={() => setOpen(!open)}
      >
        <ChevronRight
          className={`${open ? 'rotate-90' : 'rotate-0'} w-0 overflow-hidden text-sm duration-200 group-hover:w-4`}
        />
        {tSidebar(navItem.title)}
      </Typography>
      <Collapse in={open}>
        {navItem.items.map((item, index) => (
          <NavButton key={item.label} item={item} className={index !== 0 ? 'mt-1' : ''} />
        ))}
      </Collapse>
    </div>
  );
};

export default NavItemOpen;
