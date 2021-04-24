import { Platform } from "react-native";

import {
  ExperimentGroupType,
  IntroEligibilityStatus,
  OfferingTag,
  ProductDuration,
  ProductType,
  RenewState,
  SKPeriodUnit,
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
  TrialDuration,
} from "../enums";
import ExperimentGroup from "./ExperimentGroup";
import ExperimentInfo from "./ExperimentInfo";
import IntroEligibility from "./IntroEligibility";
import LaunchResult from "./LaunchResult";
import Offering from "./Offering";
import Offerings from "./Offerings";
import Permission from "./Permission";
import Product from "./Product";
import SKProduct from "./storeProducts/SKProduct";
import SKProductDiscount from "./storeProducts/SKProductDiscount";
import SKSubscriptionPeriod from "./storeProducts/SKSubscriptionPeriod";
import SkuDetails from "./storeProducts/SkuDetails";

type QLaunchResult = {
  products: Array<QProduct>;
  user_products: Array<QProduct>;
  permissions: Array<QPermission>;
  uid: string;
  timestamp: number;
};

type QProduct = {
  type: number;
  duration: number;
  trialDuration: number;
  id: string;
  store_id: string;
  prettyPrice?: string;
  storeProduct: null | QSkuDetails | QSKProduct; // QSkuDetails - android, QSKProduct - iOS
};

type QSkuDetails = {
  description: string;
  freeTrialPeriod: string;
  iconUrl: string;
  introductoryPrice: string;
  introductoryPriceAmountMicros: number;
  introductoryPriceCycles: number;
  introductoryPricePeriod: string;
  originalJson: string;
  originalPrice: string;
  originalPriceAmountMicros: number;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  sku: string;
  subscriptionPeriod: string;
  title: string;
  type: string;
  hashCode: number;
  toString: string;
};

type QSKProduct = {
  subscriptionPeriod: null | QSubscriptionPeriod;
  introductoryPrice: QProductDiscount | null;
  discounts: Array<QProductDiscount> | null;
  localizedDescription: string | undefined;
  localizedTitle: string | undefined;
  price: string;
  localeIdentifier: string | undefined;
  productIdentifier: string | undefined;
  isDownloadable: boolean;
  downloadContentVersion: string | undefined;
  downloadContentLengths: number[] | undefined;
  productDiscount: SKProductDiscount | undefined;
  subscriptionGroupIdentifier: string | undefined;
  isFamilyShareable: boolean | undefined;
  currencyCode: string;
};

type QSubscriptionPeriod = {
  numberOfUnits: number;
  unit: string;
};

type QProductDiscount = {
  subscriptionPeriod: null | QSubscriptionPeriod;
  price: string;
  localeIdentifier?: string;
  numberOfPeriods: number;
  paymentMode: number;
  identifier?: string;
  type: number;
};

type QPermission = {
  id: string;
  associated_product: string;
  active: boolean;
  renew_state: number;
  started_timestamp: number;
  expiration_timestamp: number;
};

type QOfferings = {
  availableOfferings?: Array<QOffering>;
  main: QOffering;
};

type QOffering = {
  id: string;
  tag: number;
  products: Array<QProduct>;
};

class Mapper {
  static convertLaunchResult(launchResult: QLaunchResult): LaunchResult {
    const products: Map<string, Product> = this.convertProducts(
      launchResult.products
    );
    const permissions: Map<string, Permission> = this.convertPermissions(
      launchResult.permissions
    );
    const userProducts: Map<string, Product> = this.convertProducts(
      launchResult.user_products
    );
    return new LaunchResult(
      launchResult.uid,
      launchResult.timestamp,
      products,
      permissions,
      userProducts
    );
  }

  static convertPermissions(
    permissions: Array<QPermission>
  ): Map<string, Permission> {
    let mappedPermissions = new Map();

    for (const [key, permission] of Object.entries(permissions)) {
      let renewState: RenewState = RenewState.UNKNOWN;

      switch (permission.renew_state) {
        case -1:
          renewState = RenewState.NON_RENEWABLE;
          break;
        case 1:
          renewState = RenewState.WILL_RENEW;
          break;
        case 2:
          renewState = RenewState.CANCELED;
          break;
        case 3:
          renewState = RenewState.BILLING_ISSUE;
          break;
      }

      const mappedPermission = new Permission(
        permission.id,
        permission.associated_product,
        !!permission.active,
        renewState,
        new Date(permission.started_timestamp),
        permission.expiration_timestamp
          ? new Date(permission.expiration_timestamp)
          : undefined
      );
      mappedPermissions.set(key, mappedPermission);
    }

    return mappedPermissions;
  }

  static convertProducts(products: Array<QProduct>): Map<string, Product> {
    let mappedProducts = new Map();

    for (const [key, product] of Object.entries(products)) {
      const mappedProduct = this.convertProduct(product);
      mappedProducts.set(key, mappedProduct);
    }

    return mappedProducts;
  }

  static convertProduct(product: QProduct): Product {
    const productType: ProductType = Mapper.convertProductType(product.type);
    const productDuration: ProductDuration = Mapper.convertProductDuration(
      product.duration
    );
    const trialDuration: TrialDuration = Mapper.convertTrialDuration(
      product.trialDuration
    );

    let skProduct: SKProduct | null = null;
    let skuDetails: SkuDetails | null = null;
    let price: number | undefined;
    let currencyCode: string | undefined;

    if (product.storeProduct != null) {
      if (Platform.OS === "ios") {
        skProduct = Mapper.convertSKProduct(product.storeProduct as QSKProduct);
        price = parseFloat(skProduct.price);
        currencyCode = skProduct.currencyCode;
      } else {
        skuDetails = Mapper.convertSkuDetails(
          product.storeProduct as QSkuDetails
        );
        price = skuDetails.priceAmountMicros / 1000000;
        currencyCode = skuDetails.priceCurrencyCode;
      }
    }

    const mappedProduct = new Product(
      product.id,
      product.store_id,
      productType,
      productDuration,
      skuDetails,
      skProduct,
      product.prettyPrice,
      trialDuration,
      price,
      currencyCode
    );

    return mappedProduct;
  }

  static convertOfferings(offerings: QOfferings): Offerings | null {
    if (
      !Array.isArray(offerings.availableOfferings) ||
      offerings.availableOfferings.length === 0
    ) {
      return null;
    }

    let mainOffering: Offering | null = null;
    if (offerings.main) {
      mainOffering = this.convertOffering(offerings.main);
    }

    const availableOfferings: Array<Offering> = [];

    offerings.availableOfferings.forEach((offering) => {
      const mappedOffering = this.convertOffering(offering);

      availableOfferings.push(mappedOffering);
    });

    return new Offerings(mainOffering, availableOfferings);
  }

  static convertOffering(offering: QOffering): Offering {
    const products: Array<Product> = [];
    offering.products.forEach((product) => {
      const mappedProduct = this.convertProduct(product);

      products.push(mappedProduct);
    });

    let tag: OfferingTag | null = Mapper.convertOfferingTag(offering.tag);
    if (tag == null) {
      tag = OfferingTag.NONE;
    }

    return new Offering(offering.id, tag, products);
  }

  static convertSkuDetails(skuDetails: QSkuDetails): SkuDetails {
    return new SkuDetails(
      skuDetails.description,
      skuDetails.freeTrialPeriod,
      skuDetails.iconUrl,
      skuDetails.introductoryPrice,
      skuDetails.introductoryPriceAmountMicros,
      skuDetails.introductoryPriceCycles,
      skuDetails.introductoryPricePeriod,
      skuDetails.originalJson,
      skuDetails.originalPrice,
      skuDetails.originalPriceAmountMicros,
      skuDetails.price,
      skuDetails.priceAmountMicros,
      skuDetails.priceCurrencyCode,
      skuDetails.sku,
      skuDetails.subscriptionPeriod,
      skuDetails.title,
      skuDetails.type,
      skuDetails.hashCode,
      skuDetails.toString
    );
  }

  static convertSKProduct(skProduct: QSKProduct): SKProduct {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined;
    if (skProduct.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSubscriptionPeriod(
        skProduct.subscriptionPeriod
      );
    }

    let discount: SKProductDiscount | undefined;
    if (skProduct.introductoryPrice) {
      discount = this.convertProductDiscount(skProduct.introductoryPrice);
    }

    let discounts: SKProductDiscount[] | undefined;
    if (Array.isArray(skProduct.discounts) && skProduct.discounts.length) {
      discounts = this.convertDiscounts(skProduct.discounts);
    }

    return new SKProduct(
      skProduct.localizedDescription,
      skProduct.localizedTitle,
      skProduct.price,
      skProduct.localeIdentifier,
      skProduct.productIdentifier,
      !!skProduct.isDownloadable,
      skProduct.downloadContentVersion,
      skProduct.downloadContentLengths,
      subscriptionPeriod,
      discount,
      discounts,
      skProduct.subscriptionGroupIdentifier,
      skProduct.isFamilyShareable,
      skProduct.currencyCode
    );
  }

  static convertSubscriptionPeriod(
    subscriptionPeriod: QSubscriptionPeriod
  ): SKSubscriptionPeriod {
    return new SKSubscriptionPeriod(
      subscriptionPeriod.numberOfUnits,
      Mapper.convertSKPeriodUnit(subscriptionPeriod.unit)
    );
  }

  static convertProductDiscount(discount: QProductDiscount): SKProductDiscount {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined = undefined;
    if (discount.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSubscriptionPeriod(
        discount.subscriptionPeriod
      );
    }
    return new SKProductDiscount(
      discount.price,
      discount.localeIdentifier,
      discount.numberOfPeriods,
      subscriptionPeriod,
      Mapper.convertSKProductDiscountPaymentMode(discount.paymentMode),
      discount.identifier,
      Mapper.convertSKProductDiscountType(discount.type)
    );
  }

  static convertDiscounts(
    discounts: Array<QProductDiscount>
  ): SKProductDiscount[] {
    const mappedDiscounts: SKProductDiscount[] = discounts.map((discount) => {
      return this.convertProductDiscount(discount);
    });
    return mappedDiscounts;
  }

  static convertEligibility(
    eligibilityInfo: Array<{
      productId: string;
      status:
        | "non_intro_or_trial_product"
        | "intro_or_trial_eligible"
        | "intro_or_trial_ineligible";
    }>
  ): Map<string, IntroEligibility> {
    let mappedEligibility = new Map<string, IntroEligibility>();

    for (const info of eligibilityInfo) {
      const productId = info.productId;
      const status = Mapper.convertEligibilityStatus(info.status);

      const eligibilityInfo = new IntroEligibility(status);
      mappedEligibility.set(productId, eligibilityInfo);
    }

    return mappedEligibility;
  }

  static convertProductType(productType: number): ProductType {
    switch (productType) {
      case 0:
        return ProductType.TRIAL;
      case 1:
        return ProductType.DIRECT_SUBSCRIPTION;
      case 2:
      default:
        return ProductType.ONE_TIME;
    }
  }

  static convertProductDuration(productDuration: number): ProductDuration {
    switch (productDuration) {
      case 0:
        return ProductDuration.WEEKLY;
      case 1:
        return ProductDuration.MONTHLY;
      case 2:
        return ProductDuration["3_MONTHS"];
      case 3:
        return ProductDuration["6_MONTHS"];
      case 4:
        return ProductDuration.ANNUAL;
      case 5:
      default:
        return ProductDuration.LIFETIME;
    }
  }

  static convertTrialDuration(trialDuration: number): TrialDuration {
    switch (trialDuration) {
      case -1:
        return TrialDuration.NOT_AVAILABLE;
      case 1:
        return TrialDuration.THREE_DAYS;
      case 2:
        return TrialDuration.WEEK;
      case 3:
        return TrialDuration.TWO_WEEKS;
      case 4:
        return TrialDuration.MONTH;
      case 5:
        return TrialDuration.TWO_MONTHS;
      case 6:
        return TrialDuration.THREE_MONTHS;
      case 7:
        return TrialDuration.SIX_MONTHS;
      case 8:
        return TrialDuration.YEAR;
      case 9:
      default:
        return TrialDuration.OTHER;
    }
  }

  static convertOfferingTag(offeringTag: number): OfferingTag {
    switch (offeringTag) {
      case 0:
        return OfferingTag.NONE;
      case 1:
      default:
        return OfferingTag.MAIN;
    }
  }

  static convertSKPeriodUnit(skPeriodUnit: string): SKPeriodUnit {
    switch (skPeriodUnit) {
      case "0":
        return SKPeriodUnit.DAY;
      case "1":
        return SKPeriodUnit.WEEK;
      case "2":
        return SKPeriodUnit.MONTH;
      case "3":
      default:
        return SKPeriodUnit.YEAR;
    }
  }

  static convertSKProductDiscountPaymentMode(
    skProductDiscountPaymentMode: number
  ): SKProductDiscountPaymentMode {
    switch (skProductDiscountPaymentMode) {
      case 0:
        return SKProductDiscountPaymentMode.PAY_AS_YOU_GO;
      case 1:
        return SKProductDiscountPaymentMode.PAY_UP_FRONT;
      case 2:
      default:
        return SKProductDiscountPaymentMode.FREE_TRIAL;
    }
  }

  static convertSKProductDiscountType(
    skProductDisctountType: number
  ): SKProductDiscountType {
    switch (skProductDisctountType) {
      case 0:
        return SKProductDiscountType.INTRODUCTORY;
      case 1:
      default:
        return SKProductDiscountType.SUBSCRIPTION;
    }
  }

  static convertEligibilityStatus(status: string): IntroEligibilityStatus {
    switch (status) {
      case "non_intro_or_trial_product":
        return IntroEligibilityStatus.NON_INTRO_OR_TRIAL_PRODUCT;
      case "intro_or_trial_eligible":
        return IntroEligibilityStatus.ELIGIBLE;
      case "intro_or_trial_ineligible":
        return IntroEligibilityStatus.INELIGIBLE;
      default:
        return IntroEligibilityStatus.UNKNOWN;
    }
  }

  static convertExperimentInfo(
    experimentInfo: Array<{ id: string; group: { type: number } }>
  ): Map<string, ExperimentInfo> {
    const mappedExperimentInfo = new Map<string, ExperimentInfo>();

    for (const info of experimentInfo) {
      const groupType =
        info.group.type === 1
          ? ExperimentGroupType.GROUP_TYPE_B
          : ExperimentGroupType.GROUP_TYPE_A;
      const group = new ExperimentGroup(groupType);

      const experiment = new ExperimentInfo(info.id, group);
      mappedExperimentInfo.set(experiment.identifier, experiment);
    }

    return mappedExperimentInfo;
  }
}

export default Mapper;
