import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Box, Grid, IconButton, Stack, Tooltip, Typography, MenuItem } from '@material-ui/core';
import { Add, Gavel, Refresh } from '@material-ui/icons';
import { route, useFormRequest, useRequest } from 'services/Http';
import { styled } from '@material-ui/core/styles';
import { notify } from 'utils/index';
import Form, { DateTimePicker, TextField } from 'components/Form';
import { normalizeDate } from 'utils/form';
import { useModal } from 'utils/modal';
import { SettingsBackupRestore } from '@material-ui/icons';
import { StyledToolbar } from 'styles/toolbar.style';
import SearchTable from 'components/SearchTable';
import TableContext from 'contexts/TableContext';
import ModalActions from 'components/ModalActions';
import { LoadingButton } from '@material-ui/lab';
import { useDispatch } from 'react-redux';
import { useActiveAccount } from 'hooks/account';

const InviteUser = ({ closeModal }) => {
  const [form] = Form.useForm();
  const [request, loading] = useFormRequest(form);
  const dispatch = useDispatch();
  const { reload: reloadTable, selection } = useContext(TableContext);
  const account = useActiveAccount();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    request
      .get(route('accounts.get.roles', { id: account.id }))
      .then((response) => {
        setRoles(response);
      })
      .catch((error) => {
        if (error.response) notify.error(error.response.data._error_message);
      });
  }, [request]);

  const submitForm = useCallback(
    (values) => {
      request
        .post(route('accounts.memberships.invite', { id: account.id }), values)
        .then((data) => {
          notify.success('User was successfully invited.');
          closeModal();
          reloadTable();
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
    [request, closeModal, reloadTable, dispatch, form]
  );

  return (
    <ContainerBox>
      <Box sx={{ mb: 5, px: 3 }}>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} md={12}>
            <Form form={form} onFinish={submitForm}>
              <Stack spacing={3}>
                <Stack direction="column" spacing={{ xs: 4, sm: 4 }}>
                  <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <TextField fullWidth />
                  </Form.Item>
                </Stack>

                <Stack spacing={{ xs: 2, sm: 3 }} direction={'column'}>
                  <Form.Item name="role" label="Select Role" rules={[{ required: true }]}>
                    <TextField fullWidth select sx={{ minWidth: 200 }}>
                      {roles.map((record) => {
                        return (
                          <MenuItem value={record.id} key={record.id}>
                            <CoinStyle>
                              <Typography variant="body2" ml={1} noWrap>
                                {record.name}
                              </Typography>
                            </CoinStyle>
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Form.Item>
                </Stack>

                <Stack direction="column" spacing={{ xs: 12, sm: 12 }}>
                  <Form.Item name="invitation_extra_text" label="Invitation Text" rules={[{ required: false }]}>
                    <TextField multiline minRows={3} maxRows={6} fullWidth />
                  </Form.Item>
                </Stack>
                <LoadingButton variant="contained" type="submit" loading={loading}>
                  Invite User
                </LoadingButton>
              </Stack>
            </Form>
          </Grid>
        </Grid>
      </Box>
    </ContainerBox>
  );
};

const ActionBar = ({ membership_id }) => {
  const [modal, modalElements] = useModal();
  const { reload: reloadTable, selection } = useContext(TableContext);
  const account = useActiveAccount();
  const [request] = useRequest();

  const Invite = useCallback(() => {
    modal.confirm({
      title: 'Invite Member',
      content: <InviteUser />,
      rootProps: { fullWidth: true }
    });
  }, [modal]);

  const batchDeactivate = useCallback(() => {
    request
      .post(route('accounts.memberships.batch-remove', { id: account.id }), { users: selection })
      .then(() => {
        notify.success('Users were removed.');
        reloadTable();
      })
      .catch((error) => {
        notify.error(error.response.data._error_message);
      });
  }, [request, selection, reloadTable]);

  return (
    <StyledToolbar>
      {selection.length > 0 ? (
        <Typography variant="subtitle1">{selection.length} selected</Typography>
      ) : (
        <SearchTable sx={{ mr: 2 }} placeholder="Search name..." field="name" />
      )}

      {modalElements}

      <Stack direction="row" spacing={1}>
        <Tooltip title="Reload Table">
          <IconButton onClick={reloadTable}>
            <Refresh />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add User">
          <IconButton onClick={Invite}>
            <Add />
          </IconButton>
        </Tooltip>
        {selection.length > 0 && (
          <>
            <Tooltip title="Deactivate">
              <IconButton onClick={batchDeactivate}>
                <Gavel />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </StyledToolbar>
  );
};

const CoinStyle = styled('div')({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  flexBasis: 0
});

const ContainerBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, -3),
  position: 'relative'
}));

export default ActionBar;
