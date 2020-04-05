<template>
  <form report-submit @submit="formSubmit">
    <view class="village_expert f_c_s" v-if="buildExpertList.length === 1"
          :class="{ village_expert_shadow : !item.noBoxShadow}">
      <!-- <view v-if="item.buildAddress || item.buildName || item.buildTitle" class="expert_top f_r_b">
        <view :style="{ width: !item.buildAddress ? '100%' : '',maxWidth: !item.buildAddress ? '100%' : ''}"
          class="buildName">{{ item.buildTitle || item.buildName }}</view>
        <view v-if="item.buildAddress" class="buildAddress">{{ item.buildAddress }}</view>
      </view> -->

      <view class="f_r_b expert_cont">
        <view class="f_r_s expert_cont_left">
          <view @click="goToStore(buildExpertList[0].archiveId)" class="f_c_c agent_header_view">
            <image mode="aspectFill"
                   :src="buildExpertList[0].agentHeaderImg || 'http://cdn.haofang.net/static/uuminiapp/im/defaultHead.png?t=20180427'"></image>
          </view>

          <view class="f_c_c expert_des">
            <view class="f_r_s">
              <view class="expert_des_pai"></view>

              <view class="agentName">{{ buildExpertList[0].agentName }}</view>
            </view>

            <view class="expert_info">本人专注服务于该小区，24h欢迎来电~</view>
          </view>
        </view>

        <view class="f_r_e expert_cont_right">
          <view @click="pushEntrust" class="f_c_c">
            <image class="icon_discount" src="http://cdn.haofang.net/static/wxPlusApp/yjk/house/entrust.png?t=11"></image>
            <view class="expert_cont_right_text">委托</view>
          </view>

          <view @click="linkMe" class="f_c_c">
            <image class="icon_discount" src="http://cdn.haofang.net/static/wxPlusApp/yjk/house/link.png"></image>
            <view class="expert_cont_right_text">联系</view>
          </view>
        </view>
      </view>
    </view>

    <view class="village_expert_more f_r_b" v-if="buildExpertList.length > 1">
      <view class="more_expert_item" @click="goToStore(item.archiveId)"
            v-for="(item, index) in buildExpertList" :key="index">
        <view class="more_expert_item_head_view">
          <image :src="item.agentHeaderImg" mode="aspectFill"></image>
        </view>

        <view class="more_expert_name">{{ item.agentName }}</view>

        <view class="f_r_c more_expert_star_view">
          <block v-for="(url, i) in item.starList" :key="i">
            <image :src="url" mode="aspectFill"></image>
          </block>
        </view>

        <view class="f_r_c more_expert_num_view">
          <text class="more_expert_sale_num">出售: {{ item.saleNum }}</text>
          <text>出租: {{ item.leaseNum }}</text>
        </view>
      </view>
    </view>

    <!-- 立即联系弹窗 -->
    <link-me-view :item="linkMeItem" :show="linkMeTcShow"
                  :telephone="buildExpertList.length > 0 ? buildExpertList[0].agentPhone : ''"
                  :archiveId="buildExpertList.length > 0 ? buildExpertList[0].archiveId : ''">
    </link-me-view>
  </form>
</template>

<script>
  import linkMeView from "./linkMeView.vue";
  import {Notification} from "../utils/Notification.js";
  import {Notify} from "../utils/Notify.js";
  import {GpsInfoModel} from "@/model/GpsInfoModel.js";
  import {Const} from "@/utils/Const.js";
  import {GetBuildExperList} from "../net/houseApi/GetBuildExpertList";
  import {HouseListAgentItem} from "../utils/Const";
  import {GetStarList} from "../utils/common.js";
  import {UserInfoModel} from "../model/UserInfoModel";

  class VillageExpertItem {
    buildTitle = "";
    zhuangXiuStatusId = "";  // 装修情况
    zhuangXiuStatusName = "";
    roomId = "";  // 几室id
    roomName = "";
    regionId = "";
    regionName = "";
    houseTypeId = ""; // 房屋类型id
    houseTypeName = ""; // 房屋类型文案
    buildId = "";
    buildName = "";  // 小区名称
    buildAddress = "";  // 服务地址
    agentHeaderImg = ""; // 专家头像
    agentName = "";  // 专家姓名
    agentPhone = "";  // 专家电话
    archiveId = ""; // 经纪人id
    caseId = ""; // 房源id
    caseType = "";  // 房源类型
    cityId = ""; // 城市id
    reSource = 1;  // 来源
    noBoxShadow = false;  // 不显示view 的 box-shadow style
  }

  export default {
    data() {
      return {
        linkMeTcShow: false,
        buildExpertList: [],
        linkMeItem: {}
      };
    },

    props: {
      caseType: {
        type: String | Number,
        default: "2"
      },
      item: {
        type: Object,
        default() {
          return {}
        }
      }
    },

    watch: {
      item(newValue, oldValue) {
        this.initBuildExpertList();
      }
    },

    computed: {
      agentHeaderImg() {
        return this.item.agentHeaderImg || Const.defaultHeadImg;
      }
    },

    components: {
      linkMeView
    },

    mounted() {
      this.initBuildExpertList();
      new this.InitFormSubmit(this);
      // 监听筛选弹窗显示隐藏
      new Notification().addObserver(this, "HouseListAgentChanged", Notify.HouseListAgentChanged.Name);
    },

    destroyed() {
      // 反注册通知
      new Notification().removeObserver(this, Notify.HouseListAgentChanged.Name);
    },

    methods: {
      // 初始化小区专家列表
      initBuildExpertList() {
        if (!this.item.buildId || !this.item.cityId) {
          this.buildExpertList = [];
          return;
        }

        new GetBuildExperList({buildId: this.item.buildId, cityId: this.item.cityId}).send()
          .then(res => {
            if (res.code !== Const.success) {
              this.buildExpertList = [];
              return;
            }

            let buildBiddInfoVOList = res.data ? res.data.buildBiddInfoVOList || [] : [];
            let buildExpertList = [];
            for (let info of buildBiddInfoVOList) {
              let item = new HouseListAgentItem();
              item.buildId = res.data ? res.data.buildId || "" : "";
              item.buildName = res.data
                ? res.data.buildName || "暂无小区名称"
                : "暂无小区名称";
              item.buildAddress = "";
              item.agentHeaderImg = info.buildOwnerPicUrl || Const.defaultHeadImg;
              item.agentName = info.buildOwnerName || "";
              item.agentPhone = info.buildOwnerMobile || "";
              item.isExit = 1;
              item.archiveId = info.buildOwnerArchiveId || "";
              item.cityId = res.data ? res.data.cityId || "" : "";
              item.caseType = this.item.caseType;
              item.leaseNum = info.leaseNum || 0;
              item.saleNum = info.saleNum || 0;
              item.starList = new GetStarList(info.starLevel || 3)
                .getList(true,
                  "https://zdzfapi.haofang.net/Public/wxApp/images/entrustDetail/ic_star_yellow.png",
                  "https://zdzfapi.haofang.netPublic/wxApp/images/entrustDetail/ic_star_gray.png");
              buildExpertList.push(item);
            }
            if (buildExpertList.length > 0) {
              this.linkMeItem = buildExpertList[0];
            }
            this.$emit("villageExpertListChange", buildExpertList);
            this.buildExpertList = buildExpertList;
          })
          .catch(() => {
            this.buildExpertList = [];
          });
      },

      // 联系我
      linkMe() {
        // this.linkMeTcShow = true;
        // new Notification().postNotification(Notify.ScreenShowChanged.Name, true);

        // 以前是展示弹窗现在是直接到im详情
        let me = new UserInfoModel().getModel("me") || {};
        let url = "/pagesTool/messageDetail/messageDetail";
        uni.navigateTo({
          url: url + '?messageId=' + this.buildExpertList[0].archiveId
            + '&caseId=' + this.linkMeItem.caseId + '&caseType=' + this.linkMeItem.caseType
            + "&name=" + this.linkMeItem.agentName + "&userId=" + me.userId
            + "&openId=" + me.openId + "&pageFrom=villageExpert"
            + "&buildName=" + this.linkMeItem.buildName
            + '&cityId=' + this.linkMeItem.cityId + '&reSource=' + this.linkMeItem.reSource
        });
      },

      HouseListAgentChanged(name, item = false) {
        this.linkMeTcShow = item;
        new Notification().postNotification(Notify.ScreenShowChanged.Name, item);
      },

      // 发送委托
      pushEntrust() {
        let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};
        let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
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

        let that = this;
        let itemList = ["我要买房", "我是房东，我要卖房"];
        if (this.caseType != 1) {
          itemList = ["我要租房", "我是房东，我要出租"];
        }
        that.$emit("onPushEntrustChanged", true);
        uni.showActionSheet({
          itemList: itemList,
          success: function (res) {
            if (itemList[res.tapIndex].indexOf("我要买房") >= 0
              || itemList[res.tapIndex].indexOf("我要租房") >= 0) {
              that.myWantBuyHouse();
              return;
            }

            if (itemList[res.tapIndex].indexOf("我是房东") >= 0) {
              that.myWantSaleHouse();
              return;
            }
          },
          fail: function (err) {
            that.$emit("onPushEntrustChanged", false);
          }
        });
      },
      // 我要买房
      myWantBuyHouse() {
        let caseType = 4;
        if (this.linkMeItem.caseType == 1) {
          caseType = 3
        }
        uni.navigateTo({
          url: "/pagesEntrust/entrust/entrust?archiveId=" + (this.linkMeItem.archiveId || "")
            + "&caseType=" + caseType
            + "&isVip=1" + "&step=4" + "&isEdit=1"
            + "&regionId=" + (this.linkMeItem.regionId || "")
            + "&regionName=" + (this.linkMeItem.regionName || "")
            + "&zhuangXiuStatusId=" + (this.linkMeItem.zhuangXiuStatusId || "")
            + "&zhuangXiuStatusName=" + (this.linkMeItem.zhuangXiuStatusName || "")
            + "&roomId=" + (this.linkMeItem.roomId || "")
            + "&roomName=" + (this.linkMeItem.roomName || "")
            + "&houseTypeId=" + (this.linkMeItem.houseTypeId || "")
            + "&houseTypeName=" + (this.linkMeItem.houseTypeName || "")
            + "&archiveName=" + (this.linkMeItem.agentName || "")
            + "&archiveHeadImg=" + (this.linkMeItem.agentHeaderImg || this.Const.imDefaultHeadImg)
        });
      },
      // 我要卖房
      myWantSaleHouse() {
        uni.navigateTo({
          url: "/pagesEntrust/registration/registration?archiveId="
            + this.linkMeItem.archiveId
            + "&caseType=" + this.linkMeItem.caseType
            + "&isVip=1"
        });
      },

      // 跳转到微店
      goToStore(archiveId) {
        uni.navigateTo({
          url: "/pagesStore/personalStore/personalStore?archiveId="
            + (archiveId || this.linkMeItem.archiveId)
        });
      },
    },
  }
</script>

<style>
  /* 多个专家 */
  .village_expert_more {
    width: 100%;
    box-sizing: border-box;
    margin: auto;
  }

  .village_expert_more .more_expert_item:last-child {
    margin-right: 0;
  }

  .more_expert_item {
    width: 100%;
    margin-right: 20upx;
    padding-bottom: 24upx;
    box-shadow: 0 1upx 27upx 0 rgba(55, 55, 55, 0.1);
    border-radius: 10upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/expert/expert_bj2.png) no-repeat center;
    background-size: 100%;
    background-position: 0 0;
  }

  .more_expert_item_head_view {
    width: 90upx;
    height: 90upx;
    border-radius: 50%;
    background: url(http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png) no-repeat center;
    background-size: 100% 100%;
    border: 2upx solid #fff;
    margin: 0 auto;
    margin-top: 24upx;
    flex-shrink: 0;
    overflow: hidden;
  }

  .more_expert_item_head_view image {
    width: 100%;
    height: 100%;
  }

  .more_expert_name {
    text-align: center;
    font-size: 30upx;
    color: #101d36;
    margin-top: 20upx;
    margin-bottom: 10upx;
    font-weight: bold;
  }

  .more_expert_star_view {
    margin: 6upx auto 14upx;
  }

  .more_expert_star_view image {
    width: 20upx;
    height: 20upx;
    flex-shrink: 0;
    margin-right: 8upx;
  }

  .more_expert_num_view {
    font-size: 20upx;
    color: #8E94A1;
  }

  .more_expert_sale_num {
    margin-right: 20upx;
  }

  /* 一个专家 */
  .village_expert {
    width: 100%;
    padding: 0 26upx;
    box-sizing: border-box;
    overflow: hidden;
    margin: auto;
    border-radius: 3px;
  }

  .village_expert_shadow {
    box-shadow: 0 0 20upx #E2E2E2;
  }

  .expert_top {
    color: #8E94A1;
    font-size: 26upx;
    height: 80upx;
    line-height: 80upx;
    border-bottom: 1px solid #F5F5F5;
    letter-spacing: 1upx;
    box-sizing: border-box;
  }

  .buildName {
    text-align: left;
    max-width: 30%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .buildAddress {
    text-align: right;
    max-width: 65%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .expert_cont {
    padding: 58upx 15upx 58upx 20upx;
    box-sizing: border-box;
  }

  .expert_cont_left {
    padding-right: 30upx;
    box-sizing: border-box;
  }

  .agent_header_view {
    width: 100upx;
    height: 100upx;
    overflow: hidden;
    margin: auto 10upx auto 0;
    border-radius: 100%;
    flex-shrink: 0;
  }

  .agent_header_view > image {
    width: 100%;
    height: 100%;
  }

  .agentName {
    font-size: 28upx;
    color: #1f1f1f;
    font-weight: bold;
  }

  .village_expert_text {
    color: #8a8a8a;
    font-size: 22upx;
    margin-left: 19upx;
    text-align: left;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .expert_des {
    padding-left: 20upx;
    box-sizing: border-box;
  }

  .expert_des .expert_des_pai {
    margin: auto 0;
    background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/erhouse_detail_sprites.png) no-repeat;
    background-size: 242px 40px;
    height: 17px;
    width: 17px;
    background-position: -32px 0;
  }

  .expert_info {
    line-height: 36upx;
    font-size: 26upx;
    color: #101d36;
    margin-top: 15upx;
  }

  .expert_cont_right {
    flex-shrink: 0;
  }

  .expert_cont_right > view:nth-child(2) {
    margin-left: 20upx;
  }

  .icon_discount{
    height: 84upx;
    width: 84upx;
    flex-shrink: 0;
    margin-bottom: 15upx;
  }

  .expert_cont_right_text {
    font-size: 20upx;
    line-height: 20upx;
    color: #a7a7a7;
    text-align: center;
  }
</style>
