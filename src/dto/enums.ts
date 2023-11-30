export enum LaunchMode {
  ANALYTICS = 'Analytics',
  SUBSCRIPTION_MANAGEMENT = 'SubscriptionManagement',
}

export enum Environment {
  SANDBOX = "Sandbox",
  PRODUCTION = "Production",
}

export enum ProductType {
  TRIAL = "Trial",
  INTRO = "Intro",
  SUBSCRIPTION = "Subscription",
  IN_APP = "InApp",
  UNKNOWN = "Unknown",
}

export enum SubscriptionPeriodUnit {
  DAY = "Day",
  WEEK = "Week",
  MONTH = "Month",
  YEAR = "Year",
  UNKNOWN = "Unknown",
}

/**
 * Recurrence mode of the pricing phase.
 */
export enum PricingPhaseRecurrenceMode {
  /**
   * The billing plan payment recurs for infinite billing periods unless cancelled.
   */
  INFINITE_RECURRING = "InfiniteRecurring",

  /**
   * The billing plan payment recurs for a fixed number of billing period
   * set in [billingCycleCount].
   */
  FINITE_RECURRING = "FiniteRecurring",

  /**
   * The billing plan payment is a one time charge that does not repeat.
   */
  NON_RECURRING = "NonRecurring",

  /**
   * Unknown recurrence mode.
   */
  UNKNOWN = "Unknown",
}


/**
 * Type of the pricing phase.
 */
export enum PricingPhaseType {
  /**
   * Regular subscription without any discounts like trial or intro offers.
   */
  REGULAR = "Regular",

  /**
   * A free phase.
   */
  FREE_TRIAL = "FreeTrial",

  /**
   * A phase with a discounted payment for a single period.
   */
  SINGLE_PAYMENT = "SinglePayment",

  /**
   * A phase with a discounted payment for several periods, described in [billingCycleCount].
   */
  DISCOUNTED_RECURRING_PAYMENT = "DiscountedRecurringPayment",

  /**
   * Unknown pricing phase type
   */
  UNKNOWN = "Unknown",
}

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

export enum UserPropertyKey {
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
  CUSTOM = "Custom",
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
  UNLIMITED = "Unlimited",
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

export enum ExperimentGroupType {
  UNKNOWN = "unknown",
  CONTROL = "control",
  TREATMENT = "treatment",
}

export enum RemoteConfigurationSourceType {
  UNKNOWN = "unknown",
  EXPERIMENT_CONTROL_GROUP = "experiment_control_group",
  EXPERIMENT_TREATMENT_GROUP = "experiment_treatment_group",
  REMOTE_CONFIGURATION = "remote_configuration",
}

export enum RemoteConfigurationAssignmentType {
  UNKNOWN = "unknown",
  AUTO = "auto",
  MANUAL = "manual",
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

export enum ScreenPresentationStyle {
  /**
   * on Android - default screen transaction animation will be used.
   * on iOS - not a modal presentation. This style pushes a controller to a current navigation stack.
   * For iOS NavigationController on the top of the stack is required.
   */
  PUSH = 'Push',
  /**
   * on Android - screen will move from bottom to top.
   * on iOS - UIModalPresentationFullScreen analog.
   */
  FULL_SCREEN = 'FullScreen',
  /**
   * iOS only - UIModalPresentationPopover analog
   */
  POPOVER = 'Popover',
  /**
   * Android only - screen will appear/disappear without any animation.
   * For iOS consider providing the {@link ScreenPresentationConfig.animated} flag.
   */
  NO_ANIMATION = 'NoAnimation',
}
