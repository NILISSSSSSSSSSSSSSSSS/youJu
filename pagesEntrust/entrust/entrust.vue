<template>
  <view class="entrust f_c_s">
    <!-- 顶部banner区 -->
    <image v-if="step == 1" class="top_img" mode="aspectFit"
           src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/registration/banner1.png"></image>
    <image v-if="step == 2" class="top_img" mode="aspectFit"
           src="http://cdn.haofang.net/static/wxPlusApp/yjk/entrust/banner2.png"></image>
    <image v-if="step == 3" class="top_img" mode="aspectFit"
           src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/registration/banner3.png"></image>

    <!-- 内容区 -->
    <view class="box">
      <!-- 步骤一 选择区域 || 小区 -->
      <view v-if="step == 1">
        <entrustTitle :title="isChooseRegOrBuildText"></entrustTitle>

        <!-- 区域显示 -->
        <view v-if="isChooseRegOrBuild == 1">
          <view class="step_1_24_view"></view>
          <chooseRegion :regionList="regionList" :setctionMap="sectionMap"
                        @onRegSectionChanged="onRegSectionChanged"
                        :isEdit="isEdit" :sectionName="sectionName"
                        :regionId="regionId" :sectionId="sectionId"></chooseRegion>
        </view>

        <!-- 展示小区 -->
        <view v-if="isChooseRegOrBuild == 2">
          <chooseBuild :buildName="buildName" :buildId="buildId"
                       :regId="regionId" :caseType="caseType"
                       @onNearBuildChanged="onNearBuildChanged"
                       :nearBuildList="nearBuildList"></chooseBuild>
        </view>

        <view v-if="isEdit == 2" @click="changeRegOrBuild"
              class="filter_buy_one global-font-color">{{ isChooseRegOrBuildText_2 }}
        </view>
        <view class="step_1_230_view"></view>
      </view>

      <!-- 步骤二 房屋信息-->
      <view v-if="step == 2">
        <entrustTitle :title="caseType == 3 ? '你买什么样的房子？' : '你租什么样的房子？'"></entrustTitle>

        <view class="step_36_view"></view>
        <radioView :type="'houseType'" :title="caseType == 3 ? '你想买的房屋类型？' : '你想租的房屋类型？'" :currentId="houseTypeId"
                   @onRadioChanged="onRadioChanged"
                   :list="houseTypeList"></radioView>

        <view class="step_17_view"></view>
        <radioView :type="'zhuangXiuStatus'" :title="'你对装修的要求？'" :currentId="zhuangXiuStatusId"
                   @onRadioChanged="onRadioChanged"
                   :list="houseZhuangXiuList"></radioView>

        <view class="step_17_view"></view>
        <radioView :type="'room'" :title="'你想要几室的房子？'" :currentId="roomId"
                   @onRadioChanged="onRadioChanged"
                   :list="roomList"></radioView>

        <view class="step_17_view"></view>
        <sliderView :type="'area'" :title="'你想要多大的房子？'"
                    :currentVal="currentAreaVal"
                    @onSliderChanged="onSliderChanged"
                    :list="areaList" :unit="'㎡'"></sliderView>

        <view class="step_17_view"></view>
        <priceSliderView :type="'price'" :title="'你的预算是多少？'"
                         :currentVal="currentPriceVal"
                         @onSliderChanged="onSliderChanged" :caseType="caseType"
                         :list="priceList" :unit="(caseType == 3 ? '万' : '元')"></priceSliderView>

        <view class="step_1_230_view"></view>
      </view>

      <!-- 步骤三 选择服务 -->
      <view v-if="step == 3">
        <view v-if="isVip != 1">
          <entrustTitle :title="'选择什么样的服务？'"></entrustTitle>

          <view class="step_31_view"></view>
          <chooseFeiYong @onFeiYongChanged="onFeiYongChanged"
                         :title="'选择你愿意付的中介费'" :currentVal="wfFee" :list="feiYongList"></chooseFeiYong>

          <view class="step_60_view"></view>
          <chooseAgent @onAgentSexChanged="onAgentSexChanged" :title="'挑选你的经纪人'"
                       :currentVal="agentSexVal" :list="agentList"></chooseAgent>

          <view class="step_60_view"></view>
          <otherInfoInput :maxlength="'60'" :placeholder="'请补充你的其他重要需求'"
                          @onOtherInputChanged="onOtherInputChanged"
                          :value="otherInfoVal"></otherInfoInput>
        </view>

        <view v-if="isVip == 1">
          <view class="step_31_view"></view>
          <vipAgent :archiveId="archiveId" :archiveName="archiveName"
                    :archiveHeadImg="archiveHeadImg"></vipAgent>

          <view class="step_55_view"></view>
          <chooseFeiYong @onFeiYongChanged="onFeiYongChanged"
                         :title="'选择你愿意付的中介费'" :currentVal="wfFee" :list="feiYongList"></chooseFeiYong>

          <view class="step_60_view"></view>
          <otherInfoInput :maxlength="'60'" :placeholder="'请补充你的其他重要需求'"
                          @onOtherInputChanged="onOtherInputChanged"
                          :value="otherInfoVal"></otherInfoInput>
        </view>
      </view>

      <!-- 步骤四 找房条件 -->
      <view v-if="step == 4">
        <findHouseCondition :regionName="regionName" :sectionName="sectionName"
                            :houseTypeName="houseTypeName" :zhuangXiuStatusName="zhuangXiuStatusName"
                            :roomName="roomName" :areaText="areaText" :priceText="priceText"
                            :wfFee="wfFee" :agentSexVal="agentSexVal" :caseType="caseType"
                            :buildName="buildName" :compId="compId" :buildId="buildId"
                            :houseId="houseId" :resource="resource" :specialOper="specialOper"
                            :isHelp="isHelp" :archiveId="archiveId" :archiveName="archiveName"
                            :archiveHeadImg="archiveHeadImg" :wantHouseText="wantHouseText"
                            :userMobile="userMobile" :redpackagesNum="redpackagesNum"

                            :isVip="isVip" :regionId="regionId" :sectionId="sectionId"
                            :houseTypeId="houseTypeId" :zhuangXiuStatusId="zhuangXiuStatusId"
                            :roomId="roomId" :areaMin="areaMin" :areaMax="areaMax"
                            :priceMin="priceMin" :priceMax="priceMax" :otherInfoVal="otherInfoVal"
                            @onFindConditionChanged="onFindConditionChanged"></findHouseCondition>
      </view>
    </view>

    <!-- 下一步 -->
    <view class="next" v-if="isEdit == 2 && step <= 3">
      <view @click="netStep" class="next_text global-confirm-btn">下一步</view>
    </view>

    <!-- 编辑 确定 -->
    <view class="next" v-if="isEdit == 1 && step <= 3">
      <view @click="confirmEdit" class="next_text global-confirm-btn">确定</view>
    </view>
  </view>
</template>

<script>
  import {GetScreenList} from "../../net/GetScreenList.js";
  import {GetPushEntrustBaseInfo} from "../../net/entrust/GetPushEntrustBaseInfo.js";
  import {GetRedpackages} from "../../net/entrust/GetRedpackages.js";
  import {Notification} from "../../utils/Notification.js";
  import {Notify} from "../../utils/Notify.js";
  import {GpsInfoModel} from "../../model/GpsInfoModel.js";
  import entrustTitle from "../../components/entrust/edit/entrustTitle.vue";
  import chooseRegion from "../../components/entrust/edit/chooseRegion.vue";
  import chooseBuild from "../../components/entrust/edit/chooseBuild.vue";
  import radioView from "../../components/entrust/edit/radioView.vue";
  import sliderView from "../../components/entrust/edit/sliderView.vue";
  import priceSliderView from "../../components/entrust/edit/priceSliderView.vue";
  import chooseFeiYong from "../../components/entrust/edit/chooseFeiYong.vue";
  import chooseAgent from "../../components/entrust/edit/chooseAgent.vue";
  import otherInfoInput from "../../components/entrust/edit/otherInfoInput.vue";
  import findHouseCondition from "../../components/entrust/edit/findHouseCondition.vue";
  import vipAgent from "../../components/entrust/edit/vipAgent.vue";
  import {Const} from "../../utils/Const.js";
  import {SliderPriceChangeCallback, SliderAreaChangeCallback} from "@/utils/SliderChangeCallback.js";
  import {GetUserTel} from "../../utils/common.js";
  import {UserInfoModel} from "../../model/UserInfoModel";

  let entrustPrivate = {
    currentAreaVal: 140,
    currentPriceVal: 0,
  };

  export default {
    components: {
      entrustTitle,
      chooseRegion,
      chooseBuild,
      radioView,
      sliderView,
      priceSliderView,
      chooseFeiYong,
      chooseAgent,
      otherInfoInput,
      findHouseCondition,
      vipAgent,
    },

    data() {
      return {
        caseType: "",
        cityId: "1",
        step: 1,  // 步骤
        isEdit: 2,  // 是否是编辑状态  1 是   2 否

        // 抢单优化 发布委托送优惠券金额 ，未绑定号码需要绑定号码
        userMobile: '',    //用户的绑定号码
        redpackagesNum: '',   //优惠券金额

        // 区域筛选
        regionList: [],  // [[四项], [四项]]
        sectionMap: {},  //  {id: []}

        // 附近小区
        isChooseRegOrBuild: 1,  // 1 代表区域， 2 代表小区
        nearBuildList: [],  // 附近小区列表

        // 房屋信息
        houseTypeList: Const.entrustHouseTypeList,  // 房屋类型
        houseZhuangXiuList: Const.entrustZhuangXiuList,  // 装修情况
        roomList: Const.entrustRoomList,  // 室
        areaList: [50, 70, 100, 150, 200],  // 面积范围
        currentAreaVal: 140,  // 面积slider当前的滑动位置
        currentPriceVal: 0,  // 价格slider当前的滑动位置
        priceList: [],  // 价格范围
        feiYongList: [],  // 中介费用数组
        agentList: Const.sexMap,  // 经纪人性别数组

        // 特权找房特有id
        tingId: "",  // 厅
        weiId: "",  // 卫
        houseArea: "", // 面积
        housePrice: "",  // 价格
        fromType: "",  // 从那个按钮进入到该页面  teQuanFindHouse : 特权找房
        wantHouseText: "",  // 意向房源文案
        houseId: "",   // 意向房源id
        wfRelateName: "",  // 意向房源名字

        // ---------- 以下参数用于提交请求 -----------
        isVip: 2,  // 是否是专属委托  1 是  2 否
        regionId: "",  // 当前区域id
        sectionId: "",  // 当前商圈id
        regionName: "",  // 当前区域名称
        sectionName: "不限",  // 当前商圈名称
        buildName: "",  // 小区名称
        buildId: "",   // 小区id
        houseTypeId: "1",    // 房屋类型id
        houseTypeName: "住宅",   // 房屋类型name
        zhuangXiuStatusId: "3",  // 装修情况
        zhuangXiuStatusName: "精装",  // 装修情况name
        roomId: "3",  // 几室id
        roomName: "三室",  // 几室name
        areaMin: 110,  // 面积最小值
        areaMax: 130,  // 面积最大值
        areaText: "110-130㎡",  // 面积的text
        priceMin: 0,  // 价格最小值
        priceMax: 0,  // 价格最大值
        priceText: "",  // 价格的text
        wfFee: "",   // 佣金百分比
        agentSexVal: "",  // 经纪人性别
        otherInfoVal: "",  // 其他信息的输入框内容

        archiveId: "", // 经纪人id
        archiveName: "",// 经纪人名称
        archiveHeadImg: "",// 经纪人头像

        compId: "",  // 公司id
        resource: "",   // 房源来源
        specialOper: 0,  // 1:从房源详情点击的委托、0:其他业务、后续可能还会增加
        isHelp: 0,     // 是否需要经纪人帮助填写信息-专属委托时候才需要填写，默认:0,需要:1

        firstEnter: false, // 是否是第一次进入
        haveUrlRegionId: false,
      };
    },

    onShareAppMessage() {
      return new this.ShareAppMessage().init();
    },

    // params 接受 serviceRegionId（区域id） 和 caseType
    onLoad(params = {}) {
      this.initParams(params);

      this.upGpsInfo();
      new this.InitFormSubmit(this);
      this.UserInfoChanged();

      // 监听gps变化
      new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
      // 监听用户信息事件
      new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
      this.upTitle();
    },

    onUnload() {
      // 反注册通知
      new Notification().removeObserverAllNotification(this);
    },

    onReady() {
      this.getPhoneInfo();
    },

    onShow() {
      new this.SetMetaInfo().initDefault();
    },

    computed: {
      // 有疑问？
      isChooseRegOrBuildText() {
        if (this.isChooseRegOrBuild != 1) {
          return "你想住哪个小区";
        }
        if (this.caseType == 4) {
          return "你想租哪里的房子？";
        }

        return "你想买哪里的房子？";
      },

      isChooseRegOrBuildText_2() {
        if (this.isChooseRegOrBuild != 1) {
          if (this.caseType == 3) {
            return "你想购买指定区域的房子";
          }

          return "你想租指定区域的房子";
        }

        if (this.caseType != 3) {
          return "你想租指定小区的房子？";
        }

        return "你想购买指定小区的房子？";
      }
    },

    methods: {
      UserInfoChanged() {
        this.userMobile = new UserInfoModel().getModel("telephone");
      },

      // 更新title
      upTitle() {
        // 最后一步
        if (this.step == 4) {
          uni.setNavigationBarTitle({
            title: "我的找房条件"
          });
          return;
        }

        uni.setNavigationBarTitle({
          title: "发布委托"
        });
      },

      // 初始化传入参数
      initParams(params = {}) {
        if (params.caseType || params.casetype) {
          this.caseType = params.caseType || params.casetype || "";
          this.feiYongList = Const.feeMap[this.caseType];
          this.wfFee = this.caseType == 3 ? '0.015|0.02' : '0.5|1';
        }
        if (params.zhuangXiuStatus != undefined) {
          this.zhuangXiuStatusId = params.zhuangXiuStatus || "";
        }
        this.isHelp = 0;
        this.isVip = params.isVip == 1 ? 1 : 2;
        if (params.isVip == 1) {
          this.isHelp = 1;
        }
        // key 是url参数, value是页面data参数
        let keyMap = new Map()
          .set("buildId", "buildId")
          .set("buildName", "buildName")
          .set("houseTypeId", "houseTypeId")
          .set("regionId", "regionId")
          .set("regionName", "regionName")
          .set("cityId", "cityId")
          .set("archiveId", "archiveId")
          .set("isEdit", "isEdit")
          .set("archiveName", "archiveName")
          .set("houseTypeName", "houseTypeName")
          .set("archiveHeadImg", "archiveHeadImg")
          .set("step", "step")
          .set("zhuangXiuStatusId", "zhuangXiuStatusId")
          .set("zhuangXiuStatusName", "zhuangXiuStatusName")
          .set("roomId", "roomId")
          .set("roomName", "roomName")
          .set("tingId", "tingId")
          .set("weiId", "weiId")
          .set("houseArea", "houseArea")
          .set("housePrice", "housePrice")
          .set("fromType", "fromType")
          .set("wfRelateId", "houseId")
          .set("wfRelateName", "wfRelateName")
          .set("firstEnter", "firstEnter")

        for (let key in params) {
          if (keyMap.has(key) && params[key] != undefined) {
            this[keyMap.get(key)] = params[key];
          }
        }
        if (this.isEdit == 1 && this.fromType != "teQuanFindHouse") {
          this.wfFee = "";
          this.areaText = "";
        }
        if (this.fromType == "teQuanFindHouse") {
          this.wantHouseText = this.wfRelateName + " "
            + (this.roomId ? this.roomId + "室" : "")
            + (this.tingId ? this.tingId + "厅" : "")
            + (this.weiId ? this.weiId + "卫" : "");
          this.currentPriceVal = this.housePrice || 0;
          this.currentAreaVal = this.houseArea || 0;
          entrustPrivate.currentPriceVal = this.housePrice || 0;
          entrustPrivate.currentAreaVal = this.houseArea || 0;
          this.specialOper = 1;
          new SliderAreaChangeCallback(entrustPrivate.currentAreaVal, this.areaList
            , "area", "㎡", this.caseType)
            .init((item) => {
              this.onSliderChanged(item);
            });
        }
        this.haveUrlRegionId = false;
        if (params.regionId) {
          this.haveUrlRegionId = true;
        }

        // 测试经纪人id
        // this.archiveId = "1265761";
      },

      // 获取设备信息
      getPhoneInfo() {
        let res = uni.getSystemInfoSync();
      },

      upGpsInfo() {
        if (!new GpsInfoModel().getModel("cityInfo")) return;

        let item = new GpsInfoModel().getModel("cityInfo");
        this.cityId = item.cityId || "1";
        if (!this.regionId && item.regId) {
          this.regionId = item.regId;
          this.regionName = item.regName;
        }
        this.initData();
      },

      // gps change 回调
      GpsChanged(name, item) {
        this.upGpsInfo();
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

      // 更新 委托优惠券金额信息
      initRedpackages() {
        new GetRedpackages({cityId: this.cityId, caseType: this.caseType}).send()
          .then(res => {
            // console.error(res,"---GetRedpackages----");
            if (!!res.DATA) {
              this.redpackagesNum = res.DATA.redpackages || '';
            }
          });
      },

      initData() {
        let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};

        this.upTel(null);
        this.initRedpackages();
        return new Promise((resolve, reject) => {
          new GetPushEntrustBaseInfo({cityId: this.cityId, dlat: gpsInfo.lat, dlng: gpsInfo.lng}).send()
            .then(res => {
              // console.error(res,"---GetPushEntrustBaseInfo----");
              this.drawNearBuildList(res.DATA || {});
            });
          new GetScreenList({cityId: this.cityId}).send()
            .then(res => {
              // console.error(res,"---GetScreenList---");
              this.drawRegionList(res.DATA || {});
              this.drawSectionMap(res.DATA || {});
              this.drawPriceList(res.DATA || {});
            });
        });
      },
      // 渲染区域数据
      drawRegionList(data = {}) {
        let regionData = data.REG_DATA || [];
        let regionList = [];
        let contList = [];
        for (let i = 0; i < regionData.length; i++) {
          let dataItem = regionData[i] || {};
          if (!dataItem.REG_ID) continue;

          if (this.haveUrlRegionId && this.regionId
            && this.regionId != dataItem.REG_ID) continue;

          contList.push({
            id: dataItem.REG_ID,
            name: dataItem.REG_NAME
          });
          if (this.regionId == dataItem.REG_ID) {
            this.regionName = dataItem.REG_NAME;
          }

          if (contList.length === 4) {
            regionList.push(contList);
            contList = [];
          }

          if (i === (regionData.length - 1) && ((regionData % 4) !== 0) && !this.regionId) {
            regionList.push(contList);
            contList = [];
          }
        }
        if (contList.length < 4) {
          regionList.push(contList);
        }
        this.regionList = regionList;
      },
      // 渲染商圈数据
      drawSectionMap(data = {}) {
        let sectionData = data.SECTION_DATA || {};
        let sectionMap = {};
        for (let key in sectionData) {
          let sectionList = sectionData[key] || [];
          let list = [{
            id: "",
            name: "不限"
          }];
          sectionList.map((info) => {
            list.push({
              id: info[1],
              name: info[0]
            });
          });
          sectionMap[key] = list;
        }
        this.sectionMap = sectionMap;
      },
      // 渲染附近小区
      drawNearBuildList(data = {}) {
        let list = data.buildList || [];
        let nearBuildList = [];
        list.map((item) => {
          nearBuildList.push({
            buildId: item.buildId || "",
            buildName: item.buildName || "",
            regId: item.buildRegion || "",
            regName: item.regName || ""
          });
        });
        this.nearBuildList = nearBuildList;
      },
      // 渲染价格范围
      drawPriceList(data = {}) {
        let priceStr = this.caseType == 3 ? data.BUY_PRICE_DATA : data.RENT_PRICE_DATA;
        let priceUnit = this.caseType == 3 ? '万' : '元';
        let priceArr = priceStr.split(",");
        let newPriceArr = [];
        for (let i = 0; i < priceArr.length; i++) {
          if (newPriceArr.indexOf(Number(priceArr[i])) == -1) {
            newPriceArr.push(Number(priceArr[i]))
          }
        }
        let priceL = this.caseType == 3 ? (newPriceArr[1] - 10) : (newPriceArr[1] - 100);
        let priceH = this.caseType == 3 ? (newPriceArr[1] + 10) : (newPriceArr[1] + 100);

        if (this.fromType == "teQuanFindHouse") {
          this.currentPriceVal = this.housePrice || 0;
        } else {
          this.currentPriceVal = priceL;
          entrustPrivate.currentPriceVal = priceL || 0;
        }
        entrustPrivate.currentPriceVal = this.currentPriceVal || 0;
        this.priceList = newPriceArr;
        let that = this;
        if (!this.firstEnter) {
          this.firstEnter = false;
          this.priceMin = priceL;
          this.priceMax = priceH;
          new SliderPriceChangeCallback(entrustPrivate.currentPriceVal, this.priceList
            , "price", "万", this.caseType)
            .init(function (item) {
              that.onSliderChanged(item);
            });
        }
      },

      // 下一步
      netStep() {
        if (this.step == 4) return;

        this.step++;
        this.upTitle();
      },
      // 确定编辑
      confirmEdit() {
        this.step = 4;
        this.upTitle();
      },

      // 切换小区和区域显示
      changeRegOrBuild() {
        this.isChooseRegOrBuild = this.isChooseRegOrBuild == 1 ? 2 : 1;
      },

      // 区域筛选回调
      onRegSectionChanged(info) {
        // console.error("---onRegSectionChanged-----", info);
        this.regionId = info.regId;
        this.sectionId = info.sectionId;
        this.buildName = "";
        this.buildId = "";
        this.regionName = info.regName;
        this.sectionName = info.sectionName;
      },
      // 附近小区的回调
      onNearBuildChanged(info) {
        // console.error("---onNearBuildChanged-----", info);
        this.regionId = info.regId;
        this.sectionId = "";
        this.buildName = info.buildName;
        this.buildId = info.buildId;
        this.regionName = info.regName;
        this.sectionName = "不限";
      },
      // 单选回调
      onRadioChanged(info) {
        // console.error("---onRadioChanged----", info);
        if (info.type == "room") {
          this.roomId = info.id;
          this.roomName = info.text;
        }
        if (info.type == "houseType") {
          this.houseTypeId = info.id;
          this.houseTypeName = info.text;
        }
        if (info.type == "zhuangXiuStatus") {
          this.zhuangXiuStatusId = info.id;
          this.zhuangXiuStatusName = info.text;
        }
      },
      // slider回调
      onSliderChanged(info) {
        if (this.firstEnter) {
          this.firstEnter = false;
          return;
        }

        if (info.type == "area") {
          this.areaMin = info.areaMin;
          this.areaMax = info.areaMax;
          this.areaText = info.areaText;
          entrustPrivate.currentAreaVal = this.areaMin;
          if (this.areaMin == 0) {
            entrustPrivate.currentAreaVal = this.areaMax;
          }
        }
        if (info.type == "price") {
          this.priceMin = info.priceMin;
          this.priceMax = info.priceMax;
          this.priceText = info.priceText;
          entrustPrivate.currentPriceVal = this.priceMin;
          if (this.priceMin == 0) {
            entrustPrivate.currentPriceVal = this.priceMax;
          }
        }
      },
      // 佣金回调
      onFeiYongChanged(info) {
        // console.error("---onFeiYongChanged----", info);
        this.wfFee = info;
      },
      // 经纪人性别回调
      onAgentSexChanged(info) {
        // console.error("---onAgentSexChanged----", info);
        this.agentSexVal = info;
      },
      // 其他需求input回调
      onOtherInputChanged(info) {
        // console.error("---onOtherInputChanged----", info);
        this.otherInfoVal = info;
      },
      // 找房条件回调
      onFindConditionChanged(info) {
        // console.error("----onFindConditionChanged-----", info);
        this.isEdit = 1;
        this.step = info.step || 1;
        if (info.type == 'region') {
          this.isChooseRegOrBuild = 1;
        }
        if (info.type == 'build') {
          this.isChooseRegOrBuild = 2;
        }
        if (info.step == 2) {
          this.currentAreaVal = entrustPrivate.currentAreaVal;
          this.currentPriceVal = entrustPrivate.currentPriceVal;
        }
      },
    },
  }
</script>

<style>
  /* 顶部 */
  .top_img {
    position: relative;
    width: 100%;
    height: 260upx;
  }

  .box {
    box-sizing: border-box;
    padding: 0 40upx;
  }

  .step_1_24_view {
    margin-top: 24upx;
  }

  .step_1_230_view {
    height: 230upx;
    width: 100%;
  }

  .step_36_view {
    height: 36upx;
    width: 100%;
  }

  .step_17_view {
    height: 17upx;
    width: 100%;
  }

  .step_31_view {
    height: 31upx;
    width: 100%;
  }

  .step_60_view {
    height: 60upx;
    width: 100%;
  }

  .step_55_view {
    height: 55upx;
    width: 100%;
  }

  /* 底部 */
  .filter_buy_one {
    text-align: left;
    position: fixed;
    bottom: 166upx;
    height: 50upx;
    line-height: 99upx;
    z-index: 100;
    background: #FFFFFF;
    left: 0;
    padding-left: 40upx;
    box-sizing: border-box;
    font-size: 28upx;
    color: #fe8615;
    width: 100%;
  }

  .next {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 40upx;
    box-sizing: border-box;
    z-index: 99;
    background-color: #FFFFFF;
  }

  .next_text {
    width: 100%;
    height: 90upx;
    line-height: 90upx;
    text-align: center;
    font-size: 36upx;
    background: #ff6f2e;
    background: -webkit-linear-gradient(left, #fe8e0d, #ff6f2e);
    color: #FFFFFF;
    border-radius: 8upx;
    box-sizing: border-box;
  }
</style>
