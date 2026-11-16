import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Promotion Category',
  description: 'Create a new promotion category here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
