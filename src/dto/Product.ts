import {ProductType} from "./enums";
import SKProduct from "./storeProducts/SKProduct";
import SkuDetails from "./storeProducts/SkuDetails";
import ProductStoreDetails from "./ProductStoreDetails";
import SubscriptionPeriod from './SubscriptionPeriod';

class Product {
  qonversionID: string;
  storeID: string;

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
}

export default Product;
