const Urls = {
  url: 'https://api.realjournals.com/v1',
  port: null,
  defaults: {},
  routes: {
    'locale.set': {
      uri: 'locale',
      methods: ['POST']
    },
    'locale.get': {
      uri: 'locale/fetch',
      methods: ['GET']
    },
    'config.get': {
      uri: 'config',
      methods: ['GET']
    },
    'brokers.get': {
      uri: 'brokers',
      methods: ['GET']
    },
    'auth.login': {
      uri: 'auth',
      methods: ['POST']
    },
    'auth.convert-token': {
      uri: 'api-auth/convert-token',
      methods: ['POST']
    },
    'auth.register': {
      uri: 'auth/register',
      methods: ['POST']
    },
    'auth.logout': {
      uri: 'auth/logout',
      methods: ['GET']
    },
    'auth.forgot-password': {
      uri: 'users/password_recovery',
      methods: ['POST']
    },
    'auth.change-password': {
      uri: 'users/change_password_from_recovery',
      methods: ['POST']
    },
    'auth.verify-email': {
      uri: 'users/verify_email',
      methods: ['POST']
    },
    'auth.change-email': {
      uri: 'users/change_email',
      methods: ['POST']
    },
    'auth.cancel-account': {
      uri: 'users/cancel',
      methods: ['POST']
    },
    'auth.logout': {
      uri: 'auth/logout',
      methods: ['POST']
    },
    'accounts.get': {
      uri: 'accounts',
      methods: ['GET', 'POST', 'HEAD']
    },
    'accounts.get.roles': {
      uri: 'accounts/{id}/roles',
      methods: ['GET', 'HEAD']
    },
    'accounts.upload-picture': {
      uri: 'accounts/{id}/change_logo',
      methods: ['POST', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.update': {
      uri: 'accounts/{id}',
      methods: ['PUT', 'PATCH', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.memberships': {
      uri: 'accounts/{id}/memberships',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.memberships.invite': {
      uri: 'accounts/{id}/memberships',
      methods: ['POST', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.memberships.resend-invitation': {
      uri: 'accounts/{id}/memberships/{pk}/resend_invitation',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id',
        pk: 'pk'
      }
    },
    'accounts.memberships.remove': {
      uri: 'accounts/{id}/memberships/{pk}',
      methods: ['DELETE', 'HEAD'],
      bindings: {
        id: 'id',
        pk: 'pk'
      }
    },
    'accounts.memberships.batch-remove': {
      uri: 'accounts/{id}/memberships/batch_remove',
      methods: ['POST', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'account.get': {
      uri: 'accounts/{id}',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'account.events': {
      uri: 'accounts/{id}/events',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'account.get.stats': {
      uri: 'accounts/{id}/stats',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.broker.login': {
      uri: 'accounts/{id}/login',
      methods: ['POST', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.history_deals_get': {
      uri: 'accounts/{id}/history_deals_get',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.history_orders_get': {
      uri: 'accounts/{id}/history_orders_get',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.copy_rates_range': {
      uri: 'accounts/{id}/copy_rates_range',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.positions_get': {
      uri: 'accounts/{id}/positions_get',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.orders_get': {
      uri: 'accounts/{id}/orders_get',
      methods: ['GET', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'users.me': {
      uri: 'users/me',
      methods: ['GET', 'HEAD']
    },
    'users.email-verification.send': {
      uri: 'users/send_verification_email',
      methods: ['POST', 'HEAD']
    },
    'users.get-two-factor': {
      uri: 'users/create_totp',
      methods: ['POST', 'HEAD']
    },
    'users.set-two-factor': {
      uri: 'users/verify_totp',
      methods: ['POST', 'HEAD']
    },
    'users.upload-picture': {
      uri: 'users/change_avatar',
      methods: ['POST', 'HEAD']
    },
    'accounts.upload-picture': {
      uri: 'accounts/{id}/change_logo',
      methods: ['POST', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'users.update': {
      uri: 'users/{id}',
      methods: ['PATCH', 'HEAD'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.create': {
      uri: 'accounts',
      methods: ['POST', 'HEAD']
    },
    'terminal.account-page-list': {
      uri: 'accounts/{id}/pages',
      methods: ['GET'],
      bindings: {
        id: 'id'
      }
    },
    'terminal.account-page-set-dimensions': {
      uri: 'accounts/{id}/pages',
      methods: ['POST'],
      bindings: {
        id: 'id'
      }
    },
    'terminal.statistics.daily-net-cumulative-profit-loss': {
      uri: 'accounts/{id}/daily_net_cumulative_profit_loss',
      methods: ['POST'],
      bindings: {
        id: 'id'
      }
    },
    'terminal.account.trades': {
      uri: 'accounts/{id}/trades',
      methods: ['GET'],
      bindings: {
        id: 'id'
      }
    },
    'terminal.account.trades.details': {
      uri: 'accounts/{id}/trades/{pk}',
      methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
      bindings: {
        id: 'id',
        pk: 'pk'
      }
    },
    'accounts.upload-data': {
      uri: 'accounts/{id}/upload_data',
      methods: ['POST'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.upload.attachments': {
      uri: 'accounts/{id}/attachments',
      methods: ['POST'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.create_trades': {
      uri: 'accounts/{id}/create_trades',
      methods: ['POST'],
      bindings: {
        id: 'id'
      }
    },
    'accounts.upload.attachments.detail': {
      uri: 'accounts/{id}/attachments/{other_id}/',
      methods: ['GET'],
      bindings: {
        id: 'id',
        other_id: 'other_id'
      }
    }
  }
};

export default Urls;
