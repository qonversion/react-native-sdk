import {EntitlementSource, EntitlementRenewState, EntitlementGrantType} from "./enums";
import Transaction from "./Transaction";

class Entitlement {
  id: string;
  productId: string;
  isActive: boolean;
  renewState: EntitlementRenewState;
  source: EntitlementSource;
  startedDate: Date;
  renewsCount: number;
  grantType: EntitlementGrantType;
  transactions: Array<Transaction>;
  expirationDate?: Date;
  trialStartDate?: Date;
  firstPurchaseDate?: Date;
  lastPurchaseDate?: Date;
  autoRenewDisableDate?: Date;
  lastActivatedOfferCode?: string;

  constructor(
    id: string,
    productId: string,
    isActive: boolean,
    renewState: EntitlementRenewState,
    source: EntitlementSource,
    startedDate: number,
    renewsCount: number,
    grantType: EntitlementGrantType,
    transactions: Array<Transaction>,
    expirationDate: number | undefined,
    trialStartDate: number | undefined,
    firstPurchaseDate: number | undefined,
    lastPurchaseDate: number | undefined,
    autoRenewDisableDate: number | undefined,
    lastActivatedOfferCode: string | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.isActive = isActive;
    this.renewState = renewState;
    this.source = source;
    this.startedDate = new Date(startedDate);
    this.expirationDate = expirationDate ? new Date(expirationDate) : undefined;
    this.renewsCount = renewsCount;
    this.grantType = grantType;
    this.transactions = transactions;
    this.expirationDate = expirationDate ? new Date(expirationDate) : undefined;
    this.trialStartDate = trialStartDate ? new Date(trialStartDate) : undefined;
    this.firstPurchaseDate = firstPurchaseDate ? new Date(firstPurchaseDate) : undefined;
    this.lastPurchaseDate = lastPurchaseDate ? new Date(lastPurchaseDate) : undefined;
    this.autoRenewDisableDate = autoRenewDisableDate ? new Date(autoRenewDisableDate) : undefined;
    this.lastActivatedOfferCode = lastActivatedOfferCode;
  }
}

export default Entitlement;
