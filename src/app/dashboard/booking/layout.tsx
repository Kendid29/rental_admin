import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bookings',
  description: 'Manage your hotel bookings and view occupancy.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
