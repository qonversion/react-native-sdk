import DeferredTransaction from './DeferredTransaction';

export interface DeferredPurchasesListener {

  /**
   * Called when a deferred purchase completes.
   * For example, when pending purchases like SCA, Ask to buy, etc., are approved and finalized.
   * Provides full transaction details, including for consumable products without entitlements.
   * @param transaction the completed deferred transaction with full details.
   */
  onDeferredPurchaseCompleted(transaction: DeferredTransaction): void;
}
