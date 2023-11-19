import { isEmpty } from 'lodash';
import User from 'models/User';
import Model from './Model';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { route } from 'services/Http';

export default class Auth extends Model {
  /**
   * Check if user is authenticated
   */
  check() {
    return !isEmpty(this.user);
  }

  /**
   * Get country operation status
   *
   * @returns {boolean}
   */
  countryOperation() {
    return this.check() && this.user.get('country');
  }

  /**
   * Check if user setup is required
   *
   * @returns {*|boolean}
   */
  isUserSetupRequired() {
    return this.check() && !this.user.isProfileComplete();
  }

  /**
   * Check if user setup is required
   *
   * @returns {*|boolean}
   */
  isAccountSetupRequired() {
    return (this.check() && !this.user.hasAccount()) || !this.user.accountHasBeConfigured();
  }

  /**
   * Get Login Id
   *
   * @returns {*}
   */
  credential() {
    return this.get('credential');
  }

  requireTwoFactor() {
    return this.user.enabledTwoFactor();
  }

  logout(request) {
    return request.post(route('auth.logout'));
  }

  /**
   * Get user object model
   *
   * @returns {null|User}
   */
  get user() {
    if (!this.userObject) {
      const data = this.get('user');

      if (!isEmpty(data)) {
        this.userObject = new User(data);
      } else {
        this.userObject = null;
      }
    }
    return this.userObject;
  }
}

/**
 * Auth Custom Hook
 *
 * @returns {Auth|Model}
 */
export function useAuth() {
  const auth = useSelector((state) => state.auth);
  return useMemo(() => new Auth(auth), [auth]);
}
