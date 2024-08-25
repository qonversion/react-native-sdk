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
 * Used in {@link PurchaseOptions} class for purchase updates.
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
  UNKNOWN = "Unknown", // Unknown error
  API_RATE_LIMIT_EXCEEDED = "ApiRateLimitExceeded", // API requests rate limit exceeded
  APPLE_STORE_ERROR = "AppleStoreError", // Apple Store error received
  BACKEND_ERROR = "BackendError", // There was a backend error
  BILLING_UNAVAILABLE = "BillingUnavailable", // The Billing service is unavailable on the device
  CLIENT_INVALID = "ClientInvalid", // Client is not allowed to issue the request, etc
  CLOUD_SERVICE_NETWORK_CONNECTION_FAILED = "CloudServiceNetworkConnectionFailed", // The device could not connect to the network
  CLOUD_SERVICE_PERMISSION_DENIED = "CloudServicePermissionDenied", // User is not allowed to access cloud service information
  CLOUD_SERVICE_REVOKED = "CloudServiceRevoked", // User has revoked permission to use this cloud service
  FAILED_TO_RECEIVE_DATA = "FailedToReceiveData", // Could not receive data
  FEATURE_NOT_SUPPORTED = "FeatureNotSupported", // The requested feature is not supported
  FRAUD_PURCHASE = "FraudPurchase", // Fraud purchase was detected
  INCORRECT_REQUEST = "IncorrectRequest", // Request failed
  INTERNAL_ERROR = "InternalError", // Internal backend error
  INVALID_CLIENT_UID = "InvalidClientUid", // Client Uid is invalid or not set
  INVALID_CREDENTIALS = "InvalidCredentials", // Access token is invalid or not set
  INVALID_STORE_CREDENTIALS = "InvalidStoreCredentials", // This account does not have access to the requested application
  LAUNCH_ERROR = "LaunchError", // There was an error while launching Qonversion SDK
  NETWORK_CONNECTION_FAILED = "NetworkConnectionFailed", // There was a network issue. Make sure that the Internet connection is available on the device
  OFFERINGS_NOT_FOUND = "OfferingsNotFound", // No offerings found
  PAYMENT_INVALID = "PaymentInvalid", // Purchase identifier was invalid, etc.
  PAYMENT_NOT_ALLOWED = "PaymentNotAllowed", // This device is not allowed to make the payment
  PLAY_STORE_ERROR = "PlayStoreError", // There was an issue with the Play Store service
  PRIVACY_ACKNOWLEDGEMENT_REQUIRED = "PrivacyAcknowledgementRequired", // User needs to acknowledge Apple's privacy policy
  PRODUCT_ALREADY_OWNED = "ProductAlreadyOwned", // Failed to purchase since item is already owned
  PRODUCT_NOT_FOUND = "ProductNotFound", // Failed to purchase since the Qonversion product was not found
  PRODUCT_NOT_OWNED = "ProductNotOwned", // Failed to consume purchase since item is not owned
  PROJECT_CONFIG_ERROR = "ProjectConfigError", // The project is not configured or configured incorrectly in the Qonversion Dashboard
  PURCHASE_CANCELED = "PurchaseCanceled", // User pressed back or canceled a dialog for purchase
  PURCHASE_INVALID = "PurchaseInvalid", // Failure of purchase
  PURCHASE_PENDING = "PurchasePending", // Purchase is pending
  PURCHASE_UNSPECIFIED = "PurchaseUnspecified", // Unspecified state of the purchase
  RECEIPT_VALIDATION_ERROR = "ReceiptValidationError", // Receipt validation error
  REMOTE_CONFIGURATION_NOT_AVAILABLE = "RemoteConfigurationNotAvailable", // Remote configuration is not available for the current user or for the provided context key
  RESPONSE_PARSING_FAILED = "ResponseParsingFailed", // A problem occurred while serializing or deserializing data
  STORE_PRODUCT_NOT_AVAILABLE = "StoreProductNotAvailable", // Requested product is not available for purchase or its product id was not found
  UNAUTHORIZED_REQUEST_DATA = "UnauthorizedRequestData", // App is attempting to use SKPayment's requestData property, but does not have the appropriate entitlement
  UNKNOWN_CLIENT_PLATFORM = "UnknownClientPlatform", // The current platform is not supported
}
