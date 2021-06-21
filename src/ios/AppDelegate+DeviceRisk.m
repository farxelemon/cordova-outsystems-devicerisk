#import "AppDelegate+DeviceRisk.h"
#import <objc/runtime.h>
#import "MainViewController.h"

#define kAppDelegateDeviceRiskLocMngr @"tkLocationManager"

@implementation AppDelegate (DeviceRisk)

-(void)setLocationManager:(CLLocationManager *)locationMngr{
    objc_setAssociatedObject(self, kAppDelegateDeviceRiskLocMngr, locationMngr, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

-(CLLocationManager*)locationManager{
    return objc_getAssociatedObject(self, kAppDelegateDeviceRiskLocMngr);
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    if (CLLocationManager.locationServicesEnabled) {
        switch (CLLocationManager.authorizationStatus) {
            case kCLAuthorizationStatusAuthorizedAlways:
            case kCLAuthorizationStatusAuthorizedWhenInUse:
                // The app is authorized to track the device location. FraudForce will be able to do so as
                // well, however, this sample app is not designed to demonstrate the collection of such data.
                break;
            case kCLAuthorizationStatusDenied:
            case kCLAuthorizationStatusRestricted:
                // (Apple docs) "If the authorization status is restricted or denied, your app is not
                // permitted to use location services and you should abort your attempt to use them."
                break;
            case kCLAuthorizationStatusNotDetermined:
                // Request permission to access location data.
                self.locationManager = [CLLocationManager new];
                self.locationManager.delegate = self;
                [self.locationManager requestWhenInUseAuthorization];
                break;
        }
    }
    
    [FraudForce delegation:self];
    self.viewController = [[MainViewController alloc] init];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
	
- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [FraudForce start];
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

#pragma mark - Location Manager Delegate

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    switch (status) {
        case kCLAuthorizationStatusAuthorizedAlways:
        case kCLAuthorizationStatusAuthorizedWhenInUse:
            // The app is authorized to track the device location. FraudForce will be able to do so as
            // well, however, this sample app is not designed to demonstrate the collection of such data,
            // so we just clear our strong referene to the object.
            self.locationManager = nil;
            break;
        case kCLAuthorizationStatusDenied:
        case kCLAuthorizationStatusRestricted:
            // Permission to track location has been denied. Neither the app nor FraudForce will be able
            // to track the device location unless the user grants permission in Settings.
            self.locationManager = nil;
            break;
        case kCLAuthorizationStatusNotDetermined:
            // When not determined, keep waiting (by continuing to retain the locationManager).
            break;
    }
}

#pragma mark - FraudForceDelegate protocol

- (BOOL)shouldEnableNetworkCalls {
    return YES;
}

@end
