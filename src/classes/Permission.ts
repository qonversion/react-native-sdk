import { RenewState } from "../entities";

class Permission {
  permissionID: string;
  productID: string;
  isActive: boolean;
  renewState: RenewState;
  startedDate: string;
  expirationDate?: string;

  constructor(
    permissionID: string,
    productID: string,
    isActive: boolean,
    renewState: RenewState,
    startedDate: string,
    expirationDate: string | undefined
  ) {
    this.permissionID = permissionID;
    this.productID = productID;
    this.isActive = isActive;
    this.renewState = renewState;
    this.startedDate = startedDate;
    this.expirationDate = expirationDate;
  }
}

export default Permission;
