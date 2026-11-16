import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Package Tour Pricing',
  description: 'Edit your package tour pricing here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
