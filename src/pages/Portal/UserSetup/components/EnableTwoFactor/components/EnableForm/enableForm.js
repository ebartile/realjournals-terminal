import React from 'react';
import { Grid, InputAdornment } from '@material-ui/core';
import Form, { TextField } from 'components/Form';
import { LoadingButton } from '@material-ui/lab';
import { Lock } from '@material-ui/icons';
import TokenInput from 'components/TokenInput';

const EnableForm = ({ form, onFinish, loading }) => {
  return (
    <Form form={form} onFinish={onFinish}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={8} md={6}>
          <Form.Item name="token" label="Token" rules={[{ required: true }]}>
            <TokenInput />
          </Form.Item>
        </Grid>

        <Grid item xs={4} md={2}>
          <LoadingButton variant="contained" fullWidth type="submit" loading={loading}>
            Verify
          </LoadingButton>
        </Grid>
      </Grid>
    </Form>
  );
};

export default EnableForm;
