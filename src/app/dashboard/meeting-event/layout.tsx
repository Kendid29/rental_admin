import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeting & Events',
  description: 'Manage your meeting & events options here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
