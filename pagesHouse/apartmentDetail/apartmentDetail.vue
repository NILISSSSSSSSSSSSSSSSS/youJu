<template>
	<view>
		<houseDetailLoading v-if="!isInitReady"></houseDetailLoading>

		<view class="er_house_detail">
			<house-swiper :list="swiperList"></house-swiper>

			<top-name :item="topNameItem"></top-name>

			<!-- 房间选择 -->
			<block v-if="fangJianChooseList.length > 0">
				<title-view :title="'房间选择'"></title-view>
				<fang-jian-choose :list="fangJianChooseList"></fang-jian-choose>
			</block>

			<!-- 配套设施 -->
			<block v-if="peiTaoSheShiList.length > 0">
				<title-view :title="'配套设施'"></title-view>
				<pei-tao-she-shi :list="peiTaoSheShiList"></pei-tao-she-shi>
			</block>

			<!-- 房源描述 -->
			<block v-if="houseDes != null && houseDes">
				<title-view :title="'房源描述'"></title-view>
				<house-des :houseDes="houseDes"></house-des>
			</block>

			<!-- 位置及周边 -->
			<view class="position_near" v-if="nearMapItem && nearMapItem.lat && nearMapItem.lng">
				<title-view :title="'位置及周边'"></title-view>
				<view class="near_map_item"></view>
				<near-map-view :item="nearMapItem"></near-map-view>
			</view>

			<view class="cont_empty_view"></view>
		</view>

		<view :class="{ x_bottom_empty : isInponeX }" class="bottom_btn_empty"></view>
		<bottom-btn :item="bottomInfo"></bottom-btn>

		<get-user-info></get-user-info>

		<!-- 消息体 -->
		<newMsgView></newMsgView>
	</view>
</template>

<script>
	import houseSwiper from "../components/houseSwiper.vue";
	import { GetApartmentDetail } from "../../net/houseApi/GetApartmentDetail.js";
	import { Const } from "../../utils/Const.js";
	import topName from "../components/apartmentDetail/topName.vue";
	import houseDes from "../components/erHouseDetail/houseDes.vue";
	import titleView from "../components/erHouseDetail/titleView.vue";
	import nearMapView from "../components/erHouseDetail/nearMapView.vue";
	import peiTaoSheShi from "../components/erHouseDetail/peiTaoSheShi.vue";
	import fangJianChoose from "../components/apartmentDetail/fangJianChoose.vue";
	import bottomBtn from "../components/apartmentDetail/bottomBtn.vue";
	import { Notification } from "../../utils/Notification.js";
	import { Notify } from "../../utils/Notify.js";
	import { hex_md5 } from "../../utils/md5.js";
	import {UserInfoModel} from "../../model/UserInfoModel.js";
	import {HouseDetailModel} from "../../model/HouseDetailModel.js";
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import {
		InitShareMenu,
		ShareWebToQQSession, ShareWebToWeiBoTimeline,
		ShareWxAppToSession,
		ShareWxWebToTimeline
	} from "../../static/app-plus/share";
	import {GetCityMap} from "../../utils/common";

	// 页面带过来的参数
	let paramsConfig = {};
	let shareAppMessageMap = {
		title: "",
		des: ""
	};
	let privateData = {
		shareObj: null,  // 分享初始化后的value
	};

	export default {
		data() {
			return {
				swiperList: [],
				isInitReady: false, // 是否渲染完

				houseName: "",
				apartmentUuid: "",
				roomUuid: "",
				rentType: "",

				topNameItem: {},
				houseDes: null,
				buildDesItem: {},
				nearMapItem: {},
				peiTaoSheShiList: [],  // 配套设施列表
				fangJianChooseList: [],  // 房间选择
				bottomInfo: {},

				isInponeX: this.CheckIsIphoneX.init()
			};
		},

		components: {
			houseSwiper,
			topName,
			houseDes,
			titleView,
			nearMapView,
			peiTaoSheShi,
			fangJianChoose,
			bottomBtn
		},

		onShareAppMessage() {
			let that = this;
			let path = "/pagesHouse/apartmentDetail/apartmentDetail";
			let index = 0;
			for(let key in paramsConfig) {
				index++;
				if(index == 1) {
					path += ("?"+key+"="+paramsConfig[key]);
					continue;
				}

				path += ("&"+key+"="+paramsConfig[key]);
			}
			return new this.ShareAppMessage(path, that.houseName, shareAppMessageMap["des"]).init();
		},

		onLoad(params) {
			let that = this;
			new this.InitFormSubmit(this);
			this.upData(params || {});
			paramsConfig = params || {};
			this.initData().then(res => {
					new GetCityMap().getCityKey(paramsConfig.cityId || "").then(cityKey => {
							// 分享小程序配置项
							let imgUrl = Const.houseDefaultImg;
							let path = "/pagesHouse/apartmentDetail/apartmentDetail";
						for(let key in paramsConfig) {
							if (path.indexOf("?") >= 0) {
								path += `&${key}=${paramsConfig[key]}`;
								continue;
							}

							path += `?${key}=${paramsConfig[key]}`;
						}

							// 分享网页到朋友圈配置项
							let webUrl = "https://zdzfapi.haofang.net/Home/Apartment/detail?apartmentUuid="
									+ paramsConfig["apartmentUuid"] +"&roomUuid="
									+ paramsConfig["roomUuid"] +"&roomHouseNum=&source=uuapp";
							let houseDes = that.topNameItem.sectionName + " "
									+ that.topNameItem.buildName + that.topNameItem.shiTingWei;
							// 初始化分享按钮和事件
							privateData.shareObj = new InitShareMenu([
									new ShareWxAppToSession(imgUrl, path, houseDes),
									new ShareWxWebToTimeline(imgUrl, webUrl, houseDes),
									new ShareWebToQQSession(imgUrl, webUrl, houseDes),
									new ShareWebToWeiBoTimeline(imgUrl, webUrl, houseDes)
							]);
							privateData.shareObj.init();
					});
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
			if (privateData.shareObj && typeof (privateData.shareObj.hide) !== "undefined") {
				privateData.shareObj.hide();
			}
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
		},

		onUnload() {
			if (privateData.shareObj && typeof (privateData.shareObj.hide) !== "undefined") {
				privateData.shareObj.hide();
			}
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
			this.PlatformUserBehavior.leaveHouse();
		},

		// 原生按钮点击事件
		onNavigationBarButtonTap(e) {
				if (!e.id) return;

				if (e.id !== "share") return;

				privateData.shareObj.show();
		},

		methods: {
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
                    url: "../nearInfoMap/nearInfoMap?name="+this.houseName + "&type="+info.item.type
                        +"&lat="+this.nearMapItem.lat+"&lng="+this.nearMapItem.lng + "&index="+(info.index || 0)
						+ "&text=" + info.item.text
                });
            },

            // 初始化data传递参数
            upData(item) {
                let dataKeys = ["houseName", "apartmentUuid", "roomUuid", "rentType"];
                dataKeys.map((val) => {
                    if(item[val]) {
                        this[val] = item[val];
                    }
                });
            },

            // 检查参数朱否满足
        	checkParams() {
        	    let keys = ["apartmentUuid", "roomUuid", "rentType"];
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
				if (!new UserInfoModel().getModel("me")) return;

				if (!new UserInfoModel().getModel("me").userId) return;

                return new Promise((resolve, reject) => {
                    new GetApartmentDetail({apartmentUuid:this.apartmentUuid,roomUuid:this.roomUuid,
                        userId: new UserInfoModel().getModel("me").userId}).send()
                        .then(res => {
                            let data = res.DATA || {};
							new HouseDetailModel().setModel(data, hex_md5(this.apartmentUuid+this.roomUuid));
                            this.initDraw();
                            this.isInitReady = true;
							resolve(res);
                        })
                        .catch(err => {
                            uni.showModal({
                                title: "请求失败",
                                content: "获取房源详情失败啦！请稍后重试。",
                                showCancel: false,
								success() {
                                	uni.navigateBack({
										delta: 1
									});
								}
                            });
                        });
                });
            },
			initDraw() {
				if(!new HouseDetailModel().getModel(hex_md5(this.apartmentUuid+this.roomUuid))) {
					return;
				}

				let data = new HouseDetailModel().getModel(hex_md5(this.apartmentUuid+this.roomUuid)) || {};
				this.upSwiperList(data);
				this.upTopNameIfno(data);
				this.upHouseDes(data);
				this.upNearMapInfo(data);
				this.upPeiTaoSheShiList(data);
				this.upFangJianChooseList(data);
				this.upBottomInfo(data);
			},
            upSwiperList(data) {
                let imgList = data.apartmentPhotoList || [];
                let swiperList = [];
                imgList.map((val) => {
                    if(val.photoAddr) {
                        swiperList.push({
                            url: val.photoAddr || Const.houseDefaultImg,
                            type: "img",
                            sourceUrl: ""
                        });
                    }
                });
                this.swiperList = swiperList;
            },
            upTopNameIfno(data) {
                let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
                let cityName = cityInfo.cityName || "";
                this.topNameItem = {
					buildName: data.hftBuildName || "",
					sectionName: data.hftSectionName || "",
					shiTingWei: (data.bedRoomNum && data.livingRoomNum && data.toiletNum
						? (data.bedRoomNum + "室" + data.livingRoomNum + "厅" + data.toiletNum + "卫" )
						: (!data.bedRoomNum && !data.livingRoomNum && !data.toiletNum)
							? ""
							: ((data.bedRoomNum ? data.bedRoomNum + "室" : "")
								+ (data.livingRoomNum ? data.livingRoomNum + "厅" : "")
								+ (data.toiletNum ? data.toiletNum + "卫" : ""))),
                    area: data.rentRoomArea || "",
					floor: data.houseFloor || "",
					totalFloor: data.totalFloor || "",
					showFloor: (data.houseFloor && data.totalFloor
						? (data.houseFloor + "/" + data.totalFloor)
						: (!data.houseFloor && !data.totalFloor)
							? ""
							: (data.houseFloor || "") + (data.totalFloor || "")),
					houseTags: data.tags ? data.tags.split(",") : "",
					rentType: data.rentType || "",
					street: data.street || "",
					canRentTime: data.rentStartDate || ""
                };

				this.houseName = this.topNameItem.buildName;
				uni.setNavigationBarTitle({
					title: this.houseName
				});
				shareAppMessageMap["des"] = this.topNameItem.sectionName + "  " + this.topNameItem.buildName + "  " + this.topNameItem.shiTingWei;

                let title = "", keywords = "", description = "";
                title = `${data.houseTitle}- ${cityName}悠居客`;
                keywords = `${this.topNameItem.buildName}租房信息`;
                description = `${data.houseDesc},${cityName}悠居客单身公寓出租网${this.topNameItem.buildName}品牌公寓、${this.topNameItem.buildName}优质公寓推荐,找公寓就上${cityName}悠居客`;
                new this.SetMetaInfo().init(title, keywords, description);
            },
			upHouseDes(data) {
				this.houseDes = data.houseDesc ? decodeURIComponent(data.houseDesc) : "";
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

            upNearMapInfo(data) {
                this.nearMapItem = {
                    lng: data.xCoord || "",
                    lat: data.yCoord || "",
					buildName: data.aptBuildName || ""
                };
            },

			upFangJianChooseList(data) {
				let fangJianChooseList = [];
				let list = data.apartmentRoomList || [];
				list.map((item,index) => {
					let imgList = [];
					(item.roomPhotoList || []).map(info => {
						if(info.photoAddr) {
							imgList.push(info.photoAddr);
						}
					});
					fangJianChooseList.push({
						sex: item.rentCustSex == 0 ? 1 : 2,
						fangJianName: item.houseNum,
						isCurrentFangJian: (index == 0 && data.rentType == 1) || (item.uuid == this.roomUuid && data.rentType == 2),
						isAlreadyRent: (item.isRent == 1),
						rentMoney: item.monthRent || "",
						ruZhuTime: item.checkInTime || "",
						woShiType: item.bedRoomType || "",
						tags: item.tags ? item.tags.split(",") : [],
						imgList: imgList,
						isLookMore: !!(index == 0)
					});
				});
				this.fangJianChooseList = fangJianChooseList;
			},

			upBottomInfo(data) {
				let showBackIndex = false;
				if(!getCurrentPages() || getCurrentPages().length == 1) {
					showBackIndex = true;
				}
				this.bottomInfo = {
					isCollected: !!(data.isCollected == 1),
					showBackIndex: showBackIndex,
					telphone: data.agentPhone || "",
					rentType: data.rentType,
					roomUuid: this.roomUuid
				};
			}
		},
	}
</script>

<style>
    .er_house_detail{
        overflow-x: hidden;
    }
	.near_map_item{
		height: 25upx;
	}
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
