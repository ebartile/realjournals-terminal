import React from 'react';
import { Navigate } from 'react-router-dom';
import router from 'router';
import { isExternalLink } from '..';

export function requireUserSetup() {
  return function (next) {
    return function (node, auth) {
      if (auth.isUserSetupRequired()) {
        if (isExternalLink(router.generatePath('user-setup.steps'))) {
          window.location.href = router.generatePath('user-setup.steps');
        } else {
          return <Navigate to={router.generatePath('user-setup.steps')} replace />;
        }
      }

      return next(node, auth);
    };
  };
}

export function withoutUserSetup() {
  return function (next) {
    return function (node, auth) {
      console.log(!auth.isUserSetupRequired());
      if (!auth.isUserSetupRequired()) {
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
