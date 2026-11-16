import { Metadata } from 'next';
import Link from 'next/link';

import { Button, Typography } from '@mui/material';

import Squirrel from '@/components/Squirrel';

export const metadata: Metadata = {
  title: '404 page not found!',
};

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col">
      <nav className="x-12 sticky top-0 z-50 flex w-full items-center justify-between gap-8 border-b bg-white/50 px-6 py-6 backdrop-blur backdrop-filter">
        <Link href="/dashboard/admin">Web Admin Rentalin Aja</Link>
      </nav>
      <div className="-mt-24 flex flex-1 flex-col items-center justify-center gap-4">
        <Typography variant="h4">Oops, page not found!</Typography>
        <Typography className="max-w-96 text-center">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve
          mistyped the URL? Be sure to check your spelling.
        </Typography>

        <Squirrel />

        <Link href="/dashboard/admin">
          <Button LinkComponent={undefined} variant="contained" color="black">
            Go to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
