<template>
	<form report-submit @submit="formSubmit">
		<houseDetailLoading v-if="(!topNameItem.buildName)"></houseDetailLoading>

		<view class="er_house_detail">
			<house-swiper :list="swiperList"></house-swiper>

			<top-name :pageFrom="pageFrom" :item="topNameItem"></top-name>

			<!-- 开通花呗和有电话时显示 -->
			<hou-money-pay-every-month v-if="openHuabei == 1 && housePhone && topNameItem.houseUseage == 1" :housePhone="housePhone"></hou-money-pay-every-month>

			<!-- 房源描述 -->
			<block v-if="houseDes != null && houseDes">
				<title-view :title="'房源描述'"></title-view>
				<house-des :houseDes="houseDes"></house-des>
			</block>

			<!-- 配套设施 -->
			<block v-if="peiTaoSheShiList.length > 0">
				<title-view :title="'配套设施'"></title-view>
				<pei-tao-she-shi :list="peiTaoSheShiList"></pei-tao-she-shi>
			</block>

			<!-- 物业类型+建筑类型+产权年限等 -->
			<title-view :title="(topNameItem && topNameItem.buildName) ? topNameItem.buildName : ''"></title-view>
			<build-des :item="buildDesItem"></build-des>

			<!-- 小区房价走势 -->
			<block v-if="priceTrendItem.benYueJunJia && (topNameItem.houseUseageCn=='住宅' || topNameItem.houseUseageCn=='别墅') && caseType == 1">
				<title-view :title="'小区房价'" :fontSize="'32'"></title-view>
				<price-trend :item="priceTrendItem"></price-trend>
			</block>

			<!-- 小区专家 im进入不显示-->
			<block v-if="pageFrom != 'im' && buildExpertItem.archiveId && !buildExpertItem.shareInfoFlag">
				<title-view :title="'小区专家'"></title-view>
				<build-expert :item="buildExpertItem"></build-expert>
			</block>

			<!-- 交通状况 -->
			<block v-if="trafficInfoItem.busLine">
				<title-view :title="'交通状况'"></title-view>
				<!-- <house-des :houseDes="trafficInfoItem.busLine"></house-des> -->
				<traffic-info :item="trafficInfoItem"></traffic-info>
			</block>

			<!-- 周边配套 -->
			<block v-if="nearInfoItem.text">
				<title-view :title="'周边配套'"></title-view>
				<near-info :item="nearInfoItem"></near-info>
			</block>

			<!-- 位置及周边 -->
			<view class="position_near" v-if="nearMapItem && nearMapItem.lat && nearMapItem.lng">
				<title-view :title="'位置及周边'"></title-view>
				<view class="near_map_item"></view>
				<near-map-view :item="nearMapItem"></near-map-view>
			</view>

			<!-- 周边二手房 -->
			<block v-if="nearErHouseList.length > 0">
				<view class="f_r_b near_house">
					<title-view :title="'周边二手房'"></title-view>

					<view @click="lookMoreHouseList('erHouseList')" class="look_more">查看全部</view>
				</view>

				<near-er-house :list="nearErHouseList"></near-er-house>
			</block>

			<!-- 周边新房 -->
			<block v-if="nearNewHouseList.length > 0">
				<view class="f_r_b near_house">
					<title-view :title="'周边新房'"></title-view>

					<view @click="lookMoreHouseList('newHouseList')" class="look_more">查看全部</view>
				</view>

				<near-new-house :list="nearNewHouseList"></near-new-house>
			</block>

			<!-- 挂牌经纪人 im进入不显示 -->
			<block v-if="pageFrom != 'im' && guaPaiAgentList.length > 0">
				<title-view :title="'挂牌经纪人'"></title-view>

				<gua-pai-agent-list :list="guaPaiAgentList"></gua-pai-agent-list>
			</block>
			<view class="cont_empty_view"></view>
		</view>

		<view v-if="pageFrom != 'im' && pageFrom != 'entrust'"
			:class="{ x_bottom_empty : isInponeX }" class="bottom_btn_empty"></view>
		<!-- im进入不显示 -->
		<bottom-btn v-if="pageFrom != 'im' && pageFrom != 'entrust'" :item="bottomAgentInfo"></bottom-btn>

		<get-user-info></get-user-info>

		<!-- 消息体 -->
		<newMsgView v-if="pageFrom != 'entrust'"></newMsgView>
	</form>
</template>

<script>
    import houseSwiper from "@/pagesHouse/components/houseSwiper.vue";
    import { GetEntrustCaseInfo } from "../../net/entrust/PushEntrust.js";
    import { GetBuildPriceTrend } from "../../net/GetBuildPriceTrend.js";
    import { NewHouseListItem,ErHouseListItem,Const } from "../../utils/Const.js";
	import {CheckHousePrice} from "../../utils/CheckHousePrice";
    import topName from "@/pagesHouse/components/erHouseDetail/topName.vue";
	import houseDes from "@/pagesHouse/components/erHouseDetail/houseDes.vue";
	import houMoneyPayEveryMonth from "@/pagesHouse/components/erHouseDetail/houMoneyPayEveryMonth.vue";
    import titleView from "@/pagesHouse/components/erHouseDetail/titleView.vue";
    import buildDes from "@/pagesHouse/components/erHouseDetail/buildDes.vue";
    import priceTrend from "@/pagesHouse/components/erHouseDetail/priceTrend.vue";
    import trafficInfo from "@/pagesHouse/components/erHouseDetail/trafficInfo.vue";
    import nearInfo from "@/pagesHouse/components/erHouseDetail/nearInfo.vue";
    import nearMapView from "@/pagesHouse/components/erHouseDetail/nearMapView.vue";
	import nearErHouse from "@/pagesHouse/components/erHouseDetail/nearErHouse.vue"
    import nearNewHouse from "@/pagesHouse/components/erHouseDetail/nearNewHouse.vue";
	import buildExpert from "@/pagesHouse/components/erHouseDetail/buildExpert.vue";
	import guaPaiAgentList from "@/pagesHouse/components/erHouseDetail/guaPaiAgentList.vue";
	import bottomBtn from "@/pagesHouse/components/erHouseDetail/bottomBtn.vue";
	import peiTaoSheShi from "@/pagesHouse/components/erHouseDetail/peiTaoSheShi.vue";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
	import { hex_md5 } from "../../utils/md5.js";
	import {UserInfoModel} from "../../model/UserInfoModel.js";
	import {HouseDetailModel} from "../../model/HouseDetailModel.js";
    import { GpsInfoModel } from "../../model/GpsInfoModel.js";
    import {Config} from "../../utils/config";

		// 页面带过来的参数
	let paramsConfig = {};
	 let shareAppMessageMap = {
        title: "",
        des: ""
    };

	export default {
		data() {
			return {
                swiperList: [],

                cityId: "",
                caseId: "",
                caseType: "",
                resource: "",
                houseName: "",
				pageFrom: "list",  //  进入的来源 list代表列表和搜索, im代表聊天进入 entrust 代表委托

                topNameItem: {},
				houseDes: null,
                buildDesItem: {},
                priceTrendItem: {},
				buildExpertItem: {},  // 小区专家模块字段
                trafficInfoItem: {},
                nearInfoItem: {},
                nearMapItem: {},
				nearErHouseList: [],
                nearNewHouseList: [],
				guaPaiAgentList: [],
				bottomAgentInfo: {},
				peiTaoSheShiList: [],  // 配套设施列表

				housePhone: "", // 按月付的电话
				openHuabei: "",  // 是否开通花呗 0:未开通，1:已开通

				isInponeX: this.CheckIsIphoneX.init()
			};
		},

        components: {
            houseSwiper,
            topName,
			houseDes,
			houMoneyPayEveryMonth,
            titleView,
            buildDes,
            priceTrend,
            trafficInfo,
            nearInfo,
            nearMapView,
			nearErHouse,
            nearNewHouse,
			buildExpert,
			guaPaiAgentList,
			bottomBtn,
			peiTaoSheShi
        },

		onShareAppMessage() {
            let that = this;
            let path = "/pagesHouse/erHouseDetail/erHouseDetail";
            let index = 0;
            for(let key in paramsConfig) {
                index++;
                if(index == 1) {
                    path += ("?"+key+"="+paramsConfig[key]);
                    continue;
                }

                path += ("&"+key+"="+paramsConfig[key]);
            }
        	return new this.ShareAppMessage(path, that.houseName, shareAppMessageMap["des"]).init(function() {
                that.UserBehavior.shareAppMessage();
            });
        },

        onLoad(params) {
			new this.InitFormSubmit(this);
            this.upData(params || {});
			paramsConfig = params || {};
            this.initData().then(res => {
				let data = res.DATA || {};
				if(Object.keys(data).length === 0) return;

				if(!data.archiveId || !this.caseId || !data.caseType) return;

				let item = new this.HouseDetailParamsItem();
				item.ownerArchiveId = data.archiveId || "";
				item.caseType = data.caseType || "";
				item.caseId = this.caseId || "";
				item.intentionalityRegionName = data.regionName || "";
				item.intentionalityRoom = data.houseRoom || "";
				item.intentionalityHousePrice = data.houseTotalPrice || "";
				item.cityId = data.cityId || "";

				let houseInfo = "";
				if(data.houseRoom) {
					houseInfo += data.houseRoom + "室 ";
				}
				if(data.houseArea) {
					houseInfo += data.houseArea + "㎡ ";
				}
				if(data.houseTotalPrice) {
					houseInfo += data.houseTotalPrice +  (data.caseType == 1 ? "万" : (data.priceUnitCn || ""));
				}
				this.PlatformUserBehavior.enterHouse(item, {houseName: data.buildName, houseInfo: houseInfo});
			});
        },

		onShow() {
            new this.SetMetaInfo().initDefault();
			// 监听地图btn事件
			new Notification().addObserver(this, "NearInfoMapBtnChanged", Notify.NearInfoMapBtnChanged.Name);

			// 监听用户信息授权
			new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
		},

        onHide() {
        	// 反注册通知
        	new Notification().removeObserverAllNotification(this);
        },

		onUnload() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
			this.PlatformUserBehavior.leaveHouse();
		},

		onShareAppMessage() {
			let that = this;
			return {
				title: that.houseName,
				success: function(res) {
					that.UserBehavior.shareAppMessage();
				}
			}
		},

        methods: {
			lookMoreHouseList(pageName) {
				uni.navigateTo({
					url: "/pagesHouse/"+pageName+"/"+pageName
				});
			},

			// 用户信息授权通知回调
			UserInfoChanged() {
				this.initData();
			},

			lookMap() {
				new Notification().postNotification(Notify.NearInfoMapBtnChanged.Name
					, {item: {type: "transit",text: "公交"}, index: 0});
			},

            NearInfoMapBtnChanged(name, info) {
				this.PlatformUserBehavior.lookMapNear();
                uni.navigateTo({
                    url: "/pagesHouse/nearInfoMap/nearInfoMap?name="+this.houseName + "&type="+info.item.type
                        +"&lat="+this.nearMapItem.lat+"&lng="+this.nearMapItem.lng + "&index="+(info.index || 0)
						+ "&text=" + info.item.text
                });
            },

            // 初始化data传递参数
            upData(item) {
                let dataKeys = ["cityId", "caseId", "caseType", "resource", "houseName", "pageFrom"];
                dataKeys.map((val) => {
                    if(item[val]) {
                        this[val] = item[val];
                    }
                });
            },

            // 检查参数朱否满足
        	checkParams() {
        	    let keys = ["cityId", "caseId", "caseType", "resource", "houseName"];
        	    let boolean = true;
        	    let hasKeys = [];
        	    keys.map((val) => {
        	        if(!this[val]) {
        	            hasKeys.push(val);
        	            boolean = false;
        	        }
        	    });

        	    return {
        	        boolean: boolean,
        	        key: hasKeys.join("/")
        	    };
        	},

            initData() {
                let checkRes = this.checkParams();
                if(!checkRes.boolean) {
                    uni.showToast({
                        title: checkRes.key+"未配置",
                        icon: "none",
                    });
                    return;
                }

                uni.setNavigationBarTitle({
                    title: this.houseName
                });

				this.initDraw();

				// if (!new UserInfoModel().getModel("me").userId) return;
				// , youyouUserId: new UserInfoModel().getModel("me").userId
                // 原来要传userId
                return new Promise((resolve, reject) => {
                    new GetEntrustCaseInfo({caseId:this.caseId,
						caseType:this.caseType,
						brokerArchiveId: (paramsConfig.brokerArchiveId || 0),
						queryJgdata: (paramsConfig.toSend == 2 ? 1 : 0),
                        cityId:this.cityId}).send()
                        .then(res => {
                            let data = res.DATA || {};
							new HouseDetailModel().setModel(data, hex_md5(this.caseId+this.caseType+this.cityId+this.resource));
                            this.initDraw();
							resolve(res);
                        })
                        .catch(err => {
                           console.error(err);
                            uni.showModal({
                                title: "请求失败",
                                content: "获取房源详情失败啦！请稍后重试。",
                                showCancel: false
                            });
                        });
                });
            },
			initDraw() {
				if(!new HouseDetailModel().getModel(hex_md5(this.caseId+this.caseType+this.cityId+this.resource))) {
					return;
				}

				let data = new HouseDetailModel().getModel(hex_md5(this.caseId+this.caseType+this.cityId+this.resource)) || {};
				this.upSwiperList(data);
				this.upTopNameIfno(data);
				this.upHouseEveryMonthPay(data);
				this.upHouseDes(data);
				this.upBuildDes(data);
				this.upPriceTrend(data);
				this.upBuildExpert(data);
				this.upTrafficInfo(data);
				this.upNearInfo(data);
				this.upNearMapInfo(data);
				this.upErHouseList(data);
				this.upNewHouseList(data);
				this.upGuaPaiAgentList(data);
				this.upBottomAgentInfo(data);
				this.upPeiTaoSheShiList(data);
			},
            upSwiperList(data) {
                let imgList = data.photoList || [];
                let swiperList = [];
                imgList.map((val) => {
                    if(val.picUrl) {
                        swiperList.push({
                            url: val.picUrl || Const.houseDefaultImg,
                            type: "img",
                            sourceUrl: ""
                        });
                    }
                });
                if(data.videoTopPicUrlPath && data.videoUrlPath) {
                    swiperList.unshift({
                        url: data.videoTopPicUrlPath || Const.houseDefaultImg,
                        type: "video",
                        sourceUrl: data.videoUrlPath,
                    });
                }
                if(data.panoramaMap && data.panoramaMap > 0 && data.panoramaThumbUrl) {
                    let vrUrl = Config.vrWeb + '?CITY_ID=' + this.cityId
                        + '&CASE_TYPE=' + this.caseType + '&CASE_ID='
												+ this.caseId + '&APP_SOURCE='+ Const.APP_SOURCE +'&SOURCE=WEB&SSL=1';
                    if (data.shareArchiveId && data.shareArchiveId > 0) {
                        vrUrl += '&ARCHIVE_ID=' + data.shareArchiveId;
                    }
                    swiperList.unshift({
                        url: data.panoramaThumbUrl || Const.houseDefaultImg,
                        type: "vr",
                        sourceUrl: vrUrl,
                        name: this.houseName
                    });
                }
                this.swiperList = swiperList;
            },
            upTopNameIfno(data) {
                let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
                let cityName = cityInfo.cityName || "";
				let louCeng = data.houseFloor && data.houseFloors
                        ? data.houseFloor + "/" + data.houseFloors + "层" : "";
				if(data.caseType == 3) {
					louCeng = data.houseFloor || "";
				}
				shareAppMessageMap["des"] = data.houseSubject || "";
				this.houseName = data.buildName || "";
				uni.setNavigationBarTitle({
					title: this.houseName
				});
                this.topNameItem = {
                    houseDes: data.houseSubject || "",
                    isCollected: !!(data.isCollected && data.isCollected == 1),
                    totalPrice: data.houseTotalPrice || "",
                    unitPrice: data.houseUnitPrice ? data.houseUnitPrice + "元/㎡" : "",
                    houseInfo: (data.houseRoom && data.houseRoom.indexOf("-") < 0 ? data.houseRoom + "室" : "")
                        + (data.houseHall && data.houseHall.indexOf("-") < 0 ? data.houseHall + "厅" : "")
                        + (data.houseWei && data.houseWei.indexOf("-") < 0 ? data.houseWei + "卫" : ""),
					houseRoom: data.houseRoom && data.houseRoom.indexOf("-") < 0 ? data.houseRoom : "",
                    houseArea: data.houseArea ? data.houseArea + "㎡" : "",
					houseAreaNumber: data.houseArea ? data.houseArea : "",
                    houseChao: data.houseDirectCn && data.houseDirectCn != "--" ? "朝"+data.houseDirectCn : "",
					houseChaoText: data.houseDirectCn && data.houseDirectCn != "--" ? data.houseDirectCn : "",
                    houseTags: data.houseTagDesc ? data.houseTagDesc.split("|") : [],
                    zhaungXiu: data.houseFitmentCn || "",
                    louCeng: louCeng,
					maxFloor: data.houseFloors || 0,
					currentFloor: data.houseFloor || "",
                    nianDai: data.houseYear || "",
                    isTrueHouse: !!(data.trueFlag && data.trueFlag == 1),
					caseId: this.caseId,
					cityId: this.cityId,
					reSource:this.resource,
					buildName: data.buildName || "",
					archiveId: data.archiveId || "",
					checkCodeFun: data.checkCodeFun || "",
					checkCodeFunUrl: data.checkCodeFunUrl || "",
					checkCodeCityName: data.checkCodeCityName || "",
					houseUseageCn: data.houseUseageCn || "",
					caseType: data.caseType || "",
					priceUnitCn: data.priceUnitCn || "",
					houseUseage: data.houseUseage || "",
					fuKuan: data.caseAccountCn || "",
					yaJin: data.leaseDeposit || "",
					sex: data.sexLimit || "0",
					fangJian: data.houseType || "0"
                };
                let title = "", keywords = "", description = "";
                do{
                   if(this.caseType == 1) {
                       title = `【${data.buildName}二手房】${data.houseArea}平米${data.houseTotalPrice}万精致${this.topNameItem.houseInfo} - ${cityName}悠居客`;
                       keywords = `${cityName}二手房,${data.regionName}二手房,${data.buildName}二手房,${this.topNameItem.houseInfo}二手房`;
                       description = `${data.buildName}精致${this.topNameItem.houseInfo}，售价：${data.houseTotalPrice}万（${this.topNameItem.unitPrice}）;${this.topNameItem.nianDai}建；类型：${data.buildUsage} 楼层：${this.topNameItem.louCeng}；装修：${this.topNameItem.zhaungXiu}，买二手房就到${cityName}悠居客。`;
                       break;
                   }

                   title = `【${data.sectionName}租房】${data.houseArea}平米${data.houseTotalPrice}元此房位置可以出行方便公交地铁有钥匙 - ${cityName}悠居客`;
                   keywords = `${cityName}租房,${data.regionName}租房,${data.sectionName}租房,${this.topNameItem.houseInfo}租房`;
                   description = `此房位置出行方便公交地铁有钥匙${data.houseTotalPrice}元/月，是${cityName}${data.regionName}不错的居家选择！，买二手房就到${cityName}悠居客。`;
                }while(false);
                new this.SetMetaInfo().init(title, keywords, description);
            },
			upHouseEveryMonthPay(data) {
				this.housePhone = data.currUserMobile || "";
				this.openHuabei = data.openHuabei || 0;
			},
			upHouseDes(data) {
				this.houseDes = data.houseDesc ? decodeURIComponent(data.houseDesc) : "";
			},
            upBuildDes(data) {
                this.buildDesItem = {
                    wuYeType: data.houseUseageCn || "",
                    jianZhuType: data.buildType || "",
                    chanQuanNianXIan: data.rightYears || "",
                    wuYeFei: data.costStandard || "",
                    luHuaLv: data.projectGreen || "",
                    rongJiLv: data.projectSpace || "",
                    junGongTime: data.submitDate || "",
                    kaiFaShang: data.builder || "",
                    wuYeGongSi: data.propertyComp || "",
                    xiaoQuGaiKuang: data.buildDescript || ""
                    // xiaoQuGaiKuang: data.buildDescript ? decodeURIComponent(data.buildDescript) || data.buildDescript : ""
                };
            },
            upPriceTrend(data) {
                if(!data.buildId) return;

                new GetBuildPriceTrend({cityId: this.cityId, buildId: data.buildId}).send()
                    .then(res => {
                        let newData = res.DATA || {};
						newData.ratioByLastMonthForPrice = newData.ratioByLastMonthForPrice ? Number(newData.ratioByLastMonthForPrice) : 0;
						newData.ratioByLastYearForPrice = newData.ratioByLastYearForPrice ? Number(newData.ratioByLastYearForPrice) : 0;

                        this.priceTrendItem = {
                            benYueJunJia: newData.unitPrice ? parseInt(newData.unitPrice) : "",
							priceUnit: "元/㎡",
							baiFenBiUnit: "%",
                            huanBiShangYue: Math.abs(newData.ratioByLastMonthForPrice),
                            huanBiShangYueAdd: !!(newData.ratioByLastMonthForPrice && newData.ratioByLastMonthForPrice > 0),
                            tongBiQuNian:  Math.abs(newData.ratioByLastYearForPrice),
                            tongBiQuNianAdd: !!(newData.ratioByLastYearForPrice && newData.ratioByLastYearForPrice > 0)
                        };
                    });
            },
			// 根据传过来的参数判断是否显示小区专家的其中一个字段 shareInfoFlag
			upBuildExpertShareInfoFlag() {
				// 从委托带看房源进入房源详情页面的相关判断
				if (paramsConfig.pushLogId || (paramsConfig.source == 'personalStore' || paramsConfig.source == 'zshft')) {
					this.buildExpertItem.shareInfoFlag = true;
				}
			},
			upBuildExpert(data) {
				this.upBuildExpertShareInfoFlag();
				let houseList = [];
				for(let item of (data.buildOwnerHouseList || [])) {
					if(item.caseType == 1) {
						houseList = houseList.concat(this.drawErHouseList([item]));
						continue;
					}

					houseList = houseList.concat(this.drawZuHouseList([item]));
				}
				this.buildExpertItem = {
					buildName: "联系小区专家，掌握更多该小区信息",
					buildAddress: "",
					noBoxShadow: true,
					agentHeaderImg: data.buildOwnerPicUrl || "",
					archiveId: data.buildOwnerArchiveId || "",
					agentName: data.buildOwnerName || "",
					agentPhone: data.buildOwnerMobile || "",
					houseList: houseList,
					caseId: this.caseId,
					caseType: this.caseType,
					cityId: data.cityId || "",
					reSource: data.resource || ""
				};
			},
			drawErHouseList(apiList = []) {
			    let erHouseList = [];
			    for (let i = 0;i<apiList.length;i++) {
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
			        item.houseTing = (dataItem.houseRoom ? dataItem.houseRoom + "室" : "")
			            + (dataItem.houseWei ? dataItem.houseWei + "卫" : "");
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
			    return erHouseList;
			},
			drawZuHouseList(apiList = []) {
			    let zuHouseList = [];
			    for (let i = 0;i<apiList.length;i++) {
			        let dataItem = apiList[i] || {};
			        let item = new ErHouseListItem();
			        if (!dataItem.buildId) continue;

			        let tags = (dataItem.houseTagDesc
			            && dataItem.houseTagDesc.indexOf("|") >= 0)
			            ? dataItem.houseTagDesc.split("|") : [];
			        if (tags.length > 3) {
			            tags = tags.slice(0, 3);
			        }
			        item.cityId = dataItem.cityId || "";
			        item.caseType = dataItem.caseType || "";
			        item.houseId = dataItem.buildId || "";
			        item.reSource = dataItem.reSource || "";
			        item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
			        item.houseTitle = dataItem.houseSubject || "";
			        item.houseTing = (dataItem.houseRoom ? dataItem.houseRoom + "室" : "")
			            + (dataItem.houseWei ? dataItem.houseWei + "卫" : "");
			        item.houseArea = dataItem.houseArea || "";
			        item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
			        item.houseName = dataItem.buildName || "";
			        item.houseTotalPrice = CheckHousePrice.getPrice(dataItem.houseUseage || 1
			            , dataItem.houseArea || "",dataItem.houseTotalPrice || 0, dataItem.priceUnitCn || "");
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
			    return zuHouseList;
			},

			upPeiTaoSheShiList(data) {
				let peiTaoSheShiList = [];
				let setting = data.setting || [];
				setting.map((item) => {
					peiTaoSheShiList.push({
						iconUrl: item.icon || "",
						text: item.name || "",
						id: item.id || ""
					});
				});
				this.peiTaoSheShiList = peiTaoSheShiList;
			},

			upTrafficInfo(data) {
                this.trafficInfoItem = {
                    busLine: data.busLine ? decodeURIComponent(data.busLine) : ""
                };
            },
            upNearInfo(data) {
                this.nearInfoItem = {
                    text: data.addCase ? decodeURIComponent(data.addCase).replace(/\\r\\n/g, '\n') : ""
                };
            },
            upNearMapInfo(data) {
                this.nearMapItem = {
                    lng: data.buildPositiony || "",
                    lat: data.buildPositionx || "",
					buildName: this.topNameItem.buildName || ""
                };
            },

			upErHouseList(data) {
				let nearErHouseList = [];
				let apiList = data.surroundSecondHouseList || [];
				for (let i = 0;i<apiList.length;i++) {
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
				    item.houseTing = (dataItem.houseRoom ? dataItem.houseRoom + "室" : "")
				        + (dataItem.houseWei ? dataItem.houseWei + "卫" : "");
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
				    nearErHouseList.push(item);
				}
				this.nearErHouseList = nearErHouseList;
			},

			upNewHouseList(data) {
                let nearNewHouseList = [];
                let apiList = data.houseList || [];
				for (let i = 0;i<apiList.length;i++) {
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
				    item.buildAreaUnit = item.buildArea ? "㎡" : "";
				    item.buildAddress = dataItem.buildAddr || "";
				    item.buildTags = tags;
					item.buildPriceOfArea = !dataItem.priceText ? "" : dataItem.priceText.indexOf("价格") >= 0 ? "" : parseInt(dataItem.priceText);
					item.buildPriceOfAreaUnit = "元/㎡";
				    item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
				    item.cityId = dataItem.cityId || "";
				    nearNewHouseList.push(item);
				}
				this.nearNewHouseList = nearNewHouseList;
            },

			upGuaPaiAgentList(data) {
				let guaPaiAgentList = [];
				let gpBrokerList = data.gpBrokerList || [];
				for(let i = 0;i<gpBrokerList.length;i++) {
					let item = gpBrokerList[i] || {};
					if(!item.gpBroker400Phone && !item.brokerMobilePhone) {
						continue;
					}

					guaPaiAgentList.push({
						headerImg: item.gpBrokerPhoto || "",
						name: item.gpBrokerName || "",
						service: item.gpBrokerDesc || "",
						telphone: item.brokerMobilePhone || "",
						fourPhone: item.gpBroker400Phone || "",
						archiveId: data.archiveId || "",
						caseId: this.caseId,
						caseType: this.caseType,
						resource: this.resource
					});
				}
				this.guaPaiAgentList = guaPaiAgentList;
			},

			upBottomAgentInfo(data) {
				let showBackIndex = false;
				if(!getCurrentPages() || getCurrentPages().length == 1) {
					showBackIndex = true;
				}
				this.bottomAgentInfo = {
					headerImg: data.currUserPhotoUrlPath || Const.defaultHeadImg,
					name: data.currUserName || "",
					starNum: data.costStandard || 3,
					archiveId: data.archiveId || "",
					caseId: this.caseId,
					caseType: this.caseType,
                    telephone: data.currUserMobile || "",
					cityId: data.cityId || "",
					showBackIndex: showBackIndex,
					reSource: data.resource || ""
				};
			}
		},
	}
</script>

<style>
	page{
		background: #FFFFFF;
	}
    .er_house_detail{
        overflow-x: hidden;
    }
	.near_map_item{
		height: 25upx;
	}
	.position_near{
		box-shadow: 0upx 9upx 32upx -10upx rgba(20, 20, 20, 0.07);
		margin-bottom: 10upx;
	}
	.near_house{
		margin-bottom: 20upx;
	}
	.look_more{
		color: #7A8190;
		font-size: 24upx;
		flex-shrink: 0;
		position: relative;
		line-height: 54upx;
		margin: 57upx 0 6upx;
		margin-right: 40upx;
		padding-right: 30upx;
	}
	.look_more::after{
		position: absolute;
		content: '';
		width: 15upx;
		height: 24upx;
		top: 50%;
		transform: translateY(-50%);
		margin: auto;
		flex-shrink: 0;
		right: 0;
		background: url(http://cdn.haofang.net/static/uuminiapp/index/l-jtt.png) center center no-repeat;
		background-size: 100% 100%;
	}
    /* #ifdef MP-ALIPAY */
    .look_more::after{
        top: 45%
    }
    /* #endif */
	.bottom_btn_empty{
		height: 140upx;
	}
	.x_bottom_empty{
		height: 180upx!important;
	}
	.cont_empty_view{
		height: 40upx;
	}
</style>
