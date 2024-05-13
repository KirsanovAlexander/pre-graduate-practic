import React, {useState} from 'react';
import {Pagination} from 'antd';

const CustomPagination = ({total, onPageChange, pageSizeOptions, defaultPageSize}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    onPageChange(page, pageSize);
  };

  const handleSizeChange = (page, size) => {
    setPage(1);
    setPageSize(size);
    onPageChange(1, size);
  };

  return (
    <Pagination
      current={page}
      total={total}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      showSizeChanger
      showQuickJumper
      showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} записей`}
      onChange={handlePageChange}
      onShowSizeChange={handleSizeChange}
    />
  );
};

export default CustomPagination;
