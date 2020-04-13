///<reference path='../frida-gum.d.ts'/>
console.log("------------Agent speaking from PID", Process.id);

Java.perform(function () {
  console.log("------------");

  Java.use("com.qsmy.business.a").c.implementation = function () {
    var c = this.c();
    console.log("hook App get c =" + c);
    return true;
  };

  var application = Java.use("bin.mt.apksignaturekillerplus.HookApplication");
  application.attachBaseContext.overload("android.content.Context").implementation = function (context) {
    console.log("Hook MyApplication");

    //日志开关
    //不要忘记调用原方法。一般放在最后，这样前面的hook才能更早生效。
    this.attachBaseContext(context);

    tb.traceActivity();

    // tb.enumerateLoadedClasses("Application")

    // tb.ownMethods(Java.use("com.qsmy.BaseApplicationLike"))
    // tb.ownMethods(Java.use("com.qsmy.BaseApplication"))

    // tb.enumerateLoadedClasses("Sensor")

    Java.use("com.qsmy.common.view.widget.TitleBar").a.overload('boolean').implementation = function (z) {
      console.log("hook TitleBar left clickable :" + z);
      this.a(true);
    };

    var TTRewardVideoActivity = Java.use("com.bytedance.sdk.openadsdk.activity.TTRewardVideoActivity");
    TTRewardVideoActivity.Q.implementation = function () {
      console.log("hook TTRewardVideoActivity click_close event" );
      //do nil
    };

    TTRewardVideoActivity.onCreate.overload("android.os.Bundle").implementation = function (
      bundle
    ) {
      console.log("TTRewardVideoActivity#onCreate---");

      Java.use("android.widget.RelativeLayout").setVisibility.implementation = function (z) {
        console.log("hook RelativeLayout setVisibility :" + z);
        // this.setVisibility(true);
      };

 
      this.onCreate(bundle);
    
    };
    //
    // this.f10799g.setVisibility(0);
    // /* renamed from: g */
    // RelativeLayout f10799g;


    //   /* renamed from: Q */
    //   public void m10860Q() {
    //     HashMap hashMap = new HashMap();
    //     if (this.f10808p != null && this.f10808p.mo24261c() == 1 && this.f10808p.mo24296o()) {
    //         hashMap.put("duration", Long.valueOf(System.currentTimeMillis() - this.f10785ar));
    //     }
    //     AdEventManager.m11020n(this.f10795c, this.f10808p, "rewarded_video", "click_close", (Map<String, Object>) null);
    // }



    // at android.app.Activity.onCreate(Native Method)
    // at com.qq.e.ads.ADActivity.onCreate(Unknown Source)
    
    //android.support.shadow.rewardvideo.view.activity.RewardVideoAdActivity.onCreate
  };
});

//the toolbox
const tb = {
  // tb.enumerateLoadedClasses("Application")
  enumerateLoadedClasses: function (word) {
    console.log("[*] enumerateLoadedClasses--------------" + word);
    if (word) {
      Java.enumerateLoadedClasses({
        onMatch: function (_className) {
          if (_className.indexOf(word) >= 0) {
            console.log("[*] found instance of '" + _className + "'");
          }
        },
        onComplete: function () {
          console.log("[*] class enuemration complete");
        },
      });
    }
  },

  // tb.ownMethods(Java.use("com.qsmy.BaseApplication"))
  ownMethods: function (clazz) {
    console.log("[*] ownMethods--------------" + clazz.class.getSimpleName());
    var ownMethods = clazz.class.getDeclaredMethods();
    ownMethods.forEach(function (s) {
      console.log(s);
    });
  },

  // tb.showStacks()
  showStacks: function (word) {
    Java.perform(function () {
      var t = Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new());
      if (word) {
        const idx = t.indexOf(word);
        if (idx > 0) {
          t = t.substr(0, idx) + "......";
        }
      }
      console.log(t);
    });
  },

  each: function (arr) {
    for (var i in arr) {
      console.log("item : " + JSON.stringify(arr[i]));
    }
  },

  // tb.traceActivity("yourpackage.RoadMapDetailActivity")
  // tb.traceActivity()
  traceActivity: function () {
    if (arguments.length === 1) {
      var act = arguments[0];
    } else {
      var act = "android.app.Activity";
    }

    var actShort = act.substr(act.lastIndexOf(".") + 1);
    var Activity = Java.use(act);
    Activity.onCreate.overload("android.os.Bundle").implementation = function (bundle) {
      console.log(actShort + "#onCreate---");
      this.onCreate(bundle);
      if (actShort.indexOf("Activity") == 0) {
        tb.showStacks("android.app.Activity.performCreate");
      }
      console.log(actShort + "#onCreate---end");
    };
  },

  //tb.dlog("your_msg")
  //tb.dlog("your_msg","your_pre")
  dlog: function (msg, pre) {
    var Log = Java.use("android.util.Log");
    if (arguments.length === 1) {
      Log.i("andy", "andy--- " + msg);
    } else if (arguments.length === 2) {
      Log.i("andy", pre + "--- " + msg);
    }
  },
};
