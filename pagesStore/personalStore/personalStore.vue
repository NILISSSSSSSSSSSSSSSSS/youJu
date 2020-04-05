<template>
  <view :class="{ active: isActive }" class="personal_store_view"
        :style="{height: isActive ? windowHeight : pageHeight}">
    <view v-if="!isRequesting">
      <!-- 经纪人信息 -->
      <view v-show="defaultSelected == 2">
        <agentInfo :item="agentInfo" :guanZhuStatus="guanZhuStatus"></agentInfo>
      </view>

      <!--用户信息-->
      <view v-show="defaultSelected == 3">
        <userInfoView></userInfoView>
      </view>

      <!-- 房源 -->
      <view style="background: #FFFFFF;" v-show="defaultSelected == 2">
        <!-- 房源tab -->
        <view class="house_tab_view f_r_b">
          <view class="house_tab_title">TA的房源</view>

          <view class="f_r_e">
            <view :class="houseSelectTab == 1 ? 'house_tab_item_active' : ''"
                  @click="changeHouseSelectTab(1)"
                  class="house_tab_item">出售
            </view>
            <view :class="houseSelectTab == 2 ? 'house_tab_item_active' : ''"
                  @click="changeHouseSelectTab(2)"
                  class="house_tab_item">出租
            </view>
            <view :class="houseSelectTab == 3 ? 'house_tab_item_active' : ''"
                  v-if="haveNewHouseTab"
                  @click="changeHouseSelectTab(3)"
                  class="house_tab_item">新房
            </view>
          </view>
        </view>

        <!-- 出售 房源信息 -->
        <view v-show="houseSelectTab == 1 && houseListMap[1].list">
          <saleScreenHouse :enterType="'erHouse'" :agentCityId="agentCityId"></saleScreenHouse>

          <block v-if="houseListMap[1].list && houseListMap[1].list.length > 0">
            <view class="house_list_view">
              <block v-for="(item, index) in houseListMap[1].list" :key="index">
                <erHouseListItem :item="item"></erHouseListItem>
              </block>
            </view>

            <scrollLoading v-if="houseListMap[1].isScrollIng && houseListMap[1].haveMore"
                           :isScrollIng="true"></scrollLoading>
            <view v-if="!houseListMap[1].isScrollIng && !houseListMap[1].haveMore"
                  class="no_more_data">没有更多数据了！
            </view>

            <view class="house_bottom_empty_view"></view>
          </block>

          <view class="sale_no_data"
                v-if="houseListMap[1].list && houseListMap[1].list.length == 0">
            <view class='no-pic'></view>
            <view class='no-txt'>没有找到房源！</view>
          </view>
        </view>

        <!-- 出租 房源信息 -->
        <view v-show="houseSelectTab == 2 && houseListMap[2].list">
          <leaseScreenHouse :enterType="'erHouse'" :from="'lease'"
                            :agentCityId="agentCityId"></leaseScreenHouse>

          <block v-if="houseListMap[2].list && houseListMap[2].list.length > 0">
            <view class="house_list_view">
              <block v-for="(item, index) in houseListMap[2].list" :key="index">
                <erHouseListItem :item="item"></erHouseListItem>
              </block>
            </view>

            <scrollLoading v-if="houseListMap[2].isScrollIng && houseListMap[2].haveMore"
                           :isScrollIng="true"></scrollLoading>
            <view v-if="!houseListMap[2].isScrollIng && !houseListMap[2].haveMore"
                  class="no_more_data">没有更多数据了！
            </view>

            <view class="house_bottom_empty_view"></view>
          </block>

          <view class="sale_no_data"
                v-if="houseListMap[2].list && houseListMap[2].list.length == 0">
            <view class='no-pic'></view>
            <view class='no-txt'>没有找到房源！</view>
          </view>
        </view>

        <!-- 新房 房源信息 -->
        <view v-show="houseSelectTab == 3 && houseListMap[3].list">
          <newScreenHouse :enterType="'newHouse'" :from="'newHouse'"
                          :archiveId="archiveId"
                          :compId="compId"
                          :agentCityId="agentCityId"></newScreenHouse>

          <block v-if="houseListMap[3].list && houseListMap[3].list.length > 0">
            <view class="house_list_view">
              <block v-for="(item, index) in houseListMap[3].list" :key="index">
                <newHouseListItem :item="item"></newHouseListItem>
              </block>
            </view>

            <scrollLoading v-if="houseListMap[3].isScrollIng && houseListMap[3].haveMore"
                           :isScrollIng="true"></scrollLoading>
            <view v-if="!houseListMap[3].isScrollIng && !houseListMap[3].haveMore"
                  class="no_more_data">没有更多数据了！
            </view>

            <view class="house_bottom_empty_view"></view>
          </block>

          <view class="sale_no_data"
                v-if="houseListMap[3].list && houseListMap[3].list.length == 0">
            <view class='no-pic'></view>
            <view class='no-txt'>没有找到房源！</view>
          </view>
        </view>
      </view>

      <!-- 委托 -->
      <view v-show="defaultSelected == 3">
        <entrustConfig :archiveId="archiveId" :agentInfo="agentInfo"></entrustConfig>
      </view>

      <bottomTab :tabList="bottomTab"
                 :defaultSelected="defaultSelected"
                 @onBottomTabChanged="onBottomTabChanged"></bottomTab>
    </view>

    <get-user-info></get-user-info>

    <!-- 加载动画 -->
    <scrollLoading v-if="isRequesting" :isScrollIng="true"></scrollLoading>

    <!-- 抢单优化- 未绑定号码的情况 弹窗优惠券弹窗，引导绑定号码，赠送优惠券 -->
    <giftCouponView></giftCouponView>
  </view>
</template>

<script>
  import bottomTab from "@/pagesStore/components/personalStore/bottomTab.vue";
  import giftCouponView from "@/components/giftCouponView.vue";
  import {GetAgentInfo} from "@/net/personalStore/GetAgentInfo.js";
  import agentInfo from "@/pagesStore/components/personalStore/agentInfo.vue";
  import userInfoView from "@/pagesStore/components/personalStore/userInfo.vue";
  import entrustConfig from "@/pagesStore/components/personalStore/entrustConfig.vue";
  import {CheckIsAttentionBroker} from "@/net/personalStore/CheckIsAttentionBroker.js";
  import {UserInfoModel} from "@/model/UserInfoModel.js";
  import {Notification} from "@/utils/Notification.js";
  import {Notify} from "@/utils/Notify.js";
  import {GetErHouseList} from "@/net/GetErHouseList.js";
  import erHouseListItem from "@/components/erHouseListItem.vue";
  import newHouseListItem from "@/components/newHouseListItem.vue"
  import saleScreenHouse from "@/pagesStore/components/personalStore/saleScreenHouse.vue";
  import leaseScreenHouse from "@/pagesStore/components/personalStore/leaseScreenHouse.vue";
  import newScreenHouse from "@/pagesStore/components/personalStore/newScreenHouse.vue";
  import {ErHouseListItem, NewHouseListItem} from "@/utils/Const.js";
  import {CheckHousePrice} from "@/utils/CheckHousePrice.js";
  import {Const} from "@/utils/Const.js";
  import {GetStoreNewHouseList} from "@/net/GetNewHouseList.js";
  import {ErpShareRecord} from "@/utils/ErpRecord.js";
  import {DealWeiDianLiaoKeDetail} from "@/utils/DealLiaoKeDetail.js";
  import {
    InitShareMenu,
    ShareWebToQQSession, ShareWebToWeiBoTimeline,
    ShareWxAppToSession,
    ShareWxWebToTimeline
  } from "../../static/app-plus/share";
  import {GetCityMap, ShareVisiting, SaveCclientUserType} from "../../utils/common";
  import {GpsInfoModel} from "../../model/GpsInfoModel";

  let privateData = {
    shareObj: null,  // 分享初始化后的value
  };
  let paramsConfig = {};

  export default {
    components: {
      giftCouponView,
      bottomTab,
      agentInfo,
      userInfoView,
      entrustConfig,
      saleScreenHouse,
      erHouseListItem,
      newHouseListItem,
      leaseScreenHouse,
      newScreenHouse
    },

    data() {
      return {
        sourceTypeId: 2101, // 数据采集 - lh
        isRequesting: true,
        entrustHeight: "100%",
        compId: "",  // 公司id 对应erpCompId
        agentCityId: "",  // 经纪人cityId
        archiveId: "",  // 传进来的经纪人id
        bottomTab: [
          {
            id: 1,
            text: "首页",
            iconPath: "https://zdzfapi.haofang.net/Public/wxApp/images/personalStore/home_icon_gray.png",
            selectedIconPath: "https://zdzfapi.haofang.net/Public/wxApp/images/personalStore/home_icon.png",
            pagePath: "/pages/index/index",
            pageToMethod: "reLaunch",
          },
          {
            id: 2,
            text: "房源",
            iconPath: "http://cdn.haofang.net/static/uuminiapp/personalStore/kf.png",
            selectedIconPath: "http://cdn.haofang.net/static/uuminiapp/personalStore/kf_active.png?t=111",
          },
          {
            id: 3,
            text: "委托",
            iconPath: "https://zdzfapi.haofang.net/Public/wxApp/images/personalStore/wt_icon_gray.png",
            selectedIconPath: "https://zdzfapi.haofang.net/Public/wxApp/images/personalStore/wt_icon_a.png?t=111",
          }
        ],
        defaultSelected: 2,
        agentInfo: {},  // 经纪人信息
        guanZhuStatus: 0,  // 关注状态

        pageHeight: "100%",
        windowHeight: "100%",
        isActive: false,

        haveNewHouseTab: false,  // 是否有新房tab
        houseSelectTab: 1,  // 当前选中的房源tab
        houseListMap: {
          1: {
            list: null,
            haveMore: true,
            currentPage: 1,
            pageSize: 10,
            paramsScreen: {},  // 筛选结果
            isScrollIng: false,  // 是否在请求中
          },
          2: {
            list: null,
            haveMore: true,
            currentPage: 1,
            pageSize: 10,
            paramsScreen: {},  // 筛选结果
            isScrollIng: false,  // 是否在请求中
          },
          3: {
            list: null,
            haveMore: true,
            currentPage: 1,
            pageSize: 10,
            paramsScreen: {},  // 筛选结果
            isScrollIng: false,  // 是否在请求中
          }
        },

        // 委托btn list
        entrustBtnList: [
          {
            text: "有房出售",
            event: "entrustHouseSale",
            className: "icon_sale_entrust",
          },
          {
            text: "有房出租",
            event: "entrustHouseLease",
            className: "icon_buy_entrust",
          },
          {
            text: "我要买房",
            event: "entrustHouseWantBuy",
            className: "icon_lease_entrust",
          },
          {
            text: "我要租房",
            event: "entrustHouseWantLease",
            className: "icon_rent_entrust",
          }
        ],
      }
    },

    onShareAppMessage() {
      let that = this;
      let path = "/pagesStore/personalStore/personalStore";
      for (let key in paramsConfig) {
        if (path.indexOf("?") >= 0) {
          path += `&${key}=${paramsConfig[key]}`;
          continue;
        }

        path += `?${key}=${paramsConfig[key]}`;
      }
      let title = '金牌经纪人' + that.agentInfo.agentName + '微信买房租房联系我';
      return new this.ShareAppMessage(
        path, title, null,
        "https://cdn.haofang.net/static/wxPlusApp/pocket/wd_share.jpg").init(() => {
        that.UserBehavior.storeShareAppMessage();
      });
    },

    // params = {archiveId}
    onLoad(params = {}) {
      //二维码进入
      if (params.scene) {
        // 采集数据 - lh
        uni.setStorageSync('imSourceTypeId', 3102);
        this.sourceTypeId = 2102;

        let scene = params.scene;
        // #ifdef MP-WEIXIN
        scene = decodeURIComponent(scene);
        // #endif
        scene = scene.split('&');
        if (scene.length >= 1) {
          params.archiveId = scene[0];
        }
      } else {
        // 采集数据 - lh
        uni.setStorageSync('imSourceTypeId', 3101);
        this.sourceTypeId = 2101;
      }
      if (params.archiveId) {
        this.archiveId = params.archiveId;
      }
      paramsConfig = params;
      let that = this;
      this.initData()
        .then(() => {
          let cityId = new GpsInfoModel().getModel("cityIfo")
            ? new GpsInfoModel().getModel("cityIfo").cityId || "1" : "1";
          new GetCityMap().getCityKey(cityId).then(cityKey => {
            // 分享小程序配置项
            let imgUrl = "https://cdn.haofang.net/static/wxPlusApp/pocket/wd_share.jpg";
            let path = "/pagesStore/personalStore/personalStore?archiveId=" + that.archiveId;

            // 分享网页到朋友圈配置项
            let webUrl = "https://m.haofang.net/" + cityKey;
            // 初始化分享按钮和事件
            let shareDes = "金牌经纪人" + that.agentInfo.agentName + "微信买房租房联系我";
            privateData.shareObj = new InitShareMenu([
              new ShareWxAppToSession(imgUrl, path, shareDes),
              new ShareWxWebToTimeline(that.agentInfo.agentHead, webUrl, shareDes),
              new ShareWebToQQSession(that.agentInfo.agentHead, webUrl, shareDes),
              new ShareWebToWeiBoTimeline(that.agentInfo.agentHead, webUrl, shareDes)
            ]);
            privateData.shareObj.init();
          });
        });

      // 监听筛选弹窗显示隐藏
      new Notification().addObserver(this, "ScreenShowChanged", Notify.ScreenShowChanged.Name);
      // 监听筛选结果
      new Notification().addObserver(this, "ScreenResultChanged", Notify.ScreenResultChanged.Name);
      // 监听授权事件
      new Notification().addObserver(this, "AuthonChanged", Notify.AuthonChanged.Name);

      //用户进入详情页 ERP 统计埋点  1: 掌通微店分享 5: 精英版进入
      new ErpShareRecord().send(this.archiveId, 1, 5);
      this.PlatformUserBehavior.enterStore(this.archiveId);
    },

    onShow() {
      new this.SetMetaInfo().initDefault();
    },

    onHide() {
      if (privateData.shareObj && typeof (privateData.shareObj.hide) !== "undefined") {
        privateData.shareObj.hide();
      }
    },

    onUnload() {
      if (privateData.shareObj && typeof (privateData.shareObj.hide) !== "undefined") {
        privateData.shareObj.hide();
      }
      // 反注册所有通知
      this.PlatformUserBehavior.leaveStore();
      new Notification().removeObserverAllNotification(this);
    },

    onReachBottom() {
      this.scrollBottom();
    },

    onReady() {
      this.getPhoneInfo();
    },

    // 原生按钮点击事件
    onNavigationBarButtonTap(e) {
      if (!e.id) return;

      if (e.id !== "share") return;

      privateData.shareObj.show();
    },

    methods: {
      // 监听授权事件
      AuthonChanged() {
        let me = new UserInfoModel().getModel("me") || {};
        new ShareVisiting().behavior({
          archiveId: this.agentInfo.archiveId || '', // 经济人档案id
          cUserId: me.userId || '', // c端用户id，分享时无
          caseId: '', // 房源id
          caseType: '', // 房源类型：1.出售，2.出租，6.新盘
          cityId: this.agentInfo.cityId || '',
          sourceType: this.sourceTypeId, // 统计子分类
          statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
          appSource: 'zdzf-personalStore-2'
        }).then(res => {
          console.log(res)
        });
        //平台用户来源采集(标记) 20191112 IM优化需求
        new SaveCclientUserType().behavior({
          archiveId: this.agentInfo.archiveId || '', // 经济人档案id
          sourceType: 2, //sourceType 1 = 平台， 2 = 私有
        }).then(res => {
          console.log(res)
        })


      },
      // 获取设备信息
      getPhoneInfo() {
        let res = uni.getSystemInfoSync();
        this.windowHeight = res.windowHeight + "px";
        this.pageHeight = res.windowHeight + "px";
      },

      // 设置委托高度
      setEntrustHeight() {
        let view = this.DifferenceApi.createSelectorQuery(this).select(".store_agent_view");
        let bottomView = this.DifferenceApi.createSelectorQuery(this).select(".bottom_tab_view");
        let that = this;
        view.boundingClientRect(data => {
          if (!data) return;

          let agentHeight = data.height + data.top;
          bottomView.boundingClientRect(bottomData => {
            if (!bottomData) return;

            let bottomTabHeight = bottomData.height;
            that.entrustHeight = parseInt(that.windowHeight) + 5 - agentHeight - bottomTabHeight + "px";
          }).exec();
        }).exec();
      },

      // 处理删选参数
      dealParams(params) {
        let newParams = {};
        for (let key in params) {
          if (params[key]) {
            newParams[key] = params[key];
          }
        }
        return newParams;
      },

      // 筛选弹窗显示隐藏回调
      ScreenShowChanged(name, boolean) {
        this.isActive = boolean;
      },

      // 筛选结果回调
      ScreenResultChanged(name, params) {
        // console.error("---params---",params);
        let fromType = "";
        let newParams = {};
        let regionName = "";
        let sectionName = "";
        let houseUseageText = "";

        for (let key in params) {
          if (key != 'fromType') {
            newParams[key] = params[key];
            continue;
          }

          fromType = params[key];
        }
        if (fromType == "new" && newParams["priceUnit"]) {
          newParams["priceMax"] = newParams["priceUnit"].split(":")[1];
          if (newParams["priceUnit"].split(":")[0] != 0) {
            newParams["priceMin"] = newParams["priceUnit"].split(":")[0];
          }
          if (newParams["priceMax"] == 9999) {
            newParams["priceMax"] = "";
          }
        }
        if (fromType == "new") {
          newParams["houseUsage"] = newParams["useageType"] || "";
          newParams["useageType"] = "";
        }
        if (fromType == "new" && newParams["buildRegion"]) {
          newParams["cityId"] = newParams["buildRegion"];
          newParams["buildRegion"] = "";
        }
        if (fromType == "new" && newParams["sectionId"]) {
          regionName = newParams["regionName"];
          newParams["regionId"] = newParams["sectionId"];
          newParams["sectionId"] = "";
          newParams["regionName"] = "";
          this.PlatformUserBehavior.storeNewHouseRegion(newParams["regionId"], regionName);
        }
        this.houseListMap[this.houseSelectTab].paramsScreen = newParams;
        let eventMap = new Map()
          .set("sale", 1)
          .set("lease", 2)
          .set("new", 3);
        if (!fromType || !eventMap.has(fromType)) return;

        let textOne = this.houseSelectTab == 1 ? "出售" : "出租";
        let textTwo = this.houseSelectTab == 1 ? "购房" : "租房";
        let caseType = this.houseSelectTab == 1 ? 1 : this.houseSelectTab == 2 ? 2 : 6;
        if (fromType != "new" && params.sectionId) {
          sectionName = newParams["sectionName"];
          newParams["sectionName"] = "";
          this.PlatformUserBehavior.storeHouseSection(newParams["sectionId"]
            , sectionName, caseType, textOne, textTwo);
        }
        if (params.houseUseage) {
          Const.typeLsit.map(info => {
            if (info.id == params.houseUseage) {
              houseUseageText = info.text;
            }
          });
          this.PlatformUserBehavior.storeChooseHouseUsage(houseUseageText, textOne, textTwo);
        }
        if (params.useageType && fromType == "new") {
          Const.typeLsit.map(info => {
            if (info.id == params.useageType) {
              houseUseageText = info.text;
            }
          });
          this.PlatformUserBehavior.storeNewHouseUsage(houseUseageText);
        }
        if (params.area) {
          let area = params.area;
          area = area.replace(":", "-");
          let minArea = area.split("-")[0];
          if (minArea == 0) {
            area = area.split("-")[1] + "平米以下"
          } else {
            area = area + "平米";
          }
          this.PlatformUserBehavior.storeChooseArea(area, textOne, textTwo);
        }
        if (fromType == "new" && newParams["priceUnit"]) {
          let priceText = "";

          if (!newParams["priceMax"] && newParams["priceMin"]) {
            priceText = newParams["priceMin"] + "元以上";
          }
          if (newParams["priceMax"] && !newParams["priceMin"]) {
            priceText = newParams["priceMax"] + "元以下";
          }
          if (newParams["priceMax"] && newParams["priceMin"]) {
            priceText = newParams["priceMin"] + "-" + newParams["priceMax"] + "元";
          }
          this.PlatformUserBehavior.storeNewHousePrice(newParams["priceUnit"], priceText);
          newParams["priceUnit"] = "";
        }
        if (fromType != "new" && newParams["room"]) {
          let roomText = "";
          let roomMin = newParams["room"].split(":")[0];
          let roomMax = newParams["room"].split(":")[1];
          roomText = roomMin + "室";
          if (roomMin < roomMax) {
            roomText = roomMin + "室以上";
          }
          this.PlatformUserBehavior.storeHouseRoom(newParams["room"],
            roomText, caseType, textOne, textTwo);
        }
        if (fromType != "new" && newParams["price"]) {
          let priceMin = newParams["price"].split(":")[0];
          let priceMax = newParams["price"].split(":")[1];
          let priceText = "";
          let priceUnit = this.houseSelectTab == 1 ? "万元" : "元";
          if (priceMin == 0) {
            priceText = priceMax + priceUnit + "以下";
          } else if (priceMax == 9999) {
            priceText = priceMin + priceUnit + "以上";
          } else {
            priceText = priceMin + priceMax + priceUnit;
          }
          this.PlatformUserBehavior.storeHousePrice(newParams["price"],
            priceText, caseType, textOne, textTwo);
        }

        let tab = eventMap.get(fromType);
        this.houseListMap[tab].currentPage = 1;
        this.getHouseList(tab)
          .then(list => {
            if (list.length > 0 && newParams.regionId) {
              // 微店撩客初始化
              new DealWeiDianLiaoKeDetail(this.archiveId).chooseRegion(newParams.regionId);
            }
            if (list.length < this.houseListMap[tab].pageSize) {
              this.houseListMap[tab].haveMore = false;
            } else {
              this.houseListMap[tab].haveMore = true;
            }
            this.houseListMap[tab].list = list;
          });
      },

      // 底部切换回调
      onBottomTabChanged(item) {
        this.setEntrustHeight();
        this.defaultSelected = item.id;
      },

      // 初始化信息
      initData() {
        return Promise.all([
          this.initAgentInfo()
        ]).then(res => {
          this.isRequesting = false;
          return res;
        });
      },

      // 初始化是否关注
      initGuanZhuStatus(cityId) {
        let me = new UserInfoModel().getModel("me") || {};
        return new CheckIsAttentionBroker({
          wxId: me.userId,
          archiveId: this.archiveId,
          cityId: cityId
        }).send()
          .then(res => {
            if (res.ERROR_CODE != 0) return;

            this.guanZhuStatus = res.DATA ? res.DATA.STATUS || 0 : 0;
          });
      },

      // 初始化经纪人信息
      initAgentInfo() {
        return new GetAgentInfo({archiveId: this.archiveId}).send()
          .then(res => {
            let agentInfo = res.archiveInfo || {};
            this.agentInfo = {
              archiveId: agentInfo.ARCHIVE_ID || "",
              agentName: agentInfo.USER_NAME || "",
              agentHead: agentInfo.USER_PHOTO
                ? agentInfo.USER_PHOTO.indexOf("http") >= 0
                  ? agentInfo.USER_PHOTO
                  : "http:" + agentInfo.USER_PHOTO
                : "",
              serviceRegArr: agentInfo.SERVICE_REG_ARR || [],
              serviceZoneCn: agentInfo.SERVICE_ZONE_CN || "",
              serviceZone: agentInfo.SERVICE_ZONE || "",
              personSign: agentInfo.PROFESSION_SUB || "",
              telephone: agentInfo.USER_MOBILE || "",
              cityId: agentInfo.CITY_ID || "",
              serviceReg: !agentInfo.SERVICE_REG
                ? ""
                : agentInfo.SERVICE_REG.indexOf(",") >= 0
                  ? (agentInfo.SERVICE_REG.split(",")[0] || "")
                  : agentInfo.SERVICE_REG,
              saleCount: res.saleCount || 0,
              leaseCount: res.leaseCount || 0,
            };
            // 采集数据
            let me = new UserInfoModel().getModel("me") || {};
            new ShareVisiting().behavior({
              archiveId: agentInfo.ARCHIVE_ID || '', // 经济人档案id
              cUserId: me.userId || '', // c端用户id，分享时无
              caseId: '', // 房源id
              caseType: '', // 房源类型：1.出售，2.出租，6.新盘
              cityId: agentInfo.CITY_ID || '',
              sourceType: this.sourceTypeId, // 统计子分类
              statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
              appSource: 'zdzf-personalStore-1'
            }).then(res => {
              console.log(res)
            });

            //平台用户来源采集(标记) 20191112 IM优化需求
            new SaveCclientUserType().behavior({
              archiveId: agentInfo.ARCHIVE_ID || '', // 经济人档案id
              sourceType: 2, //sourceType 1 = 平台， 2 = 私有
            }).then(res => {
              console.log(res)
            })

            this.compId = agentInfo.compId ? agentInfo.compId.erpCompId || "" : "";
            this.agentCityId = agentInfo.CITY_ID || "";
            uni.setNavigationBarTitle({
              title: (this.agentInfo.agentName ? this.agentInfo.agentName + "的微店" : "")
            });
            this.changeHouseSelectTab(1);
            this.getNewHouseList()
              .then(list => {
                this.haveNewHouseTab = false;
                if (list.length > 0) {
                  this.haveNewHouseTab = true;
                }
                this.houseListMap[3].list = list;
                if (list.length < this.houseListMap[3].pageSize) {
                  this.houseListMap[3].haveMore = false;
                }
              });
            return this.initGuanZhuStatus(agentInfo.CITY_ID);
          });
      },

      // 切换房源类型tab
      changeHouseSelectTab(tab) {
        this.houseSelectTab = tab;
        if (this.houseListMap[tab].list) {
          return Promise.resolve(this.houseListMap[tab].list);
        }

        this.getHouseList(tab)
          .then(list => {
            if (list.length < this.houseListMap[tab].pageSize) {
              this.houseListMap[tab].haveMore = false;
            }
            this.houseListMap[tab].list = list;
            return list;
          });
      },

      // 触底加载更多
      scrollBottom() {
        let houseMapItem = this.houseListMap[this.houseSelectTab];
        if (houseMapItem.isScrollIng || !houseMapItem.haveMore) return;

        houseMapItem.isScrollIng = true;
        houseMapItem.currentPage++;
        this.houseListMap[this.houseSelectTab] = houseMapItem;
        this.getHouseList(this.houseSelectTab)
          .then(list => {
            houseMapItem.isScrollIng = false;
            if (houseMapItem.pageSize > list.length) {
              houseMapItem.haveMore = false;
            }
            houseMapItem.list = (houseMapItem.list || []).concat(list);
            this.houseListMap[this.houseSelectTab] = houseMapItem;
          });
      },

      // 获取房源数据
      getHouseList(tab) {
        return new Promise((resolve, reject) => {
          let eventMap = new Map()
            .set(1, "getErHouseList")
            .set(2, "getLeaseHouseList")
            .set(3, "getNewHouseList");
          this[eventMap.get(tab)]()
            .then(list => {
              resolve(list);
            });
        });
      },
      // 获取二手房数据
      getErHouseList() {
        let dataParams = {
          pageNum: this.houseListMap[1].currentPage,
          pageSize: this.houseListMap[1].pageSize,
          cityId: this.agentCityId,
          caseType: 1,
          fromSource: 3,
          compId: this.compId
        };
        let params = Object.assign(dataParams, this.houseListMap[1].paramsScreen);
        return new GetErHouseList(this.dealParams(params)).send()
          .then(res => {
            let erHouseList = [];
            let list = res.DATA ? res.DATA.list || [] : [];
            for (let i = 0; i < list.length; i++) {
              let dataItem = list[i] || {};
              let item = new ErHouseListItem();
              if (!dataItem.buildId) return null;

              let tags = !dataItem.houseTagDesc ? []
                : dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") === -1
                  ? [dataItem.houseTagDesc] : dataItem.houseTagDesc.split("|");
              if (tags.length > 3) {
                tags = tags.slice(0, 3);
              }
              item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
              item.cityId = dataItem.cityId || "";
              item.caseType = dataItem.caseType || "";
              item.houseId = dataItem.houseId || "";
              item.reSource = dataItem.reSource || "";
              item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
              item.houseTitle = dataItem.houseSubject || "";
              item.houseTing = (dataItem.houseRoom && dataItem.houseRoom != 0
                ? dataItem.houseRoom + "室" : "")
                + (dataItem.houseWei && dataItem.houseWei != 0
                  ? dataItem.houseWei + "卫" : "");
              item.houseArea = dataItem.houseArea || "";
              item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
              item.houseName = dataItem.buildName || "";
              item.houseTotalPrice = dataItem.houseTotalPrice || "";
              item.houseTotalPriceUnit = dataItem.houseTotalPrice
                ? (dataItem.priceUnitCn || "") : "";
              item.housePriceOfArea = dataItem.houseUnitPrice || "";
              item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
              item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
              item.hasVideo = !!(dataItem.videoNum && dataItem.videoNum > 0);
              item.houseTags = tags;
              item.houseUseage = dataItem.houseUseage || "";
              item.houseUseageCn = dataItem.houseUseageCn || "";
              item.pageFrom = "personalStore";
              item.archiveId = this.archiveId;
              erHouseList.push(item);
            }
            return erHouseList;
          });
      },
      // 获取出租数据
      getLeaseHouseList() {
        let dataParams = {
          pageNum: this.houseListMap[2].currentPage,
          pageSize: this.houseListMap[2].pageSize,
          cityId: this.agentCityId,
          caseType: 2,
          fromSource: 3,
          compId: this.compId
        };
        let params = Object.assign(dataParams, this.houseListMap[2].paramsScreen);
        return new GetErHouseList(this.dealParams(params)).send()
          .then(res => {
            let leaseHouseList = [];
            let list = res.DATA ? res.DATA.list || [] : [];
            for (let i = 0; i < list.length; i++) {
              let dataItem = list[i] || {};
              let item = new ErHouseListItem();
              if (!dataItem.buildId) return null;

              let tags = !dataItem.houseTagDesc ? []
                : dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") === -1
                  ? [dataItem.houseTagDesc] : dataItem.houseTagDesc.split("|");
              if (tags.length > 3) {
                tags = tags.slice(0, 3);
              }
              item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
              item.cityId = dataItem.cityId || "";
              item.caseType = dataItem.caseType || "3";
              item.houseId = dataItem.houseId || "";
              item.reSource = dataItem.reSource || "";
              item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
              item.houseTitle = dataItem.houseSubject || "";
              item.houseTing = (dataItem.houseRoom && dataItem.houseRoom != 0 ? dataItem.houseRoom + "室" : "")
                + (dataItem.houseWei && dataItem.houseWei != 0 ? dataItem.houseWei + "卫" : "");
              item.houseArea = dataItem.houseArea || "";
              item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
              item.houseName = dataItem.buildName || "";
              item.houseTotalPrice = CheckHousePrice.getPrice(dataItem.houseUseage || 1
                , dataItem.houseArea || "", dataItem.houseTotalPrice || 0, dataItem.priceUnitCn || "");
              item.houseTotalPriceUnit = dataItem.houseTotalPrice
                ? (dataItem.priceUnitCn || "") : "";
              item.housePriceOfArea = dataItem.houseUnitPrice || "";
              item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
              item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
              item.hasVideo = !!(dataItem.videoNum && dataItem.videoNum > 0);
              item.houseTags = tags;
              item.houseUseage = dataItem.houseUseage || "";
              item.houseUseageCn = dataItem.houseUseageCn || "";
              item.pageFrom = "personalStore";
              item.archiveId = this.archiveId;
              leaseHouseList.push(item);
            }
            return leaseHouseList;
          });
      },
      // 获取新房数据
      getNewHouseList() {
        let dataParams = {
          archiveId: this.archiveId,
          brokerCityId: this.agentCityId,
          isWeiStore: 1,
          pageRows: this.houseListMap[3].pageSize,
          pageOffset: this.houseListMap[3].currentPage,
        };
        let params = Object.assign(dataParams, this.houseListMap[3].paramsScreen);
        return new GetStoreNewHouseList(this.dealParams(params)).send()
          .then(res => {
            let newHouseList = [];
            let list = res.data ? res.data.newBuildList || [] : [];
            for (let i = 0; i < list.length; i++) {
              let dataItem = list[i] || {};
              let item = new NewHouseListItem();
              if (!dataItem.buildId) continue;

              let tags = !dataItem.buildTag
                ? [] : dataItem.buildTag.indexOf(",") >= 0
                  ? dataItem.buildTag.split(",") : [dataItem.buildTag];
              let buildTypeTags = !dataItem.buildType
                ? [] : dataItem.buildType.indexOf(",") >= 0
                  ? dataItem.buildType.split(",") : [dataItem.buildType];
              let buildFitmentTags = !dataItem.buildFitment
                ? [] : dataItem.buildFitment.indexOf(",") >= 0
                  ? dataItem.buildFitment.split(",") : [dataItem.buildFitment];
              tags = tags.concat(buildTypeTags);
              tags = tags.concat(buildFitmentTags);

              if (tags.length > 3) {
                tags = tags.slice(0, 3);
              }
              item.cityId = dataItem.cityId || "";
              item.buildId = dataItem.buildId || "";
              item.buildStatus = dataItem.buildStatus || "";
              item.buildImg = dataItem.photoUrl || Const.houseDefaultImg;
              item.buildTing = dataItem.roomText ? dataItem.roomText + " | " : "";
              item.buildArea = (dataItem.areaLow && dataItem.areaHigh)
                ? parseInt(dataItem.areaLow) + "-" + parseInt(dataItem.areaHigh)
                : (parseInt(dataItem.areaLow || 0) || parseInt(dataItem.areaHigh || 0)
                  || "");
              item.buildAreaUnit = (dataItem.areaLow || dataItem.areaHigh) ? "m²" : "";
              item.buildAddress = dataItem.buildAddr || "";
              item.buildName = dataItem.buildName || "";
              item.buildTags = tags;
              item.buildPriceOfArea = !dataItem.averagePrice ? ""
                : dataItem.averagePrice.indexOf("价格") >= 0
                  ? "" : parseInt(dataItem.averagePrice);
              item.buildPriceOfAreaUnit = "元/㎡";
              item.isHotSale = !!(dataItem.hotFlag && dataItem.hotFlag == 1);
              newHouseList.push(item);
            }
            return newHouseList;
          });
      },
    },
  }
</script>

<style>
  page {
    background: #FFFFFF;
  }

  .personal_store_view {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
  }

  .active {
    overflow: hidden;
  }

  .house_tab_view {
    width: 100%;
    height: 65upx;
    background: #fff;
    font-size: 28upx;
    color: #333333;
    line-height: 65upx;
    padding: 0 40upx;
    box-sizing: border-box;
  }

  .house_tab_title {
    font-size: 38upx;
    color: #101d36;
    text-align: left;
  }

  .house_tab_item {
    margin-right: 40upx;
  }

  .house_tab_view .house_tab_item:last-child {
    margin-right: 0;
  }

  .house_tab_view .house_tab_item_active {
    color: #2491FF;
    border-bottom: 6upx solid #2491FF;
    box-sizing: border-box;
  }

  .house_list_view {
    padding: 0 40upx;
    box-sizing: border-box;
  }

  .house_bottom_empty_view {
    height: 150upx;
  }

  .no_more_data {
    height: 80upx;
    line-height: 80upx;
    text-align: center;
    font-size: 26upx;
    color: #666666;
  }

  .sale_no_data {
    position: relative;
    top: 150upx;
    width: 100%;
    height: 400upx;
  }

  .no-pic {
    margin: 0 auto;
    width: 150upx;
    height: 150upx;
    background: url(https://zdzfapi.haofang.net/Public/wxApp/images/new_images/nodata_list_new.png) no-repeat center;
    background-size: 100%;
    margin-bottom: 20upx;
  }

  .no-txt {
    width: 100%;
    text-align: center;
    font-size: 26upx;
    color: #a6a6a6;
  }
</style>
