import React, { useCallback, useContext, useEffect, useState } from 'react';
import { notify } from 'utils/index';
import { route, useFormRequest } from 'services/Http';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  Typography
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Form, { TextField } from 'components/Form';
import Result from 'components/Result';
import StepContext from 'contexts/StepContext';
import { useAccountSelector, useActiveAccount } from 'hooks/account';
import { UploadSingleFile } from 'components/upload';
import Broker from 'models/Broker';
import SelectAccount from 'components/SelectAccount';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { timezones } from 'config';
import { fetchAccounts } from 'redux/slices/account';
import Spin from 'components/Spin';

const FileImport = () => {
  const dispatch = useDispatch();
  const { next } = useContext(StepContext);
  const [file, setFile] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [supportStocks, setSupportStocks] = useState(false);
  const [supportOptions, setSupportOptions] = useState(false);
  const [supportCrypto, setSupportCrypto] = useState(false);
  const [supportFutures, setSupportFutures] = useState(false);
  const [supportForex, setSupportForex] = useState(false);
  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const [isProcessed, setIsProcessed] = useState(false);

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

  const handleDropSingleFile = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const data = new FormData();
      data.append('attached_file', file);
      if (file) {
        request
          .post(route('accounts.upload.attachments', { id: activeAccount.id }), data)
          .then((response) => {
            setFile({
              ...file,
              id: response.id,
              preview: file.path
            });
          })
          .catch((error) => {
            if (error.response) notify.error(error.response.data._error_message);
          });
      }
    },
    [request, activeAccount]
  );

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

  const submitForm = useCallback(
    (values) => {
      values.attachment = file.id;
      request
        .post(route('accounts.upload-data', { id: activeAccount.id }), values)
        .then(() => {
          setIsProcessed(true);
          notify.success('Data has been uploaded.');
          dispatch(fetchAccounts());
          const intervalId = setInterval(() => {
            request
              .get(route('accounts.upload.attachments.detail', { id: activeAccount.id, other_id: file.id }))
              .then((response) => {
                if (response.status == 'done') {
                  window.location.replace('/portal');
                }
              })
              .catch((error) => {
                if (error.response.data._error_message) {
                  notify.error(error.response.data._error_message);
                }
              });
          }, 15000);

          return () => clearInterval(intervalId);
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
    [request, dispatch, form, file]
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

                {form.getFieldValue('broker') && (
                  <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                    <Form.Item name="timezone" label="Select Timezone" rules={[{ required: true }]}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Select Timezone"
                        value={selectedId}
                        onChange={(event) => setSelectedId(event.target.value)}
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
                )}

                {form.getFieldValue('broker') && form.getFieldValue('timezone') && !loading ? (
                  <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                    <Form.Item name="file" label="Upload Excel">
                      <UploadSingleFile accept={['.xlsx', '.xls']} file={file} onDrop={handleDropSingleFile} />
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
