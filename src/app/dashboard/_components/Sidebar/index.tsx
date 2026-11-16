'use client';

import React, { useMemo } from 'react';

import { Card, Divider, Typography } from '@mui/material';

import { useNavigationStore } from '@/lib/zustand/navigation.store';
import { usePermission } from '@/services/permission/usePermission';

import NAV_ITEMS from './nav_items';
import NavListClose from './NavListClose';
import NavListOpen from './NavListOpen';
import SideBarToggleButton from './SideBarToggleButton';

const Sidebar = () => {
  const { isSidebarOpen } = useNavigationStore();

  const checkPermission = usePermission();

  const filteredNavItems = useMemo(() => {
    return NAV_ITEMS.map((overview) => {
      const tempNav = overview.items.map((item) => {
        if (item.children) {
          const tempNav2 = item.children.map((child) => {
            if (child.children) {
              const filteredNav2 = child.children.filter((child2) =>
                checkPermission(child2.permission_module, 'Read'),
              );

              return { ...child, children: filteredNav2 };
            }
            return child;
          });

          const filteredChildren = tempNav2.filter(
            (child) =>
              (child.children?.length || 0) > 0 || checkPermission(child.permission_module, 'Read'),
          );

          return {
            ...item,
            children: filteredChildren,
          };
        }
        return item;
      });

      return {
        ...overview,
        items: tempNav.filter((item) => {
          if (typeof item.children !== 'undefined') {
            if (item.children.length === 0) return false;
            return true;
          }

          return checkPermission(item.permission_module || '', 'Read');
        }),
      };
    }).filter((overview) => overview.items.length > 0);
  }, [checkPermission]);

  return (
    <Card
      variant="outlined"
      className={`fixed z-50 flex h-[calc(100%-1.5rem)] flex-col rounded-lg pt-2 pr-0 transition-all duration-700 ease-in-out ${isSidebarOpen ? 'left-3 w-[calc(100%-1.5rem)] p-3 md:w-64' : '-left-16 w-16 p-1'} md:left-3`}
    >
      <div
        className={`flex w-full items-center justify-between ${isSidebarOpen ? 'mb-3 pt-1 pr-3' : 'mb-2 pr-1'}`}
      >
        <div className={`flex gap-2 ${isSidebarOpen ? 'md:gap-2' : 'md:gap-0'}`}>
          <div
            className={`bg-primary-500 flex size-10 items-center justify-center rounded-xl ${isSidebarOpen ? 'mx-0' : 'mx-auto'} transition-all duration-700`}
          >
            <Typography className="text-lg leading-none font-bold text-white">R</Typography>
          </div>
          <div
            className={`flex flex-col ${isSidebarOpen ? 'w-full' : 'w-0'} overflow-hidden transition-all duration-700`}
          >
            <Typography className="m-0! text-base font-semibold">Rentalin Aja</Typography>
            <Typography className="-mt-1 text-sm text-neutral-500">
              Rental Kendaraan
            </Typography>
          </div>
        </div>
        <SideBarToggleButton className="md:hidden" />
      </div>

      <Divider className="-mx-3 mt-0" />

      {isSidebarOpen ? (
        <NavListOpen nav_items={filteredNavItems} isLoading={false} />
      ) : (
        <NavListClose nav_items={filteredNavItems} isLoading={false} />
      )}
    </Card>
  );
};

export default Sidebar;
