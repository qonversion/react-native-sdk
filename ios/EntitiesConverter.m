//
//  EntitiesConverter.m
//  Qonversion
//
//  Created by Surik Sarkisyan on 27.11.2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "EntitiesConverter.h"
#import <Qonversion/QNOffering.h>
#import <Qonversion/QNOfferings.h>

@implementation EntitiesConverter

+ (NSDictionary *)convertLaunchResult:(QNLaunchResult *)launchResult {
    NSDictionary *products = [EntitiesConverter convertProducts:launchResult.products.allValues];
    NSDictionary *userProducts = [EntitiesConverter convertProducts:launchResult.userPoducts.allValues];
    NSDictionary *permissions = [EntitiesConverter convertPermissions:launchResult.permissions.allValues];
    
    return @{
      @"uid": launchResult.uid,
      @"timestamp": @(launchResult.timestamp),
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
    NSMutableDictionary *productsDict = [@{
        @"id": product.qonversionID,
        @"store_id": product.storeID,
        @"type": @(product.type),
        @"duration": @(product.duration),
        @"prettyPrice": product.prettyPrice
    } mutableCopy];
    
    if (product.skProduct) {
        NSDictionary *skProductInfo = [EntitiesConverter convertSKProduct:product.skProduct];
        productsDict[@"storeProduct"] = skProductInfo;
    }
    
    return [productsDict copy];
}

+ (NSDictionary *)convertPermissions:(NSArray<QNPermission *> *)permissions {
    NSMutableDictionary *result = [NSMutableDictionary new];
    
    for (QNPermission *permission in permissions) {
        NSDictionary *permissionDict = @{
            @"id": permission.permissionID,
            @"associated_product": permission.productID,
            @"renew_state": @(permission.renewState),
            @"started_timestamp": @(permission.startedDate.timeIntervalSince1970),
            @"expiration_timestamp": @(permission.expirationDate.timeIntervalSince1970),
            @"active": @(permission.isActive),
        };
        result[permission.permissionID] = permissionDict;
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

    introductoryPrice[@"paymentMode"] = @(discount.paymentMode);
    
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

@end
