import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Report',
  description: 'Manage your booking reports here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
