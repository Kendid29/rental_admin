import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Promotion Category',
  description: 'Edit a promotion category here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
