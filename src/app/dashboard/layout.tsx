'use client';

import React from 'react';

import { usePathname } from 'next/navigation';

import { domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import { useNavigationStore } from '@/lib/zustand/navigation.store';

import Header from './_components/Header';
import Sidebar from './_components/Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useNavigationStore();
  const pathname = usePathname();

  return (
    <main className="bg-surface-50 relative flex min-h-screen w-full gap-8 p-3 pr-6 pl-6 md:pl-3">
      <Sidebar />
      <div
        className={`relative flex h-full w-full flex-1 flex-col pl-0 transition-all duration-700 ${isSidebarOpen ? 'md:pl-72' : 'md:pl-24'}`}
      >
        <Header />
        <LazyMotion features={domAnimation}>
          <m.div
            key={pathname}
            variants={{
              out: {
                opacity: 0,
                y: 40,
                transition: {
                  duration: 0,
                },
              },
              in: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  delay: 0.25,
                  type: 'spring',
                },
              },
            }}
            animate="in"
            initial="out"
            exit="out"
            className="flex flex-1 flex-col"
          >
            <div className="mx-auto flex w-full flex-1 grow flex-col">{children}</div>
          </m.div>
        </LazyMotion>
      </div>
    </main>
  );
};

export default Layout;
