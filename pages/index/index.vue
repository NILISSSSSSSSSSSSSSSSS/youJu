<template>
  <view>
    <!-- 顶部 -->
    <view class="home_top">
      <view class="search_box f_r_s" @click="searchBtn">
        <view class="city" @click.stop="chooseCity">
          <view>{{ cityName }}</view>
          <view class="city_icon"></view>
        </view>

        <view class="search_icon"></view>

        <view class="search_text">你想住哪里？</view>
      </view>
    </view>

    <!--内容区-->
    <view class="home_view">
      <!-- 功能tab -->
      <view class="controls_list">
        <view class="controls_btn_view f_r_s">
          <view @click="changeService(1)" :class="serviceStatus == 1 ? 'controls_btn_active' : ''"
                class="controls_btn_item f_c_e">买房/租房
          </view>
          <view @click="changeService(2)" :class="serviceStatus == 2 ? 'controls_btn_active' : ''"
                class="controls_btn_item f_c_e">更多服务
          </view>
        </view>

        <view :style="{justifyContent: serviceStatus == 1 ? 'space-between': ''}"
              class="f_r_s controls_content">
          <button hover-class="none" form-type="submit" @click="controlsBtn(info)"
                  :style="{marginRight: serviceStatus == 1 ? '0': ''}"
                  class="controls_item"
                  v-for="(info, index) in controlsListMap[serviceStatus]" :key="index">
            <view class="controls_img_" :class="info.className"></view>
            <view class="controls_text">{{ info.text }}</view>
          </button>
        </view>
      </view>

      <!-- swiper-->
      <view class="swiper_list" v-if="swiperDateList && swiperDateList.length == 1">
        <block v-for="(swiperDate,index) in swiperDateList" :key="index">
          <button hover-class="none" form-type="submit" class="swiper_item" @click="swiperBtn(swiperDate)">
            <image mode="aspectFit" class="swiper_img"
                   src="https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/entrust_banner_wy.png?t=2 "></image>
          </button>
        </block>
      </view>
      <swiper class="swiper_list" duration="300" v-if="swiperDateList && swiperDateList.length > 1">
        <block v-for="(swiperDate,index) in swiperDateList" :key="index">
          <swiper-item class="swiper_item">
            <button hover-class="none" form-type="submit" class="swiper_item" @click="swiperBtn(swiperDate)">
              <image mode="aspectFit" class="swiper_img" :src="swiperDate.imgSrc"></image>
            </button>
          </swiper-item>
        </block>
      </swiper>

      <!-- 必备小工具 -->
      <view class="tool_view">
        <view class="tool_title">必备小工具</view>

        <view class="tool_cont f_r_s">
          <view class="tool_item f_c_s" @click="toolBtn(item)" v-for="(item, index) in toolList" :key="index">
            <div class="tool_item_img" :class="item.className"></div>
            <view class="tool_item_text">{{ item.text }}</view>
          </view>
        </view>
      </view>

      <!-- 热门活动 -->
      <view class="hot_activity">
        <view class="tool_title">热门活动</view>

        <view class="hot_activity_content">
          <block v-if="hotActivityList && hotActivityList.length > 1">
            <swiper class="hot_activity_view" duration="300" @change="hotActivityChange">
              <block v-for="(swiperDate,index) in hotActivityList" :key="index">
                <swiper-item class="hot_activity_item">
                  <button hover-class="none" form-type="submit" class="hot_activity_btn"
                          @click="hotActivityBtn(swiperDate)">
                    <image mode="aspectFill" class="hot_activity_img" :src="swiperDate.imgSrc"></image>
                  </button>
                </swiper-item>
              </block>
            </swiper>

            <view class="hot_activity_point f_r_s">
              <view :class="hotActivityIndex == index ? 'hot_point_active' : ''"
                    v-for="(swiperDate,index) in hotActivityList" :key="index"></view>
            </view>
          </block>

          <view class="hot_activity_view" v-else-if="hotActivityList && hotActivityList.length == 1">
            <button hover-class="none" form-type="submit" class="hot_activity_btn"
                    @click="hotActivityBtn(hotActivityList[0])">
              <image mode="aspectFill" class="hot_activity_img" :src="hotActivityList[0].imgSrc"></image>
            </button>
          </view>

          <view class="hot_activity_view" v-else></view>
        </view>
      </view>

      <!-- 精选二手房 -->
      <view class="house_view" v-if="erHouseList && erHouseList.length > 0">
        <!-- 房源title -->
        <view class="f_r_b house_titl_view">
          <view class="tool_title">为你推荐</view>

          <view @click="lookMoreErHouse" class="house_title_more f_r_s">
            <view class="f_c_c">查看更多</view>

            <image class="house_title_more_img" :src="looMoreImgSrc"></image>
          </view>
        </view>

        <!-- 二手房源列表 -->
        <view class="house_list">
          <block v-for="(item, index) in erHouseList" :key="index">
            <er-house-list-item :item="item"></er-house-list-item>
          </block>
        </view>
      </view>

      <!-- 精选新房 -->
      <view :style="{marginTop: erHouseList && erHouseList.length > 0 ? '-30upx':''}"
            class="house_view" v-if="newHouseList && newHouseList.length > 0">
        <!-- 房源title -->
        <view class="f_r_b house_titl_view">
          <view class="tool_title f_r_s">精选新房</view>

          <view @click="lookMoreNewHouse" class="house_title_more f_r_s">
            <view class="f_c_c">查看更多</view>
            <image class="house_title_more_img" :src="looMoreImgSrc"></image>
          </view>
        </view>

        <!-- 新房列表 -->
        <view class="house_list">
          <block v-for="(item, index) in newHouseList" :key="index">
            <new-house-list-item :item="item"></new-house-list-item>
          </block>
        </view>
      </view>

      <!-- 精选租房 -->
      <view :style="{marginTop: newHouseList && newHouseList.length > 0 ? '-30upx':''}"
            class="house_view" v-if="zuHouseList && zuHouseList.length > 0">
        <!-- 房源title -->
        <view class="f_r_b house_titl_view">
          <view class="tool_title f_r_s">精选租房</view>

          <view @click="lookMoreZuHouse" class="house_title_more f_r_s">
            <view class="f_c_c">查看更多</view>
            <image class="house_title_more_img" :src="looMoreImgSrc"></image>
          </view>
        </view>

        <!-- 租房列表 -->
        <view class="house_list">
          <block v-for="(item, index) in zuHouseList" :key="index">
            <er-house-list-item :item="item"></er-house-list-item>
          </block>
        </view>
      </view>

      <!-- 精选公寓 -->
      <view :style="{marginTop: zuHouseList && zuHouseList.length > 0 ? '-30upx':''}"
            class="house_view" v-if="apartmentList && apartmentList.length > 0">
        <!-- 房源title -->
        <view class="f_r_b house_titl_view">
          <view class="tool_title f_r_s">精选公寓</view>

          <view @click="lookMoreApartment" class="house_title_more f_r_s">
            <view class="f_c_c">查看更多</view>
            <image class="house_title_more_img" :src="looMoreImgSrc"></image>
          </view>
        </view>

        <!-- 精选公寓列表 -->
        <scroll-view class="apartment_list" scroll-x>
          <view class="apartment_cont">
            <block v-for="(item, index) in apartmentList" :key="index">
              <apartment-house-list-item :item="item"></apartment-house-list-item>
            </block>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view @click="lookMoreErHouse" class="bottom_tips" v-if="apartmentList && apartmentList.length > 0">
      <view class="bottom_tips_line"></view>
      <view class="bottom_tips_text">点击更多进入频道</view>
    </view>

    <!-- 引导下载 -->
    <view class="down-app-box" v-if="downAppBoxShow">
      <view class="down-mask" @click='downCloseEvent'></view>
      <view class="down-con">
        <view class="down-txt down-txt-top">该功能小程序暂不支持</view>
        <view class="down-txt">请打开App Atore或应用市场</view>
        <view class="down-txt down-txt-bottom">下载悠居客App</view>
        <view class="down-img"></view>
        <view class="down-btn" @click='downCloseEvent'>
          <view class="down-btn-txt">我知道了</view>
        </view>
      </view>
    </view>

    <!-- 演唱会弹窗 -->
    <view class='vocal-box' v-if='showWindow'>
      <view class='vocal-box-mask' @click='closeJWindow'></view>
      <view class='v-cont-b'>
        <view class='v-top' :style='{backgroundImage: "url("+activeData.indexBanner || ""+")"}'></view>

        <view class='v-cont-list'>
          <view class='li'>
            <view class='v-li-dot' :style="{background: activeData.indexColor}"></view>
            {{activeData.indexTextOne || '分享转发小程序'}}
          </view>
          <view class='li'>
            <view class='v-li-dot' :style="{background: activeData.indexColor}"></view>
            {{activeData.indexTextTwo || '邀请3位好友助力'}}
          </view>
          <view class='li'>
            <view class='v-li-dot' :style="{background: activeData.indexColor}"></view>
            {{activeData.indexTextThree || '获得抽奖码领取奖品'}}
          </view>
        </view>
        <view @click="enterVocalActive" class='canyu'
              :style="{background: activeData.indexColor}">{{activeData.indexButtonText || "立即领奖"}}
        </view>
        <view class='close' @click='closeJWindow'></view>
      </view>
    </view>
    <!-- 演唱会活动悬浮按钮 -->
    <view class='act-btn-box-vocal' :style='{backgroundImage: "url(" + activeData.susIcon + ")"}'
          @click='gotoVocal' v-if='vocalShow'></view>

    <!-- indexDialog 弹窗 -->
    <view class="index-dialog" v-if="indexDialogUrl && indexDialogActionUrl">
      <view class="content">
        <image @click='bannerSkip' :src="indexDialogUrl" class="pic" mode="widthFix">
        </image>
        <view class='close' @click='indexDialogHide'></view>
      </view>
    </view>

    <get-user-info></get-user-info>

    <claimAuthon></claimAuthon>
    <!-- 抢单优化- 未绑定号码的情况 弹窗优惠券弹窗，引导绑定号码，赠送优惠券 -->
    <giftCouponView></giftCouponView>
  </view>
</template>

<script>
  import {Config} from "../../utils/config.js";
  import {Const} from "../../utils/Const.js";
  import giftCouponView from "@/components/giftCouponView.vue";
  import erHouseListItem from "@/components/erHouseListItem.vue";
  import newHouseListItem from "@/components/newHouseListItem.vue";
  import apartmentHouseListItem from "@/components/apartmentHouseListItem.vue";
  import {GetIndexData} from "../../net/GetIndexData";
  import {GetHotActivityInfo} from "../../net/index/GetHotActivityInfo.js";
  import {GetActiveBannerInfo} from "../../net/index/GetActiveBannerInfo.js";
  import {GetActivityTcInfo} from "../../net/index/GetActivityTcInfo.js";
  import {ErHouseListItem} from "../../utils/Const";
  import {NewHouseListItem} from "../../utils/Const";
  import {ApartmentHouseListItem} from "../../utils/Const";
  import {CheckHousePrice} from "../../utils/CheckHousePrice";
  import {Notification} from "../../utils/Notification.js";
  import {Notify} from "../../utils/Notify.js";
  import {UserInfoModel} from "../../model/UserInfoModel.js";
  import {UpUnReadNumTab} from "../../utils/ImChart.js";
  import {GpsInfoModel} from "@/model/GpsInfoModel.js";
  import claimAuthon from "@/components/claimAuthon.vue";

  export default {
    data() {
      return {
        showClaimAuthon: false,
        getColorFinish: true,
        controlsListMap: {
          1: [
            {
              text: "二手房",
              className: "home_house2_btn",
              event: "lookMoreErHouse"
            },
            {
              text: "新房",
              className: "home_newhouse_btn",
              event: "lookMoreNewHouse"
            },
            {
              text: "整租",
              className: "home_rentingahouse_btn",
              event: "lookMoreZuHouse",
              type: "zhengZu"
            },
            {
              text: "合租",
              className: "home_sharedrent_btn",
              event: "lookMoreZuHouse",
              type: "heZu"
            },
          ],
          2: [
            {
              text: "我的委托",
              className: "home_entrust_btn",
              event: "lookTrustList"
            },
            {
              text: "装修团购",
              className: "home_decoration_btn",
              event: "lookFitment"
            },
            {
              text: "公寓",
              className: "home_flats_btn",
              event: "lookMoreApartment"
            },
          ]
        },

        swiperDateList: [
          {
            imgSrc: "http://uuhf.myfun7.com/uuhfWeb/images/newWelPage/banner/index_banner_center@2x.png",
            href: "pages/findHouse/findHouse"
          }
        ],
        erHouseList: null,
        newHouseList: null,
        zuHouseList: null,
        apartmentList: null,

        serviceStatus: 1,  // 服务切换状态  1：买房/租房  2： 更多服务

        agentMenDianNumList: [
          {text: "全国经纪人", unit: "万+", num: "100"},
          {text: "316城门店", unit: "万+", num: "5"},
          {text: "日新增房源", unit: "万+", num: "2"}
        ],

        toolList: [
          {
            text: "房价评估",
            className: "home_huseprice_btn",
            pageTo: "/pagesTool/housePriceEvaluate/housePriceEvaluate",
          },
// 					{
// 						text: "贷款",
// 						pageTo: "webView",
// 						imgSrc: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/index/home_loan_btn.png?t=20120221",
// 					},
          {
            text: "房贷计算",
            className: "home_mortgage_btn",
            pageTo: "/pagesTool/calculatorFangDai/calculatorFangDai",
          },
          {
            text: "税费计算",
            className: "home_tax_btn",
            pageTo: "/pagesTool/calculatorShuiFei/calculatorShuiFei",
          }
        ],

        // imgSrc, pageTo
        hotActivityList: [
          {
            imgSrc: "http://dev.51vfang.cn/uuhfWeb/images/newWelPage/banner/banner_remenhuodong@2x.png",
            pageTo: Config.homeZeroEntrustMoneyWebUrl
          }
        ],
        hotActivityIndex: 0,

        // 查看更多右箭头
        looMoreImgSrc: "http://uuweb.haofang.net/Public/wxApp/images/mine/arrow_right.png",

        // 引导下载
        downAppBoxShow: false,
        // 演唱会弹窗
        showWindow: false,
        // 演唱会悬浮窗
        vocalShow: false,
        // 活动
        activeData: {},

        // indexDilog 弹窗
        indexDialogUrl: "",
        indexDialogActionUrl: "",

        cityId: "1",
        cityName: "成都"
      }
    },

    components: {
      giftCouponView,
      erHouseListItem,
      newHouseListItem,
      apartmentHouseListItem,
      claimAuthon
    },

    onShareAppMessage() {
      return new this.ShareAppMessage().init();
    },

    onLoad() {
      this.initData();

      // 监听城市切换事件
      new Notification().addObserver(this, "CityInfoChanged", Notify.CityInfoChanged.Name);
      // 监听用户信息事件
      new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
      // 监听授权事件
      new Notification().addObserver(this, "AuthonChanged", Notify.AuthonChanged.Name);
    },

    onUnload() {
      // 反注册通知
      new Notification().removeObserverAllNotification(this);
    },

    onShow() {
      this.initCitiInfo();
      new this.SetMetaInfo().initDefault();
      uni.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#ffffff"
      });
      UpUnReadNumTab.setTab();
      // 监听gps变化
      new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
    },

    onHide() {
      // 反注册通知
      new Notification().removeObserver(this, Notify.GpsChanged.Name);
    },

    methods: {
      // 授权
      AuthonChanged() {
        this.showClaimAuthon = true;
      },

      // 初始化城市信息
      initCitiInfo() {
        let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
        if (cityInfo.cityId && cityInfo.cityName) {
          this.cityId = cityInfo.cityId;
          this.cityName = cityInfo.cityName;
        }
      },

      // 搜索
      searchBtn() {
        uni.navigateTo({
          url: "/pagesHouse/search/search?from=index"
        });
      },

      // 选择城市
      chooseCity() {
        uni.navigateTo({
          url: "../chooseCity/chooseCity"
        });
      },

      // 切换服务
      changeService(status) {
        this.serviceStatus = status;
      },


      // 服务点击
      controlsBtn(info) {
        if (!info.event || !this[info.event]) {
          uni.showToast({
            title: "敬请期待！",
            duration: 1500,
            mask: Config.mask
          });
          return;
        }

        this[info.event](info);
      },
      // 二手房更多
      lookMoreErHouse() {
        uni.navigateTo({
          url: "/pagesHouse/erHouseList/erHouseList"
        });
      },
      // 新房更多
      lookMoreNewHouse() {
        uni.navigateTo({
          url: "/pagesHouse/newHouseList/newHouseList"
        });
      },
      // 租房更多
      lookMoreZuHouse(info = {}) {
        let caseType = info.type && info.type == "heZu" ? 3 : 2;
        uni.navigateTo({
          url: "/pagesHouse/leaseList/leaseList?caseType=" + caseType
        });
      },
      // 公寓更多
      lookMoreApartment() {
        uni.navigateTo({
          url: "/pagesHouse/apartmentList/apartmentList"
        });
      },
      // 装修团购
      lookFitment() {
        uni.navigateTo({
          url: "/pages/webView/webView?bgColor=#ffffff&color=#000000"
            + "&url=" + this.Config.fitmentWebUrl
            + "&type=urlParams" + "&title=装修团购"
        });
      },

      // 必备小工具
      toolBtn(item) {
        let url = item.pageTo;
        if (item.pageTo === "webView") {
          url = "../webView/webView?bgColor=#ff6300&color=#ffffff&" +
            "url=uuweb.haofang.net/App/Index/loanApplyIndex" +
            "&title=悠居客贷款查询"
        }

        uni.navigateTo({
          url: url
        });
      },

      // 特权找房的广告swiper
      swiperBtn(info) {
        uni.navigateTo({
          url: "/pagesEntrust/privilegeFindHouse/privilegeFindHouse"
        });
      },

      // 我的委托
      lookTrustList() {
        uni.navigateTo({
          url: "/pagesEntrust/trustList/trustList"
        });
      },

      // 热门活动切换
      hotActivityChange(e) {
        this.hotActivityIndex = e.detail.current;
      },
      hotActivityBtn(item) {
        let page = item.pageTo;
        uni.navigateTo({
          url: "/pagesWeb/homeActive/zeroPay"
        });
      },

      // 初始化数据
      initData() {
        new GetIndexData({cityId: this.cityId}).send().then(res => {
          let data = res.DATA || {};
          new this.SetMetaInfo().initHome();
          this.drawErHouseList(data.saleData || []);
          this.drawNewHouseList(data.newHouseList || []);
          this.drawZuHouseList(data.leaseData || []);
          this.drawApartmentHouseList(data.apartmentData || []);
        });
        Promise.all([
          this.initHotAndAgentNum(),
          this.initBottomActive(),
          // this.initTcActive()
        ]).catch(err => {
          console.error(err);
          uni.showModal({
            title: "提示",
            content: "获取房源信息失败啦！请稍后重试。"
          });
        });
      },
      drawErHouseList(apiList = []) {
        let erHouseList = [];
        for (let i = 0; i < apiList.length; i++) {
          let dataItem = apiList[i] || {};
          let item = new ErHouseListItem();
          if (!dataItem.buildId) continue;

          let tags = (dataItem.houseTagDesc
            && dataItem.houseTagDesc.indexOf("|") >= 0)
            ? dataItem.houseTagDesc.split("|") : [];
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
          item.houseTing = (dataItem.houseRoom && dataItem.houseRoom != 0 ? dataItem.houseRoom + "室" : "")
            + (dataItem.houseWei && dataItem.houseWei != 0 ? dataItem.houseWei + "卫" : "");
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
          erHouseList.push(item);
        }
        this.erHouseList = erHouseList;
      },
      drawNewHouseList(apiList = []) {
        let newHouseList = [];
        for (let i = 0; i < apiList.length; i++) {
          let dataItem = apiList[i] || {};
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
          item.buildId = dataItem.buildId || "";
          item.buildImg = dataItem.photoAddr || Const.houseDefaultImg;
          item.buildName = dataItem.buildName || "";
          item.buildStatus = dataItem.buildStatus || "";
          item.buildTing = (dataItem.roomText
          && (dataItem.areaLow || dataItem.areaHigh)
            ? dataItem.roomText + " | " : (dataItem.roomText || ""));
          item.buildArea = (dataItem.areaLow && dataItem.areaHigh)
            ? parseInt(dataItem.areaLow) + "-" + parseInt(dataItem.areaHigh)
            : (parseInt(dataItem.areaLow || 0) || parseInt(dataItem.areaHigh || 0) || "");
          item.buildAreaUnit = item.buildArea ? "m²" : "";
          item.buildAddress = dataItem.buildAddr || "";
          item.buildTags = tags;
          item.buildPriceOfArea = !dataItem.priceText ? "" : dataItem.priceText.indexOf("价格") >= 0 ? "" : parseInt(dataItem.priceText);
          item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
          item.cityId = dataItem.cityId || "";
          newHouseList.push(item);
        }
        this.newHouseList = newHouseList;
      },
      drawZuHouseList(apiList = []) {
        let zuHouseList = [];
        for (let i = 0; i < apiList.length; i++) {
          let dataItem = apiList[i] || {};
          let item = new ErHouseListItem();
          if (!dataItem.buildId) continue;

          let tags = (dataItem.houseTagDesc
            && dataItem.houseTagDesc.indexOf("|") >= 0)
            ? dataItem.houseTagDesc.split("|") : [];
          if (dataItem.caseType && dataItem.caseType == 2 && dataItem.reSource && dataItem.reSource == 5) {
            tags.unshift("合租");
          }
          if (tags.length > 3) {
            tags = tags.slice(0, 3);
          }
          item.cityId = dataItem.cityId || "";
          item.caseType = dataItem.caseType || "";
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
          zuHouseList.push(item);
        }
        this.zuHouseList = zuHouseList;
      },
      drawApartmentHouseList(apiList = []) {
        let apartmentList = [];
        for (let i = 0; i < apiList.length; i++) {
          let dataItem = apiList[i] || {};
          let item = new ApartmentHouseListItem();
          if (!dataItem.uuid) continue;

          let tags = (dataItem.tags
            && dataItem.tags.indexOf(",") >= 0)
            ? dataItem.tags.split(",") : [];
          if (tags.length > 3) {
            tags = tags.slice(0, 3);
          }
          item.houseId = dataItem.uuid || "";
          item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
          item.houseTing = (dataItem.bedRoomNum && dataItem.bedRoomNum != 0
            ? dataItem.bedRoomNum + "室" : "")
            + (dataItem.livingRoomNum && dataItem.livingRoomNum != 0
              ? dataItem.livingRoomNum + "厅" : "")
            + (dataItem.toiletNum && dataItem.toiletNum != 0
              ? dataItem.toiletNum + "卫" : "");
          item.houseResourceText = dataItem.appIdCn || "";
          item.houseName = dataItem.hftBuildName || "";
          item.houseAddress = dataItem.hftSectionName || "";
          item.housePriceOfMonth = dataItem.monthRent || "";
          item.housePriceOfMonthUnit = dataItem.monthRent ? "元/月" : "";
          item.houseTags = tags;
          item.apartmentUuid = dataItem.uuid || "";
          item.roomUuid = dataItem.roomUuid || "";
          item.rentType = dataItem.rentType || "";
          apartmentList.push(item);
        }
        this.apartmentList = apartmentList;
      },

      // 初始化活动和经纪人数量
      initHotAndAgentNum() {
        let userInfo = new UserInfoModel().getModel() || {};
        let telephone = userInfo.telephone || "";
        let that = this;
        return new Promise((resolve, reject) => {
          new GetHotActivityInfo({
            cityId: that.cityId,
            cityName: this.cityName,
            regionId: "",   // 区域id
            regionName: "",  // 区域名称
            userMobile: telephone,  // 传不传都行
            deviceType: 0,   // 设备号
            idfa: "",   // IOS的idfa
            defineAppId: "",   //  自定义appid
            isReturnRecom: 0,   //  是否返回推荐房源
          }).send()
            .then(res => {
              let data = res.DATA;
              let indexBottomBanner = data.indexBottomBanner || [];
              let hftCountInfo = data.hftCountInfo || [];
              let hotActivityList = [];
              for (let hotItem of indexBottomBanner) {
                if (!hotItem.indexIcon || !hotItem.url) continue;

                if (hotItem.url) {
                  if (hotItem.url.indexOf("?") >= 0) {
                    hotItem.url += "&code=uniapp"
                  } else {
                    hotItem.url += "?code=uniapp"
                  }
                }
                hotActivityList.push({
                  imgSrc: hotItem.indexIcon,
                  pageTo: hotItem.url
                });
              }
              if (hotActivityList.length > 0) {
                that.hotActivityList = hotActivityList;
              }

              let agentMenDianNumList = [];
              for (let numItem of hftCountInfo) {
                if (!numItem.indexSubName || !numItem.indexName) continue;

                agentMenDianNumList.push({
                  unit: numItem.indexSubName.substring(numItem.indexSubName.length - 2, numItem.indexSubName.length),
                  num: numItem.indexSubName.substring(0, numItem.indexSubName.length - 2),
                  text: numItem.indexName
                })
              }
              that.agentMenDianNumList = agentMenDianNumList;
              resolve(res);
            })
            .catch(err => {
              // uni.showModal({
              //     title: "提示",
              //     content: "获取活动信息失败啦！请稍后重试。"
              // });
              resolve(err);
            });
        });
      },

      // 初始化底部悬浮活动
      initBottomActive() {
        let that = this;
        return new Promise((resolve, reject) => {
          new GetActiveBannerInfo({}).send()
            .then(res => {
              let data = res.DATA || {};
              that.indexDialogUrl = data.indexDialogUrl || "";
              that.indexDialogActionUrl = data.indexDialogActionUrl || "";
              resolve(res);
            })
            .catch(err => resolve(err));
        })
      },

      // 初始化活动弹窗信息
      initTcActive() {
        let that = this;
        return new Promise((resolve, reject) => {
          new GetActivityTcInfo({}).send()
            .then(res => {
              let activeData = res && res.DATA ? res.DATA.activeData || {} : {};
              that.activeData = {
                susIcon: activeData.susIcon || "",
                indexBanner: activeData.indexBanner || "",
                indexColor: activeData.indexColor || "",
                indexTextOne: activeData.indexTextOne || "",
                indexTextTwo: activeData.indexTextTwo || "",
                indexTextThree: activeData.indexTextThree || "",
                indexButtonText: activeData.indexButtonText || ""
              };
              resolve(res);
            })
            .catch(err => resolve(err));
        });
      },

      // 城市切换回调
      CityInfoChanged(name, item) {
        this.cityId = item.cityId;
        this.cityName = item.cityNameLess || item.cityName || "未知";
        this.initData();
      },

      // gps change 回调
      GpsChanged(name, item) {
        if (item.cityId && item.cityId == this.cityId) return;

        this.cityId = item.cityId || "1";
        this.cityName = item.cityName || "成都";
        this.initData();
      },

      UserInfoChanged() {
        this.initHotAndAgentNum();
      },

      // 引导下载
      downCloseEvent() {
        this.downAppBoxShow = false;
      },
      // 演唱会关闭
      closeJWindow() {
        this.showWindow = false;
      },
      // 进入演唱会活动
      enterVocalActive() {
        let baseUrl = !!this.activeData.miniPath ? this.activeData.miniPath : 'packageActive/pages/vocalHtml/vocalHtml';
        let userInfo = new UserInfoModel().getModel() || {};
        let me = userInfo.me || {};
        let userId = "";
        if (!me.userId || !me.openId) {
          uni.showToast({
            title: "尽情期待",
            icon: "none"
          });
          return;
        }

        uni.navigateTo({
          url: '/' + baseUrl + '?shareUserId=' + me.userId + "&shareOpenId=" + me.openId,
          fail: function (err) {
            uni.showToast({
              title: "尽情期待",
              icon: "none"
            });
          }
        });
      },

      indexDialogHide() {
        this.indexDialogShow = false;
      },
      bannerSkip() {
        let url = this.indexDialogActionUrl;
        if (!url) {
          uni.showToast({
            title: "尽情期待",
            icon: "none"
          });
          return;
        }

        uni.navigateTo({
          url: url,
          fail: function (err) {
            uni.showToast({
              title: "尽情期待",
              icon: "none"
            });
          }
        });
      }
    }
  }
</script>

<style>
  .home_view {
    padding: 0 40upx;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
  }

  .submit_view {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
    bottom: 0;
  }

  .submit_button {
    width: 100%;
    height: 100%;
    padding: 0;
    background: none;
  }

  .canvasClasss {
    height: 200upx;
    width: 200upx;
    opacity: 0;
    background: #FFFFFF;
  }

  page {
    background-color: #FFFFFF;
  }

  /* 顶部 */
  .home_top {
    position: relative;
    width: 100%;
    height: 350upx;
    background: url(https://cdn.haofang.net/static/wxPlusApp/yjk/home/home_banner_image.png) no-repeat top center;
    background-size: 100%;
  }

  .city {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    color: #272727;
    font-size: 32upx;
  }

  .city::after {
    content: "";
    width: 1px;
    height: 34upx;
    background-color: #a3a5a8;
    opacity: 0.46;
    margin: 0 30upx;
  }

  .city_icon {
    margin-left: 10upx;
    background: url(http://cdn.haofang.net/static/wxPlusApp/yjk/arr_down.png) no-repeat;
    background-size: contain;
    height: 8upx;
    width: 13upx;
  }

  .search_box {
    position: absolute;
    top: 300upx;
    right: 40upx;
    left: 40upx;
    height: 96upx;
    line-height: 96upx;
    background: #FFFFFF;
    border-radius: 48upx;
    padding-left: 40upx;
    box-sizing: border-box;
    z-index: 88;
    box-shadow: 0upx 4upx 33upx 2upx rgba(55, 55, 55, 0.16);
  }

  /* #ifdef APP-PLUS */
  .search_box {
    top: 300upx;
  }

  /* #endif */
  .search_icon {
    margin: 30upx 14upx auto 0;
    background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/common_icon_sprites.png) no-repeat;
    background-size: 226upx 108upx;
    height: 40upx;
    width: 40upx;
    background-position: -30upx 0;
  }

  /* #ifdef MP-BAIDU */
  .search_icon {
    margin: 28upx 14upx auto 0;
  }

  /* #endif */
  .search_text {
    color: #7a8190;
    font-size: 32upx;
    font-family: PingFang-SC-Medium
  }

  /* 功能 */
  .controls_list {
    margin-top: 110upx;
    /* padding-bottom: 37upx; */
    box-sizing: border-box;
    background-color: #FFFFFF;
  }

  .controls_btn_view .controls_btn_active {
    color: #101D36;
    font-size: 44upx;
    font-weight: bold;
  }

  .controls_btn_view > view:first-child {
    margin-right: 34upx;
  }

  .controls_btn_item {
    color: #89909d;
    font-size: 32upx;
  }

  .controls_content {
    padding-top: 42upx;
    box-sizing: border-box;
  }

  .controls_list .controls_item:last-child {
    margin-right: 0;
  }

  .controls_item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 70upx;
    overflow: inherit;
  }

  .controls_img {
    width: 55px;
    height: 55px;
    margin-bottom: 10upx;
    flex-shrink: 0;
    background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/index_sprites.png) no-repeat;
    background-size: 487px 55px;
  }

  .controls_img_ {
    width: 110upx;
    height: 110upx;
    margin-bottom: 10upx;
    flex-shrink: 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .tool_item .home_tax_btn {
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/home_tax_btn.png');
  }

  .tool_item .home_mortgage_btn {
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/home_mortgage_btn.png');
  }

  .tool_item .home_huseprice_btn {
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/home_huseprice_btn.png');
  }

  .controls_item .home_rentingahouse_btn {
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/zhengzu.png');
  }

  .controls_item .home_sharedrent_btn {
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/hezu.png');
  }

  .controls_item .home_decoration_btn {
    background-image: url('http://cdn.haofang.net/static/uuminiapp/pageNewUi/index/home_decoration_btn.png');
  }

  .controls_item .home_newhouse_btn {
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/new_house.png');
  }

  .controls_item .home_house2_btn {
    background-image: url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/er_house.png');
  }

  .controls_item .home_entrust_btn {
    background-image: url('http://cdn.haofang.net/static/uuminiapp/pageNewUi/index/home_entrust_btn.png');
  }

  .controls_item .home_flats_btn {
    background-image: url('http://cdn.haofang.net/static/uuminiapp/pageNewUi/index/home_flats_btn.png');
  }

  .controls_text {
    font-size: 28upx;
    letter-spacing: 2upx;
    color: #101D36;
    line-height: 38upx;
    text-align: center;
  }

  /* 经纪人/门店等数量 */
  .agent_num_view {
    border-top: 1upx solid #f5f5f5;
    padding: 20upx 0 0;
    box-sizing: border-box;
  }

  /* #ifndef MP-BAIDU */
  /* #endif */
  .agent_num_item {
    text-align-last: center;
  }

  .agent_num {
    font-size: 72upx;
    color: #101D36;
    font-weight: bold;
    line-height: 72upx;
    min-height: 70upx;
  }

  .agent_num_unit {
    font-size: 28upx;
    color: #000000;
  }

  .agent_num_text {
    font-size: 26upx;
    line-height: 32upx;
    color: #aaafb8;
  }

  /* 广告swiper */
  .swiper_list {
    width: 100%;
    height: 170upx;
    background: #fff;
    margin-top: 50upx;
  }

  .swiper_list .uni-swiper-wrapper {
    overflow: visible;
  }

  .swiper_item {
    width: 100%;
    height: 100%;
    border-radius: 10upx;
    background: #FFFFFF;
    box-shadow: 0upx 4upx 33upx 2upx rgba(55, 55, 55, 0.1);
  }

  .swiper_img {
    width: 100%;
    height: 100%;
  }

  /* 必备小工具 */
  .tool_view {
    padding-top: 50upx;
    box-sizing: border-box;
  }

  .tool_title {
    font-size: 44upx;
    color: #101D36;
    line-height: 70upx;
    font-weight: bold;
  }

  .tool_cont {
    overflow: hidden;
    padding-top: 50upx;
    box-sizing: border-box;
  }

  .tool_item {
    width: 25%;
    text-align: center;
  }

  .tool_item_img {
    width: 54upx;
    height: 54upx;
    margin: 0 auto 10upx;
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .tool_item_text {
    color: #101D36;
    font-size: 26upx;
    line-height: 44upx;
  }

  /* 热门活动 */
  .hot_activity {
    padding-top: 52upx;
    box-sizing: border-box;
  }

  .hot_activity_view {
    width: 100%;
    height: 230upx;
    overflow: hidden;
    margin-top: 20upx;
  }

  .hot_activity_item {
    width: 100%;
    height: 100%;
    border-radius: 12upx;
    box-sizing: border-box;
    overflow: hidden;
  }

  .hot_activity_btn {
    width: 100%;
    height: 100%;
    border-radius: 12upx;
    box-sizing: border-box;
    overflow: hidden;
  }

  .hot_activity_img {
    width: 100%;
    height: 100%;
  }

  .hot_activity_content {
    position: relative;
  }

  .hot_activity_point {
    position: absolute;
    left: 40upx;
    bottom: 18upx;
    z-index: 9999;
  }

  .hot_activity_point > view {
    width: 12upx;
    height: 12upx;
    background: rgba(0, 0, 0, 0.16);
    border-radius: 100%;
    overflow: hidden;
    margin-right: 8upx;
  }

  .hot_activity_point > view:last-child {
    margin-right: 0;
  }

  .hot_activity_point > .hot_point_active {
    background: #ab7f2e;
  }

  /* 房屋列表title */
  .house_view {
    background-color: #FFFFFF;
    padding-top: 64upx;
    box-sizing: border-box;
    overflow: hidden;
  }

  .house_titl_view {
    background-color: #FFFFFF;
    height: 70upx;
    line-height: 70upx;
    font-size: 24upx;
    letter-spacing: 2upx;
    color: #7a8190;
    box-sizing: border-box;
    margin-bottom: -10upx;
  }

  .house_title_text {
    font-weight: bold;
  }

  .house_title_more {
    font-size: 24upx;
    color: #7a8190;
  }

  .house_title_more_img {
    width: 14upx;
    height: 25upx;
    margin: auto 0 auto 10upx;
  }

  /* #ifdef MP-ALIPAY */
  .house_title_more_img {
    margin: 20upx 0 auto 10upx;
  }

  /* #endif */
  .house_list {
    box-sizing: border-box;
    margin-bottom: -2upx;
    overflow: hidden;
  }

  /* 公寓list */
  .apartment_list {
    width: 100%;
    overflow: hidden;
  }

  .apartment_cont {
    width: 100%;
    display: flex;
    margin-left: -26upx;
    margin-right: -26upx;
  }

  .apartment_list .apartment_item {
    display: inline-block;
  }

  /* 底部提示 */
  .bottom_tips {
    position: relative;
    width: 100%;
    height: 100upx;
    color: #d7d7d7;
    background: #f6f6f6;
  }

  .bottom_tips_line {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 90%;
    height: 2upx;
    background: #eee;
  }

  .bottom_tips_text {
    display: inline-block;
    font-size: 24upx;
    height: 100%;
    line-height: 100upx;
    padding: 0 25upx;
    background: #f6f6f6;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
    position: absolute;
    z-index: 2;
  }

  /* 引导下载 */
  .down-app-box {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99999;
  }

  .down-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    height: 100%;
    z-index: 99999;
  }

  .down-con {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 640upx;
    transform: translate(-50%, -50%);
    z-index: 99999;
    box-sizing: border-box;
    border-radius: 5px;
    background: #fff;
  }

  .down-txt {
    font-size: 30upx;
    text-align: center;
    font-weight: bold;
  }

  .down-txt-top {
    padding-top: 55upx;
    font-weight: normal;
  }

  .down-txt-bottom {
    padding-bottom: 40upx;
  }

  .down-img {
    width: 427upx;
    height: 321upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/mine/down-bg.png) center center no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
  }

  .down-btn-txt {
    background: #17b980;
    color: #fff;
    font-size: 34upx;
    width: 523upx;
    height: 80upx;
    line-height: 80upx;
    text-align: center;
    margin: 40upx auto;
    border-radius: 4upx;
  }


  /* 演唱会弹窗 */
  .vocal-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vocal-box-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
  }

  .v-cont-b {
    position: relative;
    width: 80%;
    height: 760upx;
    background: #fff;
    border-radius: 30upx;
    z-index: 999;
  }

  .v-top {
    overflow: hidden;
    width: 100%;
    height: 320upx;
    border-top-left-radius: 30upx;
    border-top-right-radius: 30upx;
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100%;
  }

  .v-cont-list {
    margin: 30upx auto 30upx auto;
    width: 65%;
    min-height: 200upx;
  }

  .v-cont-list .li {
    width: 100%;
    height: 80upx;
    line-height: 80upx;
    font-family: PingFang-SC-Medium;
    font-size: 28upx;
    color: #353535;
    padding-left: 40upx;
    position: relative;
  }

  .v-cont-list .li .v-li-dot {
    display: block;
    content: '';
    width: 12upx;
    height: 12upx;
    position: absolute;
    left: 0upx;
    top: 32upx;
    border-radius: 100%;
    background: #df0029;
  }

  .v-cont-list .li::before {
    display: none;
    content: '';
    width: 12upx;
    height: 12upx;
    position: absolute;
    left: 0upx;
    top: 32upx;
    border: 1upx solid #df0029;
    border-radius: 100%;
    background: #df0029;
  }

  .v-cont-list .line {
    text-align: center;
    height: 20%;
  }

  .v-cont-b .canyu {
    margin: 0 auto 20upx;
    width: 460upx;
    height: 80upx;
    line-height: 80upx;
    background: #df0029;
    border-radius: 50upx;
    text-align: center;
    font-family: PingFang-SC-Medium;
    font-size: 36upx;
    color: #FFFFFF;
    letter-spacing: 4upx;
  }

  .v-cont-b .canyu::after {
    border: none;
  }

  .vocal-box .close {
    width: 80upx;
    height: 80upx;
    background: url(http://uuweb.haofang.net/Public/wxApp/images/index/close_btn.png) no-repeat center;
    background-size: 60upx;
    margin: 100upx auto;
    z-index: 1000;
  }

  /* 演唱会悬浮窗 */
  .act-btn-box-vocal {
    position: fixed;
    bottom: 50upx;
    right: 0;
    width: 206upx;
    height: 168upx;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 80%;
  }

  /* #ifdef H5 */
  .act-btn-box-vocal {
    bottom: 150upx
  }

  /* #endif */

  /* indexDialog */
  .index-dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
    background: rgba(0, 0, 0, 0.5);
  }

  .index-dialog .content .pic {
    width: 652upx;
    height: auto;
  }

  .index-dialog .content .close {
    width: 80upx;
    height: 80upx;
    background: url(http://uuweb.haofang.net/Public/wxApp/images/index/close_btn.png) no-repeat center;
    background-size: 67upx 67upx;
    margin: 0upx auto 0;
    z-index: 1000;
  }
</style>
