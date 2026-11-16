'use client';

import { useState } from 'react';

import { useMouse, useWindowSize } from '@uidotdev/usehooks';
import { SquirrelIcon } from 'lucide-react';

const Squirrel = () => {
  const [clicked, setClicked] = useState(false);

  const [mouse] = useMouse();
  const { width } = useWindowSize();

  return (
    <SquirrelIcon
      onClick={() => setClicked(true)}
      size={250}
      strokeWidth={1.25}
      className={`${(width || 0) / 2 - mouse.x > 0 && !clicked ? '-scale-x-100' : ''} ${clicked ? 'animate-spin' : ''}`}
    />
  );
};

export default Squirrel;
