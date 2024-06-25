#import "RCTSpotifyModule.h"
#import <SpotifyiOS/SpotifyiOS.h>

@implementation RCTSpotifyModule {
    SPTAppRemote *_appRemote;
}
RCT_EXPORT_MODULE(SpotifyModule);

- (instancetype)init {
    self = [super init];
    if (self) {
        NSLog(@"Module icerisindesin");
    }
    return self;
}
RCT_EXPORT_METHOD(playTrack:(NSString *)trackURI
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  

   // Bağlantı parametrelerini ayarla
    NSDictionary *connectionParameters = @{
        SPTAppRemoteOptionClientIDKey: @"081f04c9fc134332a54d2e1c567e7096",
        SPTAppRemoteOptionRedirectURIKey: @"exp://192.168.1.112:19000/callback", 
        SPTAppRemoteOptionClientSecretKey: @"9be70720ac1044dbb78f3a10476978a9",
    };

    // Spotify bağlantısını oluştur
    SPTAppRemote *appRemote = [[SPTAppRemote alloc] initWithApplicationIdentifier:@"com.spotify.music" configuration:[[SPTConfiguration alloc] initWithClientID:@"081f04c9fc134332a54d2e1c567e7096" redirectURL:[NSURL URLWithString:@"exp://192.168.1.112:19000/callback"]] logLevel:SPTAppRemoteLogLevelDebug];

    // Bağlantı parametrelerini ayarla
    appRemote.connectionParameters = connectionParameters;

    // Bağlan
    [appRemote connect];

    // Bağlantı başarılı olduğunda
    if (appRemote.isConnected) {
        // Parçayı çal
        [appRemote.playerAPI play:trackURI callback:^(id  _Nullable result, NSError * _Nullable error) {
            if (error) {
                reject(@"play_error", @"Failed to play track", error);
            } else {
                resolve(@"Track played successfully");
            }
        }];
    } else {
        reject(@"connection_error", @"Failed to connect to Spotify app", nil);
    }
}

@end

}
@end