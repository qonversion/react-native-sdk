export enum LaunchMode {
  ANALYTICS = 'Analytics',
  SUBSCRIPTION_MANAGEMENT = 'SubscriptionManagement'
}

export enum Environment {
  SANDBOX = "Sandbox",
  PRODUCTION = "Production"
}

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
  "0": "UNKNOWN",
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

export enum EntitlementRenewState {
  NON_RENEWABLE = 'non_renewable',
  UNKNOWN = 'unknown',
  WILL_RENEW = 'will_renew',
  CANCELED = 'canceled',
  BILLING_ISSUE = 'billing_issue',
}

export enum EntitlementSource {
  UNKNOWN = "Unknown",
  APP_STORE = "AppStore",
  PLAY_STORE = "PlayStore",
  STRIPE = "Stripe",
  MANUAL = "Manual",
}

export enum UserProperty {
  EMAIL = "Email",
  NAME = "Name",
  KOCHAVA_DEVICE_ID = "KochavaDeviceId",
  APPS_FLYER_USER_ID = "AppsFlyerUserId",
  ADJUST_AD_ID = "AdjustAdId",
  CUSTOM_USER_ID = "CustomUserId",
  FACEBOOK_ATTRIBUTION = "FacebookAttribution", // Android only
  FIREBASE_APP_INSTANCE_ID = "FirebaseAppInstanceId",
  APP_SET_ID = "AppSetId", // Android only
  ADVERTISING_ID = "AdvertisingId", // iOS only
}

export enum AttributionProvider {
  APPSFLYER = "AppsFlyer",
  BRANCH = "Branch",
  ADJUST = "Adjust",
  APPLE_SEARCH_ADS = "AppleSearchAds", // ios only
  APPLE_AD_SERVICES = "AppleAdServices", // ios only
}

export enum ProrationMode {
  UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY = 0,
  IMMEDIATE_WITH_TIME_PRORATION = 1,
  IMMEDIATE_AND_CHARGE_PRORATED_PRICE = 2,
  IMMEDIATE_WITHOUT_PRORATION = 3,
  DEFERRED = 4,
}

export enum EntitlementsCacheLifetime {
  WEEK = "Week",
  TWO_WEEKS = "TwoWeeks",
  MONTH = "Month",
  TWO_MONTHS = "TwoMonths",
  THREE_MONTHS = "ThreeMonths",
  SIX_MONTHS = "SixMonths",
  YEAR = "Year",
  UNLIMITED = "Unlimited"
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
  "-1": "UNKNOWN",
  "0": "NONE",
  "1": "MAIN",
} as const;
export type OfferingTags = typeof OfferingTag[keyof typeof OfferingTag];

export enum IntroEligibilityStatus {
  UNKNOWN = "unknown",
  NON_INTRO_OR_TRIAL_PRODUCT = "non_intro_or_trial_product",
  ELIGIBLE = "intro_or_trial_eligible",
  INELIGIBLE = "intro_or_trial_ineligible",
}

export enum ActionResultType {
  UNKNOWN = "unknown",
  URL = "url",
  DEEPLINK = "deeplink",
  NAVIGATION = "navigate",
  PURCHASE = "purchase",
  RESTORE = "restore",
  CLOSE = "close",
}

export enum AutomationsEventType {
  UNKNOWN = "unknown",
  TRIAL_STARTED = "trial_started",
  TRIAL_CONVERTED = "trial_converted",
  TRIAL_CANCELED = "trial_canceled",
  TRIAL_BILLING_RETRY = "trial_billing_retry_entered",
  SUBSCRIPTION_STARTED = "subscription_started",
  SUBSCRIPTION_RENEWED = "subscription_renewed",
  SUBSCRIPTION_REFUNDED = "subscription_refunded",
  SUBSCRIPTION_CANCELED = "subscription_canceled",
  SUBSCRIPTION_BILLING_RETRY = "subscription_billing_retry_entered",
  IN_APP_PURCHASE = "in_app_purchase",
  SUBSCRIPTION_UPGRADED = "subscription_upgraded",
  TRIAL_STILL_ACTIVE = "trial_still_active",
  TRIAL_EXPIRED = "trial_expired",
  SUBSCRIPTION_EXPIRED = "subscription_expired",
  SUBSCRIPTION_DOWNGRADED = "subscription_downgraded",
  SUBSCRIPTION_PRODUCT_CHANGED = "subscription_product_changed",
}
