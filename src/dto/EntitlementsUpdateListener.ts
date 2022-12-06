import Entitlement from './Entitlement';

export interface EntitlementsUpdateListener {

  /**
   * Called when the deferred transaction status updates.
   * @param entitlements all the client's entitlements after update.
   */
  onEntitlementsUpdated(entitlements: Map<string, Entitlement>): void;
}
