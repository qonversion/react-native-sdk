import {EntitlementSource, EntitlementRenewState} from "./enums";

class Entitlement {
  id: string;
  productId: string;
  isActive: boolean;
  renewState: EntitlementRenewState;
  source: EntitlementSource;
  startedDate: Date;
  expirationDate?: Date;

  constructor(
    id: string,
    productId: string,
    isActive: boolean,
    renewState: EntitlementRenewState,
    source: EntitlementSource,
    startedDate: number,
    expirationDate: number | undefined,
  ) {
    this.id = id;
    this.productId = productId;
    this.isActive = isActive;
    this.renewState = renewState;
    this.source = source;
    this.startedDate = new Date(startedDate);
    this.expirationDate = expirationDate ? new Date(expirationDate) : undefined;
  }
}

export default Entitlement;
