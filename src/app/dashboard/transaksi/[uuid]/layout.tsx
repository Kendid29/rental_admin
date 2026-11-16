import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Details',
  description: 'Booking details here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
