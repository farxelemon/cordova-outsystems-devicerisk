#import "AppDelegate.h"
@import CoreLocation;
@import FraudForce;

@interface AppDelegate (DeviceRisk) <CLLocationManagerDelegate, FraudForceDelegate>
@property (strong, nonatomic) CLLocationManager *locationManager;
@end
