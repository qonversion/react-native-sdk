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
    startedTimestamp: number,
    renewsCount: number,
    grantType: EntitlementGrantType,
    transactions: Array<Transaction>,
    expirationTimestamp: number | undefined,
    trialStartTimestamp: number | undefined,
    firstPurchaseTimestamp: number | undefined,
    lastPurchaseTimestamp: number | undefined,
    autoRenewDisableTimestamp: number | undefined,
    lastActivatedOfferCode: string | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.isActive = isActive;
    this.renewState = renewState;
    this.source = source;
    this.startedDate = new Date(startedTimestamp);
    this.expirationDate = expirationTimestamp ? new Date(expirationTimestamp) : undefined;
    this.renewsCount = renewsCount;
    this.grantType = grantType;
    this.transactions = transactions;
    this.expirationDate = expirationTimestamp ? new Date(expirationTimestamp) : undefined;
    this.trialStartDate = trialStartTimestamp ? new Date(trialStartTimestamp) : undefined;
    this.firstPurchaseDate = firstPurchaseTimestamp ? new Date(firstPurchaseTimestamp) : undefined;
    this.lastPurchaseDate = lastPurchaseTimestamp ? new Date(lastPurchaseTimestamp) : undefined;
    this.autoRenewDisableDate = autoRenewDisableTimestamp ? new Date(autoRenewDisableTimestamp) : undefined;
    this.lastActivatedOfferCode = lastActivatedOfferCode;
  }
}

export default Entitlement;
