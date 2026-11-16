import { useState } from 'react';

import { useDebounce } from '@uidotdev/usehooks';

export interface PaginationModelType {
  page: number;
  pageSize: number;
}

const useTablePagination = (iniitalPagination?: { page: number; pageSize: number }) => {
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>(
    iniitalPagination || {
      page: 0,
      pageSize: 10,
    },
  );
  const [search, setSearch] = useState('');

  const debounceSearch = useDebounce(search, 300);

  return {
    paginationModel,
    setPaginationModel,
    search: debounceSearch,
    setSearch,
  };
};

export default useTablePagination;
