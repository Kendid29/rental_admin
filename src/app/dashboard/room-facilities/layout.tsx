import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Room Facilities',
  description: 'Manage your room facilities here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
