<template>
  <!--app端@regionchange需要和@end和@begin同时使用一个时间名才会生效-->
  <view class="f_c_s" style="overflow: hidden;height: 100%;">
    <view class="map_cont_view" style="width: 100%;" :style="{height: mapHeight}">
      <map v-show="!showNewHouseCarTc" show-location
           class="map_view" id="mapFindHouseId" @markertap="markerTap"
           @callouttap="calloutTap" @controltap="controltap"
           @end="regionChange" @begin="regionChange"
           :markers="markers" @regionchange="regionChange" @tap="mapTap"
           :longitude="lng" :latitude="lat"></map>
    </view>

    <view v-if="!showBuildList" class="map_btn_view">
      <view class="map_top_btn f_r_c">
        <block v-for="(item, index) in mapBtnList" :key="index">
          <view form-type="submit" hover-class="none" @click="mapTypeBtn(item)" class="map_btn_item"
                :class="{map_btn_active: mapBtnType === item.type}">{{ item.text }}
          </view>
        </block>
      </view>

      <view @click="lookHouse" class="map_text_btn f_r_c global-confirm-btn">
        <!--v-if="mapBtnType != 'newHouse'"-->
        <!--新房也跳转到委托-->
        <image class="map_vip_icon"
               src="http://cdn.haofang.net/static/uuminiapp/new_images/vipInMap_2x.png"></image>
        <view>{{ mapTextMap[mapBtnType].text }}</view>
      </view>
    </view>

    <!-- 新房专车弹窗 -->
    <view v-if="showNewHouseCarTc" class="new_house_tc">
      <view class="down_load">
        <button form-type="submit" hover-class="none" @click="closeCarTc" class="down_close"></button>
        <view class="down_top">
          <image class="down_top_img" mode="aspectFill"
                 src="http://cdn.haofang.net/static/uuminiapp/loadDownImg/new.jpg"></image>
        </view>
        <view class="down_one_text">专车看房 方便有省心</view>
        <view class="down_two_text">下载 悠居客APP，开启免费专车看房之旅</view>
        <view form-type="submit" hover-class="none" @click="closeCarTc" class="down_btn">
          <view class="down_btn_text global-selecet-box">我知道了</view>
        </view>
      </view>
    </view>

    <!-- 点击后弹窗房源列表 -->
    <view class="house_list" :style="{height: houseListTcHeight}" v-if="showBuildList">
      <view @click="lookList" class="f_r_b house_list_top">
        <view class="house_name">{{clickBuildInfoMap[mapBtnType].name}}</view>
        <view class="house_more_down_bg"
              :class="{house_more_top_bg : allScreenHouseListShow}"></view>
        <view form-type="submit" hover-class="none"
              @click.stop="chooseBtn"
              class="choose_btn">{{ clickBuildInfoMap[mapBtnType].btnText }}
        </view>
      </view>

      <!-- 筛选 -->
      <view @click="hideHouseChoose" v-if="houseChooseShow" class="house_bg">
        <view class="house_choose_list">
          <block v-for="(item, index) in chooseList" :key="index">
            <view form-type="submit" hover-class="none"
                  :class="{house_choose_active : item.id == clickBuildInfoMap[mapBtnType].id}"
                  @click.stop="houseChooseBtn(item)"
                  class="house_choose_item">{{ item.text }}
            </view>
          </block>
        </view>
      </view>

      <!-- 房源列表 -->
      <scroll-view @scrolltolower="scrollBottom" class="house_scroll" scroll-y>
        <!--<view class="expert_view_more"-->
        <!--v-if="villageExpertItem.isExit && villageExpertItem.isExit != 0">-->
        <!--<villageExpert :item="villageExpertItem"></villageExpert>-->
        <!--</view>-->
        <view class="expert_view_more">
          <villageExpert :caseType="mapBtnType == 'erHouse' ? 1: 2"
                         :item="villageExpertItem"></villageExpert>
        </view>

        <view class="hou_list_cont">
          <block v-if="erHouseList && erHouseList.length > 0"
                 :key="index"
                 v-for="(item, index) in erHouseList">
            <er-house-list-item :item="item"></er-house-list-item>
          </block>

          <view style="position: relative;background: #FFFFFF;"
                class="f_c_c" v-if="erHouseList && erHouseList.length == 0">
            <view class="no_list_data"></view>
            <view class="no_data_text">暂无数据</view>
          </view>

          <scroll-loading :isScrollIng="isScrollIng"
                          :haveMoreData="haveMoreData"></scroll-loading>

          <view v-if="!isScrollIng && !haveMoreData && erHouseList && erHouseList.length > 0"
                class="no_more_data">没有更多数据了！
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import {Notification} from "../../utils/Notification.js";
  import {Notify} from "../../utils/Notify.js";
  import {GpsInfoModel} from "../../model/GpsInfoModel.js";
  import {SetMap, SetMapItem, ControlsItem, MapFindeHouseItem} from "../../utils/SetMap.js";
  import {GetMpaFindHouse} from "../../net/GetMpaFindHouse.js";
  import erHouseListItem from "../../components/erHouseListItem.vue";
  import {ErHouseListItem, NewHouseListItem, HouseListAgentItem} from "../../utils/Const";

  import {GetListDataForMap} from "@/net/GetNewHouseList.js";

  import scrollLoading from "../../components/scrollLoading.vue";
  import {Const} from "../../utils/Const.js";
  import villageExpert from "@/components/villageExpert.vue";

  let privateData = {
    timeOutVal: null,
    cityId: "1",
    caseType: "1",
    pageNum: 1,
    pageSize: 30,
    houseListTcDefaultHeight: 0,

    houseListConfig: {
      erHouse: {
        currentPage: 1,
        limit: 10,
        buildId: ""
      },
      zhengZu: {
        currentPage: 1,
        limit: 10,
        buildId: ""
      }
    },
    drawPageIng: false, // 是否在绘制页面中
  };

  export default {
    data() {
      return {
        lat: null,
        lng: null,
        mapVal: null,
        controls: [],
        markers: [],

        // 新房专车弹窗显示隐藏
        showNewHouseCarTc: false,

        // 租房和二手房配置
        houseListTcHeight: 0,
        showBuildList: false,
        allScreenHouseListShow: false,
        clickBuildInfoMap: {
          erHouse: {
            name: "",
            id: "",
            btnText: "户型筛选",
            defaultText: "户型筛选"
          },
          zhengZu: {
            name: "",
            id: "",
            btnText: "户型筛选",
            defaultText: "户型筛选"
          }
        },
        erHouseList: null,
        isScrollIng: false,
        haveMoreData: true,
        houseChooseShow: false,
        chooseList: [],
        biddBuilder: {}, // 经纪人信息


        mapBtnHeight: 0,
        mapHeight: "80%",
        pageHeight: null,
        pageWidth: null,
        mapBtnType: "erHouse",
        mapBtnList: [
          {text: "整租", type: "zhengZu", caseType: "2"},
          {text: "二手房", type: "erHouse", caseType: "1"},
          {text: "新房", type: "newHouse", caseType: "6"}
        ],
        mapTextMap: {
          "zhengZu": {
            text: "特权找好房"
          },
          "erHouse": {
            text: "特权找好房，成交抽佣金全返奖励"
          },
          "newHouse": {
            text: "特权找好房"
            // text: "免费专车看房"
          }
        },
        mapCtx: null,
        villageExpertItem: {},
      }
    },

    onShareAppMessage() {
      return new this.ShareAppMessage().init();
    },

    components: {
      erHouseListItem,
      scrollLoading,
      villageExpert
    },

    onLoad() {
      privateData.drawPageIng = true;
      // 监听gps变化
      new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
      new this.InitFormSubmit(this);
      this.initChooseList();
    },

    onShow() {
      privateData.drawPageIng = true;
      setInterval(() => {
        privateData.drawPageIng = false;
      }, 1500);
      new this.SetMetaInfo().initDefault();
    },

    onHide() {
      privateData.drawPageIng = false;
    },

    onUnload() {
      privateData.drawPageIng = false;
      // 反注册通知
      new Notification().removeObserverAllNotification(this);
    },

    onReady() {
      this.getPhoneInfo();
      this.upGpsInfo();
    },

    methods: {
      // 初始化筛选列表
      initChooseList() {
        if (this.mapBtnType.indexOf("erHouse") >= 0) {
          this.chooseList = Const.roomList;
        }
        if (this.mapBtnType.indexOf("zhengZu") >= 0) {
          this.chooseList = Const.roomList;
        }
      },

      // 获取btn大小
      setMapSize() {
        let view = this.DifferenceApi.createSelectorQuery(this).select(".map_btn_view");
        let that = this;
        view.boundingClientRect(data => {
          that.mapBtnHeight = data.height || 0;
          that.mapHeight = data.height ? that.pageHeight - data.height + "px" : "90%";
          privateData.houseListTcDefaultHeight = (that.pageHeight) / 2;
        }).exec();
      },

      // 获取设备信息
      getPhoneInfo() {
        let res = uni.getSystemInfoSync();
        this.pageHeight = res.windowHeight;
        this.pageWidth = res.windowWidth;
        setTimeout(() => {
          this.setMapSize();
        }, 500);
      },

      // gps变化回调
      GpsChanged() {
        this.upGpsInfo();
      },

      // 更新定位信息
      upGpsInfo() {
        if (!new GpsInfoModel().getModel("gpsInfo")) return;

        let item = new GpsInfoModel().getModel("gpsInfo");
        if (!item.lat || !item.lng) return;

        let cityInfo = new GpsInfoModel().getModel("cityInfo");
        if (cityInfo && cityInfo.cityId) {
          privateData.cityId = cityInfo.cityId || "";
        }

        this.lat = item.lat || null;
        this.lng = item.lng || null;
        this.initMap();
      },

      initMap() {
        let that = this;
        let initMapItem = new SetMapItem();
        initMapItem.id = "mapFindHouseId";
        this.mapVal = new SetMap(initMapItem);

        this.setMapControls(function () {
          that.mapTypeBtn(that.mapBtnList[1]);
          that.setMapSize();
        });
      },
      setMapControls(callback = function () {
      }) {
        callback("");
        // 不渲染控制点了
        return;

        let localTop = this.pageHeight / 2 - 17 - this.mapBtnHeight;
        let backTop = this.pageHeight - 15 - this.mapBtnHeight - 30;
        if (this.showBuildList) {
          localTop = privateData.houseListTcDefaultHeight / 2 - 17;
          backTop = privateData.houseListTcDefaultHeight - 45;
        }

        if (this.controls.length > 0 && this.controls[0].position.top == localTop) {
          return;
        }

        this.controls = [];
        let controlsItem = new ControlsItem();
        controlsItem.id = "currentGpsId";
        controlsItem.iconPath = "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/map/local-icon.png";
        controlsItem.width = 20;
        controlsItem.height = 34;
        controlsItem.left = this.pageWidth / 2 - 10;
        controlsItem.top = localTop;

        let backLocalItem = new ControlsItem();
        backLocalItem.id = "backLocalItemId";
        backLocalItem.iconPath = "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/map/resetloc.png";
        backLocalItem.width = 30;
        backLocalItem.height = 30;
        backLocalItem.left = 10;
        backLocalItem.top = backTop;
        this.mapVal.setControls([controlsItem, backLocalItem])
          .then(controls => {
            this.controls = controls;
            callback("");
          });
      },

      // 类型切换btn
      mapTypeBtn(item) {
        this.mapBtnType = item.type;
        privateData.caseType = item.caseType;
        this.initChooseList();
        this.regionChange();
      },

      // 视野变化事件
      regionChange() {
        let that = this;
        this.mapTap();
        clearTimeout(privateData.timeOutVal);
        privateData.timeOutVal = null;

        privateData.timeOutVal = setTimeout(() => {
          if (!privateData.timeOutVal) return;

          that.initMapHouseList();
        }, 500);
      },
      initMapHouseList() {
        let that = this;
        let markers = [];
        setTimeout(() => {
          this.mapCtx = uni.createMapContext('mapFindHouseId', this);
          this.mapVal.getRegion(this.mapCtx)
            .then(res => {
              return new GetMpaFindHouse({
                cityId: privateData.cityId, beginLatitude: res.minLat,
                beginLongitude: res.minLng, endLatitude: res.maxLat, endLongitude: res.maxLng,
                caseType: privateData.caseType, pageNum: privateData.pageNum, pageSize: privateData.pageSize
              }).send();
            })
            .then(res => {
              that.markers = [];
              let list = res && res.data ? res.data.list || [] : [];
              let itemList = [];
              for (let dataItem of list) {
                if (!dataItem.buildId || !dataItem.positionX || !dataItem.positionY) continue;

                let item = new MapFindeHouseItem();
                // #ifdef MP-ALIPAY
                item.lat = parseFloat(dataItem.positionX);
                item.lng = parseFloat(dataItem.positionY);
                // #endif
                // #ifndef MP-ALIPAY
                item.lat = dataItem.positionX;
                item.lng = dataItem.positionY;
                // #endif
                item.id = dataItem.buildId;
                item.iconPath = "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/map/marker_new.png";
                item.width = 22;
                item.height = 30;

                item.callout_content = dataItem.buildName || "";
                item.callout_color = "#4daaf0";
                item.callout_fontSize = 13;
                item.callout_borderRadius = 5;
                item.callout_bgColor = "#ffffff";
                item.callout_padding = 5;
                item.callout_display = "ALWAYS";
                item.callout_textAlign = "center";
                itemList.push(item);
              }
              return this.mapVal.setMapFindMarkers(itemList);
            })
            .then(res => {
              that.markers = res;
            })
            .catch(err => {
              uni.showModal({
                content: "获取附近房源失败啦！请稍后重试。",
                showCancel: false
              });
            });
        }, 0);
      },

      // 视野变化开始
      regionChangeBegin() {
        let that = this;
        this.mapTap();
        clearTimeout(privateData.timeOutVal);
        privateData.timeOutVal = null;

        privateData.timeOutVal = setTimeout(() => {
          if (!privateData.timeOutVal) return;

          that.initMapHouseList();
        }, 500);
      },
      // 视野变化结束
      regionChangeEnd() {
      },

      // 控件点击事件
      controltap(e) {
        if (e && e.controlId != undefined && e.controlId == 0 && this.mapCtx) {
          this.mapCtx.moveToLocation();
        }
      },

      // marker 点击
      markerTap(e) {
        this.markerPageTo(e.detail.markerId || e.mp.markerId);
      },
      calloutTap(e) {
        this.markerTap(e);
      },
      markerPageTo(markerId) {
        let markers = this.markers;
        let info = {};
        for (let item of markers) {
          if (markerId === item.id) {
            info = item;
            break;
          }
        }
        if (privateData.caseType == 1 || privateData.caseType == 2) {
          let mapTextKey = {
            1: "erHouse",
            2: "zhengZu"
          };
          let clickBuildInfoMapItem = this.clickBuildInfoMap[mapTextKey[privateData.caseType]];
          clickBuildInfoMapItem["name"] = info.callout
            ? info.callout.content || "" : "";
          clickBuildInfoMapItem["id"] = markerId;
          this.clickBuildInfoMap[mapTextKey[privateData.caseType]] = clickBuildInfoMapItem;
          this.upHouseListTc(true, markerId);
          return;
        }

        // 新房
        if (privateData.caseType == 6 && info.id) {
          uni.navigateTo({
            url: "/pagesHouse/newHouseDetail/newHouseDetail?cityId="
              + privateData.cityId
              + "&buildId=" + info.id
              + "&buildName="
              + (info.callout ? info.callout.content || "" : "")
          });
          return;
        }
      },

      // 设置房源弹窗 boolean = true 显示，false：恢复初始情况
      upHouseListTc(boolean = false, markerId = "") {
        if (boolean) {
          this.erHouseList = null;
          this.isScrollIng = true;
          this.haveMoreDat = true;
          privateData.houseListConfig[this.mapBtnType].currentPage = 1;
          privateData.houseListConfig[this.mapBtnType].limit = 10;
          privateData.houseListConfig[this.mapBtnType].buildId = markerId || "";
          privateData.houseListConfig[this.mapBtnType].room = "";
          this.mapHeight = (this.pageHeight) / 2 + "px";
          this.houseListTcHeight = privateData.houseListTcDefaultHeight + "px";
          this.showBuildList = true;
          let clickBuildInfoMapItem = this.clickBuildInfoMap[this.mapBtnType] || {};
          clickBuildInfoMapItem.id = "";
          clickBuildInfoMapItem.btnText = clickBuildInfoMapItem.defaultText;
          this.clickBuildInfoMap[this.mapBtnType] = clickBuildInfoMapItem;
          this.getErHouseList()
            .then(info => {
              this.biddBuilder = info.data.biddBuilder || {};
              this.isScrollIng = false;
              if (info.list.length < privateData.houseListConfig[this.mapBtnType].limit) {
                this.haveMoreData = false;
              }
              this.erHouseList = info.list;
              this.drawAgentInfo(info.data || {});
            });
          return;
        }

        this.showBuildList = false;
        this.mapHeight = this.pageHeight - this.mapBtnHeight + "px";
        this.houseListTcHeight = 0;
        this.setMapControls();
      },

      // 地图点击
      mapTap() {
        if (privateData.drawPageIng) return;

        if (!this.showBuildList) return;

        this.allScreenHouseListShow = false;
        this.upHouseListTc(false);
      },

      // 底部看房
      lookHouse() {
        if (this.mapBtnType == 'newHouse') {
          // this.showNewHouseCarTc = true;
          // TODO: 由于没有专车看房，跳到委托
          uni.navigateTo({
            url: "/pagesEntrust/privilegeFindHouse/privilegeFindHouse"
          });
          return;
        }

        let entrustCaseType = 3;
        if (this.mapBtnType == "zhengZu") {
          entrustCaseType = 4;
        }
        uni.navigateTo({
          url: "/pagesEntrust/entrust/entrust?caseType=" + entrustCaseType
        });
      },
      // 新房专车弹窗关闭事件
      closeCarTc() {
        this.showNewHouseCarTc = false;
      },

      // 房源展开和收起
      lookList() {
        if (this.allScreenHouseListShow) {
          this.allScreenHouseListShow = false;
          this.mapHeight = privateData.houseListTcDefaultHeight + "px";
          this.houseListTcHeight = privateData.houseListTcDefaultHeight + "px";
        } else {
          this.allScreenHouseListShow = true;
          this.mapHeight = 0;
          this.houseListTcHeight = this.pageHeight + "px";
        }
      },

      // 筛选btn
      chooseBtn() {
        this.houseChooseShow = true;
      },
      hideHouseChoose() {
        this.houseChooseShow = false;
      },
      houseChooseBtn(item) {
        let clickBuildInfoMapItem = this.clickBuildInfoMap[this.mapBtnType] || {};
        clickBuildInfoMapItem.id = item.id || "";
        clickBuildInfoMapItem.btnText = item.text;
        if (!item.id) {
          clickBuildInfoMapItem.btnText = clickBuildInfoMapItem.defaultText;
        }
        this.clickBuildInfoMap[this.mapBtnType] = clickBuildInfoMapItem;
        this.isScrollIng = true;
        this.houseChooseShow = false;
        this.getErHouseList()
          .then(info => {
            this.biddBuilder = info.data.biddBuilder || {};
            this.isScrollIng = false;
            if (info.list.length < privateData.houseListConfig[this.mapBtnType].limit) {
              this.haveMoreData = false;
            }

            this.erHouseList = info.list;
          });
      },

      // 滚动条事件
      scrollBottom() {
        if (this.isScrollIng) return;

        if (!this.haveMoreData) return;

        privateData.houseListConfig[this.mapBtnType].currentPage++;
        this.isScrollIng = true;
        let erHouseList = this.erHouseList || [];
        this.getErHouseList()
          .then(info => {
            this.isScrollIng = false;
            if (info.list.length === 0) {
              this.haveMoreData = false;
              return;
            }

            erHouseList = erHouseList.concat(info.list);
            this.erHouseList = erHouseList;
          });
      },

      drawAgentInfo(data = {}) {
        let biddBuilder = data.biddBuilder || {};
        let item = new HouseListAgentItem();
        item.buildName = "";
        item.buildAddress = "";
        // item.buildId = "2042065";
        item.buildId = privateData.houseListConfig[this.mapBtnType].buildId;
        item.agentHeaderImg = biddBuilder.buildOwnerPicUrl || Const.defaultHeadImg;
        item.agentName = biddBuilder.buildOwnerName || "";
        item.agentPhone = biddBuilder.buildOwnerMobile || "";
        item.isExit = biddBuilder.isExist ? biddBuilder.isExist : 0;
        item.archiveId = biddBuilder.buildOwnerArchiveId
          ? biddBuilder.buildOwnerArchiveId + "" : "";
        item.cityId = biddBuilder.cityId || "";
        item.caseType = privateData.caseType;
        this.villageExpertItem = item;
      },
      dealParams(params) {
        let newParams = {};
        for (let key in params) {
          if (params[key]) {
            newParams[key] = params[key];
          }
        }
        return newParams;
      },
      getErHouseList() {
        return new Promise((resolve, reject) => {
          let houseListConfig = privateData.houseListConfig[this.mapBtnType];
          let dataParams = {
            pageNum: houseListConfig.currentPage,
            cityId: privateData.cityId,
            caseType: privateData.caseType,
            pageSize: houseListConfig.limit,
            buildId: houseListConfig.buildId,
            // buildId: "2042065"
          };
          if (this.clickBuildInfoMap[this.mapBtnType].id) {
            dataParams["room"] = this.clickBuildInfoMap[this.mapBtnType].id;
          }

          new GetListDataForMap(this.dealParams(dataParams)).send()
            .then(res => {
              let data = res.DATA || {};
              let list = data.list || [];
              resolve({list: this.drawErHouseList(list), num: (data.trueHouseNum || 0), data: data});
            })
            .catch(err => {
            });
        });
      },
      drawErHouseList(apiList = []) {
        let erHouseList = [];
        for (let i = 0; i < apiList.length; i++) {
          let dataItem = apiList[i] || {};
          if (dataItem.caseType && dataItem.caseType == 9 && this.drawNewHouseItem(dataItem)) {
            continue;
          }

          if (this.drawErHouseItem(dataItem)) {
            erHouseList.push(this.drawErHouseItem(dataItem));
          }
        }
        return erHouseList;
      },
      drawErHouseItem(dataItem) {
        let item = new ErHouseListItem();
        let tags = !dataItem.houseTagDesc ? []
          : dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") === -1
            ? [dataItem.houseTagDesc] : dataItem.houseTagDesc.split("|");
        if (tags.length > 3) {
          tags = tags.slice(0, 3);
        }
        item.buildId = dataItem.buildId || "";
        item.compId = dataItem.compId || "";
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
        return item;
      },
    }
  }
</script>

<style>
  .expert_view_more {
    padding: 40upx;
    box-sizing: border-box;
  }

  .hou_list_cont {
    padding-left: 30upx;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    background: #FFFFFF;
  }

  .map_cont_view {
    width: 100%;
    background: url(https://zdzfapi.haofang.net/Public/wxApp/images/loadDownImg/map.png) no-repeat center;
    background-size: 100% 100%;
  }

  .map_view {
    width: 100%;
    height: 100%;
  }

  .map_btn_view {
    width: 100%;
    background: #fff;
    padding: 25upx 30upx;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .map_top_btn {
  }

  .map_btn_item {
    padding: 3upx 30upx;
    margin: 0 20upx;
    border-radius: 100upx;
    font-size: 30upx;
    border: 1px solid transparent;
    color: #999;
    box-sizing: border-box;
  }

  .map_top_btn .map_btn_active {
    border: 1px solid #ccc !important;
    color: #333 !important;
  }

  .map_text_btn {
    color: #fff;
    box-sizing: border-box;
    background: -webkit-linear-gradient(left, rgb(255, 111, 46), rgb(254, 142, 13));
    text-align: center;
    padding: 15upx 30upx;
    border-radius: 10upx;
    font-size: 34upx;
    margin-top: 20upx;
  }

  .map_vip_icon {
    width: 40upx;
    height: 36upx;
    margin: auto 5upx auto 0;
  }


  /* 专车看房弹窗 */
  .new_house_tc {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99999;
    background: rgba(0, 0, 0, 0.3);
  }

  .down_load {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600upx;
    transform: translate(-50%, -50%);
    z-index: 20;
    box-sizing: border-box;
    border-radius: 5px;
    background: #fff;
  }

  .down_close {
    position: absolute;
    width: 70upx;
    height: 70upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/loadDownImg/close_icon.png) no-repeat center;
    background-size: 27upx 27upx;
    top: 0;
    right: 0;
    z-index: 100;
  }

  .down_top {
    position: relative;
    width: 100%;
    height: 265upx;
    padding-top: 10upx;
    box-sizing: border-box;
  }

  .down_top_img {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    width: 275px;
    height: 119px;
  }

  .down_one_text {
    text-align: center;
    font-weight: bold;
    font-size: 30upx;
    color: #363f61;
    padding-top: 30upx;
    margin-bottom: 10upx;
  }

  .down_two_text {
    font-size: 26upx;
    text-align: center;
    font-weight: normal;
    color: #6b6f84;
  }

  .down_btn {
    padding: 40upx 40upx;
    box-sizing: border-box;
  }

  .down_btn_text {
    color: #ab7f2e;
    font-size: 32upx;
    width: 490upx;
    height: 90upx;
    border: 2upx solid #ab7f2e;
    line-height: 90upx;
    text-align: center;
    border-radius: 60upx;
  }

  /* 经纪人信息 */
  .agent_con {
    background: #fff;
    padding: 20upx 0;
  }

  .agent_left {
    padding-left: 20upx;
  }

  .agent_head {
    width: 100upx;
    height: 100upx;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20upx;
    background-image: url(http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png);
    background-size: cover;
  }

  .agent_head image {
    width: 100%;
    height: 100%;
  }

  .agent_name {
    margin-right: 10upx;
  }

  .agent_note {
    position: relative;
    padding-right: 36upx;
    color: #CDCDCD;
    font-size: 22upx;
    margin: auto 0;
  }

  .agent_note::after {
    content: '';
    display: inline-block;
    width: 32upx;
    height: 32upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/map/icon-medal.png) center center no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    top: 5upx;
  }

  .agent_note_txt {
    padding-top: 10upx;
    font-size: 20upx;
    color: #7E7E7E;
  }

  .trust_btn, .call_btn {
    position: relative;
    text-align: center;
    font-size: 20upx;
    color: #666;
    margin-right: 20upx;
  }

  .trust_btn::before, .call_btn::before {
    content: '';
    display: block;
    width: 73upx;
    height: 72upx;
    background-size: 100% auto;
    background-position: center center;
    background-repeat: no-repeat;
    margin: 0 auto 3upx;
  }

  .trust_btn::before {
    background-image: url('http://cdn.haofang.net/static/uuminiapp/map/icon-discount.png');
  }

  .call_btn::before {
    background-image: url('http://cdn.haofang.net/static/uuminiapp/map/icon-consulting.png')
  }


  /* 租房和二手房列表 */
  .house_list {
    position: relative;
    width: 100%;
    background: #FFFFFF;
    box-sizing: border-box;
  }

  .house_more_down_bg {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 96upx;
    height: 96upx;
    margin-top: -48upx;
    margin-left: -48upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/new_images/icon_chkm_important.png?t=20180427) no-repeat center center;
    background-size: 48upx auto;
  }

  .house_list .house_more_top_bg {
    transform: rotate(180deg);
  }

  .house_list_top {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #eee;
    line-height: 80upx;
    font-size: 28upx;
    z-index: 500;
    height: 80upx;
    padding: 0 16upx 0 30upx;
    box-sizing: border-box;
  }

  .house_name {
    color: #999;
    font-size: 28upx;
  }

  .choose_btn {
    color: #ab7f2e;
    font-size: 28upx;
    position: relative;
    padding-right: 20upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .choose_btn::after {
    content: '';
    width: 14upx;
    height: 8upx;
    right: 0;
    background: url(http://cdn.haofang.net/static/uuminiapp/new_images/down_ac_icon.png?t=20180427) center center no-repeat;
    background-size: 100% auto;
    transform: scaleY(-1);
    position: absolute;
    top: 50%;
    margin-top: -4upx;
  }

  .house_scroll {
    height: 100%;
    padding: 80upx 0 0 0;
    box-sizing: border-box;
  }

  .no_more_data {
    height: 80upx;
    line-height: 80upx;
    text-align: center;
    font-size: 26upx;
    color: #666666;
  }

  .no_list_data {
    width: 198upx;
    height: 202upx;
    background: url(http://cdn.haofang.net/static/uuminiapp/map/no-data.png) center center no-repeat;
    background-size: 100% auto;
    margin: 0 auto;
    margin-top: 60upx;
  }

  .no_data_text {
    text-align: center;
    color: #8C8C8C;
    font-size: 26upx;
  }

  .house_bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9999;
  }

  .house_choose_list {
    position: absolute;
    right: 30upx;
    top: 80upx;
    background: #fff;
    font-size: 24upx;
    width: 120upx;
    text-align: center;
    color: #666;
    border-radius: 6upx;
    box-sizing: border-box;
    overflow: hidden;
  }

  .house_choose_item {
    padding: 6upx;
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
    font-size: 24upx;
    text-align: center;
    color: #666;
  }

  .house_choose_list .house_choose_active {
    color: #ab7f2e;
  }
</style>
