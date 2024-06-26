import {ProductType} from "../enums";
import ProductOfferDetails from "./ProductOfferDetails";
import ProductInAppDetails from "./ProductInAppDetails";

/**
 * This class contains all the information about the concrete Google product,
 * either subscription or in-app. In case of a subscription also determines concrete base plan.
 */
class ProductStoreDetails {
  /**
   * Identifier of the base plan to which these details relate.
   * Null for in-app products.
   */
  basePlanId: string | null;

  /**
   * Identifier of the subscription or the in-app product.
   */
  productId: string;

  /**
   * Name of the subscription or the in-app product.
   */
  name: string;

  /**
   * Title of the subscription or the in-app product.
   * The title includes the name of the app.
   */
  title: string;

  /**
   * Description of the subscription or the in-app product.
   */
  description: string;

  /**
   * Offer details for the subscription.
   * Offer details contain all the available variations of purchase offers,
   * including both base plan and eligible base plan + offer combinations
   * from Google Play Console for current {@link basePlanId}.
   * Null for in-app products.
   */
  subscriptionOfferDetails: ProductOfferDetails[] | null;

  /**
   * The most profitable subscription offer for the client in our opinion from all the available offers.
   * We calculate the cheapest price for the client by comparing all the trial or intro phases
   * and the base plan.
   */
  defaultSubscriptionOfferDetails: ProductOfferDetails | null;

  /**
   * Subscription offer details containing only the base plan without any offer.
   */
  basePlanSubscriptionOfferDetails: ProductOfferDetails | null;

  /**
   * Offer details for the in-app product.
   * Null for subscriptions.
   */
  inAppOfferDetails: ProductInAppDetails | null;

  /**
   * True, if there is any eligible offer with a trial
   * for this subscription and base plan combination.
   * False otherwise or for an in-app product.
   */
  hasTrialOffer: boolean;

  /**
   * True, if there is any eligible offer with an intro price
   * for this subscription and base plan combination.
   * False otherwise or for an in-app product.
   */
  hasIntroOffer: boolean;

  /**
   * True, if there is any eligible offer with a trial or an intro price
   * for this subscription and base plan combination.
   * False otherwise or for an in-app product.
   */
  hasTrialOrIntroOffer: boolean;

  /**
   * The calculated type of the current product.
   */
  productType: ProductType;

  /**
   * True, if the product type is InApp.
   */
  isInApp: boolean;

  /**
   * True, if the product type is Subscription.
   */
  isSubscription: boolean;

  /**
   * True, if the subscription product is prepaid, which means that users pay in advance -
   * they will need to make a new payment to extend their plan.
   */
  isPrepaid: boolean;

  /**
   * True, if the subscription product is installment, which means that users commit
   * to pay for a specified amount of periods every month.
   */
  isInstallment: boolean;

  constructor(
    basePlanId: string | null,
    productId: string,
    name: string,
    title: string,
    description: string,
    subscriptionOfferDetails: ProductOfferDetails[] | null,
    defaultSubscriptionOfferDetails: ProductOfferDetails | null,
    basePlanSubscriptionOfferDetails: ProductOfferDetails | null,
    inAppOfferDetails: ProductInAppDetails | null,
    hasTrialOffer: boolean,
    hasIntroOffer: boolean,
    hasTrialOrIntroOffer: boolean,
    productType: ProductType,
    isInApp: boolean,
    isSubscription: boolean,
    isPrepaid: boolean,
    isInstallment: boolean,
  ) {
    this.basePlanId = basePlanId;
    this.productId = productId;
    this.name = name;
    this.title = title;
    this.description = description;
    this.subscriptionOfferDetails = subscriptionOfferDetails;
    this.defaultSubscriptionOfferDetails = defaultSubscriptionOfferDetails;
    this.basePlanSubscriptionOfferDetails = basePlanSubscriptionOfferDetails;
    this.inAppOfferDetails = inAppOfferDetails;
    this.hasTrialOffer = hasTrialOffer;
    this.hasIntroOffer = hasIntroOffer;
    this.hasTrialOrIntroOffer = hasTrialOrIntroOffer;
    this.productType = productType;
    this.isInApp = isInApp;
    this.isSubscription = isSubscription;
    this.isPrepaid = isPrepaid;
    this.isInstallment = isInstallment;
  }
}

export default ProductStoreDetails;
