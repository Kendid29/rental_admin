import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Room Addon',
  description: 'Manage your room addons here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
