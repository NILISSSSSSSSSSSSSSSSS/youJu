<template>
  <view class="coupon">
    <view class="title"></view>
    <view class="c-left">
      <view>¥</view>
      <view>{{couponObj.discountMoney || ''}}</view>
      <view>{{couponObj.note || ''}}</view>
    </view>
    <view class="c-right" @click="showCoupon()">立即领取</view>

    <!-- 领取优惠券弹窗 -->
    <view class="build-coupon" v-if="isShow">
      <view class="content">
        <view class="close-box">
          <view class="close-btn" @click="hideCoupon()"></view>
        </view>
        <view class="c-title">恭喜你 获得{{couponObj.discountMoney || ''}}元新房优惠券</view>
        <view class="c-bg-img">
          <view>
            <text>{{couponObj.discountMoney || ''}}</text>
            <text>元</text>
          </view>
        </view>
        <view class="c-phone">
          <input v-model="phoneNum" placeholder="手机号" maxlength="11" />
        </view>
        <view class="c-YZM">
          <input v-model="YZMNum" placeholder="短信验证码" />
          <view class="Y-Z-M" @click="getYZM()" v-if="!isSend">获取验证码</view>
          <view class="Y-Z-M-other" v-if="isSend">倒计时{{couponSendTime}}s</view>
        </view>
        <view class="c-save" @click="saveIt()">立即领取</view>
      </view>
    </view>
  </view>
</template>

<script>
import { SendMobileKey, CheckMobileKey, GetCoupon } from '../../../net/coupon.js';
import {UserInfoModel} from "../../../model/UserInfoModel.js";

export default {
  props: ['couponObj'],
  data () {
    return {
      isShow: false,
      phoneNum: '',
      YZMNum: '',
      isSend: false,
      daoJiShitime: null,
      couponSendTime: 60 // 倒计时
    }
  },
  methods: {
    // 领取优惠券
    showCoupon () {
      this.phoneNum = ''
      this.YZMNum = ''
      this.isShow = true;
    },
    // 隐藏优惠券弹窗
    hideCoupon () {
      this.isShow = false;
    },
    // 获取验证码
    getYZM () {
      if (!this.phoneNum) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      let reg=/^1[345789]\d{9}$/;
      if (!reg.test(this.phoneNum)) {
        uni.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }

      let obj = {
        mobile: this.phoneNum
      };
      new SendMobileKey(obj).send().then(res => {
        console.log(res)
        this.couponSendTime = 60;
        this.isSend = true;
        this.daoJiShitime = setInterval(this.daoJiShi, 1000);
      });
    },
    // 倒计时
    daoJiShi () {
      if (this.couponSendTime <= 1) {
        clearInterval(this.daoJiShitime);
        this.isSend = false;
        return;
      }
      this.couponSendTime--;
    },
    // 立即领取
    saveIt () {
      console.log(this.phoneNum, this.YZMNum);
      // 验证验证码
      let obj = {
        mobile: this.phoneNum,
        mobileKey: this.YZMNum
      };
      new CheckMobileKey(obj).send().then(res => {
        if (res.errCode === 200) {
          let me = new UserInfoModel().getModel("me") || {};
          let objData = {
            id: this.couponObj.couponId || '',
            wxId: me.userId || '',
            wxMobile: this.phoneNum || ''
          }
          console.log(objData, 'objData');
          new GetCoupon(objData).send().then(resData => {
            console.log(resData);
            this.hideCoupon()
            uni.showToast({
              title: resData.errCode === 200 ? '领取成功' : (resData.errMsg || '领取失败'),
              icon: 'none'
            });
          });
        } else {
          uni.showToast({
            title: res.errMsg,
            icon: 'none'
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.coupon {
  position: relative;
  width: 100%;
  height: 86upx;
  background-image: url('http://cdn.haofang.net/static/uuminiapp/common/coupon_bj.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.coupon>.title {
  position: absolute;
  top: 0;
  left: 0;
  width: 69upx;
  height: 31upx;
  background-image: url('http://cdn.haofang.net/static/uuminiapp/common/coupon_title.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.coupon>.c-left {
  width: auto;
  height: auto;
  line-height: 1;
  color: #ffffff;
  display: flex;
  align-items: flex-end;
}
.coupon>.c-left>view:nth-child(1) {
  font-size: 30upx;
  margin-left: 48upx;
}
.coupon>.c-left>view:nth-child(2) {
  font-size: 48upx;
  margin-left: 8upx;
}
.coupon>.c-left>view:nth-child(3) {
  max-width: 380upx;
  font-size: 24upx;
  margin-left: 18upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.coupon>.c-right {
  width: 128upx;
	height: 42upx;
  line-height: 42upx;
  text-align: center;
	background-color: #ea3523;
  border-radius: 22upx;
  color: #ffffff;
  font-size: 24upx;
  margin-right: 32upx;
}

.build-coupon {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30upx;
  box-sizing: border-box;
  z-index: 105;
}
.build-coupon>.content {
  width: 630upx;
	height: 850upx;
	background-color: #ffffff;
	border-radius: 30upx;
}
.build-coupon>.content>.close-box {
  width: 100%;
  height: 27upx;
  margin-top: 30upx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.build-coupon>.content>.close-box>.close-btn {
  width: 27upx;
  height: 27upx;
  background-image: url('https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/close_icon.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-right: 30upx;
}
.build-coupon>.content>.c-title {
  width: 100%;
  height: auto;
  margin-top: 48upx;
  line-height: 1;
  text-align: center;
  color: #101d36;
  font-size: 34upx;
}
.build-coupon>.content>.c-bg-img {
  width: 320upx;
  height: 320upx;
  margin: 0 auto;
  background-image: url('http://cdn.haofang.net/static/uuminiapp/common/coupon_img01.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.build-coupon>.content>.c-bg-img>view {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 100upx;
}
.build-coupon>.content>.c-bg-img>view>text:nth-child(1) {
  color: #592914;
  font-size: 46upx;
  line-height: 1;
}
.build-coupon>.content>.c-bg-img>view>text:nth-child(2) {
  color: #592914;
  font-size: 22upx;
  line-height: 1;
  margin-bottom: 4upx;
}
.build-coupon>.content>.c-phone {
  width: 550upx;
  height: 90upx;
  margin: 0 auto;
  border-bottom: 1upx solid #e1e1e1;
}
.build-coupon>.content>.c-phone>input {
  width: 100%;
  height: 100%;
}
.build-coupon>.content>.c-YZM {
  width: 550upx;
  height: 90upx;
  margin: 0 auto;
  border-bottom: 1upx solid #e1e1e1;
  display: flex;
  align-items: center;
}
.build-coupon>.content>.c-YZM>input {
  width: calc(100% - 150upx);
  height: 100%;
}
.build-coupon>.content>.c-YZM>.Y-Z-M {
  width: 150upx;
  height: 100%;
  line-height: 90upx;
  text-align: center;
  color: #ff6f2e;
  font-size: 26upx;
}
.build-coupon>.content>.c-YZM>.Y-Z-M-other {
  width: 150upx;
  height: 100%;
  line-height: 90upx;
  text-align: center;
  color: #cecece;
  font-size: 26upx;
}
.build-coupon>.content>.c-save {
  width: 520upx;
  height: 100upx;
  line-height: 100upx;
  text-align: center;
  margin: 50upx auto 0;
	background-image: linear-gradient(246deg, #ff6f2e 0%, #fe8e0d 100%), linear-gradient(#ffffff, #ffffff);
	background-blend-mode: normal, normal;
  border-radius: 50upx;
  color: #ffffff;
}

</style>
