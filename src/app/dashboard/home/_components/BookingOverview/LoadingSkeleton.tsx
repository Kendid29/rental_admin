import React from 'react';

import { Paper } from '@mui/material';

const LoadingSkeleton = () => {
  return (
    <Paper variant="outlined" className="flex items-center justify-between p-4">
      <div className="flex w-full items-center gap-2">
        <div className="size-10 animate-pulse rounded-full bg-gray-200" />
        <div className="w-full">
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="flex w-1/3 gap-6">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </Paper>
  );
};

export default LoadingSkeleton;
