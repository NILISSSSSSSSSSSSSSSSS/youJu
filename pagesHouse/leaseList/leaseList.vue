<template>
    <view :class="{ active: isActive }" class="er_house_list_cont"
          :style="{height: isActive ? windowHeight : pageHeight}">

        <view class="top_view" @click="searchAnimationClick" :animation="searchAnimation">
            <search-btn-view :caseType="'2'" :name="searchBuildName"></search-btn-view>
            <screen-house :city="siteMapParams.cityId" :regId="siteMapParams.regId"
                :enterType="'erHouse'" :from="'lease'"></screen-house>
        </view>

        <view style="height: 190upx;"></view>

        <view class="loading_view f_r_c" v-if="!erHouseList">
            <view class="pullUpIcon"></view>
            <view class="pullUpLabel">努力加载中...</view>
        </view>

		<no-data-trust :type="'lease'" v-if="erHouseList && erHouseList.length === 0"></no-data-trust>
        <!-- <view v-if="erHouseList && erHouseList.length === 0" class="no_house_list">抱歉没有找到合适房源</view> -->

        <view class="er_house_list_view" v-else>
			<!-- 小区专家 -->
			<view  style="box-sizing: border-box;">
				<view style="height: 50upx;" v-if="buildId && haveVillageExpert"></view>
				<village-expert-view @villageExpertListChange="villageExpertListChange"
                                     :item="villageExpertItem"></village-expert-view>
				<view style="height: 20upx;"></view>
			</view>

			<!-- 房源列表 -->
            <block v-for="(item, index) in erHouseList" :key="index">
				<new-house-list-item v-if="item.caseType == 9" :item="item"></new-house-list-item>
                <er-house-list-item v-else :item="item"></er-house-list-item>
            </block>

            <!--  loading  -->
            <view class="loading_view f_r_c" v-if="isScrollIng && haveMoreData">
                <view class="pullUpIcon"></view>
                <view class="pullUpLabel">努力加载中...</view>
            </view>
            <view v-if="!isScrollIng && !haveMoreData" class="no_more_data">没有更多数据了！</view>
        </view>

        <view class="bottom_empty_view"></view>

		<!-- 地图找房btn -->
		<map-find-house-btn :type="mapFindHouseType"></map-find-house-btn>

		<!-- 消息体 -->
		<newMsgView></newMsgView>
    </view>
</template>

<script>
    import erHouseListItem from "../../components/erHouseListItem.vue";
    import screenHouse from "@/pagesHouse/components/screenHouse.vue";
    import searchBtnView from "../../components/searchBtnView.vue";
    import {ErHouseListItem, NewHouseListItem, HouseListAgentItem} from "../../utils/Const";
    import { Config } from "../../utils/config.js";
    import { GetNewHouseList } from "@/net/GetNewHouseList.js";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import mapFindHouseBtn from "@/pagesHouse/components/mapFindHouseBtn.vue";
	import { Const } from "../../utils/Const.js";
	import newHouseListItem from "../../components/newHouseListItem.vue";
	import villageExpertView from "../../components/villageExpert.vue";
	import {CheckHousePrice} from "../../utils/CheckHousePrice";
    import { SearchHouseModel } from "../../model/SearchHouseModel.js";
	let privateData = {
		pageFrom: "",  // 首页是index
        scrollTop: 0,
        animation: null,
        isDrawTopAnimation: false,
        isDrawBottomAnimation: false
	};

	export default {
		data() {
			return {
                haveVillageExpert: false, // 是否有小区专家
                searchAnimation: null,
				caseType: "2",
				title: "整租",

				erHouseList: null,
                currentPage: 1,
                limit: 12,
                cityId: 1,
                isScrollIng: false,
                haveMoreData: true,
                searchBuildName: "",
                buildId: "",

				// 列表经纪人字段
				villageExpertItem: {},

                pageHeight: "100%",
                windowHeight: "100%",
                isActive: false,

				// 地图找房type
				mapFindHouseType: Const.erHouse,

                paramsScreen: {}, // 筛选结果
                // wrap站配置的参数
                siteMapParams: {
                    cityId: "",
                    regId: ""
                }
			};
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

        components: {
            erHouseListItem,
            screenHouse,
            searchBtnView,
			mapFindHouseBtn,
			newHouseListItem,
			villageExpertView
        },

		onShow(params) {
            new this.SetMetaInfo().initDefault();
			// 先执行一次搜索条件（如果有）
			if(privateData.pageFrom == "index") {
				this.SearchResChanged(Notify.SearchResChanged.Name, (new SearchHouseModel().getModel() || {}));
			}
		},

		onLoad(params) {
			if(params.pageFrom) {
				privateData.pageFrom = params.pageFrom;
			}
            this.siteMapParams = {
                cityId: params.cityId || "",
                regId: params.regId || ""
            };
			this.initParams(params);
            let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
            if(!new SearchHouseModel().getModel() && cityInfo.regId) {
            	this.paramsScreen["regionId"] = cityInfo.regId;
            }
            this.upGpsInfo();

            // 监听筛选弹窗显示隐藏
            new Notification().addObserver(this, "ScreenShowChanged", Notify.ScreenShowChanged.Name);
            // 监听筛选结果
            new Notification().addObserver(this, "ScreenResultChanged", Notify.ScreenResultChanged.Name);
            // 监听gps变化
            new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
            // 监听搜索结果
            new Notification().addObserver(this, "SearchResChanged", Notify.SearchResChanged.Name);
            uni.setNavigationBarTitle({
            	title: this.title
            });
		},

        onUnload() {
            // 反注册所有通知
        	new Notification().removeObserverAllNotification(this);
        },

        onReachBottom() {
            this.scrollBottom();
        },

        onPageScroll(e) {
            // #ifndef H5
            // ios上取消该动画
            if(uni.getSystemInfoSync().platform == "ios") return;

            if (!privateData.animation) return;

            let scrollTop = e.scrollTop;
            do {
                if (scrollTop > privateData.scrollTop && !privateData.isDrawTopAnimation) {
                    privateData.animation.top(-(uni.upx2px(124))).step();
                    this.searchAnimation = privateData.animation.export();
                    privateData.isDrawTopAnimation = true;
                    privateData.isDrawBottomAnimation = false;
                    break;
                }

                if (scrollTop < privateData.scrollTop && !privateData.isDrawBottomAnimation) {
                    privateData.animation.top(0).step();
                    this.searchAnimation = privateData.animation.export();
                    privateData.isDrawBottomAnimation = true;
                    privateData.isDrawTopAnimation = false;
                    break;
                }
            }while(false);
            privateData.scrollTop = scrollTop;
            // #endif
        },

        onReady() {
        	this.getPhoneInfo();
            // #ifndef H5
            privateData.animation = uni.createAnimation({
                transformOrigin: "50% 50%",
                duration: 400,
                timingFunction: "ease",
                delay: 0
            });
            // #endif
        },

        methods: {
            // 小区专家数量change
            villageExpertListChange(list) {
                if(!list || list.length === 0) {
                    this.haveVillageExpert = false;
                }else {
                    this.haveVillageExpert = true;
                }
            },

            // 点击搜索和筛选的view
            searchAnimationClick() {
                // #ifndef H5
                if (!privateData.animation) return;

                privateData.isDrawBottomAnimation = false;
                privateData.isDrawTopAnimation = false;
                privateData.animation.top(0).step();
                this.searchAnimation = privateData.animation.export();
                // #endif
            },

			initParams(params) {
				let dataMap = ["caseType"];
				let title = "整租";
				dataMap.map((val) => {
					if(params[val]) {
						this[val] = params[val];
					}
					if(val = "caseType" && (params[val] == 3 || params[val] == 'Q1')) {
						title = "合租";
                        this.caseType = 3;
					}
				});
				this.title = title;
			},

            // 更新定位信息
            upGpsInfo() {
                if(!new GpsInfoModel().getModel("cityInfo")) return;

                if(new SearchHouseModel().getModel()) {
                    let item = new SearchHouseModel().getModel() || {};
                    this.buildId = item.houseId || null;
                    this.searchBuildName = item.houseName;
                    this.paramsScreen["regionId"] = "";
                    this.paramsScreen["sectionId"] = "";
                }
                let item = new GpsInfoModel().getModel("cityInfo");
                this.cityId = item.cityId || "1";
                if (item.regId === this.siteMapParams.regId || !this.siteMapParams.regId) {
                    this.initData();
                }
                new this.SetMetaInfo().initLeaseHouseList();
            },

            // gps change 回调
            GpsChanged(name, item) {
                this.upGpsInfo();
            },

            initData() {
                this.currentPage = 1;
                this.getErHouseList()
                    .then((res) => {
                        this.erHouseList = res.list || [];
						setTimeout(() => {
							new SearchHouseModel().setModel(null);
						}, 1000);
                        if(res.num && res.num > 0) {
                            uni.showToast({
                                title: "共" + res.num + "套房源",
                                icon: "none"
                            });
                        }
                    });
            },

             // 获取设备信息
            getPhoneInfo() {
                let res = uni.getSystemInfoSync();
                this.windowHeight = res.windowHeight + "px";
                this.pageHeight = res.windowHeight + "px";
            },

            dealParams(params) {
                let newParams = {};
                for(let key in params) {
                    if(params[key]) {
                        newParams[key] = params[key];
                    }
                }
                return newParams;
            },
        	getErHouseList() {
                return new Promise((resolve, reject) => {
                    let dataParams = {
                        pageNum: this.currentPage,
                        cityId: this.cityId,
                        caseType: this.caseType,
                        pageSize:this.limit
                    };
					if(this.buildId) {
						dataParams["buildId"] = this.buildId;
					}
					if(!this.buildId && this.searchBuildName) {
						dataParams["buildName"] = this.searchBuildName;
					}
                    let params = Object.assign(dataParams, this.paramsScreen);
					if (dataParams.caseType == 2) {
					    // 0 整租 1 合租 2 混合
                        params["queryHezuFlag"] = 2;
                    }
                    new GetNewHouseList(this.dealParams(params)).send()
                       .then(res => {
                           let data = res.DATA || {};
                           let list = data.list || [];
                           if(params.pageNum === 1) {
                               this.drawAgentInfo(data);
                           }
                           if(list.length < params.pageSize) {
                               this.haveMoreData = false;
                           }
                           resolve({list: this.drawErHouseList(data), num: (data.trueHouseNum || 0)});
                       })
                       .catch(err => {
                       });
                });
            },
            drawErHouseList(requestData = {}) {
                // topHouseList
                let apiList = requestData.list || [];
                let newHouseList = requestData.newHouseList || [];
                let topHouseList = requestData.topHouseList || [];
                let erHouseList = [];
                if(this.currentPage == 1 && topHouseList.length > 0) {
                    for (let info of topHouseList) {
                        let topHouseListItem = this.drawErHouseItem(info);
                        topHouseListItem.isTopHouse = true;
                        erHouseList.push(topHouseListItem);
                    }
                }
                for (let i = 0;i<apiList.length;i++) {
                    let dataItem = apiList[i] || {};
                    if(dataItem.caseType && dataItem.caseType == 9 && this.drawNewHouseItem(dataItem)) {
						erHouseList.push(this.drawNewHouseItem(dataItem));
						continue;
					}

					if(this.drawErHouseItem(dataItem)) {
						erHouseList.push(this.drawErHouseItem(dataItem));
					}
                }
                return erHouseList;
            },
			drawErHouseItem(dataItem) {
				let item = new ErHouseListItem();
				if (!dataItem.buildId) return null;

                let tags = !dataItem.houseTagDesc ? []
                    : dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") === -1
                        ? [dataItem.houseTagDesc] : dataItem.houseTagDesc.split("|");
                if(this.caseType == 2 && ((dataItem.reSource && dataItem.reSource == 5)
                    || (dataItem.leaseRoomType && dataItem.leaseRoomType == 1))) {
                    tags.unshift("合租");
                }
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
				return item;
			},
			drawNewHouseItem(dataItem) {
				let item = new NewHouseListItem();
				if (!dataItem.buildId) return null;

				let tags = (dataItem.houseTagDesc
				    && dataItem.houseTagDesc.indexOf(",") >= 0)
				    ? dataItem.houseTagDesc.split(",") : [];
				if (tags.length > 3) {
				    tags = tags.slice(0, 3);
				}
				item.caseType = dataItem.caseType || "";
				item.cityId = dataItem.cityId || "";
				item.buildId = dataItem.buildId || "";
				item.buildStatus = dataItem.buildStatus || "";
				item.buildImg = dataItem.thumbUrl || Const.houseDefaultImg;
				item.buildTing = dataItem.roomText ? dataItem.roomText + " | " : "";
				item.buildArea = (dataItem.areaLow && dataItem.areaHig)
				    ? dataItem.areaLow + "-" + dataItem.areaHig
				    : (dataItem.areaLow || dataItem.areaHig || "");
				item.buildAreaUnit = (dataItem.areaLow || dataItem.areaHig) ? "m²" : "";
				item.buildAddress = dataItem.buildAddr || "";
				item.buildName = dataItem.buildName || "";
				item.buildTags = tags;
				item.buildPriceOfArea = dataItem.priceText || "";
				item.buildPriceOfAreaUnit = "";
				item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
				return item;
			},
            drawAgentInfo(data = {}) {
				let biddBuilder = data.biddBuilder || {};
				let item = new HouseListAgentItem();
				item.buildName = this.searchBuildName || "暂无小区名称";
				item.buildAddress = biddBuilder.buildAddr || "暂无服务地理位置";
				item.agentHeaderImg = biddBuilder.buildOwnerPicUrl
					|| "http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png";
				item.agentName = biddBuilder.buildOwnerName || "";
				item.agentPhone = biddBuilder.buildOwnerMobile || "";
				item.isExit = biddBuilder.isExist ? biddBuilder.isExist : 0;
				item.archiveId = biddBuilder.buildOwnerArchiveId || "";
				item.cityId = data.list && data.list.length > 0
                    ? data.list[0].cityId || "" : "";
				item.caseType = this.caseType;
				item.buildId = this.buildId || "";
				this.villageExpertItem = item;
			},

            scrollBottom() {
                if (this.isScrollIng || !this.haveMoreData) return;

                this.currentPage++;
                this.isScrollIng = true;
                this.getErHouseList()
                    .then((res) => {
                        this.haveMoreData = true;
                        if (res.list.length < this.limit) {
                            this.haveMoreData = false;
                        }
                        this.isScrollIng = false;
                        this.erHouseList = (this.erHouseList || []).concat(res.list);
                    })
                    .catch(() => {
                        this.isScrollIng = false;
                        this.haveMoreData = true;
                    });
            },

            // 筛选弹窗显示隐藏回调
            ScreenShowChanged(name, boolean) {
                this.isActive = boolean;
            },

            // 筛选结果回调
            ScreenResultChanged(name, params) {
                this.isScrollIng = false;
                this.haveMoreData = true;
                if(params["regionId"] || params["sectionId"]) {
                    this.buildId = "";
                     this.searchBuildName = "";
                }
                this.paramsScreen = params;
                this.initData();
            },

            // 搜索结果回调
            SearchResChanged(name, item) {
				if(!new SearchHouseModel().getModel()) return;

                this.buildId = item.houseId || null;
                this.searchBuildName = item.houseName;
				this.paramsScreen["regionId"] = "";
				this.paramsScreen["sectionId"] = "";
            }
        }
	}
</script>

<style>
    page{
        background-color: #FFFFFF;
    }

    .top_view{
        z-index: 999;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        background:#ffffff;
		margin: 0 auto;
    }
    /* #ifdef H5 */
    .top_view{
        top: 44px;
		max-width: 640px;
    }
    /* #endif */

    .bottom_empty_view{
        height: 50upx;
    }
    .active{
        overflow: hidden;
    }
    .er_house_list_cont{
        width: 100%;
        height: 100%;
        background: #FFFFFF;
    }
    .er_house_list_view{
        width: 100%;
        padding-left: 40upx;
		padding-right: 40upx;
        box-sizing: border-box;
        background: #FFFFFF;
    }
    .loading_view{
        transform-origin: 0px 0px 0px;
        opacity: 1;
        transform: scale(1, 1);
        height:40px;
        line-height:40px;
        font-size:12px;
        text-align:center;
        margin-top: 10upx;
    }
    .pullUpIcon{
        display:inline-block;
        height:15px;
        width:15px;
        border-radius:100%;
        margin:auto 6px;
        border:2px solid #666;
        border-bottom-color:transparent;
        vertical-align:middle;
        animation:loading 1s linear infinite;
    }
    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .no_more_data{
        height: 80upx;
        line-height: 80upx;
        text-align: center;
        font-size:26upx;
        color:#666666;
    }
    .no_house_list{
        margin-top: 40upx;
        line-height:60upx;
        font-size:28upx;
        color:#999999;
        text-align:center;
        width: 100%;
    }
</style>
