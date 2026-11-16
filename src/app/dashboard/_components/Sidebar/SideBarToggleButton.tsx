import React from 'react';

import { Button } from '@mui/material';

import { PanelLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useNavigationStore } from '@/lib/zustand/navigation.store';

interface Props {
  className?: string;
}

const SideBarToggleButton = ({ className }: Props) => {
  const { toggleSidebar } = useNavigationStore();

  return (
    <Button
      variant="outlined"
      className={cn('h-fit min-w-0 bg-white p-2', className)}
      onClick={() => toggleSidebar()}
    >
      <PanelLeft size={18} />
    </Button>
  );
};

export default SideBarToggleButton;
