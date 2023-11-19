import { useDispatch } from 'react-redux';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Typography
} from '@material-ui/core';
import { DatePicker, LoadingButton } from '@material-ui/lab';
import Result from 'components/Result';
import StepContext from 'contexts/StepContext';
import TwoFactor from '../CreateAccount/two_factor';
import { useAccountSelector, useActiveAccount } from 'hooks/account';
import { useCallback, useContext, useEffect, useState } from 'react';
import Form, { TextField } from 'components/Form';
import { route, useFormRequest } from 'services/Http';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Broker from 'models/Broker';
import SelectAccount from 'components/SelectAccount';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';

const AutoImport = () => {
  const dispatch = useDispatch();
  const { next } = useContext(StepContext);
  const [supportStocks, setSupportStocks] = useState(false);
  const [supportOptions, setSupportOptions] = useState(false);
  const [supportCrypto, setSupportCrypto] = useState(false);
  const [supportFutures, setSupportFutures] = useState(false);
  const [supportForex, setSupportForex] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const handleBrokerSelection = (event) => {
    const selectedBrokerId = event.target.value;
    setSelectedId(selectedBrokerId);

    // Find the selected broker record in the brokers array
    const selectedBrokerRecord = brokers.find((broker) => broker.id === selectedBrokerId);

    // Use Broker.use to process the selected broker record
    const selectedBroker = Broker.use(selectedBrokerRecord);
    setSupportStocks(selectedBroker.supports_stocks);
    setSupportOptions(selectedBroker.supports_options);
    setSupportCrypto(selectedBroker.supports_crypto);
    setSupportFutures(selectedBroker.supports_futures);
    setSupportForex(selectedBroker.supports_forex);
  };

  useAccountSelector();
  const activeAccount = useActiveAccount();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [startDate, setStartDate] = useState(threeMonthsAgo);
  const [endDate, setEndDate] = useState(new Date());

  // Handle changes for the start date picker
  const handleStartDateChange = (date) => {
    setStartDate(date);

    // Ensure that the end date cannot go before the selected start date
    setEndDate(date > endDate ? date : endDate);
  };

  // Handle changes for the end date picker
  const handleEndDateChange = (date) => {
    setEndDate(date);

    // Ensure that the start date cannot go beyond the selected end date
    setStartDate(date < startDate ? date : startDate);
  };

  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);

  useEffect(() => {
    request
      .get(
        route('brokers.get', {
          supports_file_import: 'unknown',
          supports_auto_sync_import: 'True'
        })
      )
      .then((response) => {
        setBrokers(response);
      })
      .catch((error) => {
        if (error.response) notify.error(error.response.data._error_message);
      });
  }, [request]);

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
    [request, dispatch, form]
  );

  const [brokers, setBrokers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return !activeAccount.has_be_configured ? (
    <Grid container spacing={3} sx={{ mb: 7 }}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title={'Upload your CSV'} />
          <Form form={form} onFinish={submitForm}>
            <CardContent>
              <Stack spacing={3}>
                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    When importing you must select account you'll like to import your CSV to.
                  </Typography>
                  <SelectAccount />
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Form.Item name="broker" label="Select Broker" rules={[{ required: true }]}>
                    <TextField
                      value={selectedId}
                      onChange={handleBrokerSelection}
                      fullWidth
                      select
                      sx={{ minWidth: 200 }}
                    >
                      {brokers.map((record) => {
                        const broker = Broker.use(record);
                        return (
                          <MenuItem value={broker.id} key={broker.id}>
                            <CoinStyle>
                              <Typography variant="body2" ml={1} noWrap>
                                {broker.name}
                              </Typography>
                            </CoinStyle>
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Form.Item>
                  <Typography sx={{ textAlign: 'center' }} variant="caption">
                    We currently support only the following from this broker.
                  </Typography>
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'row'}>
                  <Chip label="Stocks" color={supportStocks ? 'primary' : 'default'} disabled={!supportStocks} />
                  <Chip label="Options" color={supportOptions ? 'primary' : 'default'} disabled={!supportOptions} />
                  <Chip label="Crypto" color={supportCrypto ? 'primary' : 'default'} disabled={!supportCrypto} />
                  <Chip label="Futures" color={supportFutures ? 'primary' : 'default'} disabled={!supportFutures} />
                  <Chip label="Forex" color={supportForex ? 'primary' : 'default'} disabled={!supportForex} />
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={{ xs: 'column', sm: 'row' }}>
                  <Form.Item name="start_date" label="Start Date" rules={[{ required: true }]}>
                    <DatePicker
                      value={startDate}
                      maxDate={endDate}
                      label="Start date"
                      onChange={handleStartDateChange}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                      inputFormat="dd/MM/yyyy"
                    />
                  </Form.Item>
                  <Form.Item name="end_date" label="End Date" rules={[{ required: true }]}>
                    <DatePicker
                      value={endDate}
                      minDate={startDate}
                      maxDate={new Date()}
                      label="End date"
                      onChange={handleEndDateChange}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                      inputFormat="dd/MM/yyyy"
                    />
                  </Form.Item>
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Form.Item name="server" label="Server" rules={[{ required: true }]}>
                    <TextField fullWidth />
                  </Form.Item>
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                    <TextField fullWidth />
                  </Form.Item>
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <TextField
                      fullWidth
                      autoComplete="password"
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword} edge="end">
                              <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Form.Item>
                </Stack>
              </Stack>
            </CardContent>

            <CardActions sx={{ justifyContent: 'center' }}>
              <LoadingButton variant="contained" type="submit" loading={loading}>
                Fetch Trading Data
              </LoadingButton>
            </CardActions>
          </Form>
        </Card>
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
            <LoadingButton variant="contained" onClick={() => next()}>
              Next
            </LoadingButton>
          }
        />
      </CardContent>
    </Card>
  );
};

const CoinStyle = styled('div')({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  flexBasis: 0
});

export default AutoImport;
