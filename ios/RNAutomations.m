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

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(subscribe) {
    [_sandwich subscribe:self];
}

- (void)automationDidTriggerWithEvent:(NSString * _Nonnull)event payload:(NSDictionary<NSString *,id> * _Nullable)payload {
  [self sendEventWithName:event body:payload];
}

#pragma mark - Emitter

- (NSArray<NSString *> *)supportedEvents {
    return [self.sandwich getAvailableEvents];
}

@end
