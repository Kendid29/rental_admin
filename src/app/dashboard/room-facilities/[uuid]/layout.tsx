import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Room Facility',
  description: 'Edit a room facility here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
