'use client';

import Link from 'next/link';

import { Typography } from '@mui/material';

import { TriangleAlert } from 'lucide-react';

interface Props {
  error: Error;
  reset: () => void;
}

const GlobalError = ({ error, reset }: Props) => {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col">
          <nav className="x-12 sticky top-0 z-50 flex w-full items-center justify-between gap-8 border-b bg-white/50 px-6 py-6 backdrop-blur backdrop-filter">
            <Link href="/">La Nadiya Villa</Link>
          </nav>
          <div className="-mt-24 flex flex-1 flex-col items-center justify-center gap-4">
            <TriangleAlert size={250} strokeWidth={1.5} />
            <Typography variant="h4">Oops! Something went wrong.</Typography>
            <Typography component="div" className="max-w-96 text-center">
              We&apos;re sorry, but an unexpected error has occurred.
              <ul className="mt-4 list-disc text-start">
                <li>Try refreshing the page</li>
                <li>
                  Go back to the{' '}
                  <Link href="/dashboard/home" className="underline">
                    homepage
                  </Link>
                </li>
                <li>If the problem persists, contact support.</li>
              </ul>
            </Typography>
            <Typography className="text-center">
              Let us know if you need something more specific! 😊
            </Typography>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
