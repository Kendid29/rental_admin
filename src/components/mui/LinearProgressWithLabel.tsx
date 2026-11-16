import { Box, LinearProgress, LinearProgressProps, Typography } from '@mui/material';

const LinearProgressWithLabel = ({
  value,
  title,
  ...props
}: LinearProgressProps & { value: number }) => {
  return (
    <Box component="div" className="flex w-full items-center" title={title}>
      <Box className="mr-2 w-full">
        <LinearProgress variant="determinate" value={value} {...props} />
      </Box>
      <Box className="min-w-9">
        <Typography variant="body2">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
