import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useRequest } from 'services/Http';
import { isUndefined } from 'lodash';
import { useTheme } from '@material-ui/core/styles';
import { Box, LinearProgress } from '@material-ui/core';
import { TableProvider } from 'contexts/TableContext';
import PropTypes from 'prop-types';
import { notify } from 'utils/index';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';

const AsyncTable = forwardRef((props, ref) => {
  const {
    url,
    autoHeight = true,
    getRowId = (row) => row.id,
    checkboxSelection = false,
    initialPageSize = 10,
    onDataChange,
    rowHeight = 70,
    rowsPerPageOptions = [10, 25, 50],
    columns: baseColumns = [],
    components,
    ...otherProps
  } = props;

  const theme = useTheme();
  const [request, loading] = useRequest();
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState({});
  const [params, setParams] = useState({});
  const [selection, setSelection] = useState([]);
  const [filters, setFilters] = useState([]);
  const [data, setData] = useState([]);

  const columns = useMemo(() => {
    return baseColumns.map((column) => {
      const result = { ...column };

      if (isUndefined(column.filterable)) {
        result.filterable = false;
      }

      if (isUndefined(column.sortable)) {
        result.sortable = false;
      }

      if (isUndefined(column.disableColumnMenu)) {
        result.disableColumnMenu = !result.filterable;
      }

      return result;
    });
  }, [baseColumns]);

  const fetchData = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.append('search', JSON.stringify(search));
    queryParams.append('filters', JSON.stringify(filters)); // Assuming filters is an object
    queryParams.append('itemPerPage', pageSize);
    queryParams.append('page', page + 1);

    const fullUrl = `${url}?${queryParams.toString()}`;

    request
      .get(fullUrl) // Assuming you have a 'get' method for making GET requests
      .then((response) => {
        setRowCount(response.count);
        setData(response.results);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data._error_message) {
          notify.error(error.response.data._error_message);
        }
      });
  }, [request, page, pageSize, filters, search, url]);

  useEffect(() => {
    fetchData();
  }, [url]);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  const applySearch = useCallback((search) => {
    setSearch((state) => ({ ...state, ...search }));
    setPage(0);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch({});
    setPage(0);
  }, []);

  const applyParams = useCallback((params) => {
    setParams((state) => ({ ...state, ...params }));
    setPage(0);
  }, []);

  const clearParams = useCallback(() => {
    setParams({});
    setPage(0);
  }, []);

  useImperativeHandle(ref, () => ({
    resetPage,
    fetchData,
    applySearch,
    clearSearch,
    applyParams,
    clearParams
  }));

  const containerHeight = useMemo(() => {
    return autoHeight ? (data.length > 0 ? 'auto' : 300) : '100%';
  }, [data, autoHeight]);

  const handleFilterChange = useCallback((filterModel) => {
    setFilters(filterModel?.items);
  }, []);

  return (
    <TableProvider
      reload={fetchData}
      applySearch={applySearch}
      clearSearch={clearSearch}
      applyParams={applyParams}
      clearParams={clearParams}
      resetPage={resetPage}
      selection={selection}
      loading={loading}
    >
      <Box sx={{ height: containerHeight }}>
        <DataGrid
          autoHeight={data.length > 0 && autoHeight}
          {...otherProps}
          rowHeight={rowHeight}
          getRowId={getRowId}
          rows={data}
          columns={columns}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          rowsPerPageOptions={rowsPerPageOptions}
          disableColumnSelector
          disableSelectionOnClick
          disableDensitySelector
          checkboxSelection={checkboxSelection}
          onSelectionModelChange={setSelection}
          selectionModel={selection}
          loading={loading}
          components={{ LoadingOverlay, ...components }}
          componentsProps={{
            loadingOverlay: {
              style: {
                zIndex: 3,
                background: theme.palette.background.default,
                opacity: 0.5
              }
            }
          }}
          pagination
          paginationMode="server"
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          page={page}
          onPageChange={setPage}
          rowCount={rowCount}
        />
      </Box>
    </TableProvider>
  );
});

AsyncTable.propTypes = {
  url: PropTypes.string.isRequired,
  autoHeight: PropTypes.bool,
  checkboxSelection: PropTypes.bool,
  getRowId: PropTypes.func,
  initialPageSize: PropTypes.number,
  onDataChange: PropTypes.func,
  rowHeight: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  columns: PropTypes.arrayOf(PropTypes.object)
};

const LoadingOverlay = () => {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
};

export default AsyncTable;
