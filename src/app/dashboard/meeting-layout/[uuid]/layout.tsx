import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Meeting Layout',
  description: 'Edit a meeting layout here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
