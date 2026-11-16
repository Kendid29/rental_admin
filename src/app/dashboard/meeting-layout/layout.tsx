import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeting Layout',
  description: 'Manage your meeting layouts here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
