<template>
	<view>
        <view v-if="loading && !noDataShow" class="loading_mask"></view>

        <!-- 顶部 -->
        <view class="top_view global-confirm-btn">
            <view class="top_price_view f_r_s">
                <text :class="{ no_price : (!item.totalPrice && item.totalPrice != null) }" class="top_price f_c_e">{{ !item.totalPrice && item.totalPrice != null ? '价格面议' : item.totalPrice }}</text>
                <text v-if="item.totalPrice && item.totalPrice != null" class="top_price_unit f_c_e">万</text>
                <text class="f_c_e" v-if="item.changePriceVal">({{ item.changePriceVal }}万 较上月{{ item.changePriceVal < 0 ? '下跌' : '上升' }}{{ item.changePriveBiLi }}%)</text>
            </view>

            <view class="top_build_name">{{ item.buildName }}</view>

            <view class="f_r_s top_house_des">
                <view class="top_house_room" v-if="item.room">{{ item.room }}室</view>
                <view class="top_house_area" v-if="item.area">{{ item.area }}㎡</view>
                <view class="top_house_floor" v-if="item.currentFloor && item.allFloor">{{ item.currentFloor }}/{{ item.allFloor }}层</view>
            </view>
        </view>

        <!-- 价格走势 -->
        <view class="price_trend_view" v-if="!(!item.totalPrice && item.totalPrice != null)">
            <view class="price_trend_title f_r_b">
                价格走势

                <view class="f_r_e">
                    <view class="canvas_cityName f_r_e">
                        <!-- <view style="background: #5786f2;" class="canvas_point"></view> -->
                        <view style="background: #5786f2;" class="canvas_point"></view>
                        {{ buildName }}
                    </view>
                    <view class="canvas_cityName f_r_e">
                        <!-- <view style="background: #c2c2c2;" class="canvas_point"></view> -->
                        <view style="background: #c2c2c2;" class="canvas_point"></view>
                        {{ regionName }}
                    </view>
                    <view class="canvas_cityName f_r_e">
                        <!-- <view style="background: #fcbc41;" class="canvas_point"></view> -->
                        <view style="background: #fbcc5b;" class="canvas_point"></view>
                        {{ cityName }}
                    </view>
                </view>
            </view>

            <view class="price_trend">
                <canvas id="lineCanvas_price" canvas-id="lineCanvas_price"
                    style="width:100%;height:100%;transform:scale(1)"></canvas>
            </view>
        </view>

        <view class="no_chart_view" v-if="(!item.totalPrice && item.totalPrice != null)"></view>

        <!-- 小区专家 -->
        <view class="expert_view">
            <village-expert :caseType="'1'" :item="villageExpertItem"
                            @onPushEntrustChanged="onPushEntrustChanged"></village-expert>
        </view>

        <!-- 周边在售房源 -->
        <view class="house_list_view" v-if="houseList.length > 0">
            <view class="f_r_b house_list_title">
                <view>周边在售房源</view>

                <view class="f_r_e" v-if="houseList.length > 3">
                    <view class="look_more">查看更多</view>
                    <image class="right_arrow"
                        src="https://zdzfapi.haofang.net/Public/wxApp/images/mine/arrow_right.png"></image>
                </view>
            </view>

            <block v-for="(item,index) in houseList" :key="index">
                <er-house-list-item :class="{ er_last_item : index + 1 == houseList.length }"
                    :item="item"></er-house-list-item>
            </block>
        </view>

        <block v-if="bottomBtn && !(!item.totalPrice && item.totalPrice != null)">
            <!-- 底部撑高 -->
            <view class="empty_bottom"></view>

            <!-- 底部按钮 -->
            <view class="bootom_view f_r_b">
                <view @click="wantDaiKaun" class="dai_kuan_view f_c_c">
                    <image class="dai_kuan_icon" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/registration/icon_daikuan.png"></image>
                    <view class="dai_kuan_text">我要贷款</view>
                </view>

                <view class="f_r_b want_view">
                    <view @click="wantSaleHouse" class="want_buy global-confirm-btn-another">我要卖房</view>

                    <view @click="wantLeaseHouse" class="want_lease global-confirm-btn-right">我要出租</view>
                </view>
            </view>
        </block>

		<!-- 无数据 -->
		<view v-if="!loading && noDataShow" class='no-data-box'>
			<view class='no-img'></view>
			<view class='goback-btn' @click="gobackBtn">换个条件试试</view>
		</view>
	</view>
</template>

<script>
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import { UserInfoModel } from "../../model/UserInfoModel.js";
	import { GetHousePriceTrend } from "../../net/evaluate/GetHousePriceTrend.js";
	import {ErHouseListItem, HouseListAgentItem, Const} from "../../utils/Const";
	import erHouseListItem from "../../components/erHouseListItem.vue";
	import villageExpert from "../../components/villageExpert.vue";
	import { GetVillageExpertInfo } from "../../net/evaluate/GetVillageExpertInfo.js";
	import wxCharts from "@/utils/wxchartsNew.js";
    import { GetCityPriceTrend } from "../../net/evaluate/GetCityPriceTrend.js";

	class PriceTrendItem {
		buildName = "";  // 小区名称
		buildId = "";  // 小区id
		totalPrice = null;  // 总价 例如： 800 （单位:万）
		changePriceVal = "";  // 变化的价钱 例如： -5（单位:万）
		changePriveBiLi = "";  // 变化的比例 例如： 2.72 （单位: %）
		room = "";  // 几室 例如：3（单位: 室）
		area = "";  // 面积 例如： 49（单位: ㎡）
		currentFloor = "";  // 当前楼层 例如： 3 （单位: 层）
		allFloor = "";  // 总楼层 例如： 70 （单位: 层）
        cityName = '';
        regionName = "";
	}

	let windowWidth = 320;

    class EvaluateItem {
    	cityName = "";
    	monthVal = "";  // 月份
    	unitPrice = "";  // 单价 元/平
    	newAddHouseNum = undefined;  // 昨日新增房源数量
    	newAddKeNum = undefined; // 昨日新增客
    	daiKanNum = undefined;  // 带看量
    	priceList = [];  // 价格列表
    	timeList = []; // 时间列表
        upTime = "";  // 更新时间
    }

	export default {
		data() {
			return {
				item: new PriceTrendItem(),
				houseList: [],
				villageExpertItem: {},
                loading: true,
				noDataShow: false,
                cityName: "",
                regionName: "",
                buildName: "",
                evaluateItem: new EvaluateItem(),
                bottomBtn: true
			}
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		components: {
			erHouseListItem,
			villageExpert
		},

		onLoad(params) {
			if(params.buildName) {
				this.item.buildName = params.buildName;
				this.item.buildId = params.buildId;
				this.item.room = params.room;
				this.item.area = params.area;
				this.item.currentFloor = params.currentFloor;
				this.item.allFloor = params.allFloor;
				uni.setNavigationBarTitle({
					title: params.buildName || "房价评估"
				});
			}
			let that = this;
			uni.getSystemInfo({
				success: function (res) {
                    windowWidth = res.windowWidth;
				},
				complete: function() {
					that.initPriceTrend();
				}
			});
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		methods: {
		    // 发送委托change回调
            onPushEntrustChanged(val) {
				this.bottomBtn = !val;
			},

			initPriceTrend() {
				let item = new GpsInfoModel().getModel("cityInfo");
				let me = new UserInfoModel().getModel("me") || {};
				let requestApi = {buildId: this.item.buildId};
				if(me.userId) {
					requestApi["youyouUserId"] = me.userId;
				}
				if(item.cityId) {
					requestApi["cityId"] = item.cityId;
				}
				this.loading = true;
                this.drawVillageExpertInfo({buildId: this.item.buildId, cityId: item.cityId});
				uni.showLoading({
					title: "加载中..."
				});
				new GetHousePriceTrend(requestApi).send()
					.then(res => {
						res = res || {};
						this.loading = false;
						uni.hideLoading();
						if(res.STATUS != 1) {
							this.failModel();
							this.noDataShow = true;
							return;
						}

						this.drawTopInfo(res.DATA || {});
						this.drawPriceTrendCanvas(res.DATA || {});
						this.drawHouseList(res.DATA || {});
					})
					.catch(err => {
                        uni.hideLoading();
						this.noDataShow = true;
						this.loading = false;
						this.failModel();
					});
			},

			failModel() {
				uni.showModal({
					title: "温馨提示",
					content: "获取价格走势失败啦！请稍后重试。",
					showCancel: false,
					confirmText: "我知道了",
					confirmColor: "#ab7f2e"
				});
			},

			drawTopInfo(res = {}) {
				let unitPrice = res.unitPrice ? Number(res.unitPrice) : 0;
				let area = this.item.area ? Number(this.item.area) : 0;
				let totalPrice = parseInt(unitPrice * area / 10000);
				res.ratioByLastMonthForPrice = res.ratioByLastMonthForPrice
					? Number(res.ratioByLastMonthForPrice)
					: 0;
				res.ratioByLastYearForPrice = res.ratioByLastYearForPrice
					? Number(res.ratioByLastYearForPrice)
					: 0;
                totalPrice = !totalPrice ? "0" : totalPrice;
				this.item.totalPrice = totalPrice;
                this.noDataShow = !!(!totalPrice || totalPrice == null);
				if(res.ratioByLastMonthForPrice) {
					this.item.changePriceVal = parseFloat((totalPrice /(1
						+ parseFloat((res.ratioByLastMonthForPrice || 0))))
						* (res.ratioByLastMonthForPrice || 0)).toFixed(1);
				}
				this.item.changePriveBiLi = Math.abs(parseFloat(res.ratioByLastMonthForPrice * 100).toFixed(2));
			},

            // 网络图片下载
            downloadNetImg(imgs = []) {
                function getImageInfo(imgUrl) {
                    return new Promise((resolve, reject) => {
                        uni.getImageInfo({
                            src: imgUrl,
                            success (res) {
                                resolve(res);
                            }
                        });
                    });
                }

                return new Promise((resolve, reject) => {
                    Promise.all(imgs.map(url => {
                        return getImageInfo(url)
                    })).then(res => {
                        resolve(res);
                    });
                });
            },

			drawPriceTrendCanvas(res = {}) {
                this.cityName = res.cityName;
                this.regionName = res.regionName;
                this.buildName = res.buildName;
				let timeArr = [];
				let cityArr = [];
				let houseArr = [];
				let regionArr = [];
				(res.city || []).map((item) => {
					if (item.priceMonths) {
						cityArr.push(item.price);
						timeArr.push(item.priceMonths.substr(item.priceMonths.length-2
							, item.priceMonths.length-1)+"月");
					}
				});
				(res.house || []).map((item) => {
					houseArr.push(item.price);
				});
				(res.region || []).map((item) => {
					regionArr.push(item.price);
				});

				if (timeArr.length === 0) return;

				timeArr = timeArr.length > 6
					? timeArr.slice(timeArr.length-6, timeArr.length)
					: timeArr;
				cityArr = cityArr.length > 6
					? cityArr.slice(cityArr.length-6, cityArr.length)
					: cityArr;
				houseArr = houseArr.length > 6
					? houseArr.slice(houseArr.length-6, houseArr.length)
					: houseArr;
				regionArr = regionArr.length > 6
					? regionArr.slice(regionArr.length-6, regionArr.length)
					: regionArr;

				let houseMinVal = this.getMinMaxVal(houseArr).min;
				let houseMaxVal = this.getMinMaxVal(houseArr).max;
				let regionMinVal = this.getMinMaxVal(regionArr).min;
				let regionMaxVal = this.getMinMaxVal(regionArr).max;
				let cityMinVal = this.getMinMaxVal(cityArr).min;
				let cityMaxVal = this.getMinMaxVal(cityArr).max;
				let chaMinVal = houseMinVal;
				let chaMaxVal = houseMaxVal;
				if (chaMinVal > regionMinVal) {
					chaMinVal = regionMinVal;
				}
				if (chaMinVal > cityMinVal) {
					chaMinVal = cityMinVal;
				}

				if (chaMaxVal < regionMaxVal) {
					chaMaxVal = regionMaxVal;
				}
				if (chaMaxVal < cityMaxVal) {
					chaMaxVal = cityMaxVal;
				}
				let chaVal = (parseInt(chaMaxVal) - parseInt(chaMinVal)) || 0;
                chaVal = 1000;
                if(chaMinVal > 30000) {
                    chaVal = 5000;
                }
				let minVal = (parseInt(chaMinVal) - chaVal) < 0 ? 0 : (parseInt(chaMinVal) - chaVal);
				let maxVal = (parseInt(chaMaxVal) + chaVal) || 0;
                let chartWidth = windowWidth;
                let chartHeight = 200;
                let xAxis = {
                    disableGrid: true,
                    fontColor: "#acb1b9",
                    gridType: "dash",
                    dashLength: 3
                };
                let yAxis = {
                    format: function (e) {
                        e = e ? Number(e) : 0;
                        if (!e) return "0";

                        return Number(e/10000).toFixed(1) + "万";
                    },
                    min: minVal,
                    max: maxVal,
                    gridType: "dash",
                    dashLength: 4,
                    gridColor: "#acb1b9",
                    fontColor: "#acb1b9",
                    height: 10,
                    lineWidth: 0.2,
                };
                let animation = true;
                // #ifdef MP-ALIPAY || MP-BAIDU
                xAxis = {
                    disableGrid: true,
                };
                yAxis = {
                    format: function (e) {
                        e = e ? Number(e) : 0;
                        if (!e) return "0";

                        return Number(e/10000).toFixed(1) + "万";
                    },
                    min: minVal,
                    max: maxVal,
                };
                animation = false;
                // #endif
                this.downloadNetImg([
                    "http://cdn.haofang.net/static/wxPlusApp/yjk/trend/iocn_build.png",
                    "https://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/icon_huang.png",
                    "https://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/icon_hui.png",
                    "https://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/image_xian.png"
                ]).then((imgs) => {
                    new wxCharts({
                        $this:this,
                        canvasId: "lineCanvas_price",
                        type: "area",
                        legend: false,
                        dataLabel: false,
                        fontSize: 11,
                        background:'#FFFFFF',
                        pixelRatio: 1,
                        categories: timeArr,
                        animation: animation,
                        series: [
                            {
                                data: houseArr,
                                name:  res.buildName,
                                color: "#5786f2",
                                lineWidth: 1.5,
                                shapeStyle: {
                                    img: imgs[0].path,
                                    width: 32,
                                    height: 32
                                }
                            },
                            {
                                data: cityArr,
                                name:  res.cityName,
                                color: "#fbcc5b",
                                lineWidth: 1.5,
                                shapeStyle: {
                                    img: imgs[1].path,
                                    width: 32,
                                    height: 32
                                }
                            },
                            {
                                data: regionArr,
                                name:  res.regionName,
                                color: "#c2c2c2",
                                lineWidth: 1.5,
                                shapeStyle: {
                                    img: imgs[2].path,
                                    width: 32,
                                    height: 32
                                }
                            },
                        ],
                        // 渐变色配置
                        backgroudStyle: {
                            show: true,
                            startColor: "#ffffff",
                            endColor: "#fffbe8",
                            // 配置了img则背景渐变色无效
                            img: imgs[3].path,
                        },
                        xAxis: xAxis,
                        yAxis: yAxis,
                        width: chartWidth,
                        height: chartHeight,
                        dataPointShape: true,
                    });
                });
			},

            initChart() {
            	let that = this;
            	if(this.evaluateItem.timeList.length == 0){
            	  return;
            	}

            	let timeArr = this.evaluateItem.timeList.length > 6
            		? this.evaluateItem.timeList.slice(this.evaluateItem.timeList.length-6,this.evaluateItem.timeList.length)
            		: this.evaluateItem.timeList;
            	let cityArr = this.evaluateItem.priceList.length > 6
            		? this.evaluateItem.priceList.slice(this.evaluateItem.priceList.length-6,this.evaluateItem.priceList.length)
            		: this.evaluateItem.priceList;
            	uni.setNavigationBarTitle({
            	  title: (this.evaluateItem.cityName ? this.evaluateItem.cityName + "房价评估报告" : "城市均价")
            	});

            	let forMinVal = 0;
            	let forMaxVal = 0;
            	for (let i = 0;i<cityArr.length;i++) {
            		let itemVal = parseInt(cityArr[i]);
            		if (!forMinVal) {
            			forMinVal = itemVal;
            		}
            		if (forMinVal > itemVal) {
            			forMinVal = itemVal;
            		}
            		if (forMaxVal < itemVal) {
            			forMaxVal = itemVal;
            		}
            	}
            	let chaVal = (parseInt(forMaxVal) - parseInt(forMinVal)) > 0
            		? (parseInt(forMaxVal) - parseInt(forMinVal)) : 0;
                chaVal = 1000;
                if(forMinVal > 30000) {
                    chaVal = 5000;
                }
            	let minVal = (parseInt(forMinVal) - chaVal) < 0 ? 0 : (parseInt(forMinVal) - chaVal);
            	let maxVal = (parseInt(forMaxVal) + chaVal) || 0;
                let chartWidth = windowWidth;
                let chartHeight = 200;
                // #ifdef MP-BAIDU
                // chartWidth = windowWidth - 40;
                // chartHeight = 200 - 50;
                // #endif
                let xAxis = {
                    disableGrid: true,
                    fontColor: "#acb1b9",
                    gridType: "dash",
                    dashLength: 3
                };
                let yAxis = {
                    format: function (e) {
                        e = e ? Number(e) : 0;
                        if (!e) return "0";

                        return Number(e/10000).toFixed(1) + "万";
                    },
                    min: minVal,
                    max: maxVal,
                    gridType: "dash",
                    dashLength: 4,
                    gridColor: "#acb1b9",
                    fontColor: "#acb1b9",
                    height: 10,
                    lineWidth: 0.2,
                }
                let animation = true;
                // #ifdef MP-ALIPAY || MP-BAIDU
                xAxis = {
                    disableGrid: true,
                };
                yAxis = {
                    format: function (e) {
                        e = e ? Number(e) : 0;
                        if (!e) return "0";

                        return Number(e/10000).toFixed(1) + "万";
                    },
                    min: minVal,
                    max: maxVal,
                };
                animation = false;
                // #endif
                this.downloadNetImg([
                    "https://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/icon_huang.png",
                    "https://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/image_xian.png"
                ]).then((imgs) => {
                    new wxCharts({
                        $this:this,
                        canvasId: "lineCanvas_price",
                        type: "area",
                        legend: false,
                        dataLabel: false,
                        fontSize: 11,
                        background:'#FFFFFF',
                        pixelRatio: 1,
                        categories: timeArr,
                        animation: animation,
                        series: [
                            {
                                data: cityArr,
                                name: this.evaluateItem.cityName,
                                color: "#ffdcba",
                                lineWidth: 1.5,
                                shapeStyle: {
                                    img: imgs[0].path,
                                    width: 32,
                                    height: 32
                                }
                            }
                        ],
                        // 渐变色配置
                        backgroudStyle: {
                            show: true,
                            startColor: "#ffffff",
                            endColor: "#fffbe8",
                            // 配置了img则背景渐变色无效
                            img: imgs[1].path,
                        },
                        tooltip: {
                            option: {
                                background: "#101d36",
                                split: {
                                    color: "#ff9f3e",
                                    lineWidth: 0.5
                                },
                                color: ""
                            }
                        },
                        xAxis: xAxis,
                        yAxis: yAxis,
                        width: chartWidth,
                        height: chartHeight,
                        dataPointShape: true,
                    });
                });
            },

			getMinMaxVal(cityArr) {
				let forMinVal = 0;
				let forMaxVal = 0;
				for (let i = 0;i<cityArr.length;i++) {
					let itemVal = parseInt(cityArr[i]);
					if (!forMinVal) {
						forMinVal = itemVal;
					}
					if (forMinVal > itemVal) {
						forMinVal = itemVal;
					}
					if (forMaxVal < itemVal) {
						forMaxVal = itemVal;
					}
				}
				return {
				  min: forMinVal,
				  max: forMaxVal
				}
			},

			drawHouseList(res = {}) {
				let houseList = [];
				let list = res.houseList || [];
				for(let i = 0;i<list.length;i++) {
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
					houseList.push(item);
				}
				this.houseList = houseList;
			},

			drawVillageExpertInfo(res = {}) {
				this.villageExpertItem = {
                    buildId: res.buildId,
                    cityId: res.cityId,
				};
			},

			// 我要贷款
			wantDaiKaun() {
				uni.navigateTo({
					url: "/pages/webView/webView?bgColor=#ff6300&color=#ffffff&" +
					    "url=" + this.Config.loanApplyCheckDirectWebUrl +
					    "&title=悠居客贷款查询" + "&type=urlParams"
				});
			},

			gobackBtn() {
				uni.navigateBack({
					delta: 1
				});
			},

            // 我要卖房
            wantSaleHouse() {
                uni.navigateTo({
                	url: "/pagesEntrust/registration/registration?casetype=1"
                        + "&buildId=" + this.item.buildId
                        + "&buildName=" + this.item.buildName
                });
            },

            // 我要出租
            wantLeaseHouse() {
                uni.navigateTo({
                	url: "/pagesEntrust/registration/registration?casetype=2"
                        + "&buildId=" + this.item.buildId
                        + "&buildName=" + this.item.buildName
                });
            }
		},
	}
</script>

<style>
    .canvas_cityName{
        position: relative;
        color: #101D36;
        font-size: 26upx;
        font-weight: normal;
        text-align: right;
        margin-left: 20upx;
    }
    .canvas_point{
        width: 12upx;
        height: 12upx;
        margin: auto 12upx auto 0;
        border-radius: 100%;
        overflow: hidden;
        background: #ff9f3e;
        flex-shrink: 0;
    }
	.top_view{
		width: 100%;
		height: 370upx;
		background: -webkit-linear-gradient(left, #ff8400 , #ab7f2e);
		padding: 64upx 0 0 40upx;
		box-sizing: border-box;
	}
	.top_price_view{
		color: #101d36;
		margin-top: 18upx;
		min-height: 94upx;
	}
    .no_price{
        font-size: 40upx!important;
    }
	.top_price{
		font-size: 94upx;
		font-weight: bold;
        position: relative;
        top: 16upx;
	}
	/* #ifdef H5 */
	.top_price{
		margin-bottom: -14upx;
        top: 0;
	}
	/* #endif */
	.top_price_unit{
		margin-right: 17upx;
	}
	.top_build_name{
		font-size: 30upx;
		line-height: 60upx;
		font-weight: bold;
		color: #101d36;
		margin-top: 28upx;
	}
	.top_house_des{
		line-height: 44upx;
		margin-top: 6upx;
		color: #101d36;
		font-size: 30upx;
	}
	.top_house_room{
		padding-right: 16upx;
		box-sizing: border-box;
		position: relative;
	}
	.top_house_room::after,.top_house_area::after{
		content: "";
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
		width: 2upx;
		height: 21upx;
		background: #706820;
		flex-shrink: 0;
	}
    .no_chart_view{
        height: 30upx;
        flex-shrink: 0;
        width: 100%;
    }
	.top_house_area{
		padding: 0 16upx;
		box-sizing: border-box;
		position: relative;
	}
	.top_house_floor{
		padding-left: 16upx;
		box-sizing: border-box;
	}

	/* 价格走势 */
	.price_trend_view{
		position:relative;
		width:100%;
		margin-top:30upx;
		box-sizing:border-box;
		background-color:#FFFFFF;
		margin-bottom:20upx;
	}
	.price_trend_title{
		width:100%;
		height:86upx;
		color:#101d36;
		font-size:34upx;
		padding-left:40upx;
		box-sizing:border-box;
		line-height:86upx;
		padding-right:40upx;
	}
	.price_trend{
		height:230px;
		border-bottom:10px solid #f6f6f6;
		position:relative;
		padding-left:19upx;
		padding-right:40upx;
		margin-bottom:40upx;
		display:flex;
        padding-bottom: 20upx;
		box-sizing:border-box;
	}

	/* 房源 */
	/* .er_last_item >>> .er_house_item {
		border-bottom: none;
	} */
	.house_list_view{
		padding: 0 40upx;
		box-sizing: border-box;
		width: 100%;
		background: #FFFFFF;
	}
	.house_list_title{
		line-height: 60upx;
		color: #101D36;
		font-size: 36upx;
		font-weight: bold;
	}
	.look_more{
		font-size: 24upx;
		color: #7A8190;
		font-weight: normal;
	}
	.right_arrow{
		width: 14upx;
		height: 24upx;
		margin: auto 0 auto 11upx;
	}

	/* 底部按钮 */
	.bootom_view{
		padding: 0 40upx;
		background: #FFFFFF;
		z-index: 99999;
		position: fixed;
		left: 0;
		width: 100%;
		bottom: 0;
		height: 140upx;
		box-sizing: border-box;
	}
	.dai_kuan_view{
		width:235upx;
		text-align:center;
		margin-right:30upx;
		flex-shrink:0;
	}
	.dai_kuan_icon{
		width:44upx;
		height:47upx;
		flex-shrink:0;
		margin:0 auto;
	}
	.dai_kuan_text{
		color:#101d36;
		font-size:26upx;
		margin-top:10upx;
	}
	.want_view{
		width: 100%;
	}
	.want_view view{
		width:100%;
		height:100upx;
		line-height:100upx;
		border-radius:10upx;
		box-sizing:border-box;
		overflow:hidden;
		text-align:center;
		color:#FFFFFF;
		font-size:30upx;
		margin:auto 0;
		font-weight:bold;
	}
	.want_view .want_buy{
		background:#ff9402;
		background:-webkit-linear-gradient(left, #ffcb00 , #ff9402);
		margin-right:14upx;
	}
	.want_view .want_lease{
		background:#ab7f2e;
		background:-webkit-linear-gradient(left, #ff8400 , #ab7f2e);
	}
	.empty_bottom{
		height: 180upx;
		width: 100%;
	}

	.expert_view{
		padding: 40upx;
		box-sizing: border-box;
	}

	/* 暂无数据 */
	.no-data-box,.loading_mask{
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100000;
	}
	.no-img{
		position: relative;
		top: 300upx;
		margin: 0 auto;
		width: 298upx;
		height: 322upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/trendImg/no-data_new.png)no-repeat center;
		background-size: 100%;
	}
	.goback-btn{
		position: relative;
		top: 350upx;
		margin: 0 auto;
		width: 288upx;
		height: 90upx;
		text-align: center;
		line-height: 90upx;
		background:-webkit-linear-gradient(left, #ff8400 , #ab7f2e);
		color: #FFFFFF;
		font-size:30upx;
		border-radius: 10upx;
	}
</style>
