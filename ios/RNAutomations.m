//
//  RNAutomations.m
//  Qonversion
//
//  Created by Kamo Spertsyan on 11.03.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "RNAutomations.h"
#import "EntitiesConverter.h"
@import QonversionSadnwich;

static NSString *const kEventScreenShown = @"automations_screen_shown";
static NSString *const kEventActionStarted = @"automations_action_started";
static NSString *const kEventActionFailed = @"automations_action_failed";
static NSString *const kEventActionFinished = @"automations_action_finished";
static NSString *const kEventAutomationsFinished = @"automations_finished";

@interface RNAutomations () <QONAutomationsDelegate>

@property (nonatomic, strong) AutomationsSandwich *sandwich;

@end

@implementation RNAutomations

- (instancetype)init {
  self = [super init];
    
  if (self) {
      _sandwich = [AutomationsSandwich new];
      [_sandwich subscribe:self];
  }
    
  return self;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(subscribe) {
    [QONAutomations setDelegate:self];
}

- (void)automationsDidShowScreen:(NSString * _Nonnull)screenID {
    [self sendEventWithName:kEventScreenShown body:screenID];
}

- (void)automationsDidStartExecutingActionResult:(QONActionResult * _Nonnull)actionResult {
    NSDictionary *payload = [EntitiesConverter convertActionResult:actionResult];
    [self sendEventWithName:kEventActionStarted body:payload];
}

- (void)automationsDidFailExecutingActionResult:(QONActionResult * _Nonnull)actionResult {
    NSDictionary *payload = [EntitiesConverter convertActionResult:actionResult];
    [self sendEventWithName:kEventActionFailed body:payload];
}

- (void)automationsDidFinishExecutingActionResult:(QONActionResult * _Nonnull)actionResult {
    NSDictionary *payload = [EntitiesConverter convertActionResult:actionResult];
    [self sendEventWithName:kEventActionFinished body:payload];
}

- (void)automationsFinished {
    [self sendEventWithName:kEventAutomationsFinished body:nil];
}

#pragma mark - Emitter

- (NSArray<NSString *> *)supportedEvents {
    return @[kEventScreenShown, kEventActionStarted, kEventActionFailed, kEventActionFinished, kEventAutomationsFinished];
}

@end
