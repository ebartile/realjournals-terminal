import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { FormInputContext } from '../contexts';
import DatePicker from '@material-ui/lab/DatePicker';
import { defaultTo, isEmpty } from 'lodash';
import { dayjs } from 'utils/index';

const BaseDatePicker = ({ inputFormat = 'YYYY - MM - DD', value, onChange, helperText, ...baseProps }) => {
  const { isRequired, label, validateStatus, errors = [] } = useContext(FormInputContext);

  switch (validateStatus) {
    case 'error':
      baseProps.error = true;
      break;
    case 'success':
      baseProps.color = 'primary';
      break;
    default:
      baseProps.color = 'info';
  }

  helperText = isEmpty(errors) ? helperText : errors.join(', ');
  console.log(value);

  return (
    <DatePicker
      format={inputFormat}
      label={label}
      onChange={onChange}
      value={value}
      renderInput={(renderParams) => (
        <TextField {...renderParams} {...baseProps} helperText={helperText} required={isRequired} />
      )}
    />
  );
};

export default BaseDatePicker;
