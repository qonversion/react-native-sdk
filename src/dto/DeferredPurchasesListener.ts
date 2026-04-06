import PurchaseResult from './PurchaseResult';

export interface DeferredPurchasesListener {

  /**
   * Called when a deferred purchase completes.
   * For example, when pending purchases like SCA, Ask to buy, etc., are approved and finalized.
   * Provides the full purchase result with entitlements and store transaction details.
   * @param purchaseResult the result of the completed deferred purchase.
   */
  onDeferredPurchaseCompleted(purchaseResult: PurchaseResult): void;
}
