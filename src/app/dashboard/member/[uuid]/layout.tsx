import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Member',
  description: 'Edit your member here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;