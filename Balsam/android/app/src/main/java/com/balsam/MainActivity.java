package com.balsam;

import com.facebook.react.ReactActivity;
// new import
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Balsam";
  }

  // onResume data
   @Override
    protected void onResume() {
        super.onResume();
        WritableArray params = Arguments.createArray();
        params.putString("MyName", "Nabeel");

        ReactContext
     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
     .emit("onHostResume", params);
    }
}
