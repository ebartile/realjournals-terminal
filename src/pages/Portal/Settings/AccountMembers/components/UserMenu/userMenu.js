import React, { Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MoreVert, Refresh, Gavel } from '@material-ui/icons';
import { IconButton, MenuItem } from '@material-ui/core';
import Dropdown from 'components/Dropdown';
import { intersection, isEmpty, map } from 'lodash';
import { useAuth } from 'models/Auth';
import User from 'models/User';
import { useModal } from 'utils/modal';
import Form, { AutoComplete, DateTimePicker } from 'components/Form';
import { route, useFormRequest, useRequest } from 'services/Http';
import Spin from 'components/Spin';
import { LoadingButton } from '@material-ui/lab';
import { notify } from 'utils/index';
import { normalizeDate } from 'utils/form';
import { SettingsBackupRestore } from '@material-ui/icons';
import { AdminPanelSettings } from '@material-ui/icons';
import LoadingIcon from 'components/LoadingIcon';
import TableContext from 'contexts/TableContext';
import ModalActions from 'components/ModalActions';
import ModalContent from 'components/ModalContent';
import { useActiveAccount } from 'hooks/account';

const UserMenu = ({ user, membership_id }) => {
  const auth = useAuth();
  const [modal, modalElements] = useModal();
  const [request, loading] = useRequest();
  const account = useActiveAccount();
  const { reload: reloadTable } = useContext(TableContext);

  const activateUser = useCallback(() => {
    request
      .delete(route('accounts.memberships.remove', { id: account.id, pk: membership_id }))
      .then((response) => {
        notify.success(`User has been removed`);
        reloadTable();
      })
      .catch((error) => {
        notify.error(error.response.data._error_message);
      });
  }, [request, user, reloadTable]);

  const resendInvitation = useCallback(() => {
    request
      .get(route('accounts.memberships.resend-invitation', { id: account.id, pk: membership_id }))
      .then((response) => {
        notify.success(`Invitation Sent`);
        reloadTable();
      })
      .catch((error) => {
        notify.error(error.response.data._error_message);
      });
  }, [request, user, reloadTable]);

  const menuItems = useMemo(() => {
    const items = [];

    const data = User.use(user);

    items.push(
      <MenuItem key={1} onClick={activateUser}>
        <Gavel sx={{ mr: 2 }} />
        Remove User
      </MenuItem>
    );

    items.push(
      <MenuItem key={1} onClick={resendInvitation}>
        <Refresh sx={{ mr: 2 }} />
        Resend Invitation
      </MenuItem>
    );
    return items;
  }, [user, auth, activateUser, resendInvitation]);

  if (isEmpty(menuItems)) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown menuItems={menuItems} component={IconButton}>
        <LoadingIcon component={MoreVert} loading={loading} />
      </Dropdown>

      {modalElements}
    </Fragment>
  );
};

export default UserMenu;
