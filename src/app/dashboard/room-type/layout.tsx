import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Room Type',
  description: 'Manage your room types here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
