import React from 'react';
import { Navigate } from 'react-router-dom';
import router from 'router';
import { isExternalLink } from '..';

export function requireUserSetup() {
  return function (next) {
    return function (node, auth) {
      if (auth.isUserSetupRequired()) {
        return <Navigate to={router.generatePath('user-setup.steps')} replace />;
      }

      return next(node, auth);
    };
  };
}

export function withoutUserSetup() {
  return function (next) {
    return function (node, auth) {
      if (!auth.isUserSetupRequired()) {
        return <Navigate to={router.generatePath('terminal-portal.analytics')} replace />;
      }

      return next(node, auth);
    };
  };
}
