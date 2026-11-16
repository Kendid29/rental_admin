import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rooms and Pricing',
  description: 'Manage your rooms and pricing here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
