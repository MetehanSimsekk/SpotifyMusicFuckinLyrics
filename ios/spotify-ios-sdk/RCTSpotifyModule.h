#import <React/RCTBridgeModule.h>

@interface RCTSpotifyModule : NSObject <RCTBridgeModule>
@end

@implementation RCTSpotifyModule

RCT_EXPORT_MODULE(); // Bu satırı ekleyerek modülünüze bir isim verin, eğer bu özelliği kullanmak istemiyorsanız () içerisini boş bırakın.

// RCTBridgeModule protokolü gereksinimlerini uygulayın

@end