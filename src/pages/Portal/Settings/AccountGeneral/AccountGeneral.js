import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultTo } from 'lodash';
import { notify } from 'utils/index';
import UploadPhoto from 'components/UploadPhoto';
import { route, useFormRequest, useRequest } from 'services/Http';
import { parseDate } from 'utils/form';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardActions,
  Typography,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Stack,
  ToggleButton,
  Switch
} from '@material-ui/core';
import { DatePicker, LoadingButton } from '@material-ui/lab';
import Form, { TextField, ToggleButtonGroup } from 'components/Form';
import Result from 'components/Result';
import { countries } from 'config';
import { useRedirectPath } from 'redirect';
import { useNavigate } from 'react-router';
import router from 'router/router';
import { useActiveAccount } from 'hooks/account';
import { fetchAccounts } from 'store/slices/account';

const AccountGeneral = () => {
  const dispatch = useDispatch();
  const account = useActiveAccount();
  const navigate = useNavigate();
  const { redirectPath } = useRedirectPath();
  const [request, loading] = useRequest();

  const onUploadSuccess = useCallback(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const submitForm = useCallback(
    (values) => {
      request
        .patch(route('accounts.update', { id: account.id }), values)
        .then(() => {
          notify.success('Your account has been updated.');
          dispatch(fetchAccounts());
        })
        .catch((error) => {
          if (error.response && error.response.data && !error.response.data._error_message) {
            const { data } = error.response;

            // Iterate over the fields in the error response
            Object.keys(data).forEach((fieldName) => {
              notify.error(data[fieldName][0]);
            });
          } else {
            notify.error(error.response.data._error_message);
          }
        });
    },
    [request, dispatch]
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ py: 10, px: 3 }}>
          <UploadPhoto
            action={route('accounts.upload-picture', { id: account.id })}
            caption={'Allowed *.jpeg, *.jpg, *.png'}
            onSuccess={onUploadSuccess}
            preview={account.logo}
          />

          <Stack direction="row" sx={{ mt: 5 }} justifyContent="center">
            {loading ? (
              <LoadingButton variant="outlined" loading={loading}>
                Loading
              </LoadingButton>
            ) : (
              <ToggleButtonGroup
                color="success"
                value={account.is_private}
                fullWidth
                exclusive
                onChange={(event, method) => {
                  if (method) submitForm({ is_private: method });
                }}
              >
                <ToggleButton value={true}>Private</ToggleButton>

                <ToggleButton value={false}>Public</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <UpdateForm />
      </Grid>
    </Grid>
  );
};

const UpdateForm = () => {
  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const dispatch = useDispatch();
  const account = useActiveAccount();

  const ago = new Date();
  ago.setMonth(ago.getMonth() - 12 * 15);

  const submitForm = useCallback(
    (values) => {
      request
        .patch(route('accounts.update', { id: account.id }), values)
        .then(() => {
          notify.success('Your account has been updated.');
          dispatch(fetchAccounts());
        })
        .catch((error) => {
          if (error.response && error.response.data && !error.response.data._error_message) {
            const { data } = error.response;

            // Iterate over the fields in the error response
            Object.keys(data).forEach((fieldName) => {
              // Update the form with the field error
              form.setFields([
                {
                  name: fieldName,
                  errors: [data[fieldName][0]]
                }
              ]);
            });
          } else {
            notify.error(error.response.data._error_message);
          }
        });
    },
    [request, dispatch, form]
  );

  const initialValues = useMemo(() => {
    return {
      loginn: account.username,
      servern: account.server,
      name: account.name,
      description: account.description
    };
  }, [account]);

  return (
    <Form form={form} initialValues={initialValues} onFinish={submitForm}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" spacing={{ xs: 3, sm: 2 }}>
              <Form.Item name="loginn" label="Login">
                <TextField fullWidth disabled={true} />
              </Form.Item>
              <Form.Item name="servern" label="Server">
                <TextField fullWidth disabled={true} />
              </Form.Item>
            </Stack>
            <Stack direction="row" spacing={{ xs: 3, sm: 2 }}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <TextField fullWidth />
              </Form.Item>
            </Stack>

            <Form.Item name="description" label="Description" rules={[{ required: false }]}>
              <TextField multiline minRows={3} maxRows={6} fullWidth />
            </Form.Item>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <LoadingButton variant="contained" type="submit" loading={loading}>
            Save Changes
          </LoadingButton>
        </CardActions>
      </Card>
    </Form>
  );
};

export default AccountGeneral;
