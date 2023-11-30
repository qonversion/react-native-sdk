/**
 * Used to provide all the necessary purchase data to the {@link Qonversion.purchase} method.
 * Can be created manually or using the {@link Product.toPurchaseModel} method.
 *
 * If {@link offerId} is not specified for Android, then the default offer will be applied.
 * To know how we choose the default offer, see {@link ProductStoreDetails.defaultSubscriptionOfferDetails}.
 *
 * To prevent applying any offer to the purchase (use only bare base plan),
 * call the {@link removeOffer} method.
 */
class PurchaseModel {

  public readonly productId: string;
  public offerId: string | null = null;

  public applyOffer: boolean = true;

  constructor(productId: string, offerId: string | null = null) {
    this.productId = productId;
    this.offerId = offerId;
  }

  removeOffer(): PurchaseModel {
    this.applyOffer = false;
    return this;
  }
}

export default PurchaseModel;
