
#import <Cordova/CDV.h>
@import FraudForce;
@import UIKit;
@import WebKit;

@interface DeviceRisk : CDVPlugin <WKScriptMessageHandler>

@property (nonatomic, weak) IBOutlet UIView *webkitContainer;

- (IBAction)loadWebView:(id)sender;

@end