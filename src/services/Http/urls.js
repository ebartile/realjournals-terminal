import context from 'context';

const Urls = {
  url: 'https://' + context.api + '/v1',
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
    'testimonials.get': {
      uri: 'testimonials',
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
    'auth.register': {
      uri: 'auth/register',
      methods: ['POST']
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
      methods: ['GET', 'HEAD']
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
