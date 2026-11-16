import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promotion',
  description: 'Manage your promotions here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
