import Permission from './Permission';

export interface UpdatedPurchasesDelegate {

  /**
   * Called when the deferred transaction status updates.
   * @param permissions all the client's permissions after update.
   */
  onPermissionsUpdated(permissions: Map<string, Permission>): void;
}
