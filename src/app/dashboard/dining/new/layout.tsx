import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Dining Service',
  description: 'Create a new dining service options here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
