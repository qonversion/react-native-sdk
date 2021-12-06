export const ProductType = {
  "0": "TRIAL",
  "1": "DIRECT_SUBSCRIPTION",
  "2": "ONE_TIME",
} as const;

export type ProductTypes = typeof ProductType[keyof typeof ProductType];

export const ProductDuration = {
  0: "WEEKLY",
  1: "MONTHLY",
  2: "3_MONTHS",
  3: "6_MONTHS",
  4: "ANNUAL",
  5: "LIFETIME",
} as const;

export type ProductDurations = typeof ProductDuration[keyof typeof ProductDuration];

export const TrialDuration = {
  "-1": "NOT_AVAILABLE",
  "1": "THREE_DAYS",
  "2": "WEEK",
  "3": "TWO_WEEKS",
  "4": "MONTH",
  "5": "TWO_MONTHS",
  "6": "THREE_MONTHS",
  "7": "SIX_MONTHS",
  "8": "YEAR",
  "9": "OTHER",
} as const;

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
  ADVERTISING_ID = 7,
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

export const SKPeriodUnit = {
  0: "DAY",
  1: "WEEK",
  2: "MONTH",
  3: "YEAR",
} as const;
export type SKPeriodUnits = typeof SKPeriodUnit[keyof typeof SKPeriodUnit];

export const SKProductDiscountType = {
  0: "INTRODUCTORY",
  1: "SUBSCRIPTION",
} as const;

export type SKProductDiscountTypes = typeof SKProductDiscountType[keyof typeof SKProductDiscountType];

export const SKProductDiscountPaymentMode = {
  0: "PAY_AS_YOU_GO",
  1: "PAY_UP_FRONT",
  2: "FREE_TRIAL",
} as const;
export type SKProductDiscountPaymentModes = typeof SKProductDiscountPaymentMode[keyof typeof SKProductDiscountPaymentMode];

export const OfferingTag = {
  0: "NONE",
  1: "MAIN",
} as const;
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
