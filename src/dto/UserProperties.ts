import UserProperty from './UserProperty';
import {UserPropertyKey} from './enums';

class UserProperties {
  /**
   * List of all user properties.
   */
  properties: UserProperty[];

  /**
   * List of user properties, set for the Qonversion defined keys.
   * This is a subset of all {@link properties} list.
   * See {@link QonversionApi.setUserProperty}.
   */
  definedProperties: UserProperty[];

  /**
   * List of user properties, set for custom keys.
   * This is a subset of all {@link properties} list.
   * See {@link QonversionApi.setCustomUserProperty}.
   */
  customProperties: UserProperty[];

  /**
   * Map of all user properties.
   * This is a flattened version of the {@link properties} list as a key-value map.
   */
  flatPropertiesMap: Map<string, string>;

  /**
   * Map of user properties, set for the Qonversion defined keys.
   * This is a flattened version of the {@link definedProperties} list as a key-value map.
   * See {@link QonversionApi.setUserProperty}.
   */
  flatDefinedPropertiesMap: Map<UserPropertyKey, string>;

  /**
   * Map of user properties, set for custom keys.
   * This is a flattened version of the {@link customProperties} list as a key-value map.
   * See {@link QonversionApi.setCustomUserProperty}.
   */
  flatCustomPropertiesMap: Map<string, string>;

  constructor(properties: UserProperty[]) {
    this.properties = properties;
    this.definedProperties = properties.filter(property => property.definedKey !== UserPropertyKey.CUSTOM);
    this.customProperties = properties.filter(property => property.definedKey === UserPropertyKey.CUSTOM);

    this.flatPropertiesMap = new Map<string, string>();
    this.flatDefinedPropertiesMap = new Map<UserPropertyKey, string>();
    this.flatCustomPropertiesMap = new Map<string, string>();
    properties.forEach(property => {
      this.flatPropertiesMap.set(property.key, property.value);
      if (property.definedKey == UserPropertyKey.CUSTOM) {
        this.flatCustomPropertiesMap.set(property.key, property.value);
      } else {
        this.flatDefinedPropertiesMap.set(property.definedKey, property.value);
      }
    });
  }

  /**
   * Searches for a property with the given property {@link key} in all properties list.
   */
  getProperty(key: string): UserProperty | undefined {
    return this.properties.find(userProperty => userProperty.key == key);
  }

  /**
   * Searches for a property with the given Qonversion defined property {@link key}
   * in defined properties list.
   */
  getDefinedProperty(key: UserPropertyKey): UserProperty | undefined {
    return this.definedProperties.find(userProperty => userProperty.definedKey == key);
  }
}

export default UserProperties;
