import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Package Tour',
  description: 'Edit your package tour here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
