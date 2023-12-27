// @mui
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@material-ui/core';
import EmptyContent from 'assets/empty_content';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool
};

export default function TableNoData({ isNotFound }) {
  return (
    <>
      {isNotFound ? (
        <TableRow>
          <TableCell colSpan={11}>
            <EmptyContent title="No Data" />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={11} sx={{ p: 0 }} />
        </TableRow>
      )}
    </>
  );
}
