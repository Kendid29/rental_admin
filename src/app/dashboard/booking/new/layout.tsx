import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Booking',
  description: 'Create a new manual booking for a guest.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
