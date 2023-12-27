import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { defaultTo } from 'lodash';
import { notify } from 'utils/index';
import UploadPhoto from 'components/UploadPhoto';
import { route, useFormRequest } from 'services/Http';
import { fetchUser } from 'redux/slices/auth';
import { parseDate } from 'utils/form';
import { useAuth } from 'models/Auth';
import { useDispatch } from 'react-redux';
import { Card, CardActions, CardContent, CardHeader, Grid, MenuItem, Stack } from '@material-ui/core';
import { DatePicker, LoadingButton } from '@material-ui/lab';
import Form, { TextField } from 'components/Form';
import Result from 'components/Result';
import TwoFactor from '../EnableTwoFactor/two_factor';
import { countries } from 'config';
import { useRedirectPath } from 'redirect';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const { redirectPath } = useRedirectPath();

  const start = useCallback(() => {
    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      window.location.reload();
    }
  }, [redirectPath]);

  const onUploadSuccess = useCallback(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return !auth.user.isProfileComplete() ? (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ py: 10, px: 3 }}>
          <UploadPhoto
            action={route('users.upload-picture')}
            caption={'Allowed *.jpeg, *.jpg, *.png'}
            onSuccess={onUploadSuccess}
            preview={auth.user.getProfilePicture()}
          />
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <UpdateForm />
      </Grid>
    </Grid>
  ) : (
    <Card>
      <CardHeader title={'Profile'} />

      <CardContent>
        <Result
          title={'Profile Updated.'}
          description={'You have updated your profile.'}
          icon={TwoFactor}
          extra={
            <LoadingButton variant="contained" onClick={start}>
              Next
            </LoadingButton>
          }
        />
      </CardContent>
    </Card>
  );
};

const UpdateForm = () => {
  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const dispatch = useDispatch();
  const auth = useAuth();

  const ago = new Date();
  ago.setMonth(ago.getMonth() - 12 * 15);

  useEffect(() => {
    if (auth.check()) {
      form.resetFields();
    }
  }, [auth, form]);

  const submitForm = useCallback(
    (values) => {
      request
        .patch(route('users.update', { id: auth.user.id }), values)
        .then(() => {
          notify.success('Your profile was updated.');
          dispatch(fetchUser());
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
    [request, dispatch, auth, form]
  );

  const initialValues = useMemo(() => {
    return {
      last_name: auth.user.last_name,
      first_name: auth.user.first_name,
      date_of_birth: parseDate(defaultTo(auth.user.date_of_birth, ago)),
      bio: auth.user.bio,
      country: defaultTo(auth.user.country, '')
    };
  }, [auth]);

  return (
    <Form form={form} initialValues={initialValues} onFinish={submitForm}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                <TextField fullWidth disabled={Boolean(initialValues['first_name'])} />
              </Form.Item>

              <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                <TextField fullWidth disabled={Boolean(initialValues['last_name'])} />
              </Form.Item>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
              <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true }]}>
                <DatePicker
                  maxDate={ago}
                  label="Date of Birth"
                  onChange={(date) => {}}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                  inputFormat="dd/MM/yyyy"
                />
              </Form.Item>

              <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                <TextField fullWidth select>
                  {countries.map((country) => (
                    <MenuItem value={country.code} key={country.code}>
                      {`${country.name}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Form.Item>
            </Stack>

            <Form.Item name="bio" label="Bio" rules={[{ required: false }]}>
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

export default UpdateProfile;
