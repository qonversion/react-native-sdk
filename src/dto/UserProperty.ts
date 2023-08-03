import {UserPropertyKey} from './enums';
import mapper from '../internal/Mapper';

class UserProperty {
  key: string;
  value: string;

  /**
   * {@link UserPropertyKey} used to set this property.
   * Returns {@link UserPropertyKey.CUSTOM} for custom properties.
   */
  definedKey: UserPropertyKey;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
    this.definedKey = mapper.convertDefinedUserPropertyKey(key);
  }
}

export default UserProperty;
