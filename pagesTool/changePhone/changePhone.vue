<template>
  <view>
    <view class="change_phone">
      <view class="title">绑定新手机号</view>

      <view class="des">
        <text v-if="oldPhone">您当前的手机号为{{ oldPhone }}，</text>
        绑定新号码后，信息保持不变
      </view>

      <!-- 输入区 -->
      <view class="cont">
        <view class="cont_phone">
          <view class="cont_title">手机号</view>

          <view class="cont_input_box f_r_s">
            <view class="cont_input_title">+86</view>

            <input @input="phoneBlur" maxlength="11" type="number"
                   placeholder="请输入您的手机号" class="cont_code_input"/>
          </view>
        </view>

        <view class="cont_code">
          <view class="cont_title">验证码</view>

          <view class="f_r_b">
            <input @input="codeBlur" maxlength="10"
                   placeholder="请输入验证码" type="number"
                   class="cont_code_input"/>

            <button :disabled="getCodeDisabled" @click="getCode"
                    :loading="getCodeLoading" class="get_code">{{ codeText }}
            </button>
          </view>
        </view>
      </view>

      <!-- 绑定 -->
      <button hover-class="none"
              :disabled="bindTelLoading"
              @click="bindTel"
              :loading="bindTelLoading"
              class="bind_tel global-confirm-btn">立即绑定
      </button>
    </view>

    <!-- 委托提示弹窗 -->
    <view v-if="haveEntrust" class="entrust_tc_view f_c_c" @click="closeEntrustTc">
      <view class="entrust_cont" @click.stop="">
        <view class="entrust_close" @click="closeEntrustTc"></view>
        <view class="entrust_title">系统识别您在平台发布了委托！</view>
        <view class="entrust_text">您可前往查看与经纪人在线沟通，实时关注委托进度。</view>
        <view class="entrust_btn" @click="toTrustList">查看委托</view>
      </view>
    </view>
  </view>
</template>

<script>
  class TimeOut {
    page = null;
    defaultText = "重新发送";
    time = 60;
    timeOutVal = null;

    constructor(page) {
      this.page = page;
    }

    init() {
      this.interval();
    }

    interval() {
      let that = this;
      this.timeOutVal = setTimeout(() => {
        if (that.time <= 1) {
          that.setData({codeText: this.defaultText, getCodeDisabled: false});
          that.clear();
          return;
        }

        that.time--;
        that.setData({codeText: `已发送(${that.time})`});
        that.interval();
      }, 1000);
    }

    clear() {
      clearTimeout(this.timeOutVal);
      this.timeOutVal = null;
    }

    setData(obj) {
      for (let key in obj) {
        this.page[key] = obj[key];
      }
    }
  }

  import {GetCaptcha} from "../../net/GetCaptcha.js";
  import {BindTel} from "../../net/BindTel.js";
  import {UserInfoModel} from "../../model/UserInfoModel.js";
  import {GetUserTel} from "../../utils/common.js";
  import {CheckMobileCaptcha} from "@/net/common/CheckMobileCaptcha.js";

  export default {
    data() {
      return {
        oldPhone: "",
        codeText: "获取验证码",
        bindTelLoading: false,
        phoneVal: "",
        getCodeLoading: false,
        getCodeDisabled: false,
        codeVal: "",
        haveEntrust: false,  // 是否有委托
        fromSource: "", // homeCoupon：首页抵扣卷  entrust: 委托 im: 消息
        goBackSources: ["homeCoupon", "entrust", "im"]
      }
    },

    onShareAppMessage() {
      return new this.ShareAppMessage().init();
    },

    onLoad(options = {}) {
      this.fromSource = options.fromSource || "";
      new this.SetMetaInfo().initDefault();
    },

    onShow() {
      new this.SetMetaInfo().initDefault();
      GetUserTel.init(null)
        .then(res => {
          this.oldPhone = res || "";
        });
    },

    methods: {
      // 立即绑定
      bindTel() {
        let that = this;
        if (!that.checkPhone()) return;

        if (!that.codeVal) {
          uni.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }

        that.bindTelLoading = true;
        let me = new UserInfoModel().getModel("me") || {};
        // #ifdef MP-ALIPAY || MP-BAIDU
        new CheckMobileCaptcha({
          mobile: that.phoneVal, captcha: that.codeVal,
          userId: me.userId
        }).send()
          .then(info => {
            that.bindTelLoading = false;
            new UserInfoModel().setModel(that.phoneVal, "telephone");
            if (info.STATUS == 1) {
              if (info.DATA && info.DATA.wxId) {
                info.DATA.wxId = info.DATA.wxId.indexOf("uu") >= 0
                  ? info.DATA.wxId.replace("uu_", "") : info.DATA.wxId;
                new UserInfoModel().setModel(info.DATA.wxId, "accid");
              }
              if (info.DATA && info.DATA.youyouUserId) {
                let oldMe = new UserInfoModel().getModel("me") || {};
                oldMe["userId"] = info.DATA.youyouUserId;
                new UserInfoModel().setModel(oldMe, "me");
              }
              uni.showToast({
                title: "恭喜，绑定成功"
              });
              setTimeout(() => {
                uni.switchTab({
                  url: "/pages/my/my"
                });
              }, 1500);
              return;
            }

            uni.showToast({
              title: "绑定失败啦！",
              icon: "none"
            });
          })
          .catch(err => {
            console.error(err, "---err----");
            that.bindTelLoading = false;
            uni.showToast({
              title: "绑定失败啦！",
              icon: "none"
            });
          });
        // #endif

        // #ifndef MP-ALIPAY || MP-BAIDU
        Promise.all([
          new CheckMobileCaptcha({
            mobile: that.phoneVal, captcha: that.codeVal,
            userId: me.userId
          }).send(),
          new BindTel({
            youyouUserId: me.userId || "", userMobile: that.phoneVal,
            verify: that.codeVal
          }).send()
        ]).then(response => {
          let res = response[1];
          let info = response[0];

          if (!res || !res.STATUS || res.STATUS != 1) {
            that.bindTelLoading = false;
            uni.showToast({
              title: res && res.INFO ? res.INFO : "绑定失败啦！",
              icon: "none"
            });
            return;
          }

          if (res.DATA && res.DATA.imId) {
            new UserInfoModel().setModel((res.DATA.imId.indexOf("uu_") >= 0
              ? res.DATA.imId : "uu_" + res.DATA.imId), "accid");
          }
          if (res.DATA && res.DATA.youyouUserId) {
            me.userId = res.DATA.youyouUserId;
            new UserInfoModel().setModel(me, "me");
          }
          new UserInfoModel().setModel(that.phoneVal, "telephone");
          if (info.STATUS == 1) {
            if (info.DATA && info.DATA.wxId) {
              info.DATA.wxId = info.DATA.wxId.indexOf("uu") >= 0
                ? info.DATA.wxId.replace("uu_", "") : info.DATA.wxId;
              new UserInfoModel().setModel(info.DATA.wxId, "accid");
            }
            if (info.DATA && info.DATA.youyouUserId) {
              let oldMe = new UserInfoModel().getModel("me") || {};
              oldMe["userId"] = info.DATA.youyouUserId;
              new UserInfoModel().setModel(oldMe, "me");
            }
          }

          if (that.goBackSources.includes(that.fromSource)) {
            uni.showToast({
              title: "恭喜，绑定成功"
            });
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              });
            }, 1000);
            return;
          }

          if (res.DATA && res.DATA.userMobileEntrusteExite
            && res.DATA.userMobileEntrusteExite == 1) {
            this.haveEntrust = true;
            return;
          }

          uni.showToast({
            title: "恭喜，绑定成功"
          });
          setTimeout(() => {
            uni.switchTab({
              url: "/pages/my/my"
            });
          }, 1500);
        })
        .catch(err => {
          console.error(err);
          that.bindTelLoading = false;
          uni.showToast({
            title: err && err.INFO ? err.INFO : "绑定失败啦！",
            icon: "none"
          });
        });
        // #endif
      },

      // 检查手机号
      checkPhone() {
        let reg = /^[0-9]*$/;
        let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (new UserInfoModel().getModel("telephone")
          && new UserInfoModel().getModel("telephone") === this.phoneVal) {
          uni.showToast({
            title: "新手机号与当前绑定手机号一致",
            icon: "none"
          });
          return;
        }

        if (!this.phoneVal) {
          uni.showToast({
            title: "请输入手机号",
            icon: "none"
          });
          return false;
        }

        if (this.phoneVal.length !== 11 || !reg.test(this.phoneVal) || !phoneReg.test(this.phoneVal)) {
          uni.showToast({
            title: "请输入正确手机号",
            icon: "none"
          });
          return false;
        }

        return true;
      },

      // 获取验证码
      getCode() {
        let that = this;
        if (!that.checkPhone()) return;

        this.getCodeLoading = true;
        this.getCodeDisabled = true;
        new GetCaptcha({mobile: this.phoneVal}).send()
          .then(res => {
            if (!res || !res.STATUS || res.STATUS != 1) {
              uni.showToast({
                title: res && res.INFO ? res.INFO : "获取验证码失败啦！",
                icon: "none"
              });
              this.getCodeLoading = false;
              this.getCodeDisabled = false;
              return;
            }

            that.getCodeLoading = false;
            new TimeOut(that).init();
          })
          .catch(err => {
            uni.showToast({
              title: err && err.INFO ? err.INFO : "获取验证码失败啦！",
              icon: "none"
            });
            this.getCodeLoading = false;
            this.getCodeDisabled = false;
          });
      },

      // 手机号输入失去焦点
      phoneBlur(e) {
        this.phoneVal = e && e.detail ? e.detail.value || "" : "";
      },

      // 验证码失去焦点
      codeBlur(e) {
        this.codeVal = e && e.detail ? e.detail.value || "" : "";
      },

      // 关闭委托弹窗
      closeEntrustTc() {
        this.haveEntrust = false;
        uni.switchTab({
          url: "/pages/my/my"
        });
      },

      // 查看委托
      toTrustList() {
        uni.redirectTo({
          url: "/pagesEntrust/trustList/trustList"
        });
      },
    },
  }
</script>

<style>
  .change_phone {
    width: 100%;
    padding: 80upx 50upx 0;
    box-sizing: border-box;
  }

  .title {
    font-family: PingFang-SC-Bold;
    font-size: 40upx;
    font-weight: 600;
    color: #333333;
  }

  .des {
    font-family: PingFang-SC-Medium;
    font-size: 28upx;
    line-height: 40upx;
    color: #999999;
    margin-top: 25upx;
  }

  /* 输入区 */
  .cont {
    padding: 0 40upx 0 40upx;
    background-color: #ffffff;
    box-shadow: 0px 8upx 26upx 0px rgba(0, 0, 0, 0.06);
    border-radius: 20upx;
    box-sizing: border-box;
    width: 100%;
    margin-top: 80upx;
  }

  .cont_phone {
    width: 100%;
    padding-top: 50upx;
    padding-bottom: 30upx;
    box-sizing: border-box;
    border-bottom: 1upx solid #e3e3e3;
  }

  .cont_title {
    font-size: 26upx;
    letter-spacing: 0.5upx;
    color: #333333;
  }

  .cont_input_box {
    margin-top: 20upx;
  }

  .cont_input_title {
    font-family: PingFang-SC-Bold;
    font-size: 32upx;
    letter-spacing: 0.6upx;
    font-weight: 600;
    line-height: 70upx;
    margin-right: 10upx;
    color: #333333;
  }

  .cont_input {
    line-height: 40upx;
    height: 40upx;
    min-height: 40upx;
    padding-left: 43upx;
    box-sizing: border-box;
    vertical-align: bottom;
    font-size: 32upx;
    margin: auto 0;
  }

  .cont_code {
    height: 180upx;
    letter-spacing: 0.5upx;
    color: #333333;
    padding-top: 30upx;
    box-sizing: border-box;
  }

  .cont_code_input {
    height: 70upx;
    line-height: 70upx;
    min-height: 70upx;
    vertical-align: bottom;
    font-size: 32upx;
    margin: auto 0;
  }

  .get_code {
    width: 200upx;
    height: 70upx;
    background-color: #ffffff;
    border-radius: 35upx;
    border: solid 1upx #e3e3e3;
    color: #999999;
    font-size: 28upx;
    text-align: center;
    line-height: 70upx;
    box-sizing: border-box;
    padding: 0;
  }

  .get_code.swan-button-radius-ios {
    border-radius: 35upx;
  }

  .get_code::after {
    border: none;
    border-radius: 0;
  }

  .get_code[disabled]:not([type]), .get_code[disabled][type=default] {
    color: #999999;
    background-color: #ffffff;
  }

  /* 立即绑定 */
  .bind_tel {
    width: 100%;
    height: 80upx;
    background-image: linear-gradient(-90deg, #fe8e0d 0%, #ff6f2e 100%), linear-gradient(#00ca85, #00ca85);
    background-blend-mode: normal, normal;
    border-radius: 40upx;
    color: #ffffff;
    text-align: center;
    line-height: 80upx;
    font-size: 32upx;
    margin-top: 60upx;
    box-sizing: border-box;
    box-shadow: 0px 8upx 26upx 0px rgba(0, 0, 0, 0.06);
  }

  .bind_tel::after {
    border: none;
    border-radius: 0;
  }

  .bind_tel[disabled]:not([type]), .bind_tel[disabled][type=default] {
    color: #FFFFFF;
  }

  /* 委托弹窗 */
  .entrust_tc_view {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    padding: 0 60upx;
    box-sizing: border-box;
    z-index: 99;
  }

  .entrust_cont {
    background-color: #ffffff;
    border-radius: 10upx;
    padding: 70upx 50upx 60upx 50upx;
    z-index: 999;
    margin: auto;
    box-sizing: border-box;
    text-align: center;
    position: relative;
  }

  .entrust_close {
    width: 60upx;
    height: 60upx;
    position: absolute;
    right: 0upx;
    top: 0upx;
    z-index: 30;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUwMzYzNkE3ODVDMTExRThCNTNCQkJFRkY2QzdDMkYwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUwMzYzNkE4ODVDMTExRThCNTNCQkJFRkY2QzdDMkYwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTAzNjM2QTU4NUMxMTFFOEI1M0JCQkVGRjZDN0MyRjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTAzNjM2QTY4NUMxMTFFOEI1M0JCQkVGRjZDN0MyRjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4MuWpTAAABQ0lEQVR42rTXwWrCQBAG4M2Qa/sALULPgi8VjH0cz1Jr73kcobbXovYB7F39B3bLIia7MzsZ+IVdw35slgxJ1XWdQz0gE2Tnxq0pckBOhJ9H5Bv5RN6QagSQ/NpsfPFGeeIFefIXzJG1MR7QuR+zNeHJLfIeXdgY4gFtojlee0d+sEA+jPF76AZ5DX9ynf2tsML70NZb/3CMbwrxJHoLB7wtwLPQe3AJno32wRpchA7BElyMctWJMwu4ixZuomZTadAcOIU7DZoL5+AiNHXGOWeuQqVwqi7S1lbSkdQdjgrboLq91oVt0A08apcSOKc5tBqcDHqvqrfXQrRvF2fpzskAVe2cjFAxToaoCCdjNBsP8MoQTeGrAM+il20rdAjn8ZThH+Q3etm2Qm/xtR+ztefn+OQ/pp5H/GgL+BI5In9XAQYAlZ2YgYNfMd4AAAAASUVORK5CYII=") center no-repeat;
    background-size: 33%;
  }

  .entrust_title {
    font-size: 34upx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 40upx;
  }

  .entrust_text {
    font-size: 26upx;
    text-align: left;
    line-height: 36upx;
    color: #666666;
    margin-bottom: 56upx;
  }

  .entrust_btn {
    height: 80upx;
    background-image: linear-gradient(-90deg, #fe8e0d 0%, #ff6f2e 100%), linear-gradient(#00ca85, #00ca85);
    background-blend-mode: normal, normal;
    border-radius: 40upx;
    color: #ffffff;
    font-size: 32upx;
    text-align: center;
    line-height: 80upx;
    width: 100%;
  }
</style>
