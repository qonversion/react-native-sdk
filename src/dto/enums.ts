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
  INTRO = "Intro", /** Currently works for Android only. iOS support will be added soon. */
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
   * The billing plan payment recurs for infinite billing periods unless canceled.
   */
  INFINITE_RECURRING = "InfiniteRecurring",

  /**
   * The billing plan payment recurs for a fixed number of billing periods
   * set in {@link ProductPricingPhase.billingCycleCount}.
   */
  FINITE_RECURRING = "FiniteRecurring",

  /**
   * The billing plan payment is a one-time charge that does not repeat.
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
  DISCOUNTED_SINGLE_PAYMENT = "DiscountedSinglePayment",

  /**
   * A phase with a discounted payment for several periods, described in {@link ProductPricingPhase.billingCycleCount}.
   */
  DISCOUNTED_RECURRING_PAYMENT = "DiscountedRecurringPayment",

  /**
   * Unknown pricing phase type.
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

export enum TransactionEnvironment {
  PRODUCTION = "Production",
  SANDBOX = "Sandbox"
}

export enum TransactionOwnershipType {
  OWNER = "Owner",
  FAMILY_SHARING = "FamilySharing"
}

export enum EntitlementGrantType {
  PURCHASE = "Purchase",
  FAMILY_SHARING = "FamilySharing",
  OFFER_CODE = "OfferCode",
  MANUAL = "Manual",
}

export enum TransactionType {
  UNKNOWN = "Unknown",
  SUBSCRIPTION_STARTED = "SubscriptionStarted",
  SUBSCRIPTION_RENEWED = "SubscriptionRenewed",
  TRIAL_STARTED = "TrialStarted",
  INTRO_STARTED = "IntroStarted",
  INTRO_RENEWED = "IntroRenewed",
  NON_CONSUMABLE_PURCHASE = "NonConsumablePurchase"
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
  APP_METRICA_DEVICE_ID = "AppMetricaDeviceId",
  APP_METRICA_USER_PROFILE_ID = "AppMetricaUserProfileId",
  PUSH_WOOSH_HW_ID = "PushWooshHwId",
  PUSH_WOOSH_USER_ID = "PushWooshUserId",
  CUSTOM = "Custom",
}

export enum AttributionProvider {
  APPSFLYER = "AppsFlyer",
  BRANCH = "Branch",
  ADJUST = "Adjust",
  APPLE_SEARCH_ADS = "AppleSearchAds", // ios only
  APPLE_AD_SERVICES = "AppleAdServices", // ios only
}

/**
 * A policy used for purchase updates on Android, which describes
 * how to migrate from purchased plan to a new one.
 *
 * Used in {@link PurchaseUpdateModel} class for purchase updates.
 */
export enum PurchaseUpdatePolicy {
  /**
   * The new plan takes effect immediately, and the user is charged full price of new plan
   * and is given a full billing cycle of subscription, plus remaining prorated time
   * from the old plan.
   */
  CHARGE_FULL_PRICE = 'ChargeFullPrice',

  /**
   * The new plan takes effect immediately, and the billing cycle remains the same.
   */
  CHARGE_PRORATED_PRICE = 'ChargeProratedPrice',

  /**
   * The new plan takes effect immediately, and the remaining time will be prorated
   * and credited to the user.
   */
  WITH_TIME_PRORATION = 'WithTimeProration',

  /**
   * The new purchase takes effect immediately, the new plan will take effect
   * when the old item expires.
   */
  DEFERRED = 'Deferred',

  /**
   * The new plan takes effect immediately, and the new price will be charged
   * on next recurrence time.
   */
  WITHOUT_PRORATION = 'WithoutProration',

  /**
   * Unknown police.
   */
  UNKNOWN = 'Unknown',
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

export enum QonversionErrorCode {
  UNKNOWN = "Unknown",
  API_RATE_LIMIT_EXCEEDED = "ApiRateLimitExceeded",
  APPLE_STORE_ERROR = "AppleStoreError",
  BACKEND_ERROR = "BackendError",
  BILLING_UNAVAILABLE = "BillingUnavailable",
  CLIENT_INVALID = "ClientInvalid",
  CLOUD_SERVICE_NETWORK_CONNECTION_FAILED = "CloudServiceNetworkConnectionFailed",
  CLOUD_SERVICE_PERMISSION_DENIED = "CloudServicePermissionDenied",
  CLOUD_SERVICE_REVOKED = "CloudServiceRevoked",
  FAILED_TO_RECEIVE_DATA = "FailedToReceiveData",
  FEATURE_NOT_SUPPORTED = "FeatureNotSupported",
  FRAUD_PURCHASE = "FraudPurchase",
  INCORRECT_REQUEST = "IncorrectRequest",
  INTERNAL_ERROR = "InternalError",
  INVALID_CLIENT_UID = "InvalidClientUid",
  INVALID_CREDENTIALS = "InvalidCredentials",
  INVALID_STORE_CREDENTIALS = "InvalidStoreCredentials",
  LAUNCH_ERROR = "LaunchError",
  NETWORK_CONNECTION_FAILED = "NetworkConnectionFailed",
  OFFERINGS_NOT_FOUND = "OfferingsNotFound",
  PAYMENT_INVALID = "PaymentInvalid",
  PAYMENT_NOT_ALLOWED = "PaymentNotAllowed",
  PLAY_STORE_ERROR = "PlayStoreError",
  PRIVACY_ACKNOWLEDGEMENT_REQUIRED = "PrivacyAcknowledgementRequired",
  PRODUCT_ALREADY_OWNED = "ProductAlreadyOwned",
  PRODUCT_NOT_FOUND = "ProductNotFound",
  PRODUCT_NOT_OWNED = "ProductNotOwned",
  PROJECT_CONFIG_ERROR = "ProjectConfigError",
  PURCHASE_CANCELED = "PurchaseCanceled",
  PURCHASE_INVALID = "PurchaseInvalid",
  PURCHASE_PENDING = "PurchasePending",
  PURCHASE_UNSPECIFIED = "PurchaseUnspecified",
  RECEIPT_VALIDATION_ERROR = "ReceiptValidationError",
  REMOTE_CONFIGURATION_NOT_AVAILABLE = "RemoteConfigurationNotAvailable",
  RESPONSE_PARSING_FAILED = "ResponseParsingFailed",
  STORE_PRODUCT_NOT_AVAILABLE = "StoreProductNotAvailable",
  UNAUTHORIZED_REQUEST_DATA = "UnauthorizedRequestData",
  UNKNOWN_CLIENT_PLATFORM = "UnknownClientPlatform",
}
