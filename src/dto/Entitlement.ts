import {EntitlementSource, RenewState} from "./enums";

class Entitlement {
  id: string;
  productId: string;
  isActive: boolean;
  renewState: RenewState;
  source: EntitlementSource;
  startedDate: number;
  expirationDate?: number;

  constructor(
    id: string,
    productId: string,
    isActive: boolean,
    renewState: RenewState,
    source: EntitlementSource,
    startedDate: number,
    expirationDate: number | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.isActive = isActive;
    this.renewState = renewState;
    this.source = source;
    this.startedDate = startedDate;
    this.expirationDate = expirationDate;
  }
}

export default Entitlement;
