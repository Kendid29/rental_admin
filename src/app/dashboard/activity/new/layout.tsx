import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Activity',
  description: 'Create a new activity here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
