'use client';

import { Divider, Typography } from '@mui/material';

interface Props {
  options: any;
}

const ChartTooltip = ({ options }: Props) => {
  const { series, w, seriesIndex, dataPointIndex } = options;
  const { colors } = w.config;
  const { seriesNames, labels } = w.globals;

  return (
    <div className="font-primary p-2">
      <Typography variant="body2" className="mb-2 font-semibold">
        {labels[dataPointIndex]}
      </Typography>
      {/* <Divider className="-mx-2 my-2" /> */}
      <div className="flex w-full min-w-20 flex-col gap-1">
        {series.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: colors[index],
              }}
            />
            <Typography>{seriesNames[index]} :</Typography>
            <Typography variant="body2" className="ml-auto">
              {item[dataPointIndex]}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartTooltip;
