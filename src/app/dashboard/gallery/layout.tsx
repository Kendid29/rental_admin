import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery Management',
  description: 'Manage public landing page gallery photos here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
