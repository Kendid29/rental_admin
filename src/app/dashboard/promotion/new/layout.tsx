import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Promotion',
  description: 'Create a new promotion here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
