import { Suspense } from 'react';

import { Typography } from '@mui/material';

import ImageContainer from '@/components/ImageContainer';

import LoginForm from './_components/LoginForm';

const page = () => {
  return (
    <main className="flex h-screen w-full">
      <div className="relative hidden flex-1 overflow-hidden md:block">
        <ImageContainer className="size-full" src="/img/login-image-lana.png" alt="">
          <div className="absolute top-0 flex size-full flex-col justify-between bg-gradient-to-b from-black/80 to-black/20 p-10">
            <ImageContainer
              alt="La Nadiya Villa Logo"
              src="/img/lanadiya-logo.png"
              className="aspect-square w-24 bg-transparent"
            />

            {/* <div className="text-white">
              <Typography variant="h6" className="mb-3 !font-serif leading-7">
                “Every adversity, every failure, every heartbreak, carries with it the seed of an
                equal or greater benefit.”
              </Typography>
              <Typography variant="body1">― Napoleon Hill, Think and Grow Rich </Typography>
            </div> */}
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
