///<reference path='../frida-gum.d.ts'/>
//frida -U com.qsmy.walkmonkey -l hook.js --no-pause --runtime=v8

Java.perform(function () {
  console.log("------------");



  // //遍历heap中的对象 OutdoorsRunningStepManager
  // //com.qsmy.busniess.mappath.f.e implements SensorEventListener
  // Java.choose("com.qsmy.busniess.mappath.f.e", {
  //   onMatch: function (instance) {
  //     console.log("[*] Found instance: " + instance);
  //   },
  //   onComplete: function () {
  //     console.log("[*] Finished heap search");
  //   },
  // });

  var showLog = function(msg) {
    console.log(msg)
  }

  //遍历heap中的对象 StepListenerManager 走路的listener
  Java.choose("com.qsmy.busniess.walk.manager.b", {
    onMatch: function (instance) {
      console.log("[*] Found StepListenerManager instance: " + instance);
    },
    onComplete: function () {
    },
  });
  
  var StepListenerManager = Java.use("com.qsmy.busniess.walk.manager.b");
  StepListenerManager.onSensorChanged.implementation = function (sensorEvent) {
    console.log("hook onSensorChanged")
    showLog(sensorEvent)
    this.onSensorChanged(sensorEvent)
  };



  //遍历heap中的对象 WalkManager 走路manager，向ui下面数据
  Java.choose("com.qsmy.busniess.walk.manager.f", {
    onMatch: function (instance) {
      console.log("[*] Found WalkManager instance: " + instance);
    },
    onComplete: function () {
    },
  });

   
  var WalkManager = Java.use("com.qsmy.busniess.walk.manager.f");
  WalkManager.a.overload('java.lang.String', 'int').implementation = function(k, step) {
    console.log("hook WalkManager update step")
    showLog("k = "+k+", step ="+step)
    this.a(k, step)
  };
  //get step
  WalkManager.g.implementation = function() {
    var step = this.g()
    console.log("hook WalkManager get step ="+step)

    // tb.showStacks()

    return step
  };


  //加密前
  var EncryptUtils = Java.use("com.qsmy.business.utils.EncryptUtils");
  EncryptUtils.nativeBase64Encrypt.implementation = function(str) {
    console.log("hook nativeBase64Encrypt str ="+str)
    return this.nativeBase64Encrypt(str);
  };



  

});






//the toolbox
const tb = {

  // tb.enumerateLoadedClasses("Application")
  enumerateLoadedClasses: function(word) {
    console.log("[*] enumerateLoadedClasses--------------"+word);
    if(word){
      Java.enumerateLoadedClasses({
        onMatch: function(_className){
          if(_className.indexOf(word)>=0){
            console.log("[*] found instance of '"+_className+"'");
          }
        },
        onComplete: function(){
          console.log("[*] class enuemration complete");
        }
      });
    }
  },

  // tb.ownMethods(Java.use("com.qsmy.BaseApplication"))
  ownMethods: function(clazz) {
    console.log("[*] ownMethods--------------"+clazz.class.getSimpleName());
    var ownMethods = clazz.class.getDeclaredMethods();
    ownMethods.forEach(function(s) {
			console.log(s);
    })
  },

  // tb.showStacks()
  showStacks: function (word) {
    Java.perform(function () {
      var t = Java.use("android.util.Log").getStackTraceString(
        Java.use("java.lang.Exception").$new()
      );
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
    Activity.onCreate.overload("android.os.Bundle").implementation = function (
      bundle
    ) {
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
}

