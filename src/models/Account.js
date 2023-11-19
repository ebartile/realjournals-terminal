import Model from './Model';
import User from './User';

class Account extends Model {
  /**
   * Get all permissions
   *
   * @returns {*}
   */
  permissions() {
    return this.get('my_permissions', []);
  }

  /**
   * Check if user has permission
   *
   * @param value
   * @returns {boolean}
   */
  can(value) {
    return this.permissions().includes(value.trim());
  }

  /**
   * Check if user does not have permission
   *
   * @param value
   * @returns {boolean}
   */
  cannot(value) {
    return !this.can(value);
  }

  /**
   * Get picture url
   *
   * @returns {string|null}
   */
  getPicture() {
    return this.get('logo');
  }

  /**
   * Check Ownership
   *
   * @returns {*}
   */
  isOwner() {
    return this.get('i_am_owner', false);
  }

  /**
   * Check Membership
   *
   * @returns {*}
   */
  isMember() {
    return this.get('i_am_member', false);
  }

  /**
   * Check Admin
   *
   * @returns {*}
   */
  isAdmin() {
    return this.get('i_am_admin', false);
  }

  /**
   * Is Out of Owner Limits
   *
   * @returns {*}
   */
  isOutOfOwnerLimits() {
    return this.get('is_out_of_owner_limits', false);
  }

  /**
   * Get Owner object model
   *
   * @returns {null|Owner}
   */
  get owner() {
    if (!this.ownerObject) {
      this.ownerObject = new User(this.get('owner'));
    }
    return this.ownerObject;
  }
}

export default Account;
