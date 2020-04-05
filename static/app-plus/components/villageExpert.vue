<template>
  <div :style="{width: width+'rpx',marginTop:marginTop+'rpx'}" class="cont-view">
    <!--一个经纪人-->
    <div class="village_expert f_c_s"
         :style="{width: width+'rpx'}"
         v-if="buildExpertList.length === 1"
         :class="{ village_expert_shadow : !item.noBoxShadow}">
      <div class="f_r_b expert_cont" :style="{width: (width)+'rpx'}">
        <div class="f_r_s expert_cont_left" :style="{width: (width-208)+'rpx'}">
          <div @click="goToStore(buildExpertList[0].archiveId)"
               class="f_c_c agent_header_view">
            <image resize="cover" class="agent_header"
                   :placeholder="'http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png'"
                   :src="buildExpertList[0].agentHeaderImg || 'http://cdn.haofang.net/static/uuminiapp/im/defaultHead.png?t=20180427'"></image>
          </div>

          <div class="f_c_c expert_des">
            <div class="f_r_s" style="align-items: center;">
              <image src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/price_icon.png"
                     class="expert_des_pai"></image>

              <text class="agentName">{{ buildExpertList[0].agentName }}</text>
            </div>

            <text class="expert_info">本人专注服务于该小区，24h欢迎来电~</text>
          </div>
        </div>

        <div class="f_r_e expert_cont_right">
          <div @click="pushEntrust" class="f_c_c">
            <image class="icon_discount"
                   src="http://cdn.haofang.net/static/wxPlusApp/yjk/house/entrust.png?t=11"></image>
            <text class="expert_cont_right_text">委托</text>
          </div>

          <div @click="linkMe" class="f_c_c" style="margin-left: 20rpx;">
            <image class="icon_discount" src="http://cdn.haofang.net/static/wxPlusApp/yjk/house/link.png"></image>
            <text class="expert_cont_right_text">联系</text>
          </div>
        </div>
      </div>
    </div>

    <!--多个经纪人-->
    <div class="f_r_b village_expert_more"
         :style="{width: width+'rpx'}"
         v-if="buildExpertList.length > 1">
      <div class="more_expert_item f_c_s"
           :ref="'expertItem'+index"
           @click="goToStore(item.archiveId)"
           :style="{width: width+'rpx',marginRight: buildExpertList.length-1===index?'0':'20rpx'}"
           v-for="(item, index) in buildExpertList" :key="index">
        <image resize="cover"
               :style="{width: (width/buildExpertList.length)+'rpx',height:'88rpx',marginBottom:'-88rpx'}"
               class="more_expert_item_bg"
               src="http://cdn.haofang.net/static/uuminiapp/expert/expert_bj2.png"></image>
        <div class="more_expert_item_head_view">
          <image class="more_expert_item_head"
                 :placeholder="'http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png'"
                 :src="item.agentHeaderImg" resize="cover"></image>
        </div>

        <text class="more_expert_name">{{ item.agentName }}</text>

        <div class="f_r_c more_expert_star_view">
          <block v-for="(url, i) in item.starList" :key="i">
            <image class="more_expert_star_image" :src="url" resize="cover"></image>
          </block>
        </div>

        <div class="f_r_c more_expert_num_view">
          <text class="more_expert_sale_num more_expert_num_text">出售: {{ item.saleNum }}</text>
          <text class="more_expert_num_text">出租: {{ item.leaseNum }}</text>
        </div>
      </div>
    </div>

    <!-- 立即联系弹窗 -->
    <link-me-view :item="linkMeItem" :show="linkMeTcShow"
                  :telephone="buildExpertList.length > 0 ? buildExpertList[0].agentPhone : ''"
                  :archiveId="buildExpertList.length > 0 ? buildExpertList[0].archiveId : ''">
    </link-me-view>
  </div>
</template>

<script>
  import linkMeView from "./linkMeView.vue";
  import {Notification} from "../../../utils/Notification";
  import {Notify} from "../../../utils/Notify.js";
  import {GpsInfoModel} from "../../../model/GpsInfoModel";
  import {Const} from "../../../utils/Const";
  import {GetBuildExperList} from "../../../net/houseApi/GetBuildExpertList";
  import {HouseListAgentItem} from "../../../utils/Const";
  import {GetStarList} from "../../../utils/common.js";
  import {UserInfoModel} from "../../../model/UserInfoModel";
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
        linkMeItem: {},
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
      },
      width: {
        type: String|Number,
        default() {
          return 670;
        }
      },
      marginTop: {
        type: String|Number,
        default() {
          return 0;
        }
      },
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
            if (buildBiddInfoVOList.length > 3) {
              buildBiddInfoVOList = buildBiddInfoVOList.splice(0,3);
            }
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
  .cont-view{
    background-color: #ffffff;
  }
  /* 多个专家 */
  .village_expert_more{
  }
  .more_expert_item {
    margin-right: 20rpx;
    padding-bottom: 24rpx;
    border-width: 1rpx;
    border-color: rgba(55, 55, 55, 0.1);
    border-radius: 10rpx;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
  }
  .more_expert_item_head_view {
    width: 92rpx;
    height: 92rpx;
    border-radius: 90rpx;
    border-width: 2rpx;
    border-color: #ffffff;
    margin-top: 24rpx;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: auto;
    flex-shrink: 0;
    overflow: hidden;
    align-items: center;
  }
  .more_expert_item_head{
    width: 90rpx;
    height: 90rpx;
    border-radius: 90rpx;
  }
  .more_expert_name {
    text-align: center;
    font-size: 30rpx;
    color: #101d36;
    margin-top: 20rpx;
    margin-bottom: 10rpx;
    font-weight: bold;
  }
  .more_expert_star_view {
    margin-top: 6rpx;
    margin-bottom: 14rpx;
  }
  .more_expert_star_image {
    width: 20rpx;
    height: 20rpx;
    flex-shrink: 0;
    margin-right: 8rpx;
  }
  .more_expert_num_view {
    align-items: center;
  }
  .more_expert_sale_num {
    margin-right: 20rpx;
  }
  .more_expert_num_text{
    font-size: 20rpx;
    color: #8E94A1;
  }

  /* 一个专家 */
  .village_expert {
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 3px;
  }
  .village_expert_shadow {
    /*box-shadow: 0 0 20rpx #E2E2E2;*/
  }
  .expert_cont {
    padding-top: 26rpx;
    padding-bottom: 26rpx;
    box-sizing: border-box;
  }
  .agent_header_view {
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    overflow: hidden;
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 10rpx;
    margin-left: 0;
    border-radius: 100rpx;
    flex-shrink: 0;
  }
  .agent_header {
    width: 100rpx;
    border-radius: 100rpx;
    height: 100rpx;
  }
  .agentName {
    font-size: 28rpx;
    color: #1f1f1f;
    font-weight: bold;
  }
  .expert_des {
    flex: 1;
  }
  .expert_des_pai {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 4rpx;
    margin-left: 0;
    height: 34rpx;
    width: 34rpx;
  }
  .expert_info {
    line-height: 36rpx;
    font-size: 26rpx;
    color: #101d36;
    margin-top: 15rpx;
    lines: 2;
    text-overflow:ellipsis;
  }
  .expert_cont_right {
    flex-shrink: 0;
    align-items: center;
    margin-left: 20rpx;
    width: 188rpx;
  }
  .icon_discount {
    height: 84rpx;
    width: 84rpx;
    flex-shrink: 0;
    margin-bottom: 15rpx;
  }
  .expert_cont_right_text {
    font-size: 20rpx;
    line-height: 20rpx;
    color: #a7a7a7;
    text-align: center;
  }
</style>
