//
//  EntitiesConverter.m
//  Qonversion
//
//  Created by Surik Sarkisyan on 27.11.2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "EntitiesConverter.h"
#import <Qonversion/QNLaunchResult.h>
#import <Qonversion/QNOffering.h>
#import <Qonversion/QNOfferings.h>
#import <Qonversion/QNIntroEligibility.h>
#import <Qonversion/QNExperimentInfo.h>
#import <Qonversion/QNExperimentGroup.h>

@implementation EntitiesConverter

+ (NSDictionary *)convertActionResult:(QONActionResult *)actionResult {
    NSMutableDictionary *result = [NSMutableDictionary new];

    NSDictionary *types = @{
        @(QONActionResultTypeURL): @"url",
        @(QONActionResultTypeDeeplink): @"deeplink",
        @(QONActionResultTypeNavigation): @"navigate",
        @(QONActionResultTypePurchase): @"purchase",
        @(QONActionResultTypeRestore): @"restore",
        @(QONActionResultTypeClose): @"close"
    };

    result[@"type"] = types[@(actionResult.type)] ? : @"unknown";
    result[@"value"] = actionResult.parameters;
    if (actionResult.error) {
        result[@"error"] = [EntitiesConverter convertError:actionResult.error];
    }

    return [result copy];
}

+ (NSDictionary *)convertAutomationsEvent:(QONAutomationsEvent *)event {
    NSMutableDictionary *result = [NSMutableDictionary new];

    NSDictionary *types = @{
        @(QONAutomationsEventTypeTrialStarted): @"trial_started",
        @(QONAutomationsEventTypeTrialConverted): @"trial_converted",
        @(QONAutomationsEventTypeTrialCanceled): @"trial_canceled",
        @(QONAutomationsEventTypeTrialBillingRetry): @"trial_billing_retry_entered",
        @(QONAutomationsEventTypeSubscriptionStarted): @"subscription_started",
        @(QONAutomationsEventTypeSubscriptionRenewed): @"subscription_renewed",
        @(QONAutomationsEventTypeSubscriptionRefunded): @"subscription_refunded",
        @(QONAutomationsEventTypeSubscriptionCanceled): @"subscription_canceled",
        @(QONAutomationsEventTypeSubscriptionBillingRetry): @"subscription_billing_retry_entered",
        @(QONAutomationsEventTypeInAppPurchase): @"in_app_purchase",
        @(QONAutomationsEventTypeSubscriptionUpgraded): @"subscription_upgraded",
        @(QONAutomationsEventTypeTrialStillActive): @"trial_still_active",
        @(QONAutomationsEventTypeTrialExpired): @"trial_expired",
        @(QONAutomationsEventTypeSubscriptionExpired): @"subscription_expired",
        @(QONAutomationsEventTypeSubscriptionDowngraded): @"subscription_downgraded",
        @(QONAutomationsEventTypeSubscriptionProductChanged): @"subscription_product_changed"
    };

    result[@"type"] = types[@(event.type)] ? : @"unknown";
    result[@"timestamp"] = @(event.date.timeIntervalSince1970 * 1000);

    return [result copy];
}

+ (NSNumber *)propertyForString:(NSString *)key {
    NSDictionary *propertiesMap = @{
        @"EMAIL": @(QNPropertyEmail),
        @"NAME": @(QNPropertyName),
        @"APPS_FLYER_USER_ID": @(QNPropertyAppsFlyerUserID),
        @"ADJUST_USER_ID": @(QNPropertyAdjustUserID),
        @"KOCHAVA_DEVICE_ID": @(QNPropertyKochavaDeviceID),
        @"ADVERTISING_ID": @(QNPropertyAdvertisingID),
        @"CUSTOM_USER_ID": @(QNPropertyUserID),
        @"FIREBASE_APP_INSTANCE_ID": @(QNPropertyFirebaseAppInstanceId)
    };

    return propertiesMap[key];
}

+ (NSNumber *)permissionsCacheLifetimeForString:(NSString *)key {
    NSDictionary *permissionsCacheLifetimeMap = @{
        @"WEEK": @(QNPermissionsCacheLifetimeWeek),
        @"TWO_WEEKS": @(QNPermissionsCacheLifetimeTwoWeeks),
        @"MONTH": @(QNPermissionsCacheLifetimeMonth),
        @"TWO_MONTHS": @(QNPermissionsCacheLifetimeTwoMonth),
        @"THREE_MONTHS": @(QNPermissionsCacheLifetimeThreeMonth),
        @"SIX_MONTHS": @(QNPermissionsCacheLifetimeSixMonth),
        @"YEAR": @(QNPermissionsCacheLifetimeYear),
        @"UNLIMITED": @(QNPermissionsCacheLifetimeUnlimited)
    };

    return permissionsCacheLifetimeMap[key];
}

@end
