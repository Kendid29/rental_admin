import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Agent',
  description: 'Edit agent details here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
