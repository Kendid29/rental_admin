import { Suspense } from 'react';

import { Typography } from '@mui/material';

import ImageContainer from '@/components/ImageContainer';

import LoginForm from './_components/LoginForm';

const page = () => {
  return (
    <main className="flex h-screen w-full">
      <div className="relative hidden flex-1 overflow-hidden md:block">
        <ImageContainer className="size-full" src="/img/rentaku-login.png" alt="">
          <div className="absolute top-0 flex size-full flex-col justify-between bg-gradient-to-b from-black/80 to-black/20 p-10">
            <ImageContainer
              alt="Rentalin Aja Logo"
              src="/img/rentaku-logo.png"
              className="aspect-square w-24 bg-transparent"
            />
          </div>
        </ImageContainer>
      </div>

      <Suspense fallback={<div />}>
        <LoginForm />
      </Suspense>
    </main>
  );
};

export default page;
