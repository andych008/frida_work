///<reference path='../frida-gum.d.ts'/>
//frida -U com.qsmy.walkmonkey -l hook.js --no-pause --runtime=v8

Java.perform(function () {
  console.log("------------")


  //遍历heap中的对象 StepListenerManager
  Java.choose("com.qsmy.busniess.walk.manager.b", {
    onMatch: function (instance) {
      console.log("[*] Found instance: " + instance);
    },
    onComplete: function () {
      console.log("[*] Finished heap search");
    },
  });
  
  //遍历heap中的对象 OutdoorsRunningStepManager
  //com.qsmy.busniess.mappath.f.e implements SensorEventListener
  Java.choose("com.qsmy.busniess.mappath.f.e", {
    onMatch: function (instance) {
      console.log("[*] Found instance: " + instance);
    },
    onComplete: function () {
      console.log("[*] Finished heap search");
    },
  });
})


