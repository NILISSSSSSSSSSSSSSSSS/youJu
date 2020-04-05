<template>
  <view class="find_house_condition_view">
    <!-- 期望区域 -->
    <view @click="findCondition(1, 'region')" v-if="!buildName" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">期望区域</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val" v-if="regionName">{{ regionName }}({{ sectionName }})</view>

        <image class="find_house_condition_arrow"
               src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"></image>
      </view>
    </view>

    <!-- 指定小区 -->
    <view @click="findCondition(1, 'build')" v-if="buildName" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">指定小区</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val">{{ buildName }}</view>

        <image class="find_house_condition_arrow"
               src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"></image>
      </view>
    </view>

    <!-- 房屋类型 -->
    <view @click="findCondition(2, 'houseType')" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">房屋类型</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val">{{ houseTypeName }}
          <block v-if="zhuangXiuStatusName"> - {{ zhuangXiuStatusName }}</block>
          <block v-if="roomName"> - {{ roomName }}</block>
        </view>

        <image class="find_house_condition_arrow"
               src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"></image>
      </view>
    </view>

    <!-- 理想面积 -->
    <view @click="findCondition(2, 'area')" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">理想面积</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val">{{ areaText }}</view>

        <image class="find_house_condition_arrow"
               src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"></image>
      </view>
    </view>

    <!-- 购房预算 -->
    <view @click="findCondition(2, 'price')" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">购房预算</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val">{{ priceText }}</view>

        <image class="find_house_condition_arrow"
               src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"></image>
      </view>
    </view>

    <!-- 支付中介费 -->
    <view @click="findCondition(3, 'wfFee')" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">支付中介费</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val">{{ newWfFee }}</view>

        <image class="find_house_condition_arrow"
               src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"></image>
      </view>
    </view>

    <!-- 服务经纪人 -->
    <view @click="findCondition(3, 'agent')" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">服务经纪人</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val">{{ newAgentSexVal }}</view>

        <image class="find_house_condition_arrow"
               src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"></image>
      </view>
    </view>

    <!-- 意向房源 -->
    <view v-if="wantHouseText" class="f_r_b find_house_condition_item">
      <view class="find_house_condition_label">意向房源</view>

      <view class="find_house_condition_val_view f_r_e">
        <view class="find_house_condition_val">{{ wantHouseText }}</view>
      </view>
    </view>

    <!-- 图片介绍 -->
    <view class="fin_house_condition_des_view">
      <image class="fin_house_condition_img" v-if="caseType==3" mode="aspectFit" :src="desImgUrl"></image>

      <view class="fin_house_condition_text">{{ desText }}</view>
    </view>

    <!-- 底部空的占位 -->
    <view class="condition_bottom_empty"></view>

    <!-- 底部按钮 -->
    <view class="condition_bottom">
      <!--#ifdef MP-WEIXIN-->
      <button hover-class="none"
              v-if="!userMobile" open-type="getPhoneNumber"
              @getphonenumber="getPhone" class="bind_phone commonEntrustBtn global-confirm-btn">发布
      </button>
      <!--#endif-->

      <!--#ifndef MP-WEIXIN-->
      <button hover-class="none"
              v-if="!userMobile"
              @click.stop="pushEntrustBtn"
              class="bind_phone commonEntrustBtn global-confirm-btn">发布
      </button>
      <!--#endif-->

      <view v-if="userMobile" @click="checkEntrustCondition(1)" class="commonEntrustBtn global-confirm-btn">发布</view>
    </view>

    <requesLoading v-if="loadingShow"></requesLoading>
  </view>
</template>

<script>
  import requesLoading from "./requesLoading.vue";
  import {CheckCanPushEntrust} from "@/net/entrust/CheckCanPushEntrust.js";
  import {PushBuyLeaseEntrust} from "@/net/entrust/PushEntrust.js";
  import {UserInfoModel} from "@/model/UserInfoModel.js";
  import {GpsInfoModel} from "@/model/GpsInfoModel.js";
  import {Notification} from "@/utils/Notification.js";
  import {Notify} from "@/utils/Notify.js";

  import {GetUserTel} from "../../../utils/common.js";
  import {BindTel} from "../../../net/BindTel";
  import {WxAppPay} from "../../../utils/PayReqeust";
  import {PrepayEntrust} from "../../../net/entrust/PayEntrustMoney";

  // isHelp 是否需要经纪人帮助填写信息-专属委托时候才需要填写，默认:0,需要:1
  let paramsCondition = {
    isHelp: 0,   // 是否需要帮助
    mustpay: "",  //等于2时，点击支付意向金时直接调用登记委托，弹出推送经纪人页面，不需要调用支付
  };

  export default {
    data() {
      return {
        loadingShow: false
      }
    },

    components: {
      requesLoading
    },

    props: {
      // 意向房源文案
      wantHouseText: {
        type: String | Number,
        default: ""
      },
      regionName: {
        type: String | Number,
        default: ""
      },
      sectionName: {
        type: String | Number,
        default: ""
      },
      buildName: {
        type: String | Number,
        default: ""
      },
      houseTypeName: {
        type: String | Number,
        default: ""
      },
      zhuangXiuStatusName: {
        type: String | Number,
        default: ""
      },
      roomName: {
        type: String | Number,
        default: ""
      },
      areaText: {
        type: String | Number,
        default: ""
      },
      priceText: {
        type: String | Number,
        default: ""
      },
      // 中介费
      wfFee: {
        type: String | Number,
        default: ""
      },
      // 经纪人性别
      agentSexVal: {
        type: String | Number,
        default: ""
      },
      caseType: {
        type: String | Number,
        default: ""
      },
      // 1 专属委托  2 普通委托
      isVip: {
        type: String | Number,
        default: "2"
      },
      regionId: {
        type: String | Number,
        default: ""
      },
      sectionId: {
        type: String | Number,
        default: ""
      },
      buildId: {
        type: String | Number,
        default: ""
      },
      houseTypeId: {
        type: String | Number,
        default: ""
      },
      zhuangXiuStatusId: {
        type: String | Number,
        default: ""
      },
      roomId: {
        type: String | Number,
        default: ""
      },
      areaMin: {
        type: String | Number,
        default: ""
      },
      areaMax: {
        type: String | Number,
        default: ""
      },
      priceMin: {
        type: String | Number,
        default: ""
      },
      priceMax: {
        type: String | Number,
        default: ""
      },
      // 其他需求的输入框内容
      otherInfoVal: {
        type: String | Number,
        default: ""
      },
      // 公司id
      compId: {
        type: String | Number,
        default: ""
      },
      // 房源id
      houseId: {
        type: String | Number,
        default: ""
      },
      // 房源来源
      resource: {
        type: String | Number,
        default: ""
      },
      // 1:从房源详情点击的委托、0:其他业务、后续可能还会增加
      specialOper: {
        type: String | Number,
        default: ""
      },
      // 是否需要经纪人帮助填写信息-专属委托时候才需要填写，默认:0,需要:1
      isHelp: {
        type: String | Number,
        default: ""
      },
      // 委托登记来源：2微店1优家公众号、0优优好房。默认：0
      youjiaFlag: {
        type: String | Number,
        default: 0
      },
      //是否为专属委托(房源详情页小区专家的专属委托)
      archiveId: {
        type: String | Number,
        default: ""
      },
      archiveName: {
        type: String | Number,
        default: ""
      },
      archiveHeadImg: {
        type: String | Number,
        default: ""
      },
      // 用户电话
      userMobile: {
        type: String | Number,
        default: ""
      },
      //优惠券金额
      redpackagesNum: {
        type: String | Number,
        default: ""
      }
    },

    computed: {
      newWfFee() {
        if (!this.wfFee) return "";

        let map = {
          "0|0.5": "10-15天",
          "0.5|1": "15-20天",
          "0.01|0.015": "1-1.5%",
          "0.015|0.02": "1.5-2%"
        };
        return (map[this.wfFee] || this.wfFee);
      },

      newAgentSexVal() {
        if (this.isVip == 1) {
          return this.archiveName;
        }

        if (!this.agentSexVal) return "男女均可";

        return this.agentSexVal == 1 ? '帅哥' : '美女';
      },

      desImgUrl() {
        if (this.caseType == 3) {
          return "https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/entrust_tip.png";
        }
      },

      desText() {
        if (this.caseType == 3) {
          return "成交立抵" + this.redpackagesNum + "元中介费，还可参加每100笔成交抽佣金全返活动";
        }

        return "成交立抵" + this.redpackagesNum + "元中介费";
      },

    },

    methods: {
      // 编辑
      findCondition(step, type) {
        this.$emit("onFindConditionChanged", {step, type});
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
      getPhone(e) {
        let that = this;
        //拒绝授权
        if (e.detail.errMsg && e.detail.errMsg.indexOf("fail user deny") >= 0) {
          return;
        }

        if (!e.detail.encryptedData) {
          //无绑定号码
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
                title: res.INFO || info.msg || "绑定失败",
                icon: "none"
              });
              return;
            }

            //绑定成功，走原发布流程
            that.checkEntrustCondition(1)

          });
        })
      },

      // 非小程序绑定手机号
      pushEntrustBtn() {
        if (!new UserInfoModel().getModel("telephone")) {
          uni.navigateTo({
            url: "/pagesTool/changePhone/changePhone?fromSource=entrust"
          });
          return;
        }

        this.checkEntrustCondition(1);
      },

      // 判断委托条件  1 普通 2 悬赏
      checkEntrustCondition(type = 1) {
        // 判断是否全部填写
        let mustKeys = ["areaText", "priceText", "newWfFee"];
        let isNeed = true;
        mustKeys.map((key) => {
          if (!this[key]) {
            isNeed = false;
          }
        });
        if (!isNeed) {
          uni.showToast({
            title: "请完善信息",
            icon: "none"
          });
          return;
        }

        if (!this.regionName && !this.buildName) {
          uni.showToast({
            title: "请完善信息",
            icon: "none"
          });
          return;
        }

        if (!this.houseTypeName && !this.zhuangXiuStatusName && !this.roomName) {
          uni.showToast({
            title: "请完善信息",
            icon: "none"
          });
          return;
        }

        this.loadingShow = true;
        let that = this;

        if (this.isVip == 1) {
          if (!this.houseTypeId || !this.zhuangXiuStatusId || !this.roomId
            || (!this.areaMin && !this.areaMax) || (!this.priceMin && !this.priceMax)) {
            paramsCondition.isHelp = 1;
          }
        }
        new CheckCanPushEntrust().send()
          .then(res => {
            if (res.STATUS != 1) {
              this.loadingShow = false;
              uni.showToast({title: (res.INFO || "发布失败")});
              return;
            }

            let data = res.DATA;
            // 达到上限
            if (data.type == 0) {
              this.loadingShow = false;
              uni.showModal({
                confirmText: "立即查看",
                confirmColor: "#ab7f2e",
                title: "",
                content: "你只能发布3个委托，请等待经纪人为你服务或取消多余的委托。",
                success: function (res) {
                  if (res.confirm) {
                    uni.navigateTo({
                      url: "/pagesEntrust/trustList/trustList"
                    });
                  }
                }
              });
              return;
            }

            //可以发布:跳转至支付意向金页面
            //等于2时，点击支付意向金时直接调用登记委托，弹出推送经纪人页面，不需要调用支付
            paramsCondition.mustpay = data.mustpay || 1;
            //发布普通委托
            if (type == 1) {
              this.pushEntrust(0);
              return;
            }

            //发布悬赏委托
            if (paramsCondition.mustpay == 2) {
              //不需要调用支付,直接发布
              this.pushEntrust(2);
              return;
            }

            //需要先调支付,才能发布 mustpay
            let content = "成交抽购房0佣金需支付100元意向金，线上付佣还可抵扣500元佣金";
            if (this.caseType != 3) {
              content = "领取200元佣金抵扣需支付100元意向金（随时可退）";
            }
            uni.showModal({
              title: '温馨提示',
              content: content,
              confirmText: "立即支付",
              confirmColor: "#ab7f2e",
              success(res) {
                that.loadingShow = false;
                if (res.confirm) {
                  that.pushEntrust(1);
                }
              }
            });
          })
          .catch(err => {
            console.error("---CheckCanPushEntrust---", err);
            this.loadingShow = false;
            uni.showModal({
              showCancel: false,
              confirmText: "我知道了",
              confirmColor: "#ab7f2e",
              title: "温馨提示",
              content: "发布委托失败啦！请稍后重试。"
            });
          });
      },

      // 发送委托 0: 普通委托, 1: 支付委托 , 2: 悬赏委托
      pushEntrust(type) {
        let that = this;
        let me = new UserInfoModel().getModel("me") || {};
        let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
        let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};
        if (cityInfo.cityId != gpsInfo.cityId) {
          uni.showModal({
            showCancel: false,
            confirmColor: "#ab7f2e",
            confirmText: "立即切换",
            title: "切换城市",
            content: "特权找房只能在定位城市发布委托",
            success: (res) => {
              if (res.confirm) {
                cityInfo["cityId"] = gpsInfo.cityId || "";
                cityInfo["cityName"] = gpsInfo.cityName || "";
                cityInfo["regId"] = gpsInfo.regId || "";
                cityInfo["regName"] = gpsInfo.regName || "";
                new GpsInfoModel().setModel(cityInfo, "cityInfo");
                new Notification().postNotification(Notify.GpsChanged.Name);
                uni.reLaunch({
                  url: "/pages/index/index"
                });
              }
            }
          });
          return;
        }

        if (!me.userId) {
          uni.showToast({
            title: "暂未找到该用户"
          });
          return;
        }

        if (!cityInfo.cityId) {
          uni.showToast({
            title: "暂未城市id"
          });
          return;
        }

        let requestData = {
          buildId: this.buildId,
          buildName: this.buildName,
          houseRegion: this.regionId,
          regionName: this.regionName,
          houseSection: this.sectionId,
          sectionName: this.sectionName,
          houseUseage: this.houseTypeId,
          houseFitment: this.zhuangXiuStatusId,
          roomL: this.roomId == 20 ? 5 : this.roomId,
          roomH: this.roomId == 20 ? 20 : this.roomId,
          areaL: this.areaMin,
          areaH: this.areaMax,
          priceL: this.priceMin,
          priceH: this.priceMax,
          wfFee: this.wfFee,
          descp: this.otherInfoVal,
          // 0 随机分配
          wfSex: this.agentSexVal ? this.agentSexVal : 0,
          caseType: this.caseType,
          youyouUserId: me.userId,
          cityId: cityInfo.cityId,

          wfRelateId: this.houseId,
          resource: this.resource,
          specialOper: this.specialOper,

          isHelp: this.isHelp,

          youjiaFlag: this.youjiaFlag,
          archiveId: this.archiveId,
          isVip: this.isVip == 1 ? 1 : 0,

          giftCoupon: 1,// 新增委托赠送优惠券 抢单优化需求#11243

          mustpay: type
        };
        // console.log("---requestData-------", requestData);

        new PushBuyLeaseEntrust(requestData).send()
          .then(res => {
            this.loadingShow = false;
            if (res.STATUS != 1) {
              uni.showToast({
                title: res.INFO || "发布委托失败",
                icon: 'none'
              });
              return;
            }

            let responseData = res.DATA || {};
            //发布重复委托
            if (responseData.type != 1) {
              uni.showModal({
                confirmColor: "#ab7f2e",
                confirmText: "立即查看",
                title: "",
                content: "该委托信息已经发布过了，请勿重复委托",
                success: function (res) {
                  if (res.confirm) {
                    uni.navigateTo({
                      url: "/pagesEntrust/trustList/trustList?caseType=" + that.caseType
                    });
                  }
                }
              });
              return;
            }

            let redirectToUrl = "/pagesEntrust/trustList/trustList?caseType="
              + that.caseType;
            if (this.isVip != 1) {
              redirectToUrl = "/pagesEntrust/entrustAgent/entrustAgent?caseId="
                + (responseData.caseId || "") + "&caseType=" + that.caseType
            }
            // 支付委托
            if (type == 1) {
              new PrepayEntrust({
                openId: me.openId,
                wxId: me.userId,
                caseId: responseData.caseId,
                caseType: responseData.caseType,
                cityId: responseData.cityId,
                moneyPay: responseData.totalFee
              }).send().then(res => {
                let data = res.DATA;
                let status = res.STATUS;
                if (status != 1) {
                  uni.showToast({title: res.msg || "支付失败", icon: "none"});
                  return;
                }

                let wxPayVal = new WxAppPay();
                let wxPayItem = wxPayVal.getItem();
                wxPayItem.appId = data.appId;
                wxPayItem.timeStamp = data.timeStamp;
                wxPayItem.nonceStr = data.nonceStr;
                wxPayItem.package = data.package;
                wxPayItem.signType = data.signType;
                wxPayItem.paySign = data.paySign;
                wxPayVal.initPay(wxPayItem)
                  .then(res => {
                    uni.redirectTo({
                      url: redirectToUrl
                    });
                  })
                  .catch(err => {
                    let failTitle = "支付失败";
                    if (err.msg && err.msg.indexOf("fail cancel") >= 0) {
                      failTitle = "取消支付";
                    }
                    uni.showToast({title: failTitle, icon: "none"});
                  });
              });
              return;
            }

            uni.redirectTo({
              url: redirectToUrl
            });
          })
          .catch(err => {
            this.loadingShow = false;
            uni.showToast({
              title: "发布委托失败啦",
              icon: "none"
            });
          });
      },
    },
  }
</script>

<style scoped>
  .find_house_condition_view {
    margin-right: -40upx;
  }

  .find_house_condition_item {
    width: 100%;
    height: 90upx;
    line-height: 90upx;
    border-bottom: 1upx solid #ececec;
    box-sizing: border-box;
    padding-right: 40upx;
  }

  .find_house_condition_label {
    flex-shrink: 0;
    font-size: 30upx;
    color: #7b8190;
  }

  .find_house_condition_val_view {
    width: 100%;
  }

  .find_house_condition_val {
    position: relative;
    font-size: 30upx;
    color: #101e34;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 90%;
  }

  .find_house_condition_arrow {
    width: 44upx;
    height: 44upx;
    margin: auto 0;
    flex-shrink: 0;
  }

  .fin_house_condition_des_view {
    padding-right: 40upx;
    padding-top: 30upx;
    box-sizing: border-box;
    box-sizing: border-box;
  }

  .fin_house_condition_img {
    height: 140upx;
    box-sizing: border-box;
    width: 100%;
  }

  .fin_house_condition_text {
    text-align: left;
    color: #79838f;
    font-size: 24upx;
    box-sizing: border-box;
    line-height: 38upx;
    margin: 25upx auto;
    width: 100%;
  }

  .condition_bottom {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 30upx 40upx 0;
    box-sizing: border-box;
    background-color: #FFFFFF;
  }

  .bind_phone {
    border: none;
    background: none;
    padding: 0;
    text-align: center;
  }

  .bind_phone::after {
    border: none;
    border-radius: 0;
  }

  .condition_bottom view {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    border-radius: 8px;
    will-change: transform;
    box-sizing: border-box;
    font-size: 30upx;
    color: #fff;
    height: 90upx;
    line-height: 90upx;
    letter-spacing: 1px;
  }

  .condition_bottom .rewardEntrustBtn {
    background: -webkit-linear-gradient(left, #fe8f0d, #fe712d);
    margin-bottom: 20upx;
  }

  .condition_bottom .commonEntrustBtn {
    background: #eef1f1;
    margin-bottom: 50upx;
    text-align: center;
    border-radius: 8px;
    will-change: transform;
    box-sizing: border-box;
    font-size: 30upx;
    color: #fff;
    height: 90upx;
    line-height: 90upx;
    letter-spacing: 1px;
  }

  .condition_bottom_empty {
    height: 280upx;
    width: 100%;
    flex-shrink: 0;
  }
</style>
