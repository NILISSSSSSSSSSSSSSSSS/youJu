<template>
    <view :class="{ active: isActive }" class="er_house_list_cont"
          :style="{height: isActive ? windowHeight : pageHeight}">

        <view @click="searchAnimationClick" class="top_view" :animation="searchAnimation">
            <search-btn-view v-if="showSearchBtn" :caseType="'4'" :name="searchBuildName"></search-btn-view>
            <screen-house :city="siteMapParams.cityId" :regId="siteMapParams.regId"
                :enterType="'newHouse'" :from="'newHouse'"></screen-house>
        </view>

        <view style="height: 190upx;"></view>

        <view class="loading_view f_r_c" v-if="!erHouseList">
            <view class="pullUpIcon"></view>
            <view class="pullUpLabel">努力加载中...</view>
        </view>

		<!-- <no-data-trust :type="'lease'" v-if="erHouseList && erHouseList.length === 0"></no-data-trust> -->
        <view v-if="erHouseList && erHouseList.length === 0" class="no_house_list">
            <view class="f_r_c">
                <image src="https://zdzfapi.haofang.net/Public/wxApp/images/new_images/nodata_list_new.png"
                       class='no-data-img'>
                </image>
            </view>

            <view class='no-txt'>暂无数据记录...</view>
        </view>

        <view class="er_house_list_view" v-else>
			<!-- 房源列表 -->
			<block v-for="(item, index) in erHouseList" :key="index">
			    <new-house-list-item :item="item"></new-house-list-item>
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
    import screenHouse from "@/pagesHouse/components/screenHouse.vue";
    import searchBtnView from "../../components/searchBtnView.vue";
    import {NewHouseListItem} from "../../utils/Const";
    import { Config } from "../../utils/config.js";
    import { GetNewHouseList } from "../../net/GetNewHouseList.js";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import mapFindHouseBtn from "@/pagesHouse/components/mapFindHouseBtn.vue";
	import { Const } from "../../utils/Const.js";
	import newHouseListItem from "../../components/newHouseListItem.vue";
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
                searchAnimation: null,
				erHouseList: null,
                currentPage: 1,
                limit: 10,
                cityId: 1,
				caseType: 4,
                isScrollIng: false,
                haveMoreData: true,
                searchBuildName: "",
                buildId: "",

                pageHeight: "100%",
                windowHeight: "100%",
                isActive: false,

				// 搜索btn
				showSearchBtn: true,

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
            screenHouse,
            searchBtnView,
			mapFindHouseBtn,
			newHouseListItem
        },

		onShow() {
            new this.SetMetaInfo().initDefault();
			// 先执行一次搜索条件（如果有）
			if(privateData.pageFrom == "index") {
				this.SearchResChanged(Notify.SearchResChanged.Name, (new SearchHouseModel().getModel() || {}));
			}
		},

		onLoad(params = {}) {
// 			let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
// 			if(!new SearchHouseModel().getModel() && cityInfo.regId) {
// 				this.paramsScreen["buildRegion"] = cityInfo.regId;
// 			}
            this.siteMapParams = {
                cityId: params.cityId || "",
                regId: params.regId || ""
            };
			if(params.pageFrom) {
				privateData.pageFrom = params.pageFrom;
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
		},

        onUnload() {
            // 反注册通知
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
                new this.SetMetaInfo().initNewHouseList();
            },

            // gps change 回调
            GpsChanged(name, item) {
                this.upGpsInfo();
            },

            initData() {
                this.currentPage = 1;
                this.getErHouseList()
                    .then((res) => {
						setTimeout(() => {
							new SearchHouseModel().setModel(null);
						}, 1000);
                        this.erHouseList = res.list || [];
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
				        fromSource: 1,
						buildName: this.searchBuildName
				    };
				    let params = Object.assign(dataParams, this.paramsScreen);
				    new GetNewHouseList(this.dealParams(params)).send()
				       .then(res => {
				           let data = res.DATA || {};
				           let list = data.list || [];
                           if(list.length < 12) {
                               this.haveMoreData = false;
                           }
				           resolve({list: this.drawErHouseList(list), num: (data.trueHouseNum || 0)});
				       })
				       .catch(err => {
				           console.error(err);
				       });
				});
            },
            drawErHouseList(apiList = []) {
                let newHouseList = [];
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
                    item.couponFlag = dataItem.couponFlag || 0;
                    item.cityId = dataItem.cityId || "";
                    item.buildId = dataItem.buildId || "";
                    item.buildStatus = dataItem.buildStatus || "";
                    item.buildImg = dataItem.photoAddr || Const.houseDefaultImg;
                    item.buildTing = dataItem.roomText ? dataItem.roomText + " | " : "";
                    item.buildArea = (dataItem.areaLow && dataItem.areaHigh)
                        ? parseInt(dataItem.areaLow) + "-" + parseInt(dataItem.areaHigh)
                        : (parseInt(dataItem.areaLow || 0) || parseInt(dataItem.areaHigh || 0) || "");
                    item.buildAreaUnit = (dataItem.areaLow || dataItem.areaHigh) ? "m²" : "";
                    item.buildAddress = dataItem.buildAddr || "";
                    item.buildName = dataItem.buildName || "";
                    item.buildTags = tags;
					item.buildPriceOfArea = !dataItem.price ? "" : dataItem.price.indexOf("价格") >= 0 ? "" : parseInt(dataItem.price);
                    item.buildPriceOfAreaUnit = "元/㎡";
                    item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
                    newHouseList.push(item);
                }
                return newHouseList;
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
				this.paramsScreen["buildRegion"] = "";
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
    .no_house_list {
        width: 100%;
        position: relative;
        top: 200upx;
    }
    .no-data-img {
        margin: 0 auto;
        width: 250upx;
        height: 250upx;
    }
    .no-txt {
        width: 100%;
        text-align: center;
        font-size: 32upx;
        color: #999;
    }
</style>
