import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activities Management',
  description: 'Manage public landing page activities here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
