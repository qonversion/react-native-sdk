//
//  EntitiesConverter.h
//  Qonversion
//
//  Created by Surik Sarkisyan on 27.11.2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Qonversion.h"

NS_ASSUME_NONNULL_BEGIN

@interface EntitiesConverter : NSObject

+ (NSDictionary *)convertActionResult:(QONActionResult *)actionResult;
+ (NSDictionary *)convertAutomationsEvent:(QONAutomationsEvent *)event;

@end

NS_ASSUME_NONNULL_END
