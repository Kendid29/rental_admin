import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity Log',
  description: 'Audit trail dan riwayat aktivitas pengguna dan sistem.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
