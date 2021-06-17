package com.outsystems.devicerisk;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

import com.iovation.mobile.android.FraudForceConfiguration;
import com.iovation.mobile.android.FraudForceManager;

import android.graphics.Bitmap;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * This class echoes a string called from JavaScript.
 */
public class DeviceRisk extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("setup")) {
            String key = args.getString(0);
            this.setup(key, callbackContext);
            this.webviewSetup(callbackContext);
            return true;
        }
        return false;
    }

    private void setup(String key, CallbackContext callbackContext) {
        if (key != null && key.length() > 0) {
            FraudForceConfiguration fraudForceConfiguration = new FraudForceConfiguration.Builder()
                    .enableNetworkCalls(true)
                    .subscriberKey(key)
                    .build();

            FraudForceManager fraudForceManager = FraudForceManager.getInstance();
            fraudForceManager.initialize(fraudForceConfiguration, cordova.getActivity().getApplicationContext());
            callbackContext.success();
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }

    private void webviewSetup(CallbackContext callbackContext){
        final WebView wv = (WebView) this.webView.getEngine().getView();
        String url = "file:///android_asset/JsInjectionIntegration.html";
        wv.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                FraudForceManager.getInstance().refresh(wv.getContext());
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                String[] ref = url.split("#");
                if (url.startsWith("iov://") && ref.length > 1 && ref[1] != null) {
                    String injectedJavascript="javascript:(function() { " +
                            "document.getElementById('" + ref[1] + "').value = '" + FraudForceManager.getInstance().getBlackbox(cordova.getActivity().getApplicationContext()) +
                            "';})()";
                    wv.loadUrl(injectedJavascript);
                    return true;
                }
                return false;
            }
        });

        wv.loadUrl(url);
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setAppCacheEnabled(true);
        callbackContext.success("Setup completed");
    }

}
