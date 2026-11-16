import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Room and Pricing',
  description: 'Edit a room and pricing here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
