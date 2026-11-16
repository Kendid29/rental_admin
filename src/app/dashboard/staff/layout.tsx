import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staff',
  description: 'Manage your staff here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
