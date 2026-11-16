import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Permission Configuration',
  description: 'Configure permissions for a role here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
