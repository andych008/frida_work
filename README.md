# hook 步多多

## Manifest文件

搞出包名`com.qsmy.walkmonkey`

mt编辑器去签名验证后Application成了它
`bin.mt.apksignaturekillerplus.HookApplication`

`android:debuggable="true"`

`adb shell am start -D -n com.qsmy.walkmonkey/com.qsmy.busniess.welcome.WelcomeActivity`


## frida枚举`Application`相关的类，并遍历其定义的方法

```
tb.enumerateLoadedClasses("Application")
tb.ownMethods(Java.use("com.qsmy.BaseApplicationLike"))
tb.ownMethods(Java.use("com.qsmy.BaseApplication"))
```
## frida trace activity

```
tb.traceActivity()
```
```
Activity#onCreate---
        at com.qsmy.busniess.welcome.WelcomeActivity.onCreate(WelcomeActivity.java:29)
Activity#onCreate---end
Activity#onCreate---
        at com.qsmy.busniess.main.view.activity.MainActivity.onCreate(MainActivity.java:119)
Activity#onCreate---end
```




