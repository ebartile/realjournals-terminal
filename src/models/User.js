import Model from './Model';

class User extends Model {
  /**
   * Get staff role
   *
   * @returns {*}
   */
  isStaff() {
    return Boolean(this.get('is_staff', false));
  }

  /**
   * Determine if profile is complete
   *
   * @returns {null|*}
   */
  isProfileComplete() {
    return Boolean(this.get('is_profile_complete', false));
  }

  /**
   * Get super admin role
   *
   * @returns {*}
   */
  isSuperAdmin() {
    return Boolean(this.get('is_superuser', false));
  }

  /**
   * Check if user has verified email
   *
   * @returns {boolean}
   */
  hasVerifiedEmail() {
    return Boolean(this.get('verified_email'));
  }

  /**
   * Check if user has enabled two factor
   *
   * @returns {boolean}
   */
  enabledTwoFactor() {
    return Boolean(this.get('two_factor_enabled'));
  }

  /**
   * Get profile picture url
   *
   * @returns {string|null}
   */
  getProfilePicture() {
    return this.get('photo');
  }

  /**
   * Check if active
   *
   * @returns {boolean}
   */
  isActive() {
    return Boolean(this.get('is_active'));
  }
}

export default User;
