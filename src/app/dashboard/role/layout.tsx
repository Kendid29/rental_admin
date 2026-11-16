import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Role',
  description: 'Manage your roles here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
