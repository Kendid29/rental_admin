import { Typography } from '@mui/material';

interface Props {
  options: any;
}

const ChartLegend = ({ options }: Props) => {
  const series = options.w.config.series[options.seriesIndex];
  const seriesTotal = options.w.globals.seriesTotals[options.seriesIndex];

  return (
    <>
      <Typography className="-mt-0.5 ml-1">Total {series?.name}</Typography>
      <Typography className="ml-1 text-lg font-semibold">{seriesTotal}</Typography>
    </>
  );
};

export default ChartLegend;
