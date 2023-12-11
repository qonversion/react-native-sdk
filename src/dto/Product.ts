import {ProductType, PurchaseUpdatePolicy} from "./enums";
import SKProduct from "./storeProducts/SKProduct";
import SkuDetails from "./storeProducts/SkuDetails";
import ProductStoreDetails from "./storeProducts/ProductStoreDetails";
import ProductOfferDetails from './storeProducts/ProductOfferDetails';
import PurchaseModel from './PurchaseModel';
import PurchaseUpdateModel from './PurchaseUpdateModel';
import SubscriptionPeriod from './SubscriptionPeriod';

class Product {
  qonversionID: string;
  storeID: string | null;

  /**
   * Identifier of the base plan for Google product.
   */
  basePlanID: string | null;

  /**
   * Google Play Store details of this product.
   * Android only. Null for iOS, or if the product was not found.
   * Doesn't take into account {@link basePlanID}.
   * @deprecated Consider using {@link storeDetails} instead.
   */
  skuDetails: SkuDetails | null;

  /**
   * Google Play Store details of this product.
   * Android only. Null for iOS, or if the product was not found.
   */
  storeDetails: ProductStoreDetails | null;

  /**
   * App store details of this product.
   * iOS only. Null for Android, or if the product was not found.
   */
  skProduct: SKProduct | null;

  offeringId?: string | null;

  /**
   * For Android - the subscription base plan duration. If the {@link basePlanID} is not specified,
   * the duration is calculated using the deprecated {@link skuDetails}.
   * For iOS - the duration of the {@link skProduct}.
   * Null, if it's not a subscription product or the product was not found in the store.
   */
  subscriptionPeriod: SubscriptionPeriod | null;

  /**
   * The subscription trial duration of the default offer for Android or of the product for iOS.
   * See {@link ProductStoreDetails.defaultSubscriptionOfferDetails} for the information on how we
   * choose the default offer for Android.
   * Null, if it's not a subscription product or the product was not found the store.
   */
  trialPeriod: SubscriptionPeriod | null;

  /**
   * The calculated type of this product based on the store information.
   * On Android uses deprecated {@link skuDetails} for the old subscription products
   * where {@link basePlanID} is not specified, and {@link storeDetails} for all the other products.
   * On iOS uses {@link skProduct} information.
   */
  type: ProductType;

  /**
   * Formatted price of for this product, including the currency sign.
   */
  prettyPrice: string | null;

  price?: number;
  currencyCode?: string;
  storeTitle?: string;
  storeDescription?: string;
  prettyIntroductoryPrice?: string;

  constructor(
    qonversionID: string,
    storeID: string,
    basePlanID: string | null,
    skuDetails: SkuDetails | null,
    storeDetails: ProductStoreDetails | null,
    skProduct: SKProduct | null,
    offeringId: string | null,
    subscriptionPeriod: SubscriptionPeriod | null,
    trialPeriod: SubscriptionPeriod | null,
    type: ProductType,
    prettyPrice: string | null,
    price: number | undefined,
    currencyCode: string | undefined,
    storeTitle: string | undefined,
    storeDescription: string | undefined,
    prettyIntroductoryPrice: string | undefined,
  ) {
    this.qonversionID = qonversionID;
    this.storeID = storeID;
    this.basePlanID = basePlanID;
    this.skuDetails = skuDetails;
    this.storeDetails = storeDetails;
    this.skProduct = skProduct;
    this.offeringId = offeringId;
    this.subscriptionPeriod = subscriptionPeriod;
    this.trialPeriod = trialPeriod;
    this.type = type;
    this.prettyPrice = prettyPrice;
    this.price = price;
    this.currencyCode = currencyCode;
    this.storeTitle = storeTitle;
    this.storeDescription = storeDescription;
    this.prettyIntroductoryPrice = prettyIntroductoryPrice;
  }

  /**
   * Converts this product to purchase model to pass to {@link Qonversion.purchase}.
   * @param offerId concrete Android offer identifier if necessary.
   *                If the products' base plan id is specified, but offer id is not provided for
   *                purchase, then default offer will be used.
   *                Ignored if base plan id is not specified.
   *                Ignored for iOS.
   * To know how we choose the default offer, see {@link ProductStoreDetails.defaultSubscriptionOfferDetails}.
   * @returns purchase model to pass to the purchase method.
   */
  toPurchaseModel(offerId: string | null = null): PurchaseModel {
    return new PurchaseModel(this.qonversionID, offerId);
  }

  /**
   * Converts this product to purchase model to pass to {@link Qonversion.purchase}.
   * @param offer concrete Android offer which you'd like to purchase.
   * @return purchase model to pass to the purchase method.
   */
  toPurchaseModelWithOffer(offer: ProductOfferDetails): PurchaseModel {
    const model = this.toPurchaseModel(offer.offerId);
    // Remove offer for the case when provided offer details are for bare base plan.
    if (offer.offerId == null) {
      model.removeOffer();
    }

    return model;
  }

  /**
   * Android only.
   *
   * Converts this product to purchase update (upgrade/downgrade) model
   * to pass to {@link Qonversion.updatePurchase}.
   * @param oldProductId Qonversion product identifier from which the upgrade/downgrade
   *                     will be initialized.
   * @param updatePolicy purchase update policy.
   * @return purchase model to pass to the update purchase method.
   */
  toPurchaseUpdateModel(
    oldProductId: string,
    updatePolicy: PurchaseUpdatePolicy | null = null
  ): PurchaseUpdateModel {
    return new PurchaseUpdateModel(this.qonversionID, oldProductId, updatePolicy);
  }
}

export default Product;
