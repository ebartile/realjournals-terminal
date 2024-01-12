import React, { useMemo } from 'react';
import { Card, Chip, Container, Stack, Box, Typography } from '@material-ui/core';
import UserMenu from './components/UserMenu';
import ActionBar from './components/ActionBar';
import UserView from './components/UserView';
import AsyncTable from 'components/AsyncTable';
import { route } from 'services/Http';
import User from 'models/User';
import TrapScrollBox from 'components/TrapScrollBox';
import CurrencyCell from 'components/CurrencyCell';
import Label from 'components/Label';
import UserInfoTableCell from 'components/TableCells/UserInfoTableCell';
import DateTableCell from 'components/TableCells/DateTableCell';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';
import router from 'router/router';
import useSettings from 'hooks/useSettings';
import { useActiveAccount } from 'hooks/account';

const AccountMembers = () => {
  const columns = useMemo(
    () => [
      {
        field: 'user',
        minWidth: 200,
        flex: 1,
        renderHeader: () => <span />,
        renderCell: ({ row }) => {
          if (row.user) {
            return <UserInfoTableCell user={row.user} />;
          } else {
            return (
              <Stack direction="row" sx={{ minWidth: 0 }} alignItems="center" spacing={2}>
                <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                    {row.email}
                  </Typography>
                  <Stack direction="row" alignItems="center" sx={{ minWidth: 0 }} spacing={1}>
                    <Chip size="small" color="warning" label="Pending Invitation" />
                  </Stack>
                </Stack>
              </Stack>
            );
          }
        }
      },
      {
        field: 'role',
        minWidth: 100,
        flex: 1,
        headerName: 'Status',
        renderCell: ({ row }) => <Chip size="small" color="default" label={row.role.name} />
      },
      {
        field: 'created_at',
        headerName: 'Joined',
        flex: 1,
        minWidth: 150,
        renderCell: ({ value }) => <DateTableCell value={value} />
      },
      {
        field: 'action',
        minWidth: 100,
        flex: 0.5,
        renderHeader: () => <span />,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }) => {
          return (
            <Stack direction="row" spacing={1}>
              <UserMenu user={row.user} membership_id={row.id} />
              {/* <UserView user={row.user} /> */}
            </Stack>
          );
        }
      }
    ],
    []
  );

  const account = useActiveAccount();
  const url = route('accounts.memberships', { id: account.id });
  const { themeStretch } = useSettings();

  return (
    <Card>
      <TrapScrollBox>
        <AsyncTable columns={columns} components={{ Toolbar: ActionBar }} checkboxSelection url={url} />
      </TrapScrollBox>
    </Card>
  );
};

export default AccountMembers;
