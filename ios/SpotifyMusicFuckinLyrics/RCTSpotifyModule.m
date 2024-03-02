#import "RCTSpotifyModule.h"
#import <SpotifyiOS/SpotifyiOS.h>

@implementation RCTSpotifyModule {
    SPTAppRemote *_appRemote;
}

RCT_EXPORT_MODULE(SpotifyModule);

RCT_EXPORT_METHOD(playTrack:(NSString *)trackURI
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
   // Bağlantı parametrelerini ayarla
    NSDictionary *connectionParameters = @{
        SPTAppRemoteOptionClientIDKey: @"your_client_id",
        SPTAppRemoteOptionRedirectURIKey: @"your_redirect_uri",
        SPTAppRemoteOptionClientSecretKey: @"your_client_secret",
    };

    // Spotify bağlantısını oluştur
    SPTAppRemote *appRemote = [[SPTAppRemote alloc] initWithApplicationIdentifier:@"com.spotify.music" configuration:[[SPTConfiguration alloc] initWithClientID:@"081f04c9fc134332a54d2e1c567e7096" redirectURL:[NSURL URLWithString:@"your_redirect_uri"]] logLevel:SPTAppRemoteLogLevelDebug];

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