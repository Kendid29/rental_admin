import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Gallery Photo',
  description: 'Create a new gallery photo here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
