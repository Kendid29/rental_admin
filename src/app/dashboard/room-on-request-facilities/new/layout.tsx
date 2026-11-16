import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Room On Request Facility',
  description: 'Create a new room on request facility here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
