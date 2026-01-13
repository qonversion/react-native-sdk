import Product from './Product';

/**
 * Delegate responsible for custom purchase and restore handling.
 * When this delegate is provided, it replaces the default Qonversion SDK purchase flow.
 */
export interface PurchaseDelegate {
  /**
   * Handle purchase for the given product.
   * @param product Product to purchase.
   * @returns Promise that completes successfully when purchase finishes, otherwise throws an error.
   */
  purchase(product: Product): Promise<void>;

  /**
   * Handle restore flow.
   * @returns Promise that completes successfully when restore finishes, otherwise throws an error.
   */
  restore(): Promise<void>;
}

