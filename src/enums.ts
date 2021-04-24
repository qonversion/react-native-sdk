export enum ProductType {
  TRIAL = 0,
  DIRECT_SUBSCRIPTION = 1,
  ONE_TIME = 2,
}

export enum ProductDuration {
  WEEKLY = 0,
  MONTHLY = 1,
  "3_MONTHS" = 2,
  "6_MONTHS" = 3,
  ANNUAL = 4,
  LIFETIME = 5,
}

export enum TrialDuration {
  NOT_AVAILABLE = -1,
  THREE_DAYS = 1,
  WEEK = 2,
  TWO_WEEKS = 3,
  MONTH = 4,
  TWO_MONTHS = 5,
  THREE_MONTHS = 6,
  SIX_MONTHS = 7,
  YEAR = 8,
  OTHER = 9,
}

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
  DAY = "0",
  WEEK = "1",
  MONTH = "2",
  YEAR = "3",
}

export enum SKProductDiscountType {
  INTRODUCTORY = 0,
  SUBSCRIPTION = 1,
}

export enum SKProductDiscountPaymentMode {
  PAY_AS_YOU_GO = 0,
  PAY_UP_FRONT = 1,
  FREE_TRIAL = 2,
}

export enum OfferingTag {
  NONE = 0,
  MAIN = 1,
}

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
