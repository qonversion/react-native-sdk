import { RenewState } from "../enums";

class Permission {
  permissionID: string;
  productID: string;
  isActive: boolean;
  renewState: RenewState;
  startedDate: Date;
  expirationDate?: Date;

  constructor(
    permissionID: string,
    productID: string,
    isActive: boolean,
    renewState: RenewState,
    startedDate: Date,
    expirationDate: Date | undefined
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
