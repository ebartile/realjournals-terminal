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
import { LoadingButton } from '@material-ui/lab';
import StepContext from 'contexts/StepContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import Form, { TextField } from 'components/Form';
import { route, useFormRequest } from 'services/Http';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Broker from 'models/Broker';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import notify from 'utils/notify';

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
        .post(route('accounts.get'), values)
        .then(() => {
          notify.success('Account Created.');
          window.location.reload();
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

  return (
    <Grid container spacing={3} sx={{ mb: 7 }}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title={'Create Account'} />
          <Form form={form} onFinish={submitForm}>
            <CardContent>
              <Stack spacing={3}>
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
  );
};

const CoinStyle = styled('div')({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  flexBasis: 0
});

export default AutoImport;
