/**
 * Represents a raw store transaction from the native platform.
 * This is the transaction information as received from Apple App Store or Google Play Store.
 */
class StoreTransaction {
  /**
   * The unique identifier for this transaction.
   */
  transactionId?: string;

  /**
   * The original transaction identifier.
   * For subscriptions, this identifies the first transaction in the subscription chain.
   */
  originalTransactionId?: string;

  /**
   * The date and time when the transaction occurred.
   */
  transactionDate?: Date;

  /**
   * The store product identifier associated with this transaction.
   */
  productId?: string;

  /**
   * The quantity of items purchased.
   */
  quantity: number;

  /**
   * iOS only. The identifier of the promotional offer applied to this purchase.
   */
  promoOfferId?: string;

  /**
   * Android only. The purchase token from Google Play.
   */
  purchaseToken?: string;

  constructor(
    transactionId: string | undefined,
    originalTransactionId: string | undefined,
    transactionTimestamp: number | undefined,
    productId: string | undefined,
    quantity: number | undefined,
    promoOfferId: string | undefined,
    purchaseToken: string | undefined,
  ) {
    this.transactionId = transactionId;
    this.originalTransactionId = originalTransactionId;
    this.transactionDate = transactionTimestamp ? new Date(transactionTimestamp) : undefined;
    this.productId = productId;
    this.quantity = quantity ?? 1;
    this.promoOfferId = promoOfferId;
    this.purchaseToken = purchaseToken;
  }
}

export default StoreTransaction;
