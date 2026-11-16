import { Typography } from '@mui/material';

const generateCreatedUpdatedColumn = () => {
  return [
    {
      field: 'created',
      headerName: 'Created',
      width: 150,
      valueGetter: (_: any, row: any) => row.created.at,
      renderCell(params: any) {
        return (
          <div className="flex h-full flex-col justify-center gap-0.5">
            <Typography variant="body2" title={params.row.created.at} component="span">
              At: {params.row.created.at}
            </Typography>
            <Typography variant="body2" title={params.row.created.by} component="span">
              By: {params.row.created.by}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'updated',
      headerName: 'Updated',
      width: 150,
      valueGetter: (_: any, row: any) => row.updated.at,
      renderCell(params: any) {
        return (
          <div className="flex h-full flex-col justify-center gap-0.5">
            <Typography component="span" title={params.row.updated.at} variant="body2">
              At: {params.row.updated.at}
            </Typography>
            <Typography component="span" title={params.row.updated.by} variant="body2">
              By: {params.row.updated.by}
            </Typography>
          </div>
        );
      },
    },
  ];
};

export default generateCreatedUpdatedColumn;
