import React from 'react';

import { Divider } from '@mui/material';

import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

import ProfileMenu from './ProfileMenu';
import SearchNavigationButton from './SearchNavigation/SearchNavigationButton';
import SideBarToggleButton from './Sidebar/SideBarToggleButton';

const Header = () => {
  return (
    <div className="my-2 mb-4 flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <SideBarToggleButton />
        <Divider orientation="vertical" className="m-0 h-full" />
        <SearchNavigationButton />
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
