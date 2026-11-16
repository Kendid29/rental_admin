import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Villa Class',
  description: 'Create a new villa class here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
