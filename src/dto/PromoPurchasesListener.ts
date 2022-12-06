import Entitlement from './Entitlement';

export interface PromoPurchasesListener {

  /**
   * Fired each time a promo purchase from the App Store happens.
   * Call {@param promoPurchaseExecutor} in case of your app is ready to start promo purchase.
   * Or cache that executor and call later when you need.
   * @param productId StoreKit product identifier.
   * @param promoPurchaseExecutor a function that will start a promo purchase flow.
   */
  onPromoPurchaseReceived(productId: string, promoPurchaseExecutor: () => Promise<Map<string, Entitlement>>): void;
}
