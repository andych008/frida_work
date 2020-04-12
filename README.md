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
没什么有用的信息
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

/领红包，早晚打卡，智勇闯关，每日运动
        at com.qsmy.busniess.nativeh5.view.activity.CommonH5Activity.onCreate(CommonH5Activity.java:78)

//个人主页
        at com.qsmy.busniess.community.view.activity.PersonalSpaceActivity.onCreate(PersonalSpaceActivity.java:140)
//达标赛
        at com.qsmy.busniess.walkmatch.view.activity.WalkMatchActivity.onCreate(WalkMatchActivity.java:197)
//bytedance视频广告页 (达标赛 点击报名 可以弹出)  ，bytedance字节跳动？ 搞一搞。
        at com.bytedance.sdk.openadsdk.activity.TTBaseVideoActivity.onCreate(TTBaseVideoActivity.java:249)
        at com.bytedance.sdk.openadsdk.activity.TTRewardVideoActivity.onCreate(TTRewardVideoActivity.java:72)
//拼多多广告页 (达标赛 报名 之后再进入)，纯广告，下载拼多多的，可以返回。
        at com.qq.e.ads.ADActivity.onCreate(Unknown Source)
//热门话题，详细页        
        at com.qsmy.busniess.community.view.activity.TopicDetailActivity.onCreate(TopicDetailActivity.java:131)

//热启动进入
        at com.qsmy.business.app.base.BaseActivity.onCreate(BaseActivity.java:42)
        at android.support.shadow.splash.activity.WarmSplashActivity.onCreate(WarmSplashActivity.java:27)
```
得到activity路径
领金币相关：
1. 每日运动
    >点击一项运动，离开界面也在进行，运动完成后可领取金币。点击"领取金币"会**弹出广告**。

    >运行时间到，怎么下发通知，会不会有广播？和`com.android.providers.calendar`， `com.qsmy.walkmonkey:pushservice`相关吗？

1. 达标赛
    >点击报名会**弹出广告**。广告视频结束后也不能按物理返回。只能点右上角xx。







## 一些类(可以考虑打开jadx反混淆)
- LocalNotifyClickUtils//com.qsmy.common.b.a
com.qsmy.common.b.a.a(this, getIntent());//EmptyLaunchActivity，push一个notification
- CustomNotifyManager//com.qsmy.common.c.b
com.qsmy.common.c.b.a()//单例构造器---CustomNotifyManager
com.qsmy.common.c.b.a().b()//返回一个Notification
- LocationTrackManager//com.qsmy.busniess.mappath.f.b
b.this.e.enableBackgroundLocation(11100, com.qsmy.common.c.b.a().b());
- SensorEventListener的子类
  - StepListenerManager//com.qsmy.busniess.walk.manager.b implements SensorEventListener
  - OutdoorsRunningStepManager//com.qsmy.busniess.mappath.f.e implements SensorEventListener
- StepPresenter//







## 其它
- 数美-天网 反欺诈SDK
https://www.ishumei.com/product/bs-post-sdk.html

com.ishumei.O000O00000oO.O00O0000OooO.O000O00000o0O.O000O00000o0O(O00O0000OooO)
 SensorEventListener
 public void onSensorChanged(SensorEvent sensorEvent)





