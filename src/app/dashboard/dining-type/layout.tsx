import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dining Type',
  description: 'Manage your dining types here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
