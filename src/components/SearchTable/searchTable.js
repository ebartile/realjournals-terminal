import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchDebounce } from 'hooks/useSearchDebounce';
import TableContext from 'contexts/TableContext';
import { InputAdornment, OutlinedInput } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { defaultTo } from 'lodash';
import { experimentalStyled as styled } from '@material-ui/core/styles';

const SearchTable = ({ field = 'name', withParams = false, ...otherProps }) => {
  const [value, setValue] = useState();
  const { applySearch, applyParams } = useContext(TableContext);

  const apply = useMemo(() => (withParams ? applyParams : applySearch), [withParams, applyParams, applySearch]);

  const search = useCallback((value) => apply({ [field]: value }), [apply, field]);

  const clear = useCallback(() => apply({ [field]: undefined }), [apply, field]);

  useSearchDebounce(value, search, clear);
  useEffect(() => clear, [clear]);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return (
    <StyledOutlinedInput
      {...otherProps}
      size="small"
      onChange={handleChange}
      value={defaultTo(value, '')}
      startAdornment={
        <InputAdornment position="start">
          <Search color="text.disabled" />
        </InputAdornment>
      }
    />
  );
};

export const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderColor: `${theme.palette.grey[500_32]} !important`,
    borderWidth: `1px !important`
  }
}));

export default SearchTable;
