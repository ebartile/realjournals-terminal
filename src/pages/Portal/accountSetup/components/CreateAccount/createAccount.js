import React, { useCallback, useContext, useEffect, useState } from 'react';
import { notify } from 'utils/index';
import { route, useFormRequest } from 'services/Http';
import { useAuth } from 'models/Auth';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Switch,
  Typography,
  Stack,
  MenuItem
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Form, { ControlLabel, TextField } from 'components/Form';
import Result from 'components/Result';
import { fetchUser } from 'redux/slices/auth';
import StepContext from 'contexts/StepContext';
import TwoFactor from './two_factor';

const CreateAccount = () => {
  const auth = useAuth();
  const { next } = useContext(StepContext);

  return !auth.user.hasAccount() ? (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <CreateForm />
      </Grid>
    </Grid>
  ) : (
    <Card>
      <CardHeader title={'Account'} />

      <CardContent>
        <Result
          title={'Account Created.'}
          description={'You have created a trade account.'}
          icon={TwoFactor}
          extra={
            <LoadingButton variant="contained" onClick={() => next()}>
              Next
            </LoadingButton>
          }
        />
      </CardContent>
    </Card>
  );
};

const CreateForm = () => {
  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const dispatch = useDispatch();
  const auth = useAuth();
  const [isChecked, setIsChecked] = useState(true);

  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const submitForm = useCallback(
    (values) => {
      values.is_private = isChecked;
      request
        .post(route('accounts.create'), values)
        .then(() => {
          notify.success('Your account has be created.');
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
    [request, dispatch, auth, form, isChecked]
  );

  return (
    <Form form={form} onFinish={submitForm}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Form.Item name="name" label="Account Name" rules={[{ required: true }]}>
              <TextField fullWidth />
            </Form.Item>

            <Form.Item name="description" label="Account Description" rules={[{ required: true, min: 50 }]}>
              <TextField multiline minRows={3} maxRows={6} fullWidth />
            </Form.Item>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography variant="overline" sx={{ mr: 1.5 }}>
              Public
            </Typography>
            <Form.Item name="is_private" label="OR">
              <ControlLabel>
                <Switch checked={isChecked} onChange={handleSwitchChange} color="primary" />
              </ControlLabel>
            </Form.Item>
            <Typography variant="overline" sx={{ ml: 1.5 }}>
              Private
            </Typography>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: 'center' }}>
          <LoadingButton variant="contained" type="submit" loading={loading}>
            Create Account
          </LoadingButton>
        </CardActions>
      </Card>
    </Form>
  );
};

export default CreateAccount;
