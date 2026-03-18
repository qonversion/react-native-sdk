/**
 * Represents a completed deferred purchase transaction with full details.
 */
export default class DeferredTransaction {
  /**
   * Store product identifier.
   */
  productId: string;

  /**
   * Store transaction identifier.
   */
  transactionId: string | null;

  /**
   * Original store transaction identifier.
   * For subscriptions, this is the ID of the first transaction.
   */
  originalTransactionId: string | null;

  /**
   * Type of the transaction: Subscription, Consumable, NonConsumable, or Unknown.
   */
  type: string;

  /**
   * Transaction value. May be 0 if unavailable.
   */
  value: number;

  /**
   * Currency code (e.g. "USD"). May be null if unavailable.
   */
  currency: string | null;

  constructor(
    productId: string,
    transactionId: string | null,
    originalTransactionId: string | null,
    type: string,
    value: number,
    currency: string | null
  ) {
    this.productId = productId;
    this.transactionId = transactionId;
    this.originalTransactionId = originalTransactionId;
    this.type = type;
    this.value = value;
    this.currency = currency;
  }
}
