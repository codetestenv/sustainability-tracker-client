import React from 'react';

export const usePagination = (data = [], pageSize = 10) => {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [data.length]);

  return { page, setPage, totalPages, paginated, totalItems: data.length, pageSize };
};

export default usePagination;
