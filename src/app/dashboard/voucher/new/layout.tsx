import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Voucher',
  description: 'Create a new voucher here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
