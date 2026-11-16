import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Meeting & Event',
  description: 'Create a new meeting & event options here.',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default Layout;
