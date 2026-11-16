import './globals.css';

import React from 'react';

import { Metadata } from 'next';
import { Geist } from 'next/font/google';

import Provider from '@/provider';

// eslint-disable-next-line new-cap
const primaryFont = Geist({
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Web Admin Rentalin Aja',
    default: 'Web Admin Rentalin Aja',
    absolute: 'Web Admin Rentalin Aja',
  },
  description: 'Web Admin Rentalin Aja - Platform Rental Kendaraan & Barang',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html suppressHydrationWarning lang="id">
    <body
      id="root"
      suppressHydrationWarning
      className={`font-primary scrollbar-track-primary-100 scrollbar-thumb-primary-300 selection:bg-primary-200 selection:text-primary-900 relative flex min-h-screen scrollbar-thin text-slate-900 antialiased ${primaryFont.variable} ${primaryFont.className}`}
    >
      <Provider>{children}</Provider>
    </body>
  </html>
);

export default RootLayout;
