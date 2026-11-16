import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member',
  description: 'Manage your members here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
