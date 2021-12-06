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

+ (NSDictionary *)convertLaunchResult:(QNLaunchResult *)launchResult {
    NSDictionary *products = [EntitiesConverter convertProducts:launchResult.products.allValues];
    NSDictionary *userProducts = [EntitiesConverter convertProducts:launchResult.userPoducts.allValues];
    NSDictionary *permissions = [EntitiesConverter convertPermissions:launchResult.permissions.allValues];

    return @{
      @"uid": launchResult.uid,
      @"timestamp": @(launchResult.timestamp * 1000),
      @"products": products,
      @"permissions": permissions,
      @"user_products": userProducts,
    };
}

+ (NSDictionary *)convertProducts:(NSArray<QNProduct *> *)products {
    NSMutableDictionary *result = [NSMutableDictionary new];

    for (QNProduct *product in products) {
        NSDictionary *convertedProduct = [EntitiesConverter convertProduct:product];

        result[product.qonversionID] = convertedProduct;
    }

    return result;
}

+ (NSDictionary *)convertProduct:(QNProduct *)product {
    NSNumber *trialDuration = product.trialDuration ? @(product.trialDuration) : @(QNTrialDurationNotAvailable);
    NSMutableDictionary *productsDict = [NSMutableDictionary new];
    productsDict[@"id"] = product.qonversionID;
    productsDict[@"store_id"] = product.storeID;
    productsDict[@"type"] = @(product.type);
    productsDict[@"duration"] = @(product.duration);
    productsDict[@"prettyPrice"] = product.prettyPrice;
    productsDict[@"trialDuration"] = trialDuration;

    if (product.skProduct) {
        NSDictionary *skProductInfo = [EntitiesConverter convertSKProduct:product.skProduct];
        productsDict[@"storeProduct"] = skProductInfo;
    }

    return [productsDict copy];
}

+ (NSDictionary *)convertPermissions:(NSArray<QNPermission *> *)permissions {
    NSMutableDictionary *result = [NSMutableDictionary new];

    for (QNPermission *permission in permissions) {
        NSMutableDictionary *permissionDict = [NSMutableDictionary new];
        permissionDict[@"id"] = permission.permissionID;
        permissionDict[@"associated_product"] = permission.productID;
        permissionDict[@"renew_state"] = @(permission.renewState);
        permissionDict[@"started_timestamp"] = @(permission.startedDate.timeIntervalSince1970 * 1000);
        permissionDict[@"expiration_timestamp"] = @(permission.expirationDate.timeIntervalSince1970 * 1000);
        permissionDict[@"active"] = @(permission.isActive);
        
        result[permission.permissionID] = [permissionDict copy];
    }

    return result;
}

+ (NSDictionary *)convertSKProduct:(SKProduct *)product {
    NSMutableDictionary *result = [NSMutableDictionary new];
    result[@"localizedDescription"] = product.localizedDescription;
    result[@"localizedTitle"] = product.localizedTitle;
    result[@"price"] = [product.price stringValue];
    result[@"localeIdentifier"] = product.priceLocale.localeIdentifier;
    result[@"productIdentifier"] = product.productIdentifier;
    result[@"isDownloadable"] = @(product.isDownloadable);
    result[@"downloadContentVersion"] = product.downloadContentVersion;
    result[@"downloadContentLengths"] = product.downloadContentLengths;

    if (@available(iOS 10.0, *)) {
        result[@"currencyCode"] = product.priceLocale.currencyCode;
    }

    if (@available(iOS 11.2, *)) {
        NSMutableDictionary *subscriptionPeriod = [NSMutableDictionary new];
        subscriptionPeriod[@"numberOfUnits"] = @(product.subscriptionPeriod.numberOfUnits);
        subscriptionPeriod[@"unit"] = @(product.subscriptionPeriod.unit);

        result[@"subscriptionPeriod"] = [subscriptionPeriod copy];

        NSDictionary *introductoryPrice = [EntitiesConverter convertDiscount:product.introductoryPrice];
        result[@"introductoryPrice"] = [introductoryPrice copy];

        if (@available(iOS 12.2, *)) {
            NSArray *discounts = [EntitiesConverter convertDiscounts:product.discounts];
            result[@"discounts"] = discounts;
        }
    }

    if (@available(iOS 12.0, *)) {
        result[@"subscriptionGroupIdentifier"] = product.subscriptionGroupIdentifier;
    }

    if (@available(iOS 14.0, *)) {
        result[@"isFamilyShareable"] = @(product.isFamilyShareable);
    }


    return [result copy];
}

+ (NSArray<NSDictionary *> *)convertDiscounts:(NSArray<SKProductDiscount *> *)discounts API_AVAILABLE(ios(11.2)) {
    NSMutableArray *result = [NSMutableArray new];
    for (SKProductDiscount *discount in discounts) {
        NSDictionary *introductoryPriceInfo = [EntitiesConverter convertDiscount:discount];
        [result addObject:introductoryPriceInfo];
    }

    return [result copy];
}

+ (NSDictionary *)convertDiscount:(SKProductDiscount *)discount API_AVAILABLE(ios(11.2)) {
    NSMutableDictionary *introductoryPrice = [NSMutableDictionary new];
    introductoryPrice[@"price"] = [discount.price stringValue];
    introductoryPrice[@"localeIdentifier"] = discount.priceLocale.localeIdentifier;
    introductoryPrice[@"numberOfPeriods"] = @(discount.numberOfPeriods);

    NSMutableDictionary *introductorySubscriptionPeriod = [NSMutableDictionary new];
    introductorySubscriptionPeriod[@"numberOfUnits"] = @(discount.subscriptionPeriod.numberOfUnits);
    introductorySubscriptionPeriod[@"unit"] = @(discount.subscriptionPeriod.unit);

    introductoryPrice[@"subscriptionPeriod"] = [introductorySubscriptionPeriod copy];
    introductoryPrice[@"paymentMode"] = @(discount.paymentMode);
    
    introductoryPrice[@"currencySymbol"] = discount.priceLocale.currencySymbol;

    if (@available(iOS 12.2, *)) {
        introductoryPrice[@"identifier"] = discount.identifier;
        introductoryPrice[@"type"] = @(discount.type);
    }

    return [introductoryPrice copy];
}

+ (NSDictionary *)convertOfferings:(QNOfferings *)offerings {
    NSMutableDictionary *result = [NSMutableDictionary new];

    if (offerings.main) {
        result[@"main"] = [EntitiesConverter convertOffering:offerings.main];
    }

    NSMutableArray *availableOfferings = [NSMutableArray new];

    for (QNOffering *offering in offerings.availableOfferings) {
        NSDictionary *convertedOffering = [EntitiesConverter convertOffering:offering];

        [availableOfferings addObject:convertedOffering];
    }

    result[@"availableOfferings"] = [availableOfferings copy];

    return [result copy];
}

+ (NSDictionary *)convertOffering:(QNOffering *)offering {
    NSMutableDictionary *result = [NSMutableDictionary new];

    result[@"id"] = offering.identifier;
    result[@"tag"] = @(offering.tag);

    NSMutableArray *convertedProducts = [NSMutableArray new];

    for (QNProduct *product in offering.products) {
        NSDictionary *convertedProduct = [EntitiesConverter convertProduct:product];

        [convertedProducts addObject:convertedProduct];
    }

    result[@"products"] = [convertedProducts copy];

    return [result copy];
}

+ (NSDictionary *)convertIntroEligibility:(NSDictionary<NSString *, QNIntroEligibility *> *)introEligibilityInfo {
    NSDictionary *statuses = @{
        @(QNIntroEligibilityStatusNonIntroProduct): @"non_intro_or_trial_product",
        @(QNIntroEligibilityStatusEligible): @"intro_or_trial_eligible",
        @(QNIntroEligibilityStatusIneligible): @"intro_or_trial_ineligible"
    };

    NSMutableArray *convertedData = [NSMutableArray new];

    for (NSString *key in introEligibilityInfo.allKeys) {
        QNIntroEligibility *eligibility = introEligibilityInfo[key];
        NSString *statusValue = statuses[@(eligibility.status)] ? : @"unknonw";

        NSDictionary *eligibilityInfo = @{@"productId": key, @"status": statusValue};

        [convertedData addObject:eligibilityInfo];
    }

    return [convertedData copy];
}

+ (NSArray *)convertExperiments:(NSDictionary<NSString *, QNExperimentInfo *> *)experiments {
    NSMutableArray *result = [NSMutableArray new];

    for (NSString *key in experiments.allKeys) {
        QNExperimentInfo *experimentInfo = experiments[key];
        NSDictionary *experimentGroup = @{@"type": @(experimentInfo.group.type)};
        NSDictionary *convertedExperimentInfo = @{@"id": experimentInfo.identifier, @"group": experimentGroup};

        [result addObject:convertedExperimentInfo];
    }

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
        @"CUSTOM_USER_ID": @(QNPropertyUserID)
    };

    return propertiesMap[key];
}

@end
