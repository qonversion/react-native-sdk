import Permission from './Permission';

export interface PromoPurchasesDelegate {

  /**
   * Delegate fires each time a promo purchase from the App Store happens.
   * Call startPromoPurchase in case of your app is ready to start promo purchase.
   * Or cache that delegate and call later when you need.
   * @param productId StoreKit product identifier.
   * @param promoPurchaseExecutor A delegate that will start a promo purchase flow.
   */
  onPromoPurchaseReceived(productId: string, promoPurchaseExecutor: () => Promise<Map<string, Permission>>): void;
}
