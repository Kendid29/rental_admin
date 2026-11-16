import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Room Facility',
  description: 'Create a new room facility here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
