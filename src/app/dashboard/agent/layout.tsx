import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent',
  description: 'Manage your agents here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
