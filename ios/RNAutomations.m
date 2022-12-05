//
//  RNAutomations.m
//  Qonversion
//
//  Created by Kamo Spertsyan on 11.03.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "RNAutomations.h"
@import QonversionSandwich;

@interface RNAutomations () <AutomationsEventListener>

@property (nonatomic, strong) AutomationsSandwich *sandwich;

@end

@implementation RNAutomations

- (instancetype)init {
  self = [super init];

  if (self) {
      _sandwich = [AutomationsSandwich new];
  }

  return self;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(subscribe) {
  [_sandwich subscribe:self];
}

RCT_EXPORT_METHOD(setNotificationsToken:(NSString *)token) {
  [_sandwich setNotificationToken:token];
}

RCT_EXPORT_METHOD(getNotificationCustomPayload:(NSDictionary *)notificationData
                  completion:(RCTResponseSenderBlock)completion
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (![notificationData isKindOfClass:[NSDictionary class]]) {
      completion(nil);
      return;
  }

  NSDictionary *payload = [_sandwich getNotificationCustomPayload:notificationData];
  completion(payload == nil ? nil : @[payload]);
}

RCT_EXPORT_METHOD(handleNotification:(NSDictionary *)notificationData
                  completion:(RCTResponseSenderBlock)completion
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (![notificationData isKindOfClass:[NSDictionary class]]) {
    completion(@[@(NO)]);
    return;
  }

  BOOL isQonversionNotification = [_sandwich handleNotification:notificationData];
  completion(@[@(isQonversionNotification)]);
}

RCT_EXPORT_METHOD(showScreen:(NSString *)screenId
                  completion:(RCTResponseSenderBlock)completion
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [_sandwich showScreen:screenId completion:^(NSDictionary<NSString *,id> * _Nullable result, SandwichError * _Nullable error) {
    if (error) {
        reject(error.code, error.details, nil);

        return;
    }

    completion(@[result]);
  }];
}

- (void)automationDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
  [self sendEventWithName:event body:payload];
}

#pragma mark - Emitter

- (NSArray<NSString *> *)supportedEvents {
  return [self.sandwich getAvailableEvents];
}

@end
