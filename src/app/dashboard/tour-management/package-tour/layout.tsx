import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Package Tour',
  description: 'Manage your Package Tours here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;

