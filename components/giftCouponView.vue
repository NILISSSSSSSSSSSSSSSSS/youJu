<template>
  <!-- 抢单优化 - 未绑定号码的需要在 首页/详情页/微店首页 弹出优惠券窗口，引导绑定号码 v-if="!userMobile && userId && redpackages" -->
  <view class="giftCouponView" v-if="!userMobile && userId && redpackagesNum">
    <view class="big-box" v-if="!!openGiftFlag">
      <view class="giftCoupon-mask"></view>
      <view class="cont">
        <view class="close-btn" @tap="closeGiftCouPon"></view>
        <view class="gift-tt">恭喜你 已获{{redpackagesNum}}元中介费抵扣券</view>
        <view class="gift-icon">
          <view class="gift-icon-text">
            <view class="gift-icon-num">{{redpackagesNum}}</view>
            <view class="gift-icon-unit">元</view>
          </view>
        </view>
        <view class="gift-desc" v-if="caseType !=4 && caseType != 2">线上成交还可参与佣金全返抽奖活动哦~</view>
        <!--#ifdef MP-WEIXIN-->
        <button v-if="!userMobile" class="check-mobile-button" open-type="getPhoneNumber"
                @getphonenumber="getWxPhoneNum">
          <view class='gift-btn global-confirm-btn'>立即领取</view>
        </button>
        <!--#endif-->
        <!--#ifndef MP-WEIXIN-->
        <button v-if="!userMobile" @click.stop="bindTel" class="check-mobile-button">
          <view class='gift-btn global-confirm-btn'>立即领取</view>
        </button>
        <!--#endif-->
      </view>
    </view>
    <view class="mini-box" v-if="!openGiftFlag" @click.stop="openGiftCouPon">
      <view class="mini-box-num">{{redpackagesNum}}</view>
    </view>
  </view>
</template>

<script>
  import {Notification} from "../utils/Notification.js";
  import {Notify} from "../utils/Notify.js";
  import {UserInfoModel} from "@/model/UserInfoModel.js";
  import {GpsInfoModel} from "@/model/GpsInfoModel.js";
  import {EntrustRedpackagesModel} from "@/model/EntrustRedpackagesModel.js";
  import {CurrentPages, GetUserTel} from "../utils/common.js";
  import {GetRedpackages} from "../net/entrust/GetRedpackages.js";
  import {GiftCoupon} from "../net/entrust/GiftCoupon.js";
  import {BindTel} from "../net/BindTel";

  export default {
    data() {
      return {
        userMobile: '', //用户号码
        userId: '',     //用户id
        redpackagesNum: '',//红包优惠券金额
        openGiftFlag: true,  //是否展开  红包弹窗
        firstComePageKey: 'giftCouponComeInPath',  //首次进入的路径缓存key
      }
    },
    props: {
      // 优惠券委托类型 ： 默认 3
      caseType: {
        type: String | Number,
        default: "3"
      }
    },

    mounted() {
      // 监听用户信息授权
      new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
      this.UserInfoChanged();
      this.initData();
    },

    methods: {
      // 用户信息授权通知回调
      UserInfoChanged() {
        this.initData()
      },
      // 初始化优惠券
      initData() {
        let userInfo = new UserInfoModel().getModel("me") || '';
        this.userId = userInfo.userId || '';

        //判断是否绑定了手机号，如果没有则展示
        if (!!this.userMobile || !this.userId) return;

        this.userMobile = new UserInfoModel().getModel("telephone") || '';
        // 如果缓存没有号码，请求数据判断数据是否有号码
        //只是首次进入的页面需要弹窗 ，并且 一次弹出过程 只出现大窗一次
        let giftCouponComeInPath = new EntrustRedpackagesModel().getModel();
        let currentPath = new CurrentPages().getCurFullPath(true);

        if (!!giftCouponComeInPath && currentPath != giftCouponComeInPath) return;

        //记录当次进入场景值
        new EntrustRedpackagesModel().setModel(currentPath);
        //请求获取红包
        this.getRedpackages()
      },
      // 获取优惠券赠送金额（根据城市）
      getRedpackages() {
        let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
        let cityId = cityInfo.cityId || '';
        let params = {
          cityId: cityId,
          caseType: this.caseType
        };
        if (!params.cityId) return;

        new GetRedpackages(params).send()
          .then(res => {
            if (!!res.DATA) {
              this.redpackagesNum = res.DATA.redpackages || '';
            }
          });
      },

      closeGiftCouPon() {
        this.openGiftFlag = false
      },
      openGiftCouPon() {
        this.openGiftFlag = true
      },

      // 更新获取号码信息
      upTel(e = {}) {
        let that = this;
        return GetUserTel.init(e)
          .then(tel => {
            if (tel) {
              that.userMobile = tel;
            }
          });
      },

      // 获取电话号码
      getWxPhoneNum(e) {
        let that = this;
        //拒绝授权
        if (e.detail.errMsg && e.detail.errMsg.indexOf("fail user deny") >= 0) {
          uni.showToast({
            title: "领取失败，请授权电话",
            icon: "none"
          });
          return;
        }

        //无绑定号码
        if (!e.detail.encryptedData) return;

        this.upTel(e).then(tel => {
          if (!new UserInfoModel().getModel("telephone")) return;

          // 绑定号码
          new BindTel({
            cityId: new GpsInfoModel().getModel("cityInfo").cityId,
            youyouUserId: new UserInfoModel().getModel("me").userId,
            userMobile: new UserInfoModel().getModel("telephone"),
            verify: 9999,
          }).send().then(res => {
            if (res.STATUS != 1) {
              uni.showToast({
                title: res.INFO || info.msg || "绑定失败",
                icon: "none"
              });
              return;
            }

            that.userMobile = new UserInfoModel().getModel("telephone");
            //绑定成功，赠送优惠券
            that.giftCoupon();
          });
        });
      },

      // 赠送优惠券
      giftCoupon() {
        let params = {
          youyouUserId: this.userId,
          cityId: new GpsInfoModel().getModel("cityInfo").cityId, //当前用户定位城市Id，并不是用户的城市Id
          caseType: this.caseType, //赠送类型 3求购赠送 4求租赠送
        };
        new GiftCoupon(params).send()
          .then(res => {
            uni.showToast({
              title: res.INFO || "领取失败",
              icon: "none"
            });
          });
      },

      // 绑定手机号
      bindTel() {
        if (!new UserInfoModel().getModel("telephone")) {
          uni.navigateTo({
            url: "/pagesTool/changePhone/changePhone?fromSource=homeCoupon"
          });
          return;
        }

        //绑定成功，赠送优惠券
        this.giftCoupon();
        this.userMobile = new UserInfoModel().getModel("telephone");
      }
    },
  }
</script>

<style scoped>
  /* 抢单优化优惠券 */

  .giftCouponView {
    position: relative;
  }

  /* 大弹窗 */
  .giftCouponView .big-box {
    z-index: 202;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .giftCouponView .big-box .giftCoupon-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .giftCouponView .big-box .cont {
    z-index: 203;
    position: relative;
    width: 630upx;
    padding: 78upx 64upx 70upx;
    box-sizing: border-box;
    background: #fff;
    border-radius: 30upx;
  }

  .giftCouponView .big-box .cont .close-btn {

    position: absolute;
    width: 87upx;
    height: 87upx;
    top: 0upx;
    right: 0upx;
    background: url(https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/close_icon.png) center center no-repeat;
    background-size: 27upx 27upx;
  }

  .giftCouponView .big-box .cont .gift-tt {
    font-size: 34upx;
    line-height: 1;
    letter-spacing: 0upx;
    color: #101d36;
  }

  .giftCouponView .big-box .cont .gift-icon {
    margin: 0 auto 40upx;
    width: 300upx;
    height: 300upx;
    background: url(https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/redPack_icon.png) center center no-repeat;
    background-size: 100% 100%;
    padding-top: 90upx;
    box-sizing: border-box;
  }

  .giftCouponView .big-box .cont .gift-icon .gift-icon-text {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: -10upx;
  }

  .giftCouponView .big-box .cont .gift-icon .gift-icon-text .gift-icon-num {
    font-size: 46upx;
    color: #592914;
  }

  .giftCouponView .big-box .cont .gift-icon .gift-icon-text .gift-icon-unit {
    font-size: 22upx;
    color: #592914;
  }

  .giftCouponView .big-box .cont .gift-desc {
    text-align: center;
    font-size: 26upx;
    color: #89909d;
  }

  .giftCouponView .big-box .cont .gift-btn {
    width: 500upx;
    height: 100upx;
    line-height: 100upx;
    background-image: linear-gradient(246deg,
    #ff6f2e 0%,
    #fe8e0d 100%),
    linear-gradient(#ffffff,
      #ffffff);
    background-blend-mode: normal, normal;
    border-radius: 50upx;
    font-size: 34upx;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    margin-top: 20upx;
  }

  .giftCouponView .mini-box {
    z-index: 201;
    position: fixed;
    bottom: 152upx;
    right: 37upx;
    width: 99upx;
    height: 113upx;
    background: url(https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/redPack.png) center center no-repeat;
    background-size: 100% 100%;
  }

  .giftCouponView .mini-box .mini-box-num {
    position: absolute;
    text-align: center;
    font-size: 30upx;
    color: #ffe4a2;
    left: 0;
    bottom: 18upx;
    width: 100%;
    line-height: 1;
  }

  .check-mobile-button {
    border: none;
    background: none;
    padding: 0;
  }

  .check-mobile-button::after {
    background: none;
    border: none;
  }

</style>
