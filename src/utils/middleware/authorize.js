import React from 'react';
import Page403 from 'pages/Status/Page403';

export function can(permission) {
  return function (next) {
    return function (node, auth) {
      if (!auth.can(permission)) {
        return <Page403 />;
      }
      return next(node, auth);
    };
  };
}

export function cannot(permission) {
  return function (next) {
    return function (node, auth) {
      if (auth.can(permission)) {
        return <Page403 />;
      }
      return next(node, auth);
    };
  };
}

export function check(predicate) {
  return function (next) {
    return function (node, auth) {
      if (!predicate(auth)) {
        return <Page403 />;
      }
      return next(node, auth);
    };
  };
}
