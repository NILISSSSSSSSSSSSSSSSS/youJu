<template>
  <form report-submit @submit="formSubmit">
    <view :style="{height: titleHeight+'px'}"></view>
    <view class="my_view">
      <!-- 个人信息 -->
      <view class="my_header_view f_r_s">
        <button @getuserinfo="upMyData" form-type="submit" hover-class="none"
                open-type="getUserInfo"
                class="img_view f_r_c">
          <image mode="aspectFit" :src="headerImg || headerDefaultImg"></image>
        </button>

        <view class="f_c_s data_info">
          <!-- #ifndef H5 || APP-PLUS || APP-PLUS-NVUE-->
          <button @getuserinfo="upMyData"hover-class="none" open-type="getUserInfo"
                  class="f_r_s up_top_info" v-if="myName">
            <view class="my_name">{{ myName }}</view>

            <view class="up_data f_r_s">
              <view :animation="animationData" class="up_data_img"></view>
            </view>
          </button>
          <!-- #endif -->

          <!-- #ifdef APP-PLUS || APP-PLUS-NVUE || H5 -->
          <button hover-class="none" class="f_r_s up_top_info">
            <view class="my_name">{{ myName || "点击登录" }}</view>
          </button>
          <!-- #endif -->

          <!--  #ifdef MP-WEIXIN -->
          <button hover-class="none"
                  v-if="bindTelText == '绑定电话号码'" open-type="getPhoneNumber"
                  @getphonenumber="getPhone" class="bind_phone">{{ bindTelText }}
          </button>

          <view v-else @click.top="changePhone" class="bind_phone">
            <view class="bind_phone_val">{{ bindTelText }}</view>
            <image class="bind_phone_img" mode="scaleToFill"
                   src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/btn_edit.png"></image>
          </view>
          <!--  #endif -->

          <!--  #ifdef APP-PLUS || APP-PLUS-NVUE || H5-->
          <view @click.top="changePhone" class="bind_phone">
            <view class="bind_phone_val">{{ bindTelText }}</view>
            <image class="bind_phone_img" mode="scaleToFill"
                   src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/btn_edit.png"></image>
          </view>
          <!--  #endif -->
        </view>
      </view>

      <!-- 功能 -->
      <view class="controls_view f_r_s">
        <block v-for="(item, index) in controlsList" :key="index">
          <button form-type="submit" hover-class="none"
                  @click="controlsBtn(item)" class="controls_item f_c_c">
            <view class="controls_img" :class="item.className"></view>
            <view class="controls_text">{{ item.text }}</view>
          </button>
        </block>
      </view>

      <!-- 我的钱包 -->
      <view class="wallet">
        <view class="f_r_b wallet_title">我的钱包</view>

        <view class="f_r_b wallet_cont" @click="walletBtn('0')">
          <button form-type="submit" hover-class="none" @click.stop="walletBtn('1')" class="wallet_item f_c_c">
            <view class="wallet_val f_r_c">
              <view class="wallet_val_text">{{ yaJinVal }}</view>
              <view class="wallet_val_unit">元</view>
            </view>

            <view class="wallet_text">专车看房押金</view>
          </button>

          <button form-type="submit" hover-class="none" @click.stop="walletBtn('2')" class="wallet_item f_c_c">
            <view class="wallet_val f_r_c">
              <view class="wallet_val_text">{{ youHuiQuanVal }}</view>
              <view class="wallet_val_unit">张</view>
            </view>

            <view class="wallet_text">优惠券</view>
          </button>
        </view>
      </view>

      <!-- 个人服务 -->
      <view class="my_service">
        <view class="f_r_b wallet_title my_service_title">个人服务</view>

        <view class="my_service_cont f_r_s">
          <block v-for="(item, index) in myselfServiceList" :key="index">
            <view @click.stop="myServiceBtn(item)" class="my_service_item f_c_c">
              <image class="my_service_item_img" :class="item.className" :src="item.imgSrc"></image>
              <view class="my_service_item_text f_r_c">{{ item.text }}</view>
            </view>
          </block>
        </view>
      </view>

      <!-- 我的客服 -->
      <view class="service_view">
        <view class="f_r_b wallet_title my_service_title">我的客服</view>

        <view class="service_cont f_r_b">
          <view @click="onlineChart"
                class="f_c_c service_left service_cont_online">
            <view class="f_r_c">
              <view class="service_icon customeservice_icon"></view>
              <view class="service_oen">在线客服 (推荐)</view>
            </view>

            <view class="service_two">一触即达,分分钟解决您的疑问</view>
          </view>

          <button form-type="submit" hover-class="none" @click="makePhoen" class="f_c_c service_left"
                  style="margin-right: 0;">
            <view class="f_r_c">
              <view class="phone_icon phone_btn"></view>
              <view class="service_oen">客服电话</view>
            </view>

            <view class="service_two">{{ servicePhone }}</view>
          </button>
        </view>
      </view>

      <view class="empty_white"></view>
    </view>

    <bindClaimView v-if="isBindClaimModel"></bindClaimView>

    <get-user-info></get-user-info>
  </form>
</template>

<script>
  import {GetUseInfo, DealUserInfoFromLogin, GetUserTel} from "../../utils/common.js";
  import {UserInfoModel} from "../../model/UserInfoModel.js";
  import {Const} from "../../utils/Const.js";
  import {GetAcountList} from "../../net/GetAcountList.js";
  import {GetRedPacketList} from "../../net/GetRedPacketList.js";
  import {Notification} from "../../utils/Notification.js";
  import {Notify} from "../../utils/Notify.js";
  import {UpUnReadNumTab} from "../../utils/ImChart.js";
  import {DealUserInfo} from "../../net/DealUserInfo";
  import {BindTel} from "../../net/BindTel";
  import {GpsInfoModel} from "../../model/GpsInfoModel";
  import bindClaimView from "@/components/bindClaimView.vue";
  import {Utils} from "../../utils/Utils";

  export default {
    components: {
      bindClaimView
    },

    data() {
      return {
        titleHeight: new Utils().getStatusbarHeight(),

        // 更新信息动画
        animationData: {},
        animationNum: 1,
        bindTelText: "绑定电话号码",

        // 个人信息
        headerDefaultImg: "https://zdzfapi.haofang.net/Public/wxApp/images/mine/fang_default.png",
        headerImg: "",
        myName: "",

        // 功能
        controlsList: [
          {
            text: "买房委托",
            className: "buyhouse_btn",
            pageTo: "/pagesEntrust/trustList/trustList?caseType=3"
          },
          {
            text: "租房委托",
            className: "renthouse_btn",
            pageTo: "/pagesEntrust/trustList/trustList?caseType=4"
          },
          {
            text: "卖房委托",
            className: "sellhouse_btn",
            pageTo: "/pagesEntrust/trustList/trustList?caseType=1"
          },
          {
            text: "出租委托",
            className: "rent_btn",
            pageTo: "/pagesEntrust/trustList/trustList?caseType=2"
          },
          {
            text: "操作指南",
            className: "guide_btn",
            pageTo: "../webView/webView?title=操作指南&url=" + this.Config.userGuideWebUrl + "&type=urlParams"
          },
          {
            text: "关注/收藏",
            className: "collect_btn",
            pageTo: "/pagesHouse/collection/collection"
          }
        ],

        // 个人服务
        myselfServiceList: [
// 					{
// 					    text: "维修",
// 					    imgSrc: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/service_btn.png",
// 					    pageTo: "https://zdzfapi.haofang.net//App/Index/hotActivity"
// 					},
          {
            text: "房贷计算",
            imgSrc: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/mortgage_btn.png",
            pageTo: "/pagesTool/calculatorFangDai/calculatorFangDai",
            type: "view"
          },
          {
            text: "用户协议",
            imgSrc: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/protocol_btn.png",
            pageTo: this.Config.userAgreementWebUrl,
            title: "用户协议",
            type: "urlParams"
          },
          {
            text: "关于我们",
            imgSrc: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/aboutus_btn.png",
            pageTo: "/pagesWeb/aboutUs/aboutUs",
            type: "view"
          },
          // #ifdef APP-PLUS || H5
          {
            text: "设置",
            className: "set_btn",
            imgSrc: "http://cdn.haofang.net/static/wxPlusApp/yjk/common/shezhi.png",
            pageTo: "/pagesTool/appSet/appSet",
            type: "view"
          }
          // #endif
        ],

        servicePhone: Const.servicePhone,

        serviceBtnType: "contact",

        yaJinVal: 0,
        youHuiQuanVal: 0,
        isBindClaimModel: false, // 认领委托弹窗
      };
    },

    onShareAppMessage() {
      return new this.ShareAppMessage().init();
    },

    onShow() {
      new this.SetMetaInfo().initDefault();
      UpUnReadNumTab.setTab();
      this.initData();
    },

    onLoad() {
      //#ifdef MP
      this.serviceBtnType = "contact";
      //#endif

      new this.InitFormSubmit(this);

      // 监听用户信息授权
      new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
    },

    onUnload() {
      // 反注册通知
      new Notification().removeObserverAllNotification(this);
    },

    // 原生按钮点击事件
    onNavigationBarButtonTap(e) {
      if (!e.id) return;

      if (e.id !== "set") return;

      uni.navigateTo({
        url: "/pagesTool/appSet/appSet"
      });
    },

    methods: {
      // 用户信息授权通知回调
      UserInfoChanged() {
        this.initData();
      },

      // 初始化信息
      initData() {
        this.upTel(null);
        this.drawMyData();
        this.setWalltVal()
      },

      // 设置钱包值
      setWalltVal() {
        let me = new UserInfoModel().getModel("me") || {};
        if (!me.userId) return;

        Promise.all([
          new GetAcountList({youyouUserId: me.userId, pageNum: 1, type: 1}).send(),
          new GetRedPacketList({youyouUserId: me.userId, pageNum: 1, pageSize: 30}).send()
        ]).then(res => {
          this.yaJinVal = res && res[0] && res[0].DATA ? res[0].DATA.totalMoney || 0 : 0;
          this.youHuiQuanVal = res && res[1] && res[1].DATA ? res[1].DATA.redNum || 0 : 0;
        });
      },

      // 更新个人信息
      upMyData(e = {}) {
        // #ifdef APP-PLUS || APP-PLUS-NVUE
        return;
        // #endif

        //#ifdef MP

        // #ifndef MP-ALIPAY
        if (!e || !e.detail) return;
        // #endif

        let that = this;
        let animationData = uni.createAnimation({
          duration: 1500,
          timingFunction: 'ease',
        });
        animationData.rotate(720 * this.animationNum).step();
        this.animationData = animationData.export();
        this.animationNum++;
        DealUserInfoFromLogin.init(e.detail || {}, false)
          .then(res => {
            uni.showToast({title: "更新成功", icon: "none"});
            that.drawMyData();
          });
        //#endif
      },
      drawMyData() {
        if (!new UserInfoModel().getModel("userInfo")) return;

        let res = new UserInfoModel().getModel("userInfo");
        if (res && res.userInfo && res.userInfo.avatarUrl) {
          setTimeout(() => {
            this.headerImg = res.userInfo.avatarUrl;
          }, 0);
        }
        setTimeout(() => {
          this.myName = (res && res.userInfo) ? res.userInfo.nickName || "" : "";
        }, 0);
      },

      // 绑定电话
      changePhone() {
        uni.navigateTo({
          url: "/pagesTool/changePhone/changePhone"
        });
      },

      // 获取电话号码
      getPhone(e) {
        let that = this;
        //拒绝授权
        if (e.detail.errMsg && e.detail.errMsg.indexOf("fail user deny") >= 0) {
          return;
        }

        // 您的微信还未绑定手机号
        if (e.detail.errMsg && e.detail.errMsg.indexOf("resp data is empty") >= 0) {
          uni.showModal({
            title: "未获取到授权信息",
            content: "您还未绑定手机号",
            confirmText: "去绑定",
            success: function (res) {
              if (res.confirm) {
                that.changePhone();
              }
            }
          });
        }

        if (!e.detail.encryptedData) {
          return;
        }

        this.upTel(e).then(tel => {
          if (!new UserInfoModel().getModel("telephone")) return;

          // 确认是否有委托
          new BindTel({
            cityId: new GpsInfoModel().getModel("cityInfo").cityId,
            youyouUserId: new UserInfoModel().getModel("me").userId,
            userMobile: new UserInfoModel().getModel("telephone"),
            verify: 9999,
          }).send().then(res => {
            if (res.STATUS != 1) {
              uni.showToast({
                title: res.INFO || info.msg || "认领失败",
                icon: "none"
              });
              return;
            }

            if (res.DATA && res.DATA.userMobileEntrusteExite == 1) {
              that.isBindClaimModel = true;
            } else {
              uni.showToast({
                title: "恭喜，绑定成功",
                icon: 'none'
              });
            }
          });
        })
      },
      upTel(e = {}) {
        let that = this;
        return GetUserTel.init(e)
          .then(tel => {
            if (tel) {
              that.bindTelText = tel;
            } else {
              that.bindTelText = "绑定电话号码";
            }
            return tel;
          });
      },

      // 功能
      controlsBtn(item) {
        if (!item.pageTo) {
          throw new Error("请在controlsList中配置pageTo页面跳转字段");
        }

        uni.navigateTo({
          url: item.pageTo,
          fail: function (err) {
            uni.showModal({
              title: "页面跳转失败",
              content: JSON.stringify(err),
              showCancel: false
            });
          }
        });
      },

      // 钱包
      walletBtn(type) {
        uni.navigateTo({
          url: "/pagesTool/wallet/wallet?type=" + type,
          fail: function (err) {
            uni.showModal({
              title: "页面跳转失败",
              content: JSON.stringify(err),
              showCancel: false
            });
          }
        });
      },

      // 贷款
      loanBtn() {
        uni.navigateTo({
          url: "../webView/webView?bgColor=#ff6D00&color=white&" +
            "url=zdzfapi.haofang.net/App/Index/loanApplyIndex" +
            "&title=悠居客贷款查询",
          fail: function (err) {
            uni.showModal({
              title: "页面跳转失败",
              content: JSON.stringify(err),
              showCancel: false
            });
          }
        });
      },

      // 个人服务
      myServiceBtn(item) {
        if (!item.pageTo) {
          throw new Error("请在myselfServiceList中配置pageTo页面跳转字段");
        }

        let url = "../webView/webView?url=" + item.pageTo
          + "&type=" + item.type + "&title=" + item.title;
        if (item.type && item.type == "view") {
          url = item.pageTo;
        }

        uni.navigateTo({
          url: url,
          fail: function (err) {
            uni.showModal({
              title: "页面跳转失败",
              content: JSON.stringify(err),
              showCancel: false
            });
          }
        });
      },

      // 在线客服
      onlineChart() {
        let me = new UserInfoModel().getModel("me") || {};
        let url = "/pagesTool/messageDetail/messageDetail";
        uni.navigateTo({
          url: url + "?messageId=" + this.ImChart.getServiceId()
            + "&name=专属客服" + "&userId=" + me.userId + "&openId=" + me.openId
        });
      },

      // 拨打电话
      makePhoen() {
        this.DifferenceApi.makePhoneCall(this.servicePhone);
      }
    },
  }
</script>

<style>
  /* 个人信息 */
  .my_view {
    padding-top: 30upx;
    box-sizing: border-box;
  }

  .my_header_view {
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    border: none;
    border-radius: 0;
    will-change: transform;
    padding: 10upx 0 10upx 30upx;
  }

  .my_header_view::after {
    border: none;
    border-radius: 0;
  }

  button.img_view, .img_view {
    width: 100upx;
    height: 100upx;
    border-radius: 100%;
    border: 2upx solid #e2e2e2;
    overflow: hidden;
    box-sizing: border-box;
    margin: auto 20upx auto 0;
    flex-shrink: 0;
  }

  .img_view image {
    width: 100%;
    height: 100%;
  }

  .data_info {
    position: relative;
    width: 90%;
  }

  .up_top_info {
    margin-top: 8upx;
    height: 35upx;
  }

  .my_name {
    height: 35upx;
    line-height: 35upx;
    font-size: 30upx;
    color: #333333;
    font-weight: bold;
    margin: auto 10upx auto 0;
  }

  .bind_phone {
    display: flex;
    align-items: center;
    font-size: 26upx;
    color: #8e94a1;
    border: none;
    margin: 0;
    border-radius: 0;
    padding: 0;
    background: #FFFFFF;
    position: absolute;
    left: 0;
    z-index: 2;
    bottom: 10upx;
    height: 40upx;
    line-height: 40upx;
  }

  .bind_phone::after {
    border: none;
    border-radius: 0;
  }

  .up_data {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 24upx;
    color: #09b277;
    height: 40upx;
    background: none;
    margin: auto 0;
  }

  .up_data::after {
    border: 0;
  }

  .up_data_img {
    width: 44upx;
    height: 44upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/btb_refresh.png) no-repeat center;
    background-size: 100% 100%;
  }

  /* 功能 */
  .controls_view {
    width: 100%;
    flex-wrap: wrap;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 20upx;
    margin-top: 14upx;
  }

  .controls_item {
    flex-shrink: 0;
    width: 25%;
    height: 190upx;
    color: #666666;
    font-size: 26upx;
    text-align: center;
    box-sizing: border-box;
  }

  .controls_img {
    width: 68upx;
    height: 68upx;
    margin: 0 auto 20upx;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .btn_edit {
    height: 12px;
    width: 13px;
    background-position: 0 0;
  }

  .service_view .customeservice_icon {
    height: 24px;
    width: 24px;
    background-position: -13px 0;
  }

  .service_view .phone_btn {
    height: 24px;
    width: 24px;
    background-position: -37px 0;
  }

  .btb_refresh {
    height: 29px;
    width: 29px;
    background-position: -61px 0;
  }

  .renthouse_btn {
    background-image: url("http://cdn.haofang.net/static/wxPlusApp/yjk/me/renthouse_btn.png");
  }

  .rent_btn {
    background-image: url("http://cdn.haofang.net/static/wxPlusApp/yjk/me/chuzu_btn.png");
  }

  .sellhouse_btn {
    background-image: url("http://cdn.haofang.net/static/wxPlusApp/yjk/me/sellhouse_btn.png");
  }

  .buyhouse_btn {
    background-image: url("http://cdn.haofang.net/static/wxPlusApp/yjk/me/buyhouse_btn.png");
  }

  .collect_btn {
    background-image: url("http://cdn.haofang.net/static/wxPlusApp/yjk/me/collect_btn.png");
  }

  .guide_btn {
    background-image: url("http://cdn.haofang.net/static/wxPlusApp/yjk/me/guide_btn.png");
  }

  .controls_text {
    text-align: center;
    color: #101d36;
    font-size: 24upx;
  }

  .empty_white {
    height: 40upx;
    background-color: #FFFFFF;
  }

  /* 个人钱包 */
  .wallet {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 0 30upx 30upx;
  }

  .wallet_title {
    position: relative;
    width: 100%;
    height: auto;
    line-height: 104upx;
    box-sizing: border-box;
    font-size: 30upx;
    color: #333;
    font-weight: bold;
    overflow: hidden;
  }

  .right_arrow {
    width: 13upx;
    height: 24upx;
    margin: auto 0;
  }

  .wallet_cont {
    position: relative;
    display: flex;
    width: 100%;
    height: 170upx;
    background-color: #ffffff;
    box-shadow: 0 4upx 33upx 2upx rgba(55, 55, 55, 0.1);
    border-radius: 10upx;
    box-sizing: border-box;
  }

  .wallet_item {
    flex: 1;
    text-align: center;
    height: 100%;
  }

  .wallet_val_text {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-right: 10upx;
    position: relative;
    top: 2px;
    color: #333333;
    font-size: 44upx;
  }

  .wallet_val_unit {
    font-size: 22upx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .wallet_text {
    margin-top: 20upx;
    font-size: 26upx;
    color: #666;
  }

  /* 个人服务 */
  .my_service_title {
    padding-left: 30upx;
    box-sizing: border-box;
  }

  .my_service_cont {
    margin-top: -30upx;
  }

  .my_service_item {
    position: relative;
    flex-shrink: 0;
    width: 25%;
    height: 190upx;
    color: #101d36;
    font-size: 26upx;
    text-align: center;
    box-sizing: border-box;
  }

  .my_service_item_img {
    width: 61upx;
    height: 61upx;
    margin: 0 auto 15upx auto;
  }
  .my_service_cont .set_btn{
    width: 48upx;
    height: 48upx;
    margin: 6.5upx auto 21.5upx auto;
  }

  /* 客服 */
  .service_view {
    background: #FFFFFF;
    box-sizing: border-box;
    padding-bottom: 40upx;
  }

  .service_cont {
    padding: 0 40upx;
    box-sizing: border-box;
  }

  .service_left::after {
    border: none;
    padding: 0;
    border-radius: 0;
  }

  .service_cont .service_cont_online {
    margin-right: 30upx;
  }

  .service_left {
    padding: 0;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    -webkit-tap-highlight-color: initial;
    overflow: hidden;
    color: #101D36;
    background-color: #f6f7f9;
    width: 100%;
    margin: 0;
    height: 130upx;
    border-radius: 10upx;
  }

  .service_icon {
    width: 21.5px;
    height: 21.5px;
    margin: auto 14upx auto 0;
  }

  .service_oen {
    color: #101D36;
    font-size: 30upx;
    font-weight: bold;
    margin: auto 0;
  }

  .service_two {
    color: #7A8190;
    font-size: 20upx;
    margin-top: 14upx;
  }

  .phone_icon {
    width: 21.5px;
    height: 21.5px;
    margin: auto 6px auto 0;
  }

  .service_icon, .phone_icon {
    background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/mine_sprites.png) no-repeat;
    background-size: 385px 34px;
  }

  .bind_phone_val {
    font-size: 28upx;
    color: #8E94A1;
    margin: auto 12upx auto 0;
    height: 40upx;
    line-height: 40upx;
  }

  .bind_phone_img {
    width: 26upx;
    height: 25upx;
    flex-shrink: 0;
    margin: auto 0;
  }
</style>
