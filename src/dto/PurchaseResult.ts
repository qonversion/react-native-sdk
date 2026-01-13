import Entitlement from './Entitlement';
import QonversionError from './QonversionError';
import StoreTransaction from './StoreTransaction';
import { PurchaseResultStatus, PurchaseResultSource } from './enums';

/**
 * Represents the result of a purchase operation.
 * Contains the status of the purchase, entitlements, and store transaction details.
 */
class PurchaseResult {
  /**
   * The status of the purchase operation.
   */
  status: PurchaseResultStatus;

  /**
   * The user's entitlements after the purchase.
   * May be null if the purchase failed or is pending.
   */
  entitlements: Map<string, Entitlement> | null;

  /**
   * The error that occurred during the purchase, if any.
   */
  error: QonversionError | null;

  /**
   * Indicates whether the entitlements were generated from a fallback source.
   */
  isFallbackGenerated: boolean;

  /**
   * The source of the purchase result data.
   */
  source: PurchaseResultSource;

  /**
   * The store transaction details from the native platform.
   * Contains raw transaction information from Apple App Store or Google Play Store.
   */
  storeTransaction: StoreTransaction | null;

  constructor(
    status: PurchaseResultStatus,
    entitlements: Map<string, Entitlement> | null,
    error: QonversionError | null,
    isFallbackGenerated: boolean,
    source: PurchaseResultSource,
    storeTransaction: StoreTransaction | null,
  ) {
    this.status = status;
    this.entitlements = entitlements;
    this.error = error;
    this.isFallbackGenerated = isFallbackGenerated;
    this.source = source;
    this.storeTransaction = storeTransaction;
  }

  /**
   * Returns true if the purchase was successful.
   */
  get isSuccess(): boolean {
    return this.status === PurchaseResultStatus.SUCCESS;
  }

  /**
   * Returns true if the purchase was canceled by the user.
   */
  get isCanceled(): boolean {
    return this.status === PurchaseResultStatus.USER_CANCELED;
  }

  /**
   * Returns true if the purchase is pending.
   */
  get isPending(): boolean {
    return this.status === PurchaseResultStatus.PENDING;
  }

  /**
   * Returns true if an error occurred during the purchase.
   */
  get isError(): boolean {
    return this.status === PurchaseResultStatus.ERROR;
  }
}

export default PurchaseResult;
