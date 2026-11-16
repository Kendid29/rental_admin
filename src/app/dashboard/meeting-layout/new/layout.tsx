import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Meeting Layout',
  description: 'Create a new meeting layout here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
