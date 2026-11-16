import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Staff',
  description: 'Create a new staff here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
