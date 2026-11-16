import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voucher',
  description: 'Manage your vouchers here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
