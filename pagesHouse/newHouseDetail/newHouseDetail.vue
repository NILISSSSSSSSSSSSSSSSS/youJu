<template>
	<view>
		<houseDetailLoading v-if="!isInitReady"></houseDetailLoading>

        <view class="er_house_detail">
            <!-- 顶部滑动图片 -->
            <house-swiper :list="swiperList"></house-swiper>
            <!-- 优惠券 -->
            <coupon :couponObj="couponObj" v-if="couponObj.discountMoney"></coupon>

            <!-- 价格+介绍 -->
            <top-name :pageFrom="pageFrom" :item="topNameItem"></top-name>

            <!-- 户型介绍 -->
            <block v-if="huXingList.length > 0 && huXingCount > 0">
                <view class="f_r_b near_house">
                    <title-view :title="'户型介绍' + (huXingCount ? '('+huXingCount+')' : '')"></title-view>

                    <view @click="lookMoreHuXing" class="look_more f_r_e">
                        <view>全部户型</view>
                        <image src="http://cdn.haofang.net/static/uuminiapp/index/l-jtt.png"></image>
                    </view>
                </view>

                <hu-xing-jie-shao :list="huXingList"></hu-xing-jie-shao>
            </block>

            <!-- 楼盘图库 -->
            <block v-if="louPanTuKuList.length > 0">
                <view class="f_r_b near_house">
                    <title-view :title="'楼盘图库'"></title-view>

                    <view @click="lookMoreLouPanTuku" class="look_more f_r_e">
                        <view>查看全部</view>
                        <image src="http://cdn.haofang.net/static/uuminiapp/index/l-jtt.png"></image>
                    </view>
                </view>

                <lou-pan-tu-ku :list="louPanTuKuList"></lou-pan-tu-ku>
            </block>

            <!-- 楼盘信息 -->
            <title-view :title="'楼盘信息'"></title-view>
            <lou-pan-info :item="louPanInfo"></lou-pan-info>

            <!-- 位置及周边 -->
            <view class="position_near" v-if="nearMapItem && nearMapItem.lat && nearMapItem.lng">
                <title-view :title="'位置及周边'"></title-view>
                <view class="near_map_item"></view>
                <near-map-view :item="nearMapItem"></near-map-view>
            </view>

            <!-- 周边新房 -->
            <block v-if="nearNewHouseList.length > 0 && !this.bottomInfo.showBackIndex">
                <view class="f_r_b near_house">
                    <title-view :title="'周边新房'"></title-view>

                    <view @click="lookMoreHouseList('newHouseList')" class="look_more f_r_e">
                        <view>查看全部</view>
                        <image src="http://cdn.haofang.net/static/uuminiapp/index/l-jtt.png"></image>
                    </view>
                </view>

                <view class="house_list_view">
                    <block v-for="(item, index) in nearNewHouseList" :key="index">
                        <new-house-list-item :item="item"></new-house-list-item>
                    </block>
                </view>
            </block>

            <!-- 周边二手房 -->
            <block v-if="nearErHouseList.length > 0 && !this.bottomInfo.showBackIndex">
                <view class="f_r_b near_house">
                    <title-view :title="'周边二手房'"></title-view>

                    <view @click="lookMoreHouseList('erHouseList')" class="look_more f_r_e">
                        <view>查看全部</view>

                        <image src="http://cdn.haofang.net/static/uuminiapp/index/l-jtt.png"></image>
                    </view>
                </view>

                <near-er-house :list="nearErHouseList"></near-er-house>
            </block>

            <view class="cont_empty_view"></view>
        </view>

        <view :class="{ x_bottom_empty : isInponeX }" class="bottom_btn_empty"></view>
        <bottom-btn :item="bottomInfo" :pageFrom="pageFrom"></bottom-btn>

        <get-user-info></get-user-info>

        <!-- 消息体 -->
        <newMsgView></newMsgView>
	</view>
</template>

<script>
    import houseSwiper from "@/pagesHouse/components/houseSwiper.vue";
    import { GetNewHouseDetail } from "../../net/houseApi/GetNewHouseDetail.js";
    import { NewHouseListItem, ErHouseListItem, Const } from "../../utils/Const.js";
    import topName from "@/pagesHouse/components/newHouseDetail/topName.vue";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
	import { hex_md5 } from "../../utils/md5.js";
	import {UserInfoModel} from "../../model/UserInfoModel.js";
	import {HouseDetailModel} from "../../model/HouseDetailModel.js";
	import huXingJieShao from "@/pagesHouse/components/newHouseDetail/huXingJieShao.vue";
	import titleView from "@/pagesHouse/components/erHouseDetail/titleView.vue";
	import louPanTuKu from "@/pagesHouse/components/newHouseDetail/louPanTuKu.vue";
	import louPanInfo from "@/pagesHouse/components/newHouseDetail/louPanInfo.vue";
	import coupon from "@/pagesHouse/components/newHouseDetail/coupon.vue";
	import nearMapView from "@/pagesHouse/components/erHouseDetail/nearMapView.vue";
	import newHouseListItem from "@/components/newHouseListItem.vue";
	import nearErHouse from "@/pagesHouse/components/erHouseDetail/nearErHouse.vue";
	import bottomBtn from "@/pagesHouse/components/newHouseDetail/bottomBtn.vue";
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import { GetSaleUserListUrl } from "../../net/houseApi/GetSaleUserListUrl.js";
	import { GetStarList } from "../../utils/common.js";
    import {
        InitShareMenu,
        ShareWebToQQSession, ShareWebToWeiBoTimeline,
        ShareWxAppToSession,
        ShareWxWebToTimeline
    } from "../../static/app-plus/share";
    import {GetCityMap, ShareVisiting ,SaveCclientUserType} from "../../utils/common";
    import {
        CompStoreAdminCompIdModel, CompStoreAdminDeptIdModel,
        CompStoreArchiveIdModel,
        CompStoreCityIdModel
		} from "../../pagesStore/model/CompStoreModel";
		import { AddWebsiteVisitorRecordsRequest, AddWebsiteVisitorRecords } from '../../net/coupon.js';

	// 页面带过来的参数
	let paramsConfig = {};
	let shareAppMessageMap = {
		title: "",
		des: ""
	};
	let privateData = {
        shareObj: null
    };

	export default {
		data() {
			return {
								sourceTypeId: 2201, // 数据采集 - lh
								shareOption: {},
								swiperList: [],
								isInitReady: false, // 是否初始化完成

								couponObj: {}, // 优惠券
								recordsDate: 0, // 访客记录时长

                cityId: "",
                buildId: "",
                buildName: "",
                archiveId: "",  // 经纪人id
                pageFrom: "",

                topNameItem: {},
				huXingList: [],    // 户型图数组
				huXingCount: 0,   // 户型图数量
				louPanTuKuList: [],  // 楼盘图库
				louPanInfo: {},  // 楼盘信息
				nearMapItem: {}, // 位置及周边
				nearNewHouseList: [],  // 周边新房
				nearErHouseList: [], // 周边二手房
				bottomInfo: {},  // 底部信息

				isInponeX: this.CheckIsIphoneX.init()
			};
		},

		onShareAppMessage() {
            let that = this;
            let path = "/pagesHouse/newHouseDetail/newHouseDetail";
            let index = 0;
            for(let key in paramsConfig) {
                index++;
                if(index == 1) {
                    path += ("?"+key+"="+paramsConfig[key]);
                    continue;
                }

                path += ("&"+key+"="+paramsConfig[key]);
            }
        	return new this.ShareAppMessage(path, that.buildName, shareAppMessageMap["des"]).init(function() {
                that.UserBehavior.newHouseShareAppMessage();
            });
        },

    components: {
        houseSwiper,
        topName,
  huXingJieShao,
  titleView,
  louPanTuKu,
  louPanInfo,
  nearMapView,
  newHouseListItem,
  nearErHouse,
  bottomBtn,
  coupon
},

    onLoad(params = {}) {
      // 记录时长
      this.recordsDate = new Date().getTime();
      console.log(this.recordsDate, 'this.recordsDate')
        //二维码扫码进入的详情页
        if (params.scene) {
          // 采集数据 - lh
          uni.setStorageSync('imSourceTypeId', 3301);
          this.sourceTypeId = 2301;

            let scene = params.scene;
            // #ifdef MP-WEIXIN
            scene = decodeURIComponent(scene);
            // #endif
            scene = scene.split('&');
            if (scene.length > 3) {
                params.cityId = scene[2];
                params.buildId = scene[3];
                params.archiveId = scene[4];
            }
        } else {
          // 采集数据 - lh
          uni.setStorageSync('imSourceTypeId', 3201);
          this.sourceTypeId = 2201;
        }

        // 数据采集
        this.shareOption = {
          archiveId: params.archiveId || '',
          cityId: params.cityId || '',
          caseId: params.caseId || ''
        }
        let me = new UserInfoModel().getModel("me") || {};
        new ShareVisiting().behavior({
            archiveId: params.archiveId || '', // 经济人档案id
            cUserId: me.userId || '', // c端用户id，分享时无
            caseId: params.caseId || '', // 房源id
            caseType: 6, // 房源类型：1.出售，2.出租，6.新盘
            cityId: params.cityId || '',
            sourceType: this.sourceTypeId, // 统计子分类
            statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
            appSource: 'zdzf-newHouseDetail-1'
        }).then(res => {
            console.log(res)
        });

        //平台用户来源采集(标记) 20191112 IM优化需求
        new SaveCclientUserType().behavior({
            archiveId: params.archiveId || '', // 经济人档案id
            sourceType: 2, //sourceType 1 = 平台， 2 = 私有
        }).then(res => {console.log(res)})

        if(params.pageFrom) {
            this.pageFrom = params.pageFrom;
        }

        let that = this;
    new this.InitFormSubmit(this);
        this.upData(params || {});
    paramsConfig = params || {};
        this.initData().then(res => {
            that.isInitReady = true;
            // 初始化用户行为统计参数
    let data = res.detailInfo.DATA || {};
    let guWenInfo = res.guWenInfo.DATA && res.guWenInfo.DATA.userList && res.guWenInfo.DATA.userList.length > 0
      ? res.guWenInfo.DATA.userList[0] : {};
    if(Object.keys(data).length === 0) return;

    if(!this.buildId) return;

    let item = new this.HouseDetailParamsItem();
    item.shareArchiveId = guWenInfo.imId || guWenInfo.userId || "";
    item.caseType = 6;  // 原来代码写的固定的
    item.caseId = this.buildId || "";
    item.intentionalityRegionName = data.regName || "";
    item.cityId = this.cityId || "";
    this.PlatformUserBehavior.enterNewHouse(item,
                {houseName: data.buildName, houseInfo: ""}
            );

            new GetCityMap().getCityKey(paramsConfig.cityId || "").then(cityKey => {
                // 分享小程序配置项
                let imgUrl = that.swiperList.length > 0 && that.swiperList[0].url
                    ? Const.getDealCdnImgUrl(that.swiperList[0].url)
                    : Const.houseDefaultImg;
                let path = "/pagesHouse/newHouseDetail/newHouseDetail";
                for(let key in paramsConfig) {
                    if (path.indexOf("?") >= 0) {
                        path += `&${key}=${paramsConfig[key]}`;
                        continue;
                    }

                    path += `?${key}=${paramsConfig[key]}`;
                }

                // 分享网页到朋友圈配置项
                let webUrl = "https://m.haofang.net/" + cityKey + "/xinfang/"
                    + paramsConfig["buildId"] + ".html";
                // 初始化分享按钮和事件
                let shareTitle = "我在悠居客上看到一套很不错的房源，你也来看看！"
                    + "(" + that.buildName + ")";
                privateData.shareObj = new InitShareMenu([
                    new ShareWxAppToSession(imgUrl, path, that.buildName),
                    new ShareWxWebToTimeline(imgUrl, webUrl, shareTitle),
                    new ShareWebToQQSession(imgUrl, webUrl, shareTitle),
                    new ShareWebToWeiBoTimeline(imgUrl, webUrl, shareTitle)
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
        this.websiteVisitorRecords();
        // 反注册通知
        new Notification().removeObserverAllNotification(this);
    },

		onUnload() {
        if (privateData.shareObj && typeof (privateData.shareObj.hide) !== "undefined") {
            privateData.shareObj.hide();
        }
			  this.websiteVisitorRecords();
			  // 反注册通知
			  new Notification().removeObserverAllNotification(this);
			  this.PlatformUserBehavior.leaveNewHouse();
		},

        // 原生按钮点击事件
        onNavigationBarButtonTap(e) {
            if (!e.id) return;

            if (e.id !== "share") return;

            privateData.shareObj.show();
        },

        methods: {
					websiteVisitorRecords () {
						// 访客记录
						if (+this.recordsDate > 0) {
							if (!this.buildId || !this.cityId) return;
							let date = new Date().getTime();
							let me = new UserInfoModel().getModel("me") || {};
							let addWebsiteVisitorRecordsObj = new AddWebsiteVisitorRecordsRequest();
							addWebsiteVisitorRecordsObj.buildId = this.buildId;
							addWebsiteVisitorRecordsObj.cityId = this.cityId;
							addWebsiteVisitorRecordsObj.wxId = me.userId;
							addWebsiteVisitorRecordsObj.duration = Math.ceil((date - this.recordsDate) / 1000);
							console.log(addWebsiteVisitorRecordsObj);
							new AddWebsiteVisitorRecords(addWebsiteVisitorRecordsObj).send().then(res => {
								console.log(res)
								this.recordsDate = 0;
							})
						}
					},
			lookMoreHouseList(pageName) {
				uni.navigateTo({
					url: "/pagesHouse/"+pageName+"/"+pageName
				});
			},

			// 查看更多户型
			lookMoreHuXing() {
				this.PlatformUserBehavior.newHouseHuXingInfo();
				uni.navigateTo({
					url: "/pagesHouse/newHouseHuXing/newHouseHuXing?buildId=" + this.buildId
				});
			},

			// 查看更多的楼盘图库
			lookMoreLouPanTuku() {
				this.PlatformUserBehavior.newHouseLouPanTuKu();
				uni.navigateTo({
					url: "/pagesHouse/newHouseLouPanTuKu/newHouseLouPanTuKu?buildId=" + this.buildId
				});
			},

			// 用户信息授权通知回调
			UserInfoChanged() {
				let me = new UserInfoModel().getModel("me") || {};
				new ShareVisiting().behavior({
						archiveId: this.shareOption.archiveId || '', // 经济人档案id
						cUserId: me.userId || '', // c端用户id，分享时无
						caseId: this.shareOption.caseId || '', // 房源id
						caseType: 6, // 房源类型：1.出售，2.出租，6.新盘
						cityId: this.shareOption.cityId || '',
						sourceType: this.sourceTypeId, // 统计子分类
						statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
						appSource: 'zdzf-newHouseDetail-2'
				}).then(res => {
						console.log(res)
				});
        //平台用户来源采集(标记) 20191112 IM优化需求
        new SaveCclientUserType().behavior({
            archiveId: this.shareOption.archiveId || '', // 经济人档案id
            sourceType: 2, //sourceType 1 = 平台， 2 = 私有
        }).then(res => {console.log(res)})
				this.initData();
			},

			lookMap() {
				new Notification().postNotification(Notify.NearInfoMapBtnChanged.Name
					, {item: {type: "transit",text: "公交"}, index: 0});
			},

            NearInfoMapBtnChanged(name, info) {
				this.PlatformUserBehavior.newHouseMapGps();
				this.PlatformUserBehavior.newHouseLookNearInfo();
                uni.navigateTo({
                    url: "../nearInfoMap/nearInfoMap?name="+this.buildName + "&type="+info.item.type
                        +"&lat="+this.nearMapItem.lat+"&lng="+this.nearMapItem.lng + "&index="+(info.index || 0)
						+ "&text=" + info.item.text
                });
            },

            // 初始化data传递参数
            upData(item) {
                let dataKeys = ["cityId", "buildId", "buildName", "archiveId"];
                dataKeys.map((val) => {
                    if(item[val]) {
                        this[val] = item[val];
                    }
                });
            },

            // 检查参数朱否满足
        	checkParams() {
        	    let keys = ["buildId"];
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
                    return Promise.reject(checkRes.key+"未配置");
                }

                uni.setNavigationBarTitle({
                    title: this.buildName
                });
				this.initDraw();
				if (!new UserInfoModel().getModel("me")) return Promise.reject();

				if (!new UserInfoModel().getModel("me").userId) return Promise.reject();

                return new Promise((resolve, reject) => {
                    new GetNewHouseDetail({
                        buildId:this.buildId,
                        archiveId: this.archiveId,
                        youyouUserId: new UserInfoModel().getModel("me").userId
                    }).send()
                        .then(res => {
                            if(res.STATUS != 1) {
                                return Promise.reject();
                            }

                            let data = res.DATA || {};
							new HouseDetailModel().setModel(data, hex_md5(this.buildId+this.cityId));
                            this.initDraw();
							if((data.systemFlag && data.systemFlag == 2) || !data.buildPhone400Num) {
								new GetSaleUserListUrl({buildId: this.buildId}).send()
									.then(info => {
										this.dealGuWenList(info);
										resolve({detailInfo: res, guWenInfo: info});
									});
								return;
							}

                            if(getCurrentPages() && getCurrentPages().length == 1){
                                new CompStoreArchiveIdModel().setModel(this.archiveId);
                                new CompStoreAdminCompIdModel().setModel(data.compInfo
                                    ? data.compInfo.adminCompId || "" : "");
                                new CompStoreCityIdModel().setModel(data.cityId);
                                new CompStoreAdminDeptIdModel().setModel(data.compInfo
                                    ? data.compInfo.adminDeptId || "" : "")
                            }
                            if(data.compInfo && data.compInfo.adminCompId == "279104") {
                                this.pageFrom = "jk";
                            }

                            this.upBottomBtnInfo();
							resolve({detailInfo: res, guWenInfo: {}});
                        })
                        .catch(err => {
                           console.error(err);
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
				if(!new HouseDetailModel().getModel(hex_md5(this.buildId+this.cityId))) {
					return;
				}

				let data = new HouseDetailModel().getModel(hex_md5(this.buildId+this.cityId)) || {};
				this.upSwiperList(data);
				this.upTopNameIfno(data);
				this.upHuXingList(data);
				this.upLouPanTuKu(data);
				this.upLouPanInfo(data);
				this.upNearMapInfo(data);
				this.upNewHouseList(data);
				this.upErHouseList(data);
				this.upCoupon(data);
			},
			upCoupon (data) {
				this.couponObj = data.couponInfoVO || {}
			},
            upSwiperList(data) {
                let imgList = data.photoList || [];
                let swiperList = [];
                imgList.map((val) => {
                    if(val.photoAddr && swiperList.length < 50) {
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
				let tags = !data.buildTag
					? [] : data.buildTag.indexOf(",") >= 0
						? data.buildTag.split(",") : [data.buildTag];
				let buildTypeTags = !data.buildType
					? [] : data.buildType.indexOf(",") >= 0
						? data.buildType.split(",") : [data.buildType];
				let buildFitmentTags = !data.buildFitment
					? [] : data.buildFitment.indexOf(",") >= 0
						? data.buildFitment.split(",") : [data.buildFitment];
				tags = tags.concat(buildTypeTags);
				tags = tags.concat(buildFitmentTags);

				shareAppMessageMap["des"] = data.shareDesc || "";
				this.buildName = data.buildName || "";
				uni.setNavigationBarTitle({
					title: this.buildName
				});

                this.topNameItem = {
					buildName: data.buildName || "",
					buildStatus: data.buildStatus || "",
					houseTags: tags,
					unitPrice: data.price ? parseInt(data.price) : "",
					totalPrice: data.totalPriceLow ? parseInt(data.totalPriceLow) : "",
					minArea: data.areaLow || "",
					maxArea: data.areaHigh || "",
					roomText: data.roomText || "",
					chanQuanYear: data.rightYears || "",
					zhaungXiu: data.buildFitment || "",
					kaiPanTime: data.openDate || "",
					address: data.buildAddr || "",
					lat: data.positionX || "",
					lng: data.positionY || ""
                };
                let title = "", keywords = "", description = "";
                title = `【${data.buildName}|新开盘楼盘现房出售价格】- ${cityName}悠居客`;
                keywords = `${data.buildName}新房,${data.buildName}新房买卖信息`;
                description = `悠居客${cityName}房产网提供${data.buildName}售楼电话、开盘时间、地理位置、周边配套、户型图等信息，以及${data.buildName}开发商、售楼处、物业信息等。了解更多${data.buildName}详细信息，请关注悠居客${cityName}新房频道`;
                new this.SetMetaInfo().init(title, keywords, description);
            },
			upHuXingList(data) {
				let huXingList = [];
				let layoutList = data.layoutList || [];
				this.huXingCount = data.layoutCount || 0;
				layoutList.map((item) => {
					huXingList.push({
						huXingUrl: item.layoutPic1,
						shiTingWei: (item.rooms ? (item.rooms+'室'): "") + (item.halls?(item.halls+'厅'): '') + (item.weis?(item.weis+'卫'): ''),
						buildStatus: item.layoutStatus || "",
						totalPrice: item.price ? parseInt(item.price) : "",
						area: item.buildArea || "",
						tags: item.layoutTag ? item.layoutTag.split(' ').splice(0, 3) : [],
						buildId: data.buildId || ""
					});
				});
				this.huXingList = huXingList;
			},
			upLouPanTuKu(data) {
				let louPanTuKuList = [];
				let buildPhotoList = data.buildPhotoList || [];
				buildPhotoList.map((item) => {
					louPanTuKuList.push({
						buildId: data.buildId || "",
						imgUrl: item.photoListSub && item.photoListSub.length >= 1 ? item.photoListSub[0].photoAddr || "" : "",
						type: item.photoType || "详情图"
					});
				});
				this.louPanTuKuList = louPanTuKuList;
			},
			upLouPanInfo(data) {
				this.louPanInfo = {
					kaiPanTime: data.openDate || "",
					fangWuYongTu: data.useageType || "",
					luHuaLv: data.projectGreen || "",
					rongJiLv: data.projectSpace || "",
					zhuangXiuQingKuang: data.buildFitment || "",
					chanQuanYear: data.rightYears || "",
					zhanDiArea: data.constractArea || "",
					tingCheWei: data.carsCase || "",
					jianZhuArea: data.buildArea || "",
					jiaoFangTime: data.submitDate || "",
					wuGuanGongSi: data.propertyComp || "",
					kaiFaShang: data.devloperName || "",
					shouLouAddress: data.sellAddr || "",
					shouLouXuKe: data.saleLicense || ""
				};
			},
			upNearMapInfo(data) {
			    this.nearMapItem = {
			        lng: data.positionY || "",
			        lat: data.positionX || "",
					buildName: data.buildName || ""
			    };
			},
			upErHouseList(data) {
				let nearErHouseList = [];
				let apiList = data.secondHouseList || [];
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
			    let apiList = data.surroundNewHouseList || [];
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
				    item.buildAreaUnit = item.buildArea ? "m²" : "";
				    item.buildAddress = dataItem.buildAddr || "";
				    item.buildTags = tags;
					item.buildPriceOfArea = !dataItem.priceText ? "" : dataItem.priceText.indexOf("价格") >= 0 ? "" : parseInt(dataItem.priceText);
				    item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
				    item.cityId = dataItem.cityId || "";
				    nearNewHouseList.push(item);
				}
				this.nearNewHouseList = nearNewHouseList;
			},
			upBottomBtnInfo(guWenList = []) {
                if(!new HouseDetailModel().getModel(hex_md5(this.buildId+this.cityId))) {
                	return;
                }

                let data = new HouseDetailModel().getModel(hex_md5(this.buildId+this.cityId)) || {};
				let showBackIndex = false;
				if(!getCurrentPages() || getCurrentPages().length == 1) {
					showBackIndex = true;
				}
                let hasGuWen = false;
                do{
                    if(data.systemFlag && data.systemFlag == 2 && data.hasSaleUsers == 1) {
                        hasGuWen = true;
                        break;
                    }

                    if(!data.buildPhone400Num) {
                        hasGuWen = true;
                    }
                }while (false);

                if(guWenList.length === 0) {
                    hasGuWen = false;
                }
				this.bottomInfo = {
					isCollected: !!(data.isCollected == 1),
					showBackIndex: showBackIndex,
					caseId: data.buildId,
					caseType: 6,
					reSource: 6,
					cityId: data.cityId,
					archiveId: this.archiveId || "",
					telphone: data.buildPhone400Num || "",
					hasGuWen: hasGuWen,
                    guWenList: guWenList
				}
			},
			dealGuWenList(data = {}) {
				let guWenList = [];
				let list = data.DATA ? data.DATA.userList || [] : [];
				list.map((item) => {
					guWenList.push({
						headerImg: item.userPhoto || Const.defaultHeadImg,
						name: item.userName || "",
						starList: new GetStarList((item.starLevel || 3)).getList(),
						starNum: item.starLevel && parseInt(item.starLevel) > 3 ? parseInt(item.starLevel) : 3,
						telephone: item.phone400Num || "",
						messageId: item.imId || item.userId || "",
						des: `您好,我是${this.buildName}的置业顾问,欢迎有购房需求的朋友联系我`
					});
				});
                this.upBottomBtnInfo(guWenList);
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
        padding-right: 40upx;
	}
    .look_more>image{
        width: 15upx;
        height: 24upx;
        flex-shrink: 0;
        position: relative;
        top: -2upx;
        margin: auto 0 auto 10upx;
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
	.near_house{
		margin-bottom: 20upx;
	}
	.house_list_view{
		margin-top: -40upx;
		padding: 0 40upx;
		box-sizing: border-box;
	}
</style>
