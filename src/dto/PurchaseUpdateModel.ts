import {PurchaseUpdatePolicy} from './enums';

/**
 * Used to provide all the necessary purchase data to the {@link Qonversion.updatePurchase} method.
 * Can be created manually or using the {@link Product.toPurchaseUpdateModel} method.
 *
 * Requires Qonversion product identifiers - {@link productId} for the purchasing one and
 * {@link oldProductId} for the purchased one.
 *
 * If {@link offerId} is not specified for Android, then the default offer will be applied.
 * To know how we choose the default offer, see {@link ProductStoreDetails.defaultSubscriptionOfferDetails}.
 *
 * If you want to remove any intro/trial offer from the purchase on Android (use only a bare base plan),
 * call the {@link removeOffer} method.
 */
class PurchaseUpdateModel {

  public readonly productId: string;
  public readonly oldProductId: string;
  public updatePolicy: PurchaseUpdatePolicy | null = null;
  public offerId: string | null = null;

  public applyOffer: boolean = true;

  constructor(
    productId: string,
    oldProductId: string,
    updatePolicy: PurchaseUpdatePolicy | null = null,
    offerId: string | null = null,
  ) {
    this.productId = productId;
    this.oldProductId = oldProductId;
    this.updatePolicy = updatePolicy;
    this.offerId = offerId;
  }

  removeOffer(): PurchaseUpdateModel {
    this.applyOffer = false;
    return this;
  }
}

export default PurchaseUpdateModel;
