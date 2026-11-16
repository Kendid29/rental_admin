import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Package Tour Pricing',
  description: 'Manage your Package Tour pricings here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
