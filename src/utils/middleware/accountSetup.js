import { useAccounts } from 'hooks/account';
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import router from 'router';

export function requireAccountSetup() {
  return function (next) {
    return function (node, auth) {
      if (auth.isAccountSetupRequired()) {
        return <Navigate to={router.generatePath('account-setup.steps')} replace />;
      }

      return next(node, auth);
    };
  };
}

export function withoutAccountSetup() {
  return function (next) {
    return function (node, auth) {
      if (!auth.isAccountSetupRequired()) {
        return <Navigate to={router.generatePath('terminal-portal.analytics')} replace />;
      }

      return next(node, auth);
    };
  };
}
