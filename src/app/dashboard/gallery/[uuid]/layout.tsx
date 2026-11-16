import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Gallery Photo',
  description: 'Edit a gallery photo here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
