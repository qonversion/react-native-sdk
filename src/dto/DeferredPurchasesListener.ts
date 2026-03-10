import Entitlement from './Entitlement';

export interface DeferredPurchasesListener {

  /**
   * Called when a deferred purchase completes.
   * For example, when pending purchases like SCA, Ask to buy, etc., are approved and finalized.
   * @param entitlements the user's entitlements after the deferred purchase completion.
   */
  onDeferredPurchaseCompleted(entitlements: Map<string, Entitlement>): void;
}
