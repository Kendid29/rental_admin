import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promotion Category',
  description: 'Manage your promotion categories here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
