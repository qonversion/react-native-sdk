export enum ProductType {
  TRIAL = "TRIAL",
  DIRECT_SUBSCRIPTION = "DIRECT_SUBSCRIPTION",
  ONE_TIME = "ONE_TIME",
}
// deprecated
export type ProductTypes = typeof ProductType[keyof typeof ProductType];

export enum ProductDuration {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  THREE_MONTHS = "3_MONTHS",
  SIX_MONTHS = "6_MONTHS",
  ANNUAL = "ANNUAL",
  LIFETIME = "LIFETIME",
}
// deprecated
export type ProductDurations = typeof ProductDuration[keyof typeof ProductDuration];

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
  OTHER = "OTHER",
}
// deprecated
export type TrialDurations = typeof TrialDuration[keyof typeof TrialDuration];

export enum RenewState {
  NON_RENEWABLE = -1,
  UNKNOWN = 0,
  WILL_RENEW = 1,
  CANCELED = 2,
  BILLING_ISSUE = 3,
}

export enum Property {
  EMAIL = 0,
  NAME = 1,
  APPS_FLYER_USER_ID = 2,
  ADJUST_USER_ID = 3,
  KOCHAVA_DEVICE_ID = 4,
  CUSTOM_USER_ID = 5,
  FACEBOOK_ATTRIBUTION = 6,
}

export enum Provider {
  APPSFLYER = 0,
  BRANCH = 1,
  ADJUST = 2,
  APPLE = 3,
}

export enum ProrationMode {
  UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY = 0,
  IMMEDIATE_WITH_TIME_PRORATION = 1,
  IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 2,
  IMMEDIATE_WITHOUT_PRORATION = 3,
  DEFERRED = 4,
}

export enum SKPeriodUnit {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}
// deprecated
export type SKPeriodUnits = typeof SKPeriodUnit[keyof typeof SKPeriodUnit];

export enum SKProductDiscountType {
  INTRODUCTORY = "INTRODUCTORY",
  SUBSCRIPTION = "SUBSCRIPTION",
}
// deprecated
export type SKProductDiscountTypes = typeof SKProductDiscountType[keyof typeof SKProductDiscountType];

export enum SKProductDiscountPaymentMode {
  PAY_AS_YOU_GO = "PAY_AS_YOU_GO",
  PAY_UP_FRONT = "PAY_UP_FRONT",
  FREE_TRIAL = "FREE_TRIAL",
}
// deprecated
export type SKProductDiscountPaymentModes = typeof SKProductDiscountPaymentMode[keyof typeof SKProductDiscountPaymentMode];

export enum OfferingTag {
  NONE = "NONE",
  MAIN = "MAIN",
}
// deprecated
export type OfferingTags = typeof OfferingTag[keyof typeof OfferingTag];

export enum IntroEligibilityStatus {
  UNKNOWN = "unknown",
  NON_INTRO_OR_TRIAL_PRODUCT = "non_intro_or_trial_product",
  ELIGIBLE = "intro_or_trial_eligible",
  INELIGIBLE = "intro_or_trial_ineligible",
}

export enum ExperimentGroupType {
  GROUP_TYPE_A = 0,
  GROUP_TYPE_B = 1,
}
