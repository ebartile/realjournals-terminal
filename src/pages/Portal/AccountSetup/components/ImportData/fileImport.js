import React, { useCallback, useContext, useEffect, useState } from 'react';
import { notify } from 'utils/index';
import { route, useFormRequest } from 'services/Http';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  Switch,
  ToggleButton,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Form, { TextField, ToggleButtonGroup } from 'components/Form';
import Result from 'components/Result';
import StepContext from 'contexts/StepContext';
import { useActiveAccount } from 'hooks/account';
import { UploadSingleFile } from 'components/upload';
import Broker from 'models/Broker';
import SelectAccount from 'components/SelectAccount';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { timezones } from 'config';
import { addAccount, fetchAccounts, setActiveAccount } from 'store/slices/account';
import Spin from 'components/Spin';
import { useIsMonthly, useSubscription } from 'hooks/global';
import router from 'router/router';
import { useNavigate } from 'react-router';
import { read, utils } from 'xlsx';
import { assign } from 'lodash';

const FileImport = () => {
  const dispatch = useDispatch();
  const { next } = useContext(StepContext);
  const [file, setFile] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [selectedBroker, setSelectedBroker] = useState('');
  const [supportStocks, setSupportStocks] = useState(false);
  const [supportOptions, setSupportOptions] = useState(false);
  const [supportCrypto, setSupportCrypto] = useState(false);
  const [supportFutures, setSupportFutures] = useState(false);
  const [supportForex, setSupportForex] = useState(false);
  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isProcessed, setIsProcessed] = useState(false);
  const subscription = useSubscription();
  const isMonthly = useIsMonthly();
  const navigate = useNavigate();

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

  const activeAccount = useActiveAccount();

  const handleDropSingleFile = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
  }, []);

  useEffect(() => {
    request
      .get(
        route('brokers.get', {
          supports_file_import: 'True',
          supports_auto_sync_import: 'unknown'
        })
      )
      .then((response) => {
        setBrokers(response);
      })
      .catch((error) => {
        if (error.response) notify.error(error.response.data._error_message);
      });
  }, [request]);

  const [brokers, setBrokers] = useState([]);

  const readAsText = async (param) => {
    return new Promise(async (resolve, reject) => {
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        resolve(reader.result);
      };
      reader.readAsText(param);
    });
  };

  const readAsArrayBuffer = async (param) => {
    return new Promise(async (resolve, reject) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(param);
    });
  };

  const submitForm = useCallback(
    async (values) => {
      if (selectedBroker.name == 'Meta Trader 5') {
        let fileInput = await readAsArrayBuffer(file);
        try {
          var workbook = read(fileInput, { type: 'array' });
          var result = {};
          workbook.SheetNames.forEach((sheetName) => {
            var roa = utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
              result[sheetName] = roa;
            }
          });
          let accountKey = result[Object.keys(result)[0]].findIndex(
            (item) => item['Trade History Report'] == 'Account:'
          );
          let accountJson = result[Object.keys(result)[0]][accountKey]; // doit it this way instead of naming keys in case key names change
          let account = [Object.values(accountJson)[1]][0].replace(/[(),]/g, '').split(' ');

          let option = account[3].toLowerCase();
          let trade_mode;

          switch (option) {
            case 'demo':
              trade_mode = 0;
              break;
            case 'contest':
              trade_mode = 1;
              break;
            case 'real':
              trade_mode = 2;
              break;
            default:
              // Handle unknown option
              trade_mode = 0; // Or any other default value indicating unknown
              break;
          }
          let values = {
            username: account[0],
            currency: account[1],
            server: account[2],
            trade_mode: trade_mode,
            is_private: isPrivate,
            timezone: selectedTimezone,
            billing_type: subscription,
            is_monthly_billing: !isMonthly,
            account_type: 'MANUAL',
            company: [
              Object.values(
                result[Object.keys(result)[0]][
                  result[Object.keys(result)[0]].findIndex((item) => item['Trade History Report'] == 'Company:')
                ]
              )[1]
            ][0],
            name: [
              Object.values(
                result[Object.keys(result)[0]][
                  result[Object.keys(result)[0]].findIndex((item) => item['Trade History Report'] == 'Name:')
                ]
              )[1]
            ][0],
            broker: selectedBroker.id
          };

          let dealsKey = result[Object.keys(result)[0]].findIndex((item) => item['Trade History Report'] == 'Deals');

          let dealIterate = true;
          let history_deals = [];
          for (let i = dealsKey + 2; dealIterate; i++) {
            let row = result[Object.keys(result)[0]][i];
            if (row['__EMPTY'] == undefined) {
              dealIterate = false;
            } else {
              let entry_option = String(row['__EMPTY_3']).toLowerCase();
              let entry;

              switch (entry_option) {
                case 'in':
                  entry = 0;
                  break;
                case 'out':
                  entry = 1;
                  break;
                case 'inout':
                  entry = 2;
                  break;
                case 'out by':
                  entry = 3;
                  break;
                default:
                  entry = 0;
                  break;
              }

              let type_option = String(row['__EMPTY_2']).toLowerCase();
              let type;

              switch (type_option) {
                case 'buy':
                  type = 0;
                  break;
                case 'sell':
                  type = 1;
                  break;
                case 'balance':
                  type = 2;
                  break;
                case 'credit':
                  type = 3;
                  break;
                case 'charge':
                  type = 4;
                  break;
                case 'correction':
                  type = 5;
                  break;
                case 'bonus':
                  type = 6;
                  break;
                case 'commission':
                  type = 7;
                  break;
                case 'daily commission':
                  type = 8;
                  break;
                case 'monthly commission':
                  type = 9;
                  break;
                case 'daily agent commission':
                  type = 10;
                  break;
                case 'monthly agent commission':
                  type = 11;
                  break;
                case 'interest':
                  type = 12;
                  break;
                case 'buy canceled':
                  type = 13;
                  break;
                case 'sell canceled':
                  type = 15;
                  break;
                case 'dividend':
                  type = 15;
                  break;
                case 'dividend franked':
                  type = 16;
                  break;
                case 'tax':
                  type = 17;
                  break;
                default:
                  type = 0;
                  break;
              }

              let order = {
                ticket: row['__EMPTY'],
                order: row['__EMPTY_6'] || 0,
                time: Date.parse(row['Trade History Report']) / 1000,
                time_msc: Date.parse(row['Trade History Report']),
                type: type,
                entry: entry,
                magic: 0,
                position_id: entry == 0 ? row['__EMPTY_6'] : 0,
                reason: 0,
                volume: parseFloat(row['__EMPTY_4'] || 0),
                price: row['__EMPTY_5'] || 0,
                commission: row['__EMPTY_8'] || 0,
                swap: row['__EMPTY_10'] || 0,
                profit: row['__EMPTY_11'] || 0,
                fee: row['__EMPTY_9'] || 0,
                symbol: row['__EMPTY_1'] || '',
                comment: row['__EMPTY_12'] || '',
                external_id: ''
              };
              history_deals.push(order);
            }
          }

          let workingOrderKey = result[Object.keys(result)[0]].findIndex(
            (item) => item['Trade History Report'] == 'Working Orders'
          );

          let workingOrderIterate = true;
          let orders = [];
          for (let i = workingOrderKey + 2; workingOrderIterate; i++) {
            let row = result[Object.keys(result)[0]][i];
            if (row['__EMPTY'] == undefined) {
              workingOrderIterate = false;
            } else {
              let state_option = String(row['__EMPTY_8']).toLowerCase();
              let state;

              switch (state_option) {
                case 'started':
                  state = 0;
                  break;
                case 'placed':
                  state = 1;
                  break;
                case 'canceled':
                  state = 2;
                  break;
                case 'partial':
                  state = 3;
                  break;
                case 'filled':
                  state = 4;
                  break;
                case 'rejected':
                  state = 5;
                  break;
                case 'expired':
                  state = 6;
                  break;
                case 'request add':
                  state = 7;
                  break;
                case 'request modify':
                  state = 8;
                  break;
                case 'request cancel':
                  state = 9;
                  break;
                default:
                  state = 0;
                  break;
              }

              let type_option = String(row['__EMPTY_2']).toLowerCase();
              let type;

              switch (type_option) {
                case 'buy':
                  type = 0;
                  break;
                case 'sell':
                  type = 1;
                  break;
                case 'buy limit':
                  type = 2;
                  break;
                case 'sell limit':
                  type = 3;
                  break;
                case 'buy stop':
                  type = 4;
                  break;
                case 'sell stop':
                  type = 5;
                  break;
                case 'buy stop limit':
                  type = 6;
                  break;
                case 'sell stop limit':
                  type = 7;
                  break;
                case 'close by':
                  type = 8;
                  break;
                default:
                  type = 0;
                  break;
              }

              let order = {
                ticket: row['__EMPTY'],
                time_setup: Date.parse(row['Trade History Report']) / 1000,
                type: type,
                type_time: 0,
                type_filling: 2,
                state: state,
                magic: 0,
                position_id: 0,
                position_by_id: 0,
                reason: 0,
                volume_current: parseFloat(row['__EMPTY_3'].split('/')[0] || 0),
                volume_initial: parseFloat(row['__EMPTY_3'].split('/')[0] || 0),
                price_open: row['__EMPTY_4'],
                sl: row['__EMPTY_5'] || 0,
                tp: row['__EMPTY_6'] || 0,
                price_current: row['__EMPTY_7'],
                price_stoplimit: 0,
                symbol: row['__EMPTY_1'] || '',
                comment: row['__EMPTY_9'] || '',
                external_id: ''
              };
              orders.push(order);
            }
          }

          let ordersKey = result[Object.keys(result)[0]].findIndex((item) => item['Trade History Report'] == 'Orders');

          let OrdersIterate = true;
          let history_orders = [];
          for (let i = ordersKey + 2; OrdersIterate; i++) {
            let row = result[Object.keys(result)[0]][i];
            if (row['__EMPTY'] == undefined) {
              OrdersIterate = false;
            } else {
              let state_option = String(row['__EMPTY_8']).toLowerCase();
              let state;

              switch (state_option) {
                case 'started':
                  state = 0;
                  break;
                case 'placed':
                  state = 1;
                  break;
                case 'canceled':
                  state = 2;
                  break;
                case 'partial':
                  state = 3;
                  break;
                case 'filled':
                  state = 4;
                  break;
                case 'rejected':
                  state = 5;
                  break;
                case 'expired':
                  state = 6;
                  break;
                case 'request add':
                  state = 7;
                  break;
                case 'request modify':
                  state = 8;
                  break;
                case 'request cancel':
                  state = 9;
                  break;
                default:
                  state = 0;
                  break;
              }

              let type_option = String(row['__EMPTY_2']).toLowerCase();
              let type;

              switch (type_option) {
                case 'buy':
                  type = 0;
                  break;
                case 'sell':
                  type = 1;
                  break;
                case 'buy limit':
                  type = 2;
                  break;
                case 'sell limit':
                  type = 3;
                  break;
                case 'buy stop':
                  type = 4;
                  break;
                case 'sell stop':
                  type = 5;
                  break;
                case 'buy stop limit':
                  type = 6;
                  break;
                case 'sell stop limit':
                  type = 7;
                  break;
                case 'close by':
                  type = 8;
                  break;
                default:
                  type = 0;
                  break;
              }

              let order = {
                ticket: row['__EMPTY'],
                time_setup: Date.parse(row['Trade History Report']) / 1000,
                time_done: Date.parse(row['__EMPTY_7']) / 1000,
                type: type,
                type_time: 0,
                type_filling: 2,
                state: state,
                magic: 0,
                position_id: 0,
                position_by_id: 0,
                reason: 0,
                volume_current: parseFloat(row['__EMPTY_3'].split('/')[0] || 0),
                volume_initial: parseFloat(row['__EMPTY_3'].split('/')[0] || 0),
                price_open: 0,
                sl: row['__EMPTY_5'] || 0,
                tp: row['__EMPTY_6'] || 0,
                price_current: 0,
                price_stoplimit: 0,
                symbol: row['__EMPTY_1'] || '',
                comment: row['__EMPTY_9'] || '',
                external_id: ''
              };
              history_orders.push(order);
            }
          }

          let positionsKey = result[Object.keys(result)[0]].findIndex(
            (item) => item['Trade History Report'] == 'Open Positions'
          );

          let positionIterate = true;
          let positions = [];
          for (let i = positionsKey + 2; positionIterate; i++) {
            let row = result[Object.keys(result)[0]][i];
            if (row['__EMPTY'] == undefined) {
              positionIterate = false;
            } else {
              let type_option = String(row['__EMPTY_2']).toLowerCase();
              let type;

              switch (type_option) {
                case 'buy':
                  type = 0;
                  break;
                case 'sell':
                  type = 1;
                  break;
                case 'buy limit':
                  type = 2;
                  break;
                case 'sell limit':
                  type = 3;
                  break;
                case 'buy stop':
                  type = 4;
                  break;
                case 'sell stop':
                  type = 5;
                  break;
                case 'buy stop limit':
                  type = 6;
                  break;
                case 'sell stop limit':
                  type = 7;
                  break;
                case 'close by':
                  type = 8;
                  break;
                default:
                  type = 0;
                  break;
              }

              let position = {
                ticket: row['__EMPTY'],
                time: Date.parse(row['Trade History Report']) / 1000,
                time_msc: Date.parse(row['Trade History Report']),
                time_update: Date.parse(row['Trade History Report']) / 1000,
                time_update_msc: Date.parse(row['Trade History Report']),
                type: type,
                magic: 0,
                identifier: row['__EMPTY'],
                reason: 0,
                volume: parseFloat(row['__EMPTY_3'] || 0),
                price_open: row['__EMPTY_4'] || 0,
                sl: row['__EMPTY_5'] || 0,
                tp: row['__EMPTY_6'] || 0,
                price_current: row['__EMPTY_7'] || 0,
                swap: row['__EMPTY_9'] || 0,
                profit: row['__EMPTY_10'] || 0,
                symbol: row['__EMPTY_1'] || '',
                comment: row['__EMPTY_11'] || '',
                external_id: ''
              };

              positions.push(position);
            }
          }

          request
            .post(route('accounts.get'), values)
            .then((response) => {
              notify.success('Account Created.');
              dispatch(addAccount(response));
              dispatch(setActiveAccount(response.id));
              const data = new FormData();
              data.append('attached_file', file);
              const id = response.id;
              request
                .post(route('accounts.upload.attachments', { id: id }), data, {
                  headers: assign({ 'Content-Type': 'multipart/form-data' })
                })
                .then((response) => {
                  notify.success('Uploading File.');
                  request
                    .post(route('accounts.create_trades', { id: id }), {
                      history_deals: history_deals,
                      history_orders: history_orders,
                      orders: orders,
                      positions: positions
                    })
                    .then((response) => {
                      notify.success('Uploading Data.');
                      navigate(router.generatePath('terminal-portal.analytics'));
                    })
                    .catch((error) => {
                      if (error.response) notify.error(error.response.data._error_message);
                    });
                })
                .catch((error) => {
                  if (error.response) notify.error(error.response.data._error_message);
                });
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
        } catch (error) {
          notify.error('Uploaded File has an invalid format. Contact support for help.');
        }
      }
    },
    [dispatch, file, selectedTimezone, isPrivate, subscription, isMonthly]
  );

  return !isProcessed ? (
    <Grid container spacing={3} sx={{ mb: 7 }}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title={'Upload your Excel'} />
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
                      {selectedBroker.manual_instructions}
                    </Typography>
                    <Box>
                      {selectedBroker.manual_video_link && (
                        <iframe
                          width="100%"
                          height="450"
                          src={selectedBroker.manual_video_link}
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
                  <Form.Item name="timezone" label="Select Timezone" rules={[{ required: true }]}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Select Timezone"
                      value={selectedTimezone}
                      onChange={(event) => setSelectedTimezone(event.target.value)}
                      select
                    >
                      {timezones.map(([timezone, label], index) => {
                        return (
                          <MenuItem value={timezone} key={index}>
                            <CoinStyle>
                              <Typography variant="body2" ml={1} noWrap>
                                {label}
                              </Typography>
                            </CoinStyle>
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Form.Item>
                  <Typography variant="caption">
                    Note, when you want to see data in a different timezone, go to account settings to change.
                  </Typography>
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

                {!loading ? (
                  <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                    <Form.Item name="file" label="Upload Excel">
                      <UploadSingleFile
                        accept={{
                          'application/vnd.ms-excel': ['.xls'],
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                        }}
                        file={file}
                        onDrop={handleDropSingleFile}
                      />
                    </Form.Item>
                  </Stack>
                ) : (
                  <Spin spinning={loading} />
                )}
              </Stack>
            </CardContent>

            {file && (
              <CardActions sx={{ justifyContent: 'center' }}>
                <LoadingButton variant="contained" type="submit" loading={loading}>
                  Upload Data
                </LoadingButton>
              </CardActions>
            )}
          </Form>
        </Card>
      </Grid>
    </Grid>
  ) : (
    <Card>
      <CardHeader title={'Processing Data'} />

      <CardContent>
        <Result title={'Analysing Data'} description={'We are processing uploaded file.'} icon={CircularProgress} />
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

export default FileImport;
