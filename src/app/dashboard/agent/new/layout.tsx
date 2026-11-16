import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Agent',
  description: 'Create a new agent here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
