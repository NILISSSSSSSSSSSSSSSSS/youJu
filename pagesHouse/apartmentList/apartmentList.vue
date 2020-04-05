<template>
    <view :class="{ active: isActive }" class="er_house_list_cont"
          :style="{height: isActive ? windowHeight : pageHeight}">

        <view @click="searchAnimationClick" class="top_view" :animation="searchAnimation">
            <search-btn-view :caseType="'5'" :name="searchBuildName"></search-btn-view>
            <screen-house :city="siteMapParams.cityId" :regId="siteMapParams.regId"
                :enterType="'apartment'" :from="'apartment'"></screen-house>
        </view>

        <view style="height: 190upx;"></view>

        <view class="loading_view f_r_c" v-if="!erHouseList">
            <view class="pullUpIcon"></view>
            <view class="pullUpLabel">努力加载中...</view>
        </view>

        <view v-if="erHouseList && erHouseList.length === 0" class="no_house_list">
            <view class="f_r_c">
                <image src="https://zdzfapi.haofang.net/Public/wxApp/images/new_images/nodata_list_new.png"
                       class='no-data-img'>
                </image>
            </view>

            <view class='no-txt'>暂无数据记录...</view>
        </view>

        <view class="er_house_list_view" v-if="erHouseList && erHouseList.length > 0">
			<view class="top_banner_view">
				<image mode="aspectFill" class="top_banner_img"
					src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/flats_banner.png"></image>
			</view>

			<!-- 房源列表 -->
            <block v-for="(item, index) in erHouseList" :key="index">
				<apartment-list-item :item="item"></apartment-list-item>
            </block>

            <!--  loading  -->
            <view class="loading_view f_r_c" v-if="isScrollIng && haveMoreData">
                <view class="pullUpIcon"></view>
                <view class="pullUpLabel">努力加载中...</view>
            </view>
            <view v-if="!isScrollIng && !haveMoreData" class="no_more_data">没有更多数据了！</view>
        </view>

        <view class="bottom_empty_view"></view>

		<!-- 消息体 -->
		<newMsgView></newMsgView>
    </view>
</template>

<script>
    import screenHouse from "../components/screenHouse.vue";
    import searchBtnView from "../../components/searchBtnView.vue";
    import {ApartmentHouseListItem} from "../../utils/Const";
    import { Config } from "../../utils/config.js";
    import { GetNewHouseList } from "../../net/GetNewHouseList.js";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import { Const } from "../../utils/Const.js";
	import apartmentListItem from "../../components/apartmentListItem.vue";
    import { SearchHouseModel } from "../../model/SearchHouseModel.js"
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
				caseType: "5",
				erHouseList: null,
                currentPage: 1,
                limit: 12,
                cityId: 1,
                isScrollIng: false,
                haveMoreData: true,
                searchBuildName: "",
                buildId: "",

                pageHeight: "100%",
                windowHeight: "100%",
                isActive: false,

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
			apartmentListItem
        },

        onLoad(params = {}) {
//         	let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
//         	if(!new SearchHouseModel().getModel() && cityInfo.regId) {
//         		this.paramsScreen["regionId"] = cityInfo.regId;
//         	}
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

		onShow() {
            new this.SetMetaInfo().initDefault();
			// 先执行一次搜索条件（如果有）
			if(privateData.pageFrom == "index") {
				this.SearchResChanged(Notify.SearchResChanged.Name, (new SearchHouseModel().getModel() || {}));
			}
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

                let item = new GpsInfoModel().getModel("cityInfo");
                this.cityId = item.cityId || "1";
                if (item.regId === this.siteMapParams.regId || !this.siteMapParams.regId) {
                    this.initData();
                }
                new this.SetMetaInfo().initAparmentList();
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
                        pageSize:this.limit,
                        buildName: this.searchBuildName
                    };
                    let params = Object.assign(dataParams, this.paramsScreen);
                    new GetNewHouseList(this.dealParams(params)).send()
                       .then(res => {
                           let data = res.DATA || {};
                           let list = data.list || [];
                           if(list.length < params.pageSize) {
                               this.haveMoreData = false;
                           }
                           resolve({list: this.drawErHouseList(list), num: (data.total || 0)});
                       })
                       .catch(err => {
                       });
                });
            },
            drawErHouseList(apiList = []) {
                let erHouseList = [];
                for (let i = 0;i<apiList.length;i++) {
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
                    item.houseImg = dataItem.thumbUrl ? dataItem.thumbUrl : Const.houseDefaultImg;
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
					item.houseSource = dataItem.appIdCn || "";
                    erHouseList.push(item);
                }
                return erHouseList;
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
    .top_banner_view{
		margin:40upx 0 32upx;
		height:190upx;
		border-radius: 14upx;
		box-sizing: border-box;
		overflow: hidden;
	}
	.top_banner_img{
		width: 100%;
		height: 100%;
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
        background: #FFFFFF;
        box-sizing: border-box;
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
