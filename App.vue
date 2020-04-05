<script>
  import {getAdcodeHere} from './utils/addressGps.js';
  import {Notification} from './utils/Notification.js';
  import {Notify} from './utils/Notify.js';
  import {GetCityInfoByGps} from './net/GetCityInfoByGps.js';
  import {GpsInfoModel} from './model/GpsInfoModel.js';
  import {PlatformUserBehavior} from "./utils/PlatformUserBehavior.js";
  import {UserInfoModel} from "./model/UserInfoModel.js";
  import {GetTelephoneFormLogin} from "./utils/common.js";
  import {CommonModel} from "@/model/CommonModel.js";
  import {RedirectPage} from "@/utils/RedirectPage.js";
  import {Config} from "@/utils/config.js";
  import {Const} from "@/utils/Const.js";
  import {UpdateUserLoginInfo} from "@/net/im/LiaoKeNet.js";
  import {UpWxApp} from "./utils/updateManager";
  import {UserBehavior} from './utils/UserBehavior.js';
  import {ClearStorageIntoHomePage} from "./utils/common";
  import {CompStoreLeaveCompIndexModel} from "./pagesStore/model/CompStoreModel";
  import {SendServiceMsg} from "./net/common/GetSessionKey";
  import {ImChart} from "./utils/ImChart";
  import {DealChartListModel} from "./model/im/ChatListModel";
  import {EntrustRedpackagesModel} from "@/model/EntrustRedpackagesModel.js";
  import Vue from "vue";

  // #ifdef MP-WEIXIN
  const ald = require('./utils/ald-stat.js');//引入阿拉丁统计代码
  // #endif

  let privateData = {
    enterInterVal: null,  // 进入10分钟请求一次的interval
    enterStatus: 1,  // 1 进入， 2 退出
  };

  export default {
    // globalData: {
    //     imChartClass: null,
    //     notifyNames: Object.create(null),
    // },

    onLaunch: function () {
      new CompStoreLeaveCompIndexModel().removeModel();
      PlatformUserBehavior.init();
      this.initData();
      // #ifdef APP-PLUS || APP-PLUS-NVUE || H5
      // this.h5SetTestUserId();
      // #endif
      if (process.env.NODE_ENV === 'development') {
        console.log('开发环境');
        // #ifdef APP-PLUS || APP-PLUS-NVUE || H5
        this.h5SetTestUserId();
        // #endif
      }

      // 授权后用户直接返回用户信息
      GetTelephoneFormLogin.init().then((res) => {
        // 初始化im用户信息
        this.ImChart.initImUserInfo();
      });

      // #ifdef MP-WEIXIN
      wx.onPageNotFound(function (res) {
        new RedirectPage(res.path || "", res.query || {}).init();
      });
      // #endif
    },

    onShow: function (options) {
      // 全局设置设备信息
      Vue.prototype.getSystemInfo = function () {
        return uni.getSystemInfoSync();
      };

      if (new UserInfoModel().getModel("me")
        && new UserInfoModel().getModel("me").userId) {
        if (ImChart.imChartVal) {
          ImChart.imChartVal.connect();
        }
        if (new UserInfoModel().getModel("accid") && new UserInfoModel().getModel("me")
          && new UserInfoModel().getModel("me").token) {
          ImChart.setToken(new UserInfoModel().getModel("me").token);
          ImChart.setUuAccid(new UserInfoModel().getModel("accid"));
          ImChart.initConfig();
        }
        ImChart.getChartList(() => {
          new DealChartListModel().sendMsgListNc();
        });
      }
      // #ifdef MP-WEIXIN
      // 一分钟以上主动调用客服给C端发一条消息
      SendServiceMsg.send();
      let sceneMap = [1007, 1008, 1047];
      if (options.scene && sceneMap.includes(options.scene)) {
        new CompStoreLeaveCompIndexModel().removeModel();
      }
      new ClearStorageIntoHomePage();
      new UpWxApp();
      this.dealEnterAndLeaveApp().enter();
      // #endif
      this.initData();
    },

    onHide: function () {
      // #ifdef MP-WEIXIN
      // 一分钟以上主动调用客服给C端发一条消息(退出)
      SendServiceMsg.exit();

      //退出小程序时删除 抢单优惠券缓存
      new EntrustRedpackagesModel().removeModel();

      new CompStoreLeaveCompIndexModel().setModel(1);
      this.dealEnterAndLeaveApp().leave();
      // #endif
    },

    methods: {
      // 地理位置信息
      initData() {
        let enterAppTime = new CommonModel().getModel("enterAppTime") || 0;
        enterAppTime = parseInt(enterAppTime);
        let nowTime = new Date().getTime();
        // 5 分钟内无需定位
        if (new GpsInfoModel().getModel("gpsInfo") && new GpsInfoModel().getModel("gpsInfo").cityId
          && enterAppTime && (nowTime - enterAppTime < (5 * 60 * 1000))) {
          return;
        }

        new CommonModel().setModel(nowTime, "enterAppTime");
        let that = this;
        let item = {
          lng: 104.04311,
          lat: 30.64242,
          adcode: "5101",
          cityName: "成都"
        };
        getAdcodeHere(
          function (lng, lat, adcode, cityName) {
            item = {lng, lat, adcode, cityName};
            that.setCityInfo(item)
              .then((data) => {
                if (data.needNc) {
                  new Notification().postNotification(Notify.GpsChanged.Name, data.cityInfo);
                }
              });
          },
          function () {
            // 定位失败默认显示成都的数据
            that.setCityInfo(item)
              .then((data) => {
                if (data.needNc) {
                  new Notification().postNotification(Notify.GpsChanged.Name, data.cityInfo);
                }
              });
          }
        );
      },

      setCityInfo(item) {
        return new Promise((resolve, reject) => {
          new GpsInfoModel().setModel(item, "gpsInfo");
          if (!item.lat || !item.lng) {
            resolve({cityInfo: new GpsInfoModel().getModel("cityInfo") || {}, needNc: false});
            return;
          }

          new GetCityInfoByGps({lat: item.lat, lng: item.lng}).send()
            .then(res => {
              let data = res.data || {};
              if (!data.cityId || !data.cityName) {
                resolve({cityInfo: new GpsInfoModel().getModel("cityInfo") || {}, needNc: false});
                return;
              }

              let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
              let needNc = false;
              if (cityInfo.cityId != item.cityId) {
                needNc = true;
              }
              item.cityId = data.cityId;
              item.cityName = data.cityName;
              item.regId = data.regId || "";
              item.regName = data.regName || "";
              new GpsInfoModel().setModel(item, "gpsInfo");
              new GpsInfoModel().setModel(data, "cityInfo");
              resolve({cityInfo: new GpsInfoModel().getModel("cityInfo") || {}, needNc: needNc});
            })
            .catch(err => {
              uni.showModal({
                title: "请求失败",
                content: "获取当前位置信息失败啦！请稍后重试。",
                confirmColor: "#ab7f2e",
                confirmText: "我知道了",
                showCancel: false
              });
              reject(err);
            });
        });
      },

      // h5 方便测试，再h5上设置默认的userId
      h5SetTestUserId() {
        if (Config.env == "pro") {
          new UserInfoModel().setModel({userId: "219977", openId: "oD5_z0Ir5YLfUPEBuf3jIxspAsOo"}, "me");
          new UserInfoModel().setModel("uu_219977", "accid");
          new UserInfoModel().setModel({userInfo: {}}, "userInfo");
          // new UserInfoModel().setModel({userId: "1565144", openId: "oD5_z0Ir5YLfUPEBuf3jIxspAsOo"},"me");
          // new UserInfoModel().setModel("17628000821","telephone");
        }
        if (Config.env == "beta") {
          new UserInfoModel().setModel({userId: "1249942", openId: "oAg0N5JyKRUN0GTmvayJyZTKnCGY"}, "me");
          new UserInfoModel().setModel("uu_1249942", "accid");
        }
        if (Config.env == "dev") {
          // 子弹
          // new UserInfoModel().setModel({userId: "25157", openId: "oD5_z0Ir5YLfUPEBuf3jIxspAsOo"},"me");
          // new UserInfoModel().setModel("uu_25157", "accid");

          // 悠居客
          new UserInfoModel().setModel({
            userInfo: {
              nickName: "王小黑",
              avatarUrl: ""
            }
          }, "userInfo");
          new UserInfoModel().setModel({userId: "36536", openId: "odheb5YrVjwk3OKMQ2lHqPo-qX9E"}, "me");
          new UserInfoModel().setModel("uu_36536", "accid");
        }
      },


      // 处理进入和退出app判断
      dealEnterAndLeaveApp() {
        let that = this;

        class EnterAppCheck {
          static initEnterApp() {
            let me = new UserInfoModel().getModel("me") || {};
            let userId = me.userId || "";
            if (!userId) return;

            new UpdateUserLoginInfo({youyouUserId: userId, loginType: Const.loginType_zdzf}).send()
          }

          static enter() {
            privateData.enterStatus = 1;
            this.initEnterApp();
            this.leave();
            privateData.enterInterVal = setInterval(() => {
              if (!privateData.enterInterVal || privateData.enterStatus === 2) {
                this.leave();
                return;
              }

              this.initEnterApp();
            }, 60 * 1000);
          }

          static leave() {
            privateData.enterStatus = 2;
            clearInterval(privateData.enterInterVal);
            privateData.enterInterVal = null;
          }
        }

        return EnterAppCheck;
      },
    }
  };
</script>

<style>
  /*每个页面公共css */
  @import './common/common.css';
  @import './common/theme.css';

  /* 初始化默认样式 */
  .uni-page-head__title {
    font-weight: normal !important;
  }

  body,
  html {
    max-width: 640px;
    margin: 0 auto;
  }

  uni-tabbar,
  uni-tabbar .uni-tabbar {
    max-width: 640px;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
  }

  button {
    padding: 0;
    margin: 0;
    background: inherit;
    text-align: left;
    border: none;
    border-radius: 0;
    line-height: normal;
  }

  button::after {
    border: none;
    border-radius: 0;
  }
  uni-page-body,#app {height: 100%;}
</style>
