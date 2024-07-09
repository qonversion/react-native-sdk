import {
  AutomationsEventType,
  EntitlementGrantType,
  EntitlementRenewState,
  EntitlementSource,
  ExperimentGroupType,
  IntroEligibilityStatus,
  OfferingTag,
  PricingPhaseRecurrenceMode,
  PricingPhaseType,
  ProductType,
  QonversionErrorCode,
  RemoteConfigurationAssignmentType,
  RemoteConfigurationSourceType,
  SKPeriodUnit,
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
  SubscriptionPeriodUnit,
  TransactionEnvironment,
  TransactionOwnershipType,
  TransactionType,
  UserPropertyKey,
} from "../dto/enums";
import IntroEligibility from "../dto/IntroEligibility";
import Offering from "../dto/Offering";
import Offerings from "../dto/Offerings";
import Entitlement from "../dto/Entitlement";
import Product from "../dto/Product";
import SKProduct from "../dto/storeProducts/SKProduct";
import SKProductDiscount from "../dto/storeProducts/SKProductDiscount";
import SKSubscriptionPeriod from "../dto/storeProducts/SKSubscriptionPeriod";
import SkuDetails from "../dto/storeProducts/SkuDetails";
import ActionResult from "../dto/ActionResult";
import QonversionError from "../dto/QonversionError";
import AutomationsEvent from "../dto/AutomationsEvent";
import User from '../dto/User';
import {ScreenPresentationConfig} from '../dto/ScreenPresentationConfig';
import Experiment from "../dto/Experiment";
import ExperimentGroup from "../dto/ExperimentGroup";
import SubscriptionPeriod from "../dto/SubscriptionPeriod";
import RemoteConfig from "../dto/RemoteConfig";
import RemoteConfigList from '../dto/RemoteConfigList';
import UserProperties from '../dto/UserProperties';
import UserProperty from '../dto/UserProperty';
import RemoteConfigurationSource from "../dto/RemoteConfigurationSource";
import Transaction from "../dto/Transaction";
import ProductStoreDetails from "../dto/storeProducts/ProductStoreDetails";
import ProductOfferDetails from "../dto/storeProducts/ProductOfferDetails";
import ProductInAppDetails from "../dto/storeProducts/ProductInAppDetails";
import ProductPrice from "../dto/storeProducts/ProductPrice";
import ProductPricingPhase from "../dto/storeProducts/ProductPricingPhase";
import ProductInstallmentPlanDetails from '../dto/storeProducts/ProductInstallmentPlanDetails';

type QProduct = {
  id: string;
  storeId: string;
  basePlanId?: string | null;
  type: string;
  subscriptionPeriod?: QSubscriptionPeriod | null;
  trialPeriod?: QSubscriptionPeriod | null;
  skuDetails?: QSkuDetails | null; // android
  storeDetails?: QProductStoreDetails // android
  skProduct?: QSKProduct | null // iOS
  prettyPrice?: string | null;
  offeringId?: string | null;
};

type QProductStoreDetails = {
  basePlanId?: string | null,
  productId: string,
  name: string,
  title: string
  description: string,
  subscriptionOfferDetails?: QProductOfferDetails[] | null,
  defaultSubscriptionOfferDetails?: QProductOfferDetails | null,
  basePlanSubscriptionOfferDetails?: QProductOfferDetails | null,
  inAppOfferDetails?: QProductInAppDetails | null,
  hasTrialOffer: boolean,
  hasIntroOffer: boolean,
  hasTrialOrIntroOffer: boolean,
  productType: string,
  isInApp: boolean,
  isSubscription: boolean,
  isPrepaid: boolean,
  isInstallment: boolean,
}

type QSubscriptionPeriod = {
  unitCount: number,
  unit: string,
  iso: string,
}

type QProductPricingPhase = {
  price: QProductPrice,
  billingPeriod: QSubscriptionPeriod,
  billingCycleCount: number,
  recurrenceMode: string,
  type: string
  isTrial: boolean,
  isIntro: boolean,
  isBasePlan: boolean,
}

type QProductInstallmentPlanDetails = {
  commitmentPaymentsCount: number;
  subsequentCommitmentPaymentsCount: number;
}

type QProductOfferDetails = {
  basePlanId: string,
  offerId?: string | null,
  offerToken: string,
  tags: string[],
  pricingPhases: QProductPricingPhase[],
  basePlan?: QProductPricingPhase | null,
  installmentPlanDetails?: QProductInstallmentPlanDetails | null,
  trialPhase?: QProductPricingPhase | null,
  introPhase: QProductPricingPhase | null,
  hasTrial: boolean,
  hasIntro: boolean,
  hasTrialOrIntro: boolean,
}

type QProductPrice = {
  priceAmountMicros: number,
  priceCurrencyCode: string,
  formattedPrice: string,
  isFree: boolean,
  currencySymbol: string,
}

type QProductInAppDetails = {
  price: QProductPrice,
}

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
  subscriptionPeriod: null | QSKSubscriptionPeriod;
  introductoryPrice: QProductDiscount | null;
  discounts: Array<QProductDiscount> | null;
  localizedDescription: string | undefined;
  localizedTitle: string | undefined;
  price: string;
  priceLocale: QLocale;
  productIdentifier: string | undefined;
  isDownloadable: boolean | undefined;
  downloadContentVersion: string | undefined;
  downloadContentLengths: number[] | undefined;
  productDiscount: SKProductDiscount | undefined;
  subscriptionGroupIdentifier: string | undefined;
  isFamilyShareable: boolean | undefined;
};

type QSKSubscriptionPeriod = {
  numberOfUnits: number;
  unit: keyof typeof SKPeriodUnit;
};

type QProductDiscount = {
  subscriptionPeriod: null | QSKSubscriptionPeriod;
  price: string;
  numberOfPeriods: number;
  paymentMode: keyof typeof SKProductDiscountPaymentMode;
  identifier?: string;
  type: keyof typeof SKProductDiscountType;
  priceLocale: QLocale;
};

type QLocale = {
  currencySymbol: string | null;
  currencyCode: string | null;
  localeIdentifier: string;
};

export type QEntitlement = {
  id: string;
  productId: string;
  active: boolean;
  renewState: string;
  source: string;
  startedTimestamp: number;
  expirationTimestamp: number;
  renewsCount: number;
  trialStartTimestamp: number;
  firstPurchaseTimestamp: number;
  lastPurchaseTimestamp: number;
  lastActivatedOfferCode: string;
  grantType: string;
  autoRenewDisableTimestamp: number;
  transactions?: Array<QTransaction>;
};

type QTransaction = {
  originalTransactionId: string;
  transactionId: string;
  offerCode: string;
  transactionTimestamp: number;
  expirationTimestamp: number;
  transactionRevocationTimestamp: number;
  environment: string;
  ownershipType: string;
  type: string;
}

type QOfferings = {
  availableOfferings?: Array<QOffering>;
  main: QOffering;
};

type QOffering = {
  id: string;
  tag: keyof typeof OfferingTag;
  products: Array<QProduct>;
};

type QAutomationsEvent = {
  type: AutomationsEventType;
  timestamp: number;
};

type QUser = {
  qonversionId: string;
  identityId?: string | null;
};

type QRemoteConfig = {
  payload: Map<string, Object>;
  experiment?: QExperiment | null;
  source: QRemoteConfigurationSource;
};

type QRemoteConfigList = {
  remoteConfigs: Array<QRemoteConfig>;
}

type QRemoteConfigurationSource = {
  id: string;
  name: string;
  type: string;
  assignmentType: string;
  contextKey: string | null | undefined;
};

type QExperiment = {
  id: string;
  name: string;
  group: QExperimentGroup;
}

type QExperimentGroup = {
  id: string;
  name: string;
  type: string;
}

type QUserProperty = {
  key: string;
  value: string;
};

type QUserProperties = {
  properties: QUserProperty[];
};

const priceMicrosRatio = 1000000;

class Mapper {
  static convertEntitlements(
    entitlements: Record<string, QEntitlement> | null | undefined
  ): Map<string, Entitlement> {
    let mappedPermissions = new Map();

    if (!entitlements) {
      return mappedPermissions;
    }
    for (const [key, entitlement] of Object.entries(entitlements)) {
      let renewState: EntitlementRenewState;
      switch (entitlement.renewState) {
        case EntitlementRenewState.NON_RENEWABLE:
          renewState = EntitlementRenewState.NON_RENEWABLE;
          break;
        case EntitlementRenewState.WILL_RENEW:
          renewState = EntitlementRenewState.WILL_RENEW;
          break;
        case EntitlementRenewState.CANCELED:
          renewState = EntitlementRenewState.CANCELED;
          break;
        case EntitlementRenewState.BILLING_ISSUE:
          renewState = EntitlementRenewState.BILLING_ISSUE;
          break;
        default:
          renewState = EntitlementRenewState.UNKNOWN;
          break;
      }

      const entitlementSource = this.convertEntitlementSource(entitlement.source);
      const entitlementGrantType = this.convertEntitlementGrantType(entitlement.grantType);
      const transactions: Array<Transaction> = [];

      if (Array.isArray(entitlement.transactions)) {
        entitlement.transactions.forEach((transaction) => {
          const mappedTransaction = this.convertTransaction(transaction);

          transactions.push(mappedTransaction);
        });
      }

      const mappedPermission = new Entitlement(
          entitlement.id,
          entitlement.productId,
          entitlement.active,
          renewState,
          entitlementSource,
          entitlement.startedTimestamp,
          entitlement.renewsCount,
          entitlementGrantType,
          transactions,
          entitlement.expirationTimestamp,
          entitlement.trialStartTimestamp,
          entitlement.firstPurchaseTimestamp,
          entitlement.lastPurchaseTimestamp,
          entitlement.autoRenewDisableTimestamp,
          entitlement.lastActivatedOfferCode,
      );
      mappedPermissions.set(key, mappedPermission);
    }

    return mappedPermissions;
  }

  static convertTransaction(transaction: QTransaction): Transaction {
    const environment = this.convertTransactionEnvironment(transaction.environment);
    const ownershipType = this.convertTransactionOwnershipType(transaction.ownershipType);
    const type = this.convertTransactionType(transaction.type);

    return new Transaction(
        transaction.originalTransactionId,
        transaction.transactionId,
        transaction.transactionTimestamp,
        environment,
        ownershipType,
        type,
        transaction.expirationTimestamp,
        transaction.transactionRevocationTimestamp,
        transaction.offerCode,
    );
  }

  static convertTransactionType(typeKey: string): TransactionType {
    switch (typeKey) {
      case "SubscriptionStarted":
        return TransactionType.SUBSCRIPTION_STARTED;
      case "SubscriptionRenewed":
        return TransactionType.SUBSCRIPTION_RENEWED;
      case "TrialStarted":
        return TransactionType.TRIAL_STARTED;
      case "IntroStarted":
        return TransactionType.INTRO_STARTED;
      case "IntroRenewed":
        return TransactionType.INTRO_RENEWED;
      case "NonConsumablePurchase":
        return TransactionType.NON_CONSUMABLE_PURCHASE;
    }

    return TransactionType.UNKNOWN;
  }

  static convertTransactionOwnershipType(ownershipTypeKey: string): TransactionOwnershipType {
    switch (ownershipTypeKey) {
      case "Owner":
        return TransactionOwnershipType.OWNER;
      case "FamilySharing":
        return TransactionOwnershipType.FAMILY_SHARING;
    }

    return TransactionOwnershipType.OWNER;
  }

  static convertTransactionEnvironment(envKey: string): TransactionEnvironment {
    switch (envKey) {
      case "Production":
        return TransactionEnvironment.PRODUCTION;
      case "Sandbox":
        return TransactionEnvironment.SANDBOX;
    }

    return TransactionEnvironment.PRODUCTION;
  }

  static convertEntitlementSource(sourceKey: string): EntitlementSource {
    switch (sourceKey) {
      case "Unknown":
        return EntitlementSource.UNKNOWN;
      case "AppStore":
        return EntitlementSource.APP_STORE;
      case "PlayStore":
        return EntitlementSource.PLAY_STORE;
      case "Stripe":
        return EntitlementSource.STRIPE;
      case "Manual":
        return EntitlementSource.MANUAL;
    }

    return EntitlementSource.UNKNOWN;
  }

  static convertEntitlementGrantType(typeKey: string): EntitlementGrantType {
    switch (typeKey) {
      case "Purchase":
        return EntitlementGrantType.PURCHASE;
      case "FamilySharing":
        return EntitlementGrantType.FAMILY_SHARING;
      case "OfferCode":
        return EntitlementGrantType.OFFER_CODE;
      case "Manual":
        return EntitlementGrantType.MANUAL;
    }

    return EntitlementGrantType.PURCHASE;
  }

  static convertDefinedUserPropertyKey(sourceKey: string): UserPropertyKey {
    switch (sourceKey) {
      case '_q_email':
        return UserPropertyKey.EMAIL;
      case '_q_name':
        return UserPropertyKey.NAME;
      case '_q_kochava_device_id':
        return UserPropertyKey.KOCHAVA_DEVICE_ID;
      case '_q_appsflyer_user_id':
        return UserPropertyKey.APPS_FLYER_USER_ID;
      case '_q_adjust_adid':
        return UserPropertyKey.ADJUST_AD_ID;
      case '_q_custom_user_id':
        return UserPropertyKey.CUSTOM_USER_ID;
      case '_q_fb_attribution':
        return UserPropertyKey.FACEBOOK_ATTRIBUTION;
      case '_q_firebase_instance_id':
        return UserPropertyKey.FIREBASE_APP_INSTANCE_ID;
      case '_q_app_set_id':
        return UserPropertyKey.APP_SET_ID;
      case '_q_advertising_id':
        return UserPropertyKey.ADVERTISING_ID;
      case "_q_appmetrica_device_id":
        return UserPropertyKey.APP_METRICA_DEVICE_ID;
      case "_q_appmetrica_user_profile_id":
        return UserPropertyKey.APP_METRICA_USER_PROFILE_ID;
      case "_q_pushwoosh_hwid":
        return UserPropertyKey.PUSH_WOOSH_HW_ID;
      case "_q_pushwoosh_user_id":
        return UserPropertyKey.PUSH_WOOSH_USER_ID;
    }

    return UserPropertyKey.CUSTOM;
  }

  static convertUserProperties(properties: QUserProperties): UserProperties {
    const mappedProperties = properties.properties.map(propertyData =>
      new UserProperty(propertyData.key, propertyData.value));

    return new UserProperties(mappedProperties);
  }

  static convertProducts(products: Record<string, QProduct> | null | undefined): Map<string, Product> {
    let mappedProducts = new Map();

    if (!products) {
      return mappedProducts;
    }

    for (const [key, product] of Object.entries(products)) {
      const mappedProduct = this.convertProduct(product);
      mappedProducts.set(key, mappedProduct);
    }

    return mappedProducts;
  }

  static convertProduct(product: QProduct): Product {
    const productType = Mapper.convertProductType(product.type);
    const subscriptionPeriod: SubscriptionPeriod | null = Mapper.convertSubscriptionPeriod(product.subscriptionPeriod);
    const trialPeriod: SubscriptionPeriod | null = Mapper.convertSubscriptionPeriod(product.trialPeriod);
    const offeringId: string | null = product.offeringId ?? null;

    let skProduct: SKProduct | null = null;
    let skuDetails: SkuDetails | null = null;
    let storeDetails: ProductStoreDetails | null = null;
    let price: number | undefined;
    let currencyCode: string | undefined;
    let storeTitle: string | undefined;
    let storeDescription: string | undefined;
    let prettyIntroductoryPrice: string | undefined;

    if (!!product.skProduct) {
      skProduct = Mapper.convertSKProduct(product.skProduct as QSKProduct);
      price = parseFloat(skProduct.price);
      currencyCode = skProduct.currencyCode;
      storeTitle = skProduct.localizedTitle;
      storeDescription = skProduct.localizedDescription;

      if (skProduct.productDiscount) {
        prettyIntroductoryPrice = skProduct.productDiscount.currencySymbol + skProduct.productDiscount.price;
      }
    } else {
      let priceMicros = null
      if (!!product.skuDetails) {
        skuDetails = Mapper.convertSkuDetails(product.skuDetails as QSkuDetails);
        storeTitle = skuDetails.title;
        storeDescription = skuDetails.description;

        priceMicros = skuDetails.priceAmountMicros;
        currencyCode = skuDetails.priceCurrencyCode;
        if (skuDetails.introductoryPrice.length > 0) {
          prettyIntroductoryPrice = skuDetails.introductoryPrice;
        }
      }

      if (!!product.storeDetails) {
        storeDetails = Mapper.convertProductStoreDetails(product.storeDetails);
        storeTitle = storeDetails.title;
        storeDescription = storeDetails.description;

        const defaultOffer = storeDetails.defaultSubscriptionOfferDetails;
        const inAppOffer = storeDetails.inAppOfferDetails;
        if (defaultOffer) {
          priceMicros = defaultOffer.basePlan?.price?.priceAmountMicros;
          currencyCode = defaultOffer.basePlan?.price?.priceCurrencyCode;
          prettyIntroductoryPrice = defaultOffer.introPhase?.price?.formattedPrice;
        } else if (inAppOffer) {
          priceMicros = inAppOffer.price.priceAmountMicros;
          currencyCode = inAppOffer.price.priceCurrencyCode;
          prettyIntroductoryPrice = undefined;
        }
      }

      price = priceMicros ? priceMicros / priceMicrosRatio : undefined;
    }

    const mappedProduct = new Product(
      product.id,
      product.storeId,
      product.basePlanId ?? null,
      skuDetails,
      storeDetails,
      skProduct,
      offeringId,
      subscriptionPeriod,
      trialPeriod,
      productType,
      product.prettyPrice ?? null,
      price,
      currencyCode,
      storeTitle,
      storeDescription,
      prettyIntroductoryPrice,
    );

    return mappedProduct;
  }

  static convertOfferings(offerings: QOfferings | null | undefined): Offerings | null {
    if (!offerings) {
      return null;
    }

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

    const tag = OfferingTag[offering.tag] ?? OfferingTag['0'];

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

  static convertProductType(productType: string): ProductType {
    let type = ProductType.UNKNOWN
    switch (productType) {
      case ProductType.TRIAL:
        type = ProductType.TRIAL;
        break;
      case ProductType.INTRO:
        type = ProductType.INTRO;
        break;
      case ProductType.SUBSCRIPTION:
        type = ProductType.SUBSCRIPTION;
        break;
      case ProductType.IN_APP:
        type = ProductType.IN_APP;
        break;
    }

    return type;
  }

  static convertSubscriptionPeriod(productPeriod: QSubscriptionPeriod | null | undefined): SubscriptionPeriod | null {
    if (!productPeriod) {
      return null;
    }

    const unit = Mapper.convertSubscriptionPeriodUnit(productPeriod.unit);

    return new SubscriptionPeriod(
      productPeriod.unitCount,
      unit,
      productPeriod.iso,
    )
  }

  static convertSubscriptionPeriodUnit(unit: string): SubscriptionPeriodUnit {
    let result: SubscriptionPeriodUnit = SubscriptionPeriodUnit.UNKNOWN;
    switch (unit) {
      case SubscriptionPeriodUnit.DAY:
        result = SubscriptionPeriodUnit.DAY;
        break;
      case SubscriptionPeriodUnit.WEEK:
        result = SubscriptionPeriodUnit.WEEK;
        break;
      case SubscriptionPeriodUnit.MONTH:
        result = SubscriptionPeriodUnit.MONTH;
        break;
      case SubscriptionPeriodUnit.YEAR:
        result = SubscriptionPeriodUnit.YEAR;
        break;
    }

    return result;
  }

  static convertProductPricingPhase(pricingPhase: QProductPricingPhase | null | undefined): ProductPricingPhase | null {
    if (!pricingPhase) {
      return null;
    }

    const price: ProductPrice = Mapper.convertProductPrice(pricingPhase.price);
    const billingPeriod = Mapper.convertSubscriptionPeriod(pricingPhase.billingPeriod)!!;
    const recurrenceMode = Mapper.convertPrisingPhaseRecurrenceMode(pricingPhase.recurrenceMode);
    const type = Mapper.convertPrisingPhaseType(pricingPhase.type);

    return new ProductPricingPhase(
      price,
      billingPeriod,
      pricingPhase.billingCycleCount,
      recurrenceMode,
      type,
      pricingPhase.isTrial,
      pricingPhase.isIntro,
      pricingPhase.isBasePlan,
    );
  }

  static convertPrisingPhaseRecurrenceMode(recurrenceMode: string): PricingPhaseRecurrenceMode {
    let mode: PricingPhaseRecurrenceMode = PricingPhaseRecurrenceMode.UNKNOWN;
    switch (recurrenceMode) {
      case PricingPhaseRecurrenceMode.INFINITE_RECURRING:
        mode = PricingPhaseRecurrenceMode.INFINITE_RECURRING;
        break;
      case PricingPhaseRecurrenceMode.FINITE_RECURRING:
        mode = PricingPhaseRecurrenceMode.FINITE_RECURRING;
        break;
      case PricingPhaseRecurrenceMode.NON_RECURRING:
        mode = PricingPhaseRecurrenceMode.NON_RECURRING;
        break;
    }

    return mode;
  }

  static convertPrisingPhaseType(type: string): PricingPhaseType {
    let result: PricingPhaseType = PricingPhaseType.UNKNOWN
    switch (type) {
      case PricingPhaseType.REGULAR:
        result = PricingPhaseType.REGULAR;
        break;
      case PricingPhaseType.FREE_TRIAL:
        result = PricingPhaseType.FREE_TRIAL;
        break;
      case PricingPhaseType.DISCOUNTED_SINGLE_PAYMENT:
        result = PricingPhaseType.DISCOUNTED_SINGLE_PAYMENT;
        break;
      case PricingPhaseType.DISCOUNTED_RECURRING_PAYMENT:
        result = PricingPhaseType.DISCOUNTED_RECURRING_PAYMENT;
        break;
    }

    return result;
  }

  static convertProductInstallmentPlanDetails(installmentPlanDetails: QProductInstallmentPlanDetails | null | undefined): ProductInstallmentPlanDetails | null {
    if (!installmentPlanDetails) {
      return null;
    }

    return new ProductInstallmentPlanDetails(
      installmentPlanDetails.commitmentPaymentsCount,
      installmentPlanDetails.subsequentCommitmentPaymentsCount,
    );
  }

  static convertProductOfferDetails(offerDetails: QProductOfferDetails): ProductOfferDetails {
    let basePlan = Mapper.convertProductPricingPhase(offerDetails.basePlan);
    let trialPhase = Mapper.convertProductPricingPhase(offerDetails.trialPhase);
    let introPhase = Mapper.convertProductPricingPhase(offerDetails.introPhase);

    let installmentPlanDetails = Mapper.convertProductInstallmentPlanDetails(offerDetails.installmentPlanDetails);

    let pricingPhases = offerDetails.pricingPhases.map(
      pricingPhase => Mapper.convertProductPricingPhase(pricingPhase)
    ).filter(Boolean) as ProductPricingPhase[];

    return new ProductOfferDetails(
      offerDetails.basePlanId,
      offerDetails.offerId ?? null,
      offerDetails.offerToken,
      offerDetails.tags,
      pricingPhases,
      basePlan,
      installmentPlanDetails,
      introPhase,
      trialPhase,
      offerDetails.hasTrial,
      offerDetails.hasIntro,
      offerDetails.hasTrialOrIntro,
    );
  }

  static convertInAppOfferDetails(inAppOfferDetails: QProductInAppDetails): ProductInAppDetails {
    let productPrice: ProductPrice = this.convertProductPrice(inAppOfferDetails.price);

    return new ProductInAppDetails(productPrice);
  }

  static convertProductPrice(productPrice: QProductPrice): ProductPrice {
    return new ProductPrice(
      productPrice.priceAmountMicros,
      productPrice.priceCurrencyCode,
      productPrice.formattedPrice,
      productPrice.isFree,
      productPrice.currencySymbol,
    )
  }

  static convertProductStoreDetails(productStoreDetails: QProductStoreDetails): ProductStoreDetails {
    let defaultSubscriptionOfferDetails: ProductOfferDetails | null = null;
    if (productStoreDetails.defaultSubscriptionOfferDetails != null) {
      defaultSubscriptionOfferDetails = this.convertProductOfferDetails(
        productStoreDetails.defaultSubscriptionOfferDetails
      );
    }

    let basePlanSubscriptionOfferDetails: ProductOfferDetails | null = null;
    if (productStoreDetails.basePlanSubscriptionOfferDetails != null) {
      basePlanSubscriptionOfferDetails = this.convertProductOfferDetails(
        productStoreDetails.basePlanSubscriptionOfferDetails
      );
    }

    let inAppOfferDetails: ProductInAppDetails | null = null;
    if (productStoreDetails.inAppOfferDetails != null) {
      inAppOfferDetails = this.convertInAppOfferDetails(productStoreDetails.inAppOfferDetails);
    }

    let subscriptionOfferDetails: ProductOfferDetails[] | null = null;
    if (productStoreDetails.subscriptionOfferDetails != null) {
      subscriptionOfferDetails = productStoreDetails.subscriptionOfferDetails.map(
        defaultOfferDetail => this.convertProductOfferDetails(defaultOfferDetail));
    }

    const productType: ProductType = Mapper.convertProductType(productStoreDetails.productType);

    return new ProductStoreDetails(
      productStoreDetails.basePlanId ?? null,
      productStoreDetails.productId,
      productStoreDetails.name,
      productStoreDetails.title,
      productStoreDetails.description,
      subscriptionOfferDetails,
      defaultSubscriptionOfferDetails,
      basePlanSubscriptionOfferDetails,
      inAppOfferDetails,
      productStoreDetails.hasTrialOffer,
      productStoreDetails.hasIntroOffer,
      productStoreDetails.hasTrialOrIntroOffer,
      productType,
      productStoreDetails.isInApp,
      productStoreDetails.isSubscription,
      productStoreDetails.isPrepaid,
      productStoreDetails.isInstallment,
    );
  }

  static convertSKProduct(skProduct: QSKProduct): SKProduct {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined;
    if (skProduct.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSKSubscriptionPeriod(
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
      skProduct.priceLocale.localeIdentifier,
      skProduct.productIdentifier,
      !!skProduct.isDownloadable,
      skProduct.downloadContentVersion,
      skProduct.downloadContentLengths,
      subscriptionPeriod,
      discount,
      discounts,
      skProduct.subscriptionGroupIdentifier,
      skProduct.isFamilyShareable,
      skProduct.priceLocale.currencyCode ?? ""
    );
  }

  static convertSKSubscriptionPeriod(
    subscriptionPeriod: QSKSubscriptionPeriod
  ): SKSubscriptionPeriod {
    return new SKSubscriptionPeriod(
      subscriptionPeriod.numberOfUnits,
      SKPeriodUnit[subscriptionPeriod.unit]
    );
  }

  static convertProductDiscount(discount: QProductDiscount): SKProductDiscount {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined = undefined;
    if (discount.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSKSubscriptionPeriod(
        discount.subscriptionPeriod
      );
    }
    return new SKProductDiscount(
      discount.price,
      discount.priceLocale.localeIdentifier,
      discount.numberOfPeriods,
      subscriptionPeriod,
      SKProductDiscountPaymentMode[discount.paymentMode],
      discount.identifier,
      SKProductDiscountType[discount.type],
      discount.priceLocale.currencySymbol ?? ""
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
    eligibilityMap: Record<string, {
      status:
        | "non_intro_or_trial_product"
        | "intro_or_trial_eligible"
        | "intro_or_trial_ineligible";
    }> | null | undefined
  ): Map<string, IntroEligibility> {
    let mappedEligibility = new Map<string, IntroEligibility>();

    if (!eligibilityMap) {
      return mappedEligibility;
    }

    for (const [key, value] of Object.entries(eligibilityMap)) {
      const status = Mapper.convertEligibilityStatus(value.status);

      const eligibilityInfo = new IntroEligibility(status);
      mappedEligibility.set(key, eligibilityInfo);
    }

    return mappedEligibility;
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

  static convertActionResult(
    payload: Record<string, any>
  ): ActionResult {
    return new ActionResult(
      payload["type"],
      payload["value"],
      this.convertQonversionError(payload["error"])
    );
  }

  static convertQonversionError(
    payload: Record<string, string> | undefined
  ): QonversionError | undefined {
    if (!payload) return undefined;

    const code = this.convertErrorCode(payload["code"]);
    return new QonversionError(
      code,
      payload["description"],
      payload["additionalMessage"],
      payload["domain"],
    );
  }

  static convertAutomationsEvent(
    automationsEvent: QAutomationsEvent
  ): AutomationsEvent {
    return new AutomationsEvent(
      automationsEvent.type,
      automationsEvent.timestamp
    );
  }

  static convertUserInfo(user: QUser): User {
    return new User(user.qonversionId, user.identityId);
  }

  static convertRemoteConfig(remoteConfig: QRemoteConfig): RemoteConfig {
    let experiment = null;
    if (remoteConfig.experiment) {
      const groupType = this.convertGroupType(remoteConfig.experiment.group.type);
      const group = new ExperimentGroup(remoteConfig.experiment.group.id, remoteConfig.experiment.group.name, groupType);
      experiment = new Experiment(remoteConfig.experiment.id, remoteConfig.experiment.name, group);
    }

    const sourceType = this.convertRemoteConfigurationSourceType(remoteConfig.source.type);
    const assignmentType = this.convertRemoteConfigurationAssignmentType(remoteConfig.source.assignmentType);

    const source = new RemoteConfigurationSource(
      remoteConfig.source.id,
      remoteConfig.source.name,
      sourceType,
      assignmentType,
      remoteConfig.source.contextKey ?? null,
    )

    return new RemoteConfig(remoteConfig.payload, experiment, source);
  }

  static convertRemoteConfigList(remoteConfigList: QRemoteConfigList): RemoteConfigList {
    const remoteConfigs = remoteConfigList.remoteConfigs.map(config => this.convertRemoteConfig(config));
    return new RemoteConfigList(remoteConfigs);
  }

  static convertRemoteConfigurationSourceType(type: String): RemoteConfigurationSourceType {
    switch (type) {
      case "experiment_control_group":
        return RemoteConfigurationSourceType.EXPERIMENT_CONTROL_GROUP;
      case "experiment_treatment_group":
        return RemoteConfigurationSourceType.EXPERIMENT_TREATMENT_GROUP;
      case "remote_configuration":
        return RemoteConfigurationSourceType.REMOTE_CONFIGURATION;
      default:
        return RemoteConfigurationSourceType.UNKNOWN;
    }
  }

  static convertRemoteConfigurationAssignmentType(type: String): RemoteConfigurationAssignmentType {
    switch (type) {
      case "auto":
        return RemoteConfigurationAssignmentType.AUTO;
      case "manual":
        return RemoteConfigurationAssignmentType.MANUAL;
      default:
        return RemoteConfigurationAssignmentType.UNKNOWN;
    }
  }

  static convertGroupType(type: String): ExperimentGroupType {
    switch (type) {
      case "control":
        return ExperimentGroupType.CONTROL;
      case "treatment":
        return ExperimentGroupType.TREATMENT;
      default:
        return ExperimentGroupType.UNKNOWN;
    }
  }

  static convertScreenPresentationConfig(config: ScreenPresentationConfig): Object {
    return {
      presentationStyle: config.presentationStyle,
      animated: config.animated ? '1' : '0',
    };
  }

  static convertErrorCode(code: string): QonversionErrorCode {
    switch (code) {
      case QonversionErrorCode.UNKNOWN: return QonversionErrorCode.UNKNOWN;
      case QonversionErrorCode.API_RATE_LIMIT_EXCEEDED: return QonversionErrorCode.API_RATE_LIMIT_EXCEEDED;
      case QonversionErrorCode.APPLE_STORE_ERROR: return QonversionErrorCode.APPLE_STORE_ERROR;
      case QonversionErrorCode.BACKEND_ERROR: return QonversionErrorCode.BACKEND_ERROR;
      case QonversionErrorCode.BILLING_UNAVAILABLE: return QonversionErrorCode.BILLING_UNAVAILABLE;
      case QonversionErrorCode.CLIENT_INVALID: return QonversionErrorCode.CLIENT_INVALID;
      case QonversionErrorCode.CLOUD_SERVICE_NETWORK_CONNECTION_FAILED: return QonversionErrorCode.CLOUD_SERVICE_NETWORK_CONNECTION_FAILED;
      case QonversionErrorCode.CLOUD_SERVICE_PERMISSION_DENIED: return QonversionErrorCode.CLOUD_SERVICE_PERMISSION_DENIED;
      case QonversionErrorCode.CLOUD_SERVICE_REVOKED: return QonversionErrorCode.CLOUD_SERVICE_REVOKED;
      case QonversionErrorCode.FAILED_TO_RECEIVE_DATA: return QonversionErrorCode.FAILED_TO_RECEIVE_DATA;
      case QonversionErrorCode.FEATURE_NOT_SUPPORTED: return QonversionErrorCode.FEATURE_NOT_SUPPORTED;
      case QonversionErrorCode.FRAUD_PURCHASE: return QonversionErrorCode.FRAUD_PURCHASE;
      case QonversionErrorCode.INCORRECT_REQUEST: return QonversionErrorCode.INCORRECT_REQUEST;
      case QonversionErrorCode.INTERNAL_ERROR: return QonversionErrorCode.INTERNAL_ERROR;
      case QonversionErrorCode.INVALID_CLIENT_UID: return QonversionErrorCode.INVALID_CLIENT_UID;
      case QonversionErrorCode.INVALID_CREDENTIALS: return QonversionErrorCode.INVALID_CREDENTIALS;
      case QonversionErrorCode.INVALID_STORE_CREDENTIALS: return QonversionErrorCode.INVALID_STORE_CREDENTIALS;
      case QonversionErrorCode.LAUNCH_ERROR: return QonversionErrorCode.LAUNCH_ERROR;
      case QonversionErrorCode.NETWORK_CONNECTION_FAILED: return QonversionErrorCode.NETWORK_CONNECTION_FAILED;
      case QonversionErrorCode.OFFERINGS_NOT_FOUND: return QonversionErrorCode.OFFERINGS_NOT_FOUND;
      case QonversionErrorCode.PAYMENT_INVALID: return QonversionErrorCode.PAYMENT_INVALID;
      case QonversionErrorCode.PAYMENT_NOT_ALLOWED: return QonversionErrorCode.PAYMENT_NOT_ALLOWED;
      case QonversionErrorCode.PLAY_STORE_ERROR: return QonversionErrorCode.PLAY_STORE_ERROR;
      case QonversionErrorCode.PRIVACY_ACKNOWLEDGEMENT_REQUIRED: return QonversionErrorCode.PRIVACY_ACKNOWLEDGEMENT_REQUIRED;
      case QonversionErrorCode.PRODUCT_ALREADY_OWNED: return QonversionErrorCode.PRODUCT_ALREADY_OWNED;
      case QonversionErrorCode.PRODUCT_NOT_FOUND: return QonversionErrorCode.PRODUCT_NOT_FOUND;
      case QonversionErrorCode.PRODUCT_NOT_OWNED: return QonversionErrorCode.PRODUCT_NOT_OWNED;
      case QonversionErrorCode.PROJECT_CONFIG_ERROR: return QonversionErrorCode.PROJECT_CONFIG_ERROR;
      case QonversionErrorCode.PURCHASE_CANCELED: return QonversionErrorCode.PURCHASE_CANCELED;
      case QonversionErrorCode.PURCHASE_INVALID: return QonversionErrorCode.PURCHASE_INVALID;
      case QonversionErrorCode.PURCHASE_PENDING: return QonversionErrorCode.PURCHASE_PENDING;
      case QonversionErrorCode.PURCHASE_UNSPECIFIED: return QonversionErrorCode.PURCHASE_UNSPECIFIED;
      case QonversionErrorCode.RECEIPT_VALIDATION_ERROR: return QonversionErrorCode.RECEIPT_VALIDATION_ERROR;
      case QonversionErrorCode.REMOTE_CONFIGURATION_NOT_AVAILABLE: return QonversionErrorCode.REMOTE_CONFIGURATION_NOT_AVAILABLE;
      case QonversionErrorCode.RESPONSE_PARSING_FAILED: return QonversionErrorCode.RESPONSE_PARSING_FAILED;
      case QonversionErrorCode.STORE_PRODUCT_NOT_AVAILABLE: return QonversionErrorCode.STORE_PRODUCT_NOT_AVAILABLE;
      case QonversionErrorCode.UNAUTHORIZED_REQUEST_DATA: return QonversionErrorCode.UNAUTHORIZED_REQUEST_DATA;
      case QonversionErrorCode.UNKNOWN_CLIENT_PLATFORM: return QonversionErrorCode.UNKNOWN_CLIENT_PLATFORM;
    }

    return QonversionErrorCode.UNKNOWN;
  }
}

export default Mapper;
