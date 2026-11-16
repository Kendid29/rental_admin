import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Room and Pricing',
  description: 'Create a new room and pricing here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
