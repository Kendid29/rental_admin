import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Villa Class',
  description: 'Manage your villa classes here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
