import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dining Services',
  description: 'Manage your dining services options here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
