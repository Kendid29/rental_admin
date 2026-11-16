import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Room On Request Facilities',
  description: 'Manage your room on request facilities here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
