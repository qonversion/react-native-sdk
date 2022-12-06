import Entitlement from './Entitlement';

export interface EntitlementsUpdateListener {

  /**
   * Called when entitlements update.
   * For example, when pending purchases like SCA, Ask to buy, etc., happen.
   * @param entitlements all the client's entitlements after update.
   */
  onEntitlementsUpdated(entitlements: Map<string, Entitlement>): void;
}
