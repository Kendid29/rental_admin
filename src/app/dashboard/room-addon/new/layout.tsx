import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Room Addon',
  description: 'Create a new room addon here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
