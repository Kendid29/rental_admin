import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Staff',
  description: 'Edit a staff here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
