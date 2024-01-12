import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  ToggleButton,
  Stack,
  Typography
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
import StepContext from 'contexts/StepContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import Form, { TextField, ToggleButtonGroup } from 'components/Form';
import { route, useFormRequest } from 'services/Http';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import Broker from 'models/Broker';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import notify from 'utils/notify';
import router from 'router/router';
import { useAuth } from 'models/Auth';
import { useNavigate } from 'react-router';
import { useIsMonthly, useSubscription } from 'hooks/global';
import { addAccount, setActiveAccount } from 'store/slices/account';

const servers = [
  {
    name: 'Exness',
    servers: [
      'Exness-MT5Trial',
      'Exness-MT5Trial2',
      'Exness-MT5Trial3',
      'Exness-MT5Trial4',
      'Exness-MT5Trial5',
      'Exness-MT5Trial6',
      'Exness-MT5Trial7',
      'Exness-MT5Trial8',
      'Exness-MT5Trial9',
      'Exness-MT5Trial10',
      'Exness-MT5Trial11',
      'Exness-MT5Trial12',
      'Exness-MT5Real',
      'Exness-MT5Real2',
      'Exness-MT5Real3',
      'Exness-MT5Real4',
      'Exness-MT5Real5',
      'Exness-MT5Real6',
      'Exness-MT5Real7',
      'Exness-MT5Real8',
      'Exness-MT5Real9',
      'Exness-MT5Real10',
      'Exness-MT5Real11',
      'Exness-MT5Real12',
      'Exness-MT5Real14',
      'Exness-MT5Real15'
    ]
  },
  {
    name: 'IC Markets',
    servers: ['ICMarketsSC-Demo', 'ICMarketsSC-MT5', 'ICMarketsSC-MT5-2', 'ICMarketsSC-MT5-4']
  },
  {
    name: 'Blueberry Markets',
    servers: ['BlueberryMarkets-Demo', 'BlueberryMarkets-Demo02', 'BlueberryMarkets-Live', 'BlueberryMarkets-Live02']
  },
  {
    name: 'Pepperstone',
    servers: ['Pepperstone-MT5-Live01', 'Pepperstone-Demo']
  },
  {
    name: 'OctaFX',
    servers: ['OctaFX-Demo', 'OctaFX-Real', 'OctaFX-Real2']
  },
  {
    name: 'Kwakol',
    servers: ['KwakolMarketsPty-Server']
  },
  {
    name: 'Dominion',
    servers: ['DominionMarkets-MT5']
  },
  {
    name: 'AXSE Brokerage',
    servers: ['PurpleTradingSC-01MT5']
  }
];

const AutoImport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { next } = useContext(StepContext);
  const [supportStocks, setSupportStocks] = useState(false);
  const [supportOptions, setSupportOptions] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('');
  const [supportCrypto, setSupportCrypto] = useState(false);
  const [supportFutures, setSupportFutures] = useState(false);
  const [supportForex, setSupportForex] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedServer, setSelectedServer] = useState();
  const subscription = useSubscription();
  const isMonthly = useIsMonthly();
  const [isPrivate, setIsPrivate] = useState(true);
  const auth = useAuth();

  const handleServerSelection = (event) => {
    setSelectedServer(event.target.value);
    form.setFieldsValue({ server: '' });
  };

  const handleBrokerSelection = (event) => {
    const selectedBrokerId = event.target.value;
    setSelectedId(selectedBrokerId);

    // Find the selected broker record in the brokers array
    const selectedBrokerRecord = brokers.find((broker) => broker.id === selectedBrokerId);

    // Use Broker.use to process the selected broker record
    const selectedBroker = Broker.use(selectedBrokerRecord);
    setSelectedBroker(selectedBroker);
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
      values.is_private = isPrivate;
      values.billing_type = subscription;
      values.is_monthly_billing = isMonthly;
      request
        .post(route('accounts.get'), values)
        .then(async (response) => {
          notify.success('Account Created.');
          await dispatch(addAccount(response));
          await dispatch(setActiveAccount(response.id));
          navigate(router.generatePath('terminal-portal.analytics'));
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
    [request, dispatch, form, isPrivate]
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
                  <Form.Item name="broker" label="Select Platform" rules={[{ required: true }]}>
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
                    We currently support only the following from this platform.
                  </Typography>
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'row'}>
                  <Chip label="Stocks" color={supportStocks ? 'primary' : 'default'} disabled={!supportStocks} />
                  <Chip label="Options" color={supportOptions ? 'primary' : 'default'} disabled={!supportOptions} />
                  <Chip label="Crypto" color={supportCrypto ? 'primary' : 'default'} disabled={!supportCrypto} />
                  <Chip label="Futures" color={supportFutures ? 'primary' : 'default'} disabled={!supportFutures} />
                  <Chip label="Forex" color={supportForex ? 'primary' : 'default'} disabled={!supportForex} />
                </Stack>

                {selectedBroker && (
                  <>
                    <Typography variant="body2" ml={1} noWrap>
                      {selectedBroker.auto_instructions}
                    </Typography>
                    <Box>
                      {selectedBroker.auto_video_link && (
                        <iframe
                          width="100%"
                          height="450"
                          src={selectedBroker.auto_video_link}
                          title="Instructions"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      )}
                    </Box>
                  </>
                )}

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Form.Item name="selectbroker" label="Select Broker" rules={[{ required: true }]}>
                    <TextField
                      value={selectedServer}
                      onChange={handleServerSelection}
                      fullWidth
                      select
                      sx={{ minWidth: 200 }}
                    >
                      {servers.map((value, index) => (
                        <MenuItem value={index} key={index}>
                          <CoinStyle>
                            <Typography variant="body2" ml={1} noWrap>
                              {value.name}
                            </Typography>
                          </CoinStyle>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Form.Item>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <ToggleButtonGroup
                    color="success"
                    value={isPrivate}
                    fullWidth
                    exclusive
                    onChange={(event, method) => setIsPrivate(method || !isPrivate)}
                  >
                    <ToggleButton value={true}>Private</ToggleButton>

                    <ToggleButton value={false}>Public</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {selectedServer !== undefined && (
                  <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                    <Form.Item name="server" label="Server" rules={[{ required: true }]}>
                      <TextField fullWidth select sx={{ minWidth: 200 }}>
                        {servers[selectedServer].servers.map((record) => (
                          <MenuItem value={record} key={record}>
                            <CoinStyle>
                              <Typography variant="body2" ml={1} noWrap>
                                {record}
                              </Typography>
                            </CoinStyle>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Form.Item>
                  </Stack>
                )}

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Form.Item name="username" label="Login" rules={[{ required: true }]}>
                    <TextField type="number" fullWidth />
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
