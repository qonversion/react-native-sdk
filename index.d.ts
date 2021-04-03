// Entities

export enum ProductType {
  TRIAL = "TRIAL",
  DIRECT_SUBSCRIPTION = "DIRECT_SUBSCRIPTION",
  ONE_TIME = "ONE_TIME"
}

export enum ProductDuration {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  THREE_MONTHS = "3_MONTHS",
  SIX_MONTHS = "6_MONTHS",
  ANNUAL = "ANNUAL",
  LIFETIME = "LIFETIME"
}

export enum TrialDuration {
  NOT_AVAILABLE = "NOT_AVAILABLE",
  THREE_DAYS = "THREE_DAYS",
  WEEK = "WEEK",
  TWO_WEEKS = "TWO_WEEKS",
  MONTH = "MONTH",
  TWO_MONTHS = "TWO_MONTHS",
  THREE_MONTHS = "THREE_MONTHS",
  SIX_MONTHS = "SIX_MONTHS",
  YEAR = "YEAR",
  OTHER = "OTHER"
}

export enum RenewState {
  NON_RENEWABLE = "NON_RENEWABLE",
  UNKNOWN = "UNKNOWN",
  WILL_RENEW = "WILL_RENEW",
  CANCELED = "CANCELED",
  BILLING_ISSUE = "BILLING_ISSUE"
}

export enum Property {
  EMAIL,
  NAME,
  APPS_FLYER_USER_ID,
  ADJUST_USER_ID,
  KOCHAVA_DEVICE_ID,
  CUSTOM_USER_ID,
  FACEBOOK_ATTRIBUTION
}

export enum Provider {
  APPSFLYER,
  BRANCH,
  ADJUST,
  APPLE
}

export enum ProrationMode {
  UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY,
  IMMEDIATE_WITH_TIME_PRORATION,
  IMMEDIATE_AND_CHARGE_PRORATED_PRICE,
  IMMEDIATE_WITHOUT_PRORATION,
  DEFERRED
}

export enum SKPeriodUnit {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR"
}

export enum SKProductDiscountType {
  INTRODUCTORY = "INTRODUCTORY",
  SUBSCRIPTION = "SUBSCRIPTION"
}

export enum SKProductDiscountPaymentMode {
  PAY_AS_YOU_GO = "PAY_AS_YOU_GO",
  PAY_UP_FRONT = "PAY_UP_FRONT",
  FREE_TRIAL = "FREE_TRIAL"
}

export enum OfferingTag {
  NONE = "NONE",
  MAIN = "MAIN"
}

export enum IntroEligibilityStatus {
  UNKNOWN = "unknown",
  NON_INTRO_OR_TRIAL_PRODUCT = "non_intro_or_trial_product",
  ELIGIBLE = "intro_or_trial_eligible",
  INELIGIBLE = "intro_or_trial_ineligible"
}

export enum ExperimentGroupType {
  GROUP_TYPE_A,
  GROUP_TYPE_B
}

export interface LaunchResult {
  uid: string
  timestamp: number
  products: Map<string, Product>
  permissions: Map<string, Permission>
  userProducts: Map<string, Product>
}

export interface Product {
  qonversionID: string
  storeID: string
  type: ProductType
  duration: ProductDuration
  skuDetails: SkuDetails | null
  skProduct: SKProduct | null
  prettyPrice: string | undefined
  trialDuration: TrialDuration | undefined
  price: number | undefined
  currencyCode: string | undefined
}

export interface Permission {
  permissionID: string
  productID: string
  isActive: boolean
  renewState: RenewState
  startedDate: Date
  expirationDate: Date | undefined
}

export interface Offerings {
  main: Offering | null
  availableOfferings: Offering[]
  offeringForIdentifier(identifier: string): Offering | undefined
}

export interface Offering {
  id: string
  tag: OfferingTag
  products: Product[]
  productForIdentifier(identifier: string): Product | undefined
}

export interface IntroEligibility {
  status?: IntroEligibilityStatus
}

export interface ExperimentInfo {
  identifier: string
  group: ExperimentGroup
}

export interface ExperimentGroup {
  type: ExperimentGroupType
}

// Store products

export interface SkuDetails {
  description: string
  freeTrialPeriod: string
  iconUrl: string
  introductoryPrice: string
  introductoryPriceAmountMicros: number
  introductoryPriceCycles: number
  introductoryPricePeriod: string
  originalJson: string
  originalPrice: string
  originalPriceAmountMicros: number
  price: string
  priceAmountMicros: number
  priceCurrencyCode: string
  sku: string
  subscriptionPeriod: string
  title: string
  type: string
  hashCode: number
  toString: string
}

export interface SKProduct {
  localizedDescription?: string
  localizedTitle?: string
  price: string
  localeIdentifier?: string
  productIdentifier?: string
  isDownloadable: boolean
  downloadContentVersion?: string
  downloadContentLengths?: number[]
  subscriptionPeriod?: SKSubscriptionPeriod
  productDiscount?: SKProductDiscount
  discounts?: SKProductDiscount[]
  subscriptionGroupIdentifier?: string
  isFamilyShareable?: boolean
  currencyCode: string
}

export interface SKSubscriptionPeriod {
  numberOfUnits: number
  unit: SKPeriodUnit
}

export interface SKProductDiscount {
  price: string
  localeIdentifier?: string
  numberOfPeriods: number
  subscriptionPeriod?: SKSubscriptionPeriod
  paymentMode: SKProductDiscountPaymentMode
  identifier?: string
  type: SKProductDiscountType
}

class Qonversion {
  static launchWithKey(key: string, observerMode: boolean = false): Promise<LaunchResult>
  static setProperty(property: Property, value: string)
  static setUserProperty(property: string, value: string)
  static setUserId(userId: string)
  static addAttributionData(data: any, provider: Provider)
  static checkPermissions(): Promise<Map<string, Permission>>
  static purchase(productId: string): Promise<Map<string, Permission>>
  static updatePurchase(
    productId: string,
    oldProductId: string,
    prorationMode: ProrationMode = null,
  ): Promise<Map<string, Permission>>
  static products(): Promise<Map<string, Product>>
  static offerings(): Promise<Offerings>
  static restore(): Promise<Map<string, Permission>>
  static checkTrialIntroEligibilityForProductIds(ids: string[]): Promise<Map<string, Permission>>
  static experiments(): Promise<Map<string, ExperimentInfo>>
  static syncPurchases()
  static setDebugMode()
}

export default Qonversion
