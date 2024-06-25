#import <React/RCTBridgeModule.h>

@interface RCTSpotifyModule : NSObject <RCTBridgeModule>
@end

@implementation RCTSpotifyModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(playTrack:(NSString *)trackId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSLog(@"playTrack fonksiyonu çağrıldı. Track ID: %@", trackId);
        // Spotify işlemleri burada yapılır
        [SpotifyPlayer playTrackWithId:trackId];
        resolve(@"Success"); // Başarı durumunda
    }
    @catch (NSException *exception) {
        NSLog(@"playTrack fonksiyonunda hata oluştu: %@", exception);
        NSError *error = [NSError errorWithDomain:@"com.example.app" code:1 userInfo:@{NSLocalizedDescriptionKey: @"Hata"}];
        reject(@"error_code", @"Hata", error); // Hata durumunda
    }
}

@end