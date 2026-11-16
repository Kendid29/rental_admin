import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Package Tour',
  description: 'Create a new Package Tour here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;

