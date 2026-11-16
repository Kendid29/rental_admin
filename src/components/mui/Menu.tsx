'use client';

import React, { useState } from 'react';

import { ButtonProps, IconButtonProps } from '@mui/material';
import MuiMenu, { MenuProps } from '@mui/material/Menu';

import { cn } from '@/lib/utils';

const flattenMenuChildren = (children: React.ReactNode): React.ReactNode[] => {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child) || child.type !== React.Fragment) {
      return [child];
    }

    const fragmentChild = child as React.ReactElement<{ children?: React.ReactNode }>;

    return flattenMenuChildren(fragmentChild.props.children);
  });
};

interface Props extends Omit<MenuProps, 'open'> {
  Button: any;
  buttonProps?: Partial<ButtonProps | IconButtonProps>;
}

const Menu = ({ Button, buttonProps, children, className, ...props }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick} {...buttonProps} />
      <MuiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        className={cn('menu-container', className)}
        {...props}
        slotProps={{
          ...props.slotProps,
          paper: {
            variant: 'outlined',
            ...props.slotProps?.paper,
          },
        }}
      >
        {flattenMenuChildren(children)}
      </MuiMenu>
    </>
  );
};

export default Menu;
