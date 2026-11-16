import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Room Addon',
  description: 'Edit a room addon here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
