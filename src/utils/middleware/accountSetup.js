import React from 'react';
import { Navigate } from 'react-router-dom';
import router from 'router';
import { isExternalLink } from '..';

export function requireAccountSetup() {
  return function (next) {
    return function (node, auth) {
      if (auth.isAccountSetupRequired()) {
        if (isExternalLink(router.generatePath('account-setup.steps'))) {
          window.location.href = router.generatePath('account-setup.steps');
        } else {
          return <Navigate to={router.generatePath('account-setup.steps')} replace />;
        }
      }

      return next(node, auth);
    };
  };
}

export function withoutAccountSetup() {
  return function (next) {
    return function (node, auth) {
      console.log(!auth.isAccountSetupRequired());
      if (!auth.isAccountSetupRequired()) {
        if (isExternalLink(router.generatePath('terminal-portal.dashboard'))) {
          window.location.href = router.generatePath('terminal-portal.dashboard');
        } else {
          return <Navigate to={router.generatePath('terminal-portal.dashboard')} replace />;
        }
      }

      return next(node, auth);
    };
  };
}
