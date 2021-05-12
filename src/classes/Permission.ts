import { RenewState } from "../enums";

class Permission {
  permissionID: string;
  productID: string;
  isActive: boolean;
  renewState: RenewState;
  startedDate: number;
  expirationDate?: number;

  constructor(
    permissionID: string,
    productID: string,
    isActive: boolean,
    renewState: RenewState,
    startedDate: number,
    expirationDate: number | undefined
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
