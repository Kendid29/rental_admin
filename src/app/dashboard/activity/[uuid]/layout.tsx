import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Activity',
  description: 'Edit an activity here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
