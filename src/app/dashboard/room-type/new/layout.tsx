import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Room Type',
  description: 'Create a new room type here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
