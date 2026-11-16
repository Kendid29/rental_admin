import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent History',
  description: 'View agent transaction history here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
