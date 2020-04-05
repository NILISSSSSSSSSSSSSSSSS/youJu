<template>
  <view>
    <!-- 拨打电话按钮 -->
    <view @click="chooseLinkType" class="take_phone_btn"></view>

    <!-- 弹窗 -->
    <view class="call-modal-box f_c_c" @touchmove.stop.prevent=""
          v-if="showTypeTc" @click='downCloseEvent'>
      <view class="cl-conten" @click.stop="">
        <view class="cl-close" @click='downCloseEvent'></view>
        <view class="cl-title">
          <view class="cl-title-line"></view>
          <view class="cl-title-text">选择联系方式</view>
        </view>

        <!-- #ifdef MP-WEIXIN -->
        <view class="cl-listinfo" v-if='!userTel'>
          <button class="my-button" open-type="getPhoneNumber"
                  @getphonenumber.stop="getPhone">
            <view class="clst-con">
              <view class="clast-title">隐号转接
                <image src="http://cdn.haofang.net/static/uuminiapp/im/anli.png"></image>
              </view>
              <view class="clast-titfo">平台为您提供号码保护，对方看不见您的真实号码</view>
            </view>
          </button>
        </view>

        <view class="cl-listinfo" v-if='userTel'>
          <view class="clst-con" @click.stop='callHideAgent'>
            <view class="clast-title">隐号转接
              <image src="http://cdn.haofang.net/static/uuminiapp/im/anli.png"></image>
            </view>
            <view class="clast-titfo">平台为您提供号码保护，对方看不见您的真实号码</view>
          </view>
        </view>
        <!-- #endif -->

        <!-- #ifndef MP-WEIXIN -->
        <view class="cl-listinfo">
          <view class="clst-con" @click.stop='callHideAgent'>
            <view class="clast-title">隐号转接
              <image src="http://cdn.haofang.net/static/uuminiapp/im/anli.png"></image>
            </view>
            <view class="clast-titfo">平台为您提供号码保护，对方看不见您的真实号码</view>
          </view>
        </view>
        <!-- #endif -->

        <view class="cl-listinfo" @click.stop='callAgent'>
          <view class="clst-con clst-zhicall">
            <view class="clast-title">直拨电话</view>
            <view class="clast-titfo">直拨经纪人电话，号码未加密</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {UserInfoModel} from "@/model/UserInfoModel.js";
  import {GetAxbPhoneNumber} from "@/net/common/GetAxbPhoneNumber.js";
  import {GpsInfoModel} from "@/model/GpsInfoModel.js";
  import {GetUserTel} from "@/utils/common.js";

  class TakePhoneItem {
    userMobile = "";  // 用户电话
  }

  export default {
    props: {
      item: {
        type: Object,
        default() {
          return new TakePhoneItem()
        }
      },
    },

    data() {
      return {
        showTypeTc: false,
        userTel: ""
      }
    },

    mounted() {
      this.userTel = new UserInfoModel().getModel("telephone") || "";
    },

    methods: {
      chooseLinkType() {
        this.showTypeTc = true;
      },

      downCloseEvent() {
        this.showTypeTc = false;
      },

      callAgent() {
        if (!this.item.userMobile) {
          uni.showToast({
            title: "暂无电话, 无法拨打。",
            icon: "none"
          });
          return;
        }

        this.DifferenceApi.makePhoneCall(this.item.userMobile);
        this.showTypeTc = false;
      },

      // 隐号拨打
      callHideAgent() {
        this.userTel = new UserInfoModel().getModel("telephone") || "";
        if (!this.item.userMobile) {
          uni.showToast({
            title: "暂无电话, 无法拨打。",
            icon: "none"
          });
          return;
        }

        if (this.userTel == this.item.userMobile) {
          uni.showToast({
            title: "呼叫方与被叫方号码相同，不可使用隐号转接系统!",
            icon: "none"
          });
          return;
        }

        if (!this.userTel) {
          uni.navigateTo({
            url: "/pagesTool/changePhone/changePhone?fromSource=im"
          });
          return;
        }

        new GetAxbPhoneNumber({
          cityId: new GpsInfoModel().getModel("cityInfo")
            ? new GpsInfoModel().getModel("cityInfo").cityId || 1 : 1,
          customerMobile: this.item.userMobile,
          userMobile: this.userTel
        }).send()
          .then(res => {
            let phone = res && res.DATA ?
              res.DATA.phoneX || "" : "";
            if (!phone) {
              uni.showToast({
                title: "隐号拨打失败！",
                icon: "none"
              });
              return;
            }

            this.DifferenceApi.makePhoneCall(phone);
            this.showTypeTc = false;
          })
          .catch(err => {
            uni.showToast({
              title: "隐号拨打失败！",
              icon: "none"
            });
          })
      },

      // 授权获取电话
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
                uni.navigateTo({
                  url: "/pagesTool/changePhone/changePhone"
                });
              }
            }
          });
        }

        if (!e.detail.encryptedData) {
          return;
        }

        GetUserTel.init(e)
          .then(tel => {
            console.error("---etel----", tel);
            this.callHideAgent();
          });
      }
    },
  }
</script>

<style scoped>
  .take_phone_btn {
    height: 106upx;
    width: 106upx;
    background: url(http://cdn.haofang.net/static/wxPlusApp/yjk/tel_pic.png) no-repeat 0 0;
    background-size: 100%;
    margin-bottom: 30upx;
    position: fixed;
    right: 10upx;
    bottom: 250upx;
    opacity: 0.9;
  }

  /* 拨打电话弹层 */
  .call-modal-box {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 300;
    background: rgba(0, 0, 0, 0.3);
  }

  /* #ifdef H5 */
  .call-modal-box {
    top: 88upx;
  }

  /* #endif */
  .cl-conten {
    margin: auto;
    width: 630upx;
    box-sizing: border-box;
    border-radius: 5px;
    will-change: transform;
    background: #fff;
  }

  .cl-close {
    position: absolute;
    width: 70upx;
    height: 70upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/loadDownImg/close_icon.png) no-repeat center;
    background-size: 27upx 27upx;
    top: 0;
    right: 0;
    z-index: 100;
  }

  .cl-title {
    width: 500upx;
    margin: 50upx auto 0;
    color: #333;
    font-size: 34upx;
    line-height: 70upx;
    font-weight: bold;
    background: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .cl-title-text {
    width: 220upx;
    padding: 0 25upx;
    margin: auto;
    position: relative;
    z-index: 99;
    background: #FFFFFF;
  }

  .cl-title-line {
    position: absolute;
    height: 1upx;
    width: 100%;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background: #E6E6E6;
  }

  .cl-conten > .cl-listinfo:last-child {
    border: 0;
  }

  .cl-listinfo {
    padding: 45upx 60upx;
    box-sizing: border-box;
    border-bottom: solid 2upx #f6f6f6;
  }

  .clst-con {
    background: url('http://cdn.haofang.net/static/uuminiapp/im/hideNumber.png') no-repeat left center;
    background-size: 90upx 90upx;
    padding-left: 110upx;
  }

  .clst-zhicall {
    background: url('http://cdn.haofang.net/static/uuminiapp/im/callNumber.png') no-repeat left center;
    background-size: 90upx 90upx;
    padding: 10upx 110upx;
    padding-right: 0;
  }

  .clast-title {
    font-size: 32upx;
    color: #404040;
    line-height: 36upx;
    font-weight: bold;
    margin-bottom: 15upx;
  }

  .clast-title image {
    width: 54upx;
    height: 27upx;
    margin-top: 5upx;
  }

  .clast-titfo {
    font-size: 24upx;
    color: #999;
    line-height: 30upx;
  }

  .my-button {
    width: 100%;
    height: 100%;
    padding: 0;
    background: none;
    text-align: left;
  }

  .my-button::after {
    border: none;
  }
</style>
