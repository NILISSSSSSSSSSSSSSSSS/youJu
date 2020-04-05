<template>
	<view>
		<block v-if="!loading && !noDataShow">
			<!-- 顶部 -->
			<view class="m-build-name">{{ item.buildName }}</view>
			<view class="num_change_view f_r_c">
				<view class="num_change_item">

					<view class="num_change_num">{{item.avgPrice}}</view>
					<view class="num_change_title">本月均价(元/㎡)</view>
				</view>

				<view class="num_change_item">
					<view class="num_change_num">
						{{ratioByLastMonthForPrice}}%	
						<image v-if="ratioByLastMonthForPrice>=0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-up.png"></image>
						<image v-if="ratioByLastMonthForPrice<0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-down.png"></image>
					</view>
					<view class="num_change_title">环比上月</view>
				</view>

				<view class="num_change_item">
					<view class="num_change_num">
						{{ratioByLastYearForPrice}}%
						<image v-if="ratioByLastYearForPrice>=0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-up.png"></image>
						<image v-if="ratioByLastYearForPrice<0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-down.png"></image>
					</view>
					<view class="num_change_title">同比去年</view>
				</view>
			</view>

			<!-- 价格走势 -->
			<view class="price_trend_view" v-if="havePriceTrend">
				<view class="price-content">
					<view class="price-trend-titel radius-1">{{buildName}}</view>
					<view class="price-trend-titel radius-2">{{regionName}}</view>
					<view class="price-trend-titel radius-3">{{cityName}}</view>
				</view>
				<view class="price-trend-jia">均价(元/㎡)</view>

				<view class="price_trend">
					<canvas id="lineCanvas" @touchstart="touchArea" canvas-id="lineCanvas" style="width:100%;height:100%;transform:scale(1)"></canvas>
				</view>
			</view>
			
			
			<view class="new_title">成都市二手房</view>
			<view class="num_change_view-new f_r_c">
				<view class="num_change_item" style="text-align: center;">
					<view class="num_change_num">{{erHouse.averagePrice}}</view>
					<view class="num_change_title">本月均价(元/㎡)</view>
				</view>

				<view class="num_change_item" style="text-align: center;">
					<view class="num_change_num">
						{{erHouse.trendRatio}}%
						<image v-if="erHouse.trendRatio>=0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-up.png"></image>
						<image v-if="erHouse.trendRatio<0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-down.png"></image>
					</view>
					<view class="num_change_title">环比上月</view>
				</view>
			</view>

			<view class="no_chart_view" v-if="(!item.totalPrice && item.totalPrice != null)"></view>

			<!-- 周边在售房源 -->
			<view class="house_list_view" v-if="houseList.length > 0">
				<view class="f_r_b house_list_title">
					<view>附近小区均价</view>

					<view class="f_r_e" v-if="houseList.length > 1">
						<view class="look_more">比上月</view>
						<!-- <image class="right_arrow" 
							src="https://zdzfapi.haofang.net/Public/wxApp/images/mine/arrow_right.png"></image> -->
					</view>
				</view>

				<view class="house-list" v-for="(item,index) in houseList" :key="index" @click="jumpDetail(item)">

					<view class="house-list-left">
						<view class="house-list-title">{{item.houseName}} <span>{{item.housePriceOfArea}}元/㎡</span></view>
			
					</view>
					<view class="house-list-right">
						<span :class="[ 'house-chain-ratio',item.chainRatio>=0?' u-go-up':'u-lower']">{{item.chainRatio>=0?item.chainRatio:-(item.chainRatio)}}%</span>
						<image v-if="item.chainRatio>=0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-up.png"></image>
						<image v-if="item.chainRatio<0" class="house-list-data-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/icon-down.png"></image>
						<image class="house-list-right-img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/computer-new/right.png"></image>
					</view>
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
	import {
		GpsInfoModel
	} from "../../model/GpsInfoModel.js";
	import {
		UserInfoModel
	} from "../../model/UserInfoModel.js";
	import {
		QuerBuildInfo,QuerBuildTrend,
		QueryAroundResidentialAreaPrice,
		GetCityPriceTrend
	} from "../../net/evaluate/GetHousePriceTrend.js";
	import {
		ErHouseListItem,
		HouseListAgentItem,
		Const
	} from "../../utils/Const";
	import erHouseListItem from "../../components/erHouseListItem.vue";
	import villageExpert from "../../components/villageExpert.vue";
	import {
		GetVillageExpertInfo
	} from "../../net/evaluate/GetVillageExpertInfo.js";
	const wxCharts = require('../../utils/wxchartsNew.js');

	class PriceTrendItem {
		buildName = ""; // 小区名称
		buildId = ""; // 小区id
		totalPrice = null; // 总价 例如： 800 （单位:万）
		changePriceVal = ""; // 变化的价钱 例如： -5（单位:万）
		changePriveBiLi = ""; // 变化的比例 例如： 2.72 （单位: %）
		room = ""; // 几室 例如：3（单位: 室）
		area = ""; // 面积 例如： 49（单位: ㎡） 
		currentFloor = ""; // 当前楼层 例如： 3 （单位: 层）
		allFloor = ""; // 总楼层 例如： 70 （单位: 层）
		avgPrice= "";	//小区均价
	}

	let windowWidth = 320;
	let canvaArea = null;
	export default {
		data() {
			return {
				buildName:'',
				regionName:'',
				cityName:'',
				houseAvg:0,
				ratioByLastMonthForPrice:0,
				ratioByLastYearForPrice:0,
				item: new PriceTrendItem(),
				erHouse: {
					averagePrice: "0",
					trendRatio: "0",
					trend: 0
				},
				houseList: [],
				villageExpertItem: {},
				loading: true,
				noDataShow: false,
				havePriceTrend: false,  //  是否有价格走势
			}
		},

		components: {
			erHouseListItem,
			villageExpert
		},

		onLoad(params) {
			if (params.buildName) {
				this.item.buildName = params.buildName;
				this.item.buildId = params.buildId;
				this.item.room = params.room;
				this.item.area = params.area;
				this.item.currentFloor = params.currentFloor;
				this.item.allFloor = params.allFloor;
				uni.setNavigationBarTitle({
					title: params.buildName || "评估参考价"
				});
			}
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					windowWidth = res.windowWidth;
				},
				complete: function() {
					that.initPriceTrend();
				}
			});
		},
		onReady() {
			new this.SetH5BrowerTitle().init();
			document.title="房价参考价"
			if(typeof(window.zshft) != 'undefined'){
			    window.zshft.setVcTitle('房价参考价');
			}else if(typeof(window.kdb) != 'undefined'){
				window.kdb.setVcTitle('房价参考价');
			}
		},

		methods: {
			initPriceTrend() {
				let item = new GpsInfoModel().getModel("cityInfo");
				let me = new UserInfoModel().getModel("me") || {};
				let requestApi = {
					buildId: this.item.buildId
				};
				if (item.cityId) {
					requestApi["cityId"] = item.cityId;
				}
				console.log(1111)
				this.loading = true;
				uni.showLoading({
					title: "加载中..."
				});
				Promise.all([
					new QuerBuildTrend(requestApi).send(),
					new QuerBuildInfo(requestApi).send(),
					new GetCityPriceTrend(requestApi).send(),
					new QueryAroundResidentialAreaPrice(requestApi).send()
				])
					.then(res => {
						console.log('---res---',res);
						this.loading = false;
						uni.hideLoading();
						this.drawPriceTrendCanvas(res[0].data || {});
						this.drawTopInfo(res[1].data || {});
						this.drawErHouse(res[2].data || {})
						this.drawHouseList(res[3].data || {});
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
				let unitPrice = res.avgPrice ? Number(res.avgPrice) : 0;
				let area = this.item.area ? Number(this.item.area) : 0;
				let totalPrice = parseInt(unitPrice * area / 10000);
				
				this.noDataShow = false;
				
				this.item.avgPrice = unitPrice;
				this.houseAvg=parseInt(totalPrice * area)
				
				// 环比
				res.ratioByLastMonthForPrice = res.ratioByLastMonthForPrice ? Number(res.ratioByLastMonthForPrice) : 0;
				this.ratioByLastMonthForPrice=res.ratioByLastMonthForPrice*100;
				
				// 同比
				res.ratioByLastYearForPrice = res.ratioByLastYearForPrice ? Number(res.ratioByLastYearForPrice) : 0;
				this.ratioByLastYearForPrice=res.ratioByLastYearForPrice*100;
				
				this.item.totalPrice = totalPrice;
				// if (!totalPrice || totalPrice == null) {
				// 	this.noDataShow = true;
				// } else {
				// 	this.noDataShow = false;
				// }
				if (res.ratioByLastMonthForPrice) {
					this.item.changePriceVal = parseFloat((totalPrice / (1 +
							parseFloat((res.ratioByLastMonthForPrice || 0)))) *
						(res.ratioByLastMonthForPrice || 0)).toFixed(1);
				}
				this.item.changePriveBiLi = Math.abs(parseFloat(res.ratioByLastMonthForPrice * 100).toFixed(2));
			},
			
			// 价格走势
			drawPriceTrendCanvas(res = {}) {
				let timeArr = [];
				let cityArr = [];
				let houseArr = [];
				let regionArr = [];
				(res.cityList || []).map(item => {
					if (item.markerMonth) {
						cityArr.push(item.price);
						timeArr.push(item.markerMonth.substr(item.markerMonth.length - 2, item.markerMonth.length - 1) + '月');
					}
				});
				(res.buildList || []).map(item => {
					houseArr.push(item.price);
				});
				(res.regionList || []).map(item => {
					regionArr.push(item.price);
				});
				if (timeArr.length === 0) return;
				
				timeArr = timeArr.length > 6 ? timeArr.slice(timeArr.length - 6, timeArr.length) : timeArr;
				cityArr = cityArr.length > 6 ? cityArr.slice(cityArr.length - 6, cityArr.length) : cityArr;
				houseArr = houseArr.length > 6 ? houseArr.slice(houseArr.length - 6, houseArr.length) : houseArr;
				regionArr = regionArr.length > 6 ? regionArr.slice(regionArr.length - 6, regionArr.length) : regionArr;
				if (timeArr.length + cityArr.length + houseArr.length + regionArr.length > 0) {
					this.havePriceTrend = true;
				} else {
					this.havePriceTrend = false;
				}
				this.buildName = res.buildName;
				this.regionName =res.cityName;
				this.cityName = res.regionName;
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
				let chaVal = parseInt(chaMaxVal) - parseInt(chaMinVal) || 0;
				chaVal = 1000;
				if (chaMinVal > 30000) {
					chaVal = 5000;
				}
				let minVal = parseInt(chaMinVal) - chaVal < 0 ? 0 : parseInt(chaMinVal) - chaVal;
				let maxVal = parseInt(chaMaxVal) + chaVal || 0;
				let chartWidth = windowWidth;
				let chartHeight = 200;
				
				let xAxis = {
					disableGrid: true,
					fontColor: '#acb1b9',
					gridType: 'dash',
					dashLength: 3,
					gridColor: '#f1f3ff',
				};
				let yAxis = {
					format: function(e) {
						e = e ? Number(e) : 0;
						if (!e) return '0';
				
						return Number(e / 10000).toFixed(1) + '万';
					},
					min: minVal,
					max: maxVal,
					gridType: 'dash',
					dashLength: 4,
					gridColor: '#f1f3ff',
					fontColor: '#acb1b9',
					height: 10,
					lineWidth: 0.2
				};
				let animation = true;
				
				canvaArea = new wxCharts({
					$this: this,
					canvasId: 'lineCanvas',
					type: 'area',
					legend: false,
					dataLabel: false,
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: 1,
					categories: timeArr,
					animation: animation,
					series: [
						{
							data: houseArr,
							name: res.buildName,
							color: '#ffb109',
							lineWidth: 1.5,
							shapeStyle: {
								img: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_huang.png',
								width: 32,
								height: 32
							}
						},
						{
							data: cityArr,
							name: res.cityName,
							color: '#37bc84',
							lineWidth: 1.5,
							shapeStyle: {
								img: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_green.png',
								width: 32,
								height: 32
							}
						},
						{
							data: regionArr,
							name: res.regionName,
							color: '#fa5741',
							lineWidth: 1.5,
							shapeStyle: {
								img: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_red.png',
								width: 32,
								height: 32
							}
						}
					],
					// 渐变色配置
					backgroudStyle: {
						show: true,
						startColor: '#ffffff',
						endColor: '#fffbe8',
						// 配置了img则背景渐变色无效
						img: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/trend_bg.png'
					},
					tooltip: {
						option: {
							background: '#191f25',
							split: {
								color: '#ffb109',
								lineWidth: 0
							},
							showLegend: false,
							color: '#fff'
						}
					},
					xAxis: xAxis,
					yAxis: yAxis,
					width: chartWidth,
					height: chartHeight,
					dataPointShape: true
				});
			},
			touchArea(e){
				canvaArea.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			
			getMinMaxVal(cityArr) {
				let forMinVal = 0;
				let forMaxVal = 0;
				for (let i = 0; i < cityArr.length; i++) {
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
			
			// 城市二手房均价 环比
			drawErHouse(res = {}){
				let list = res.list || [];
				let item = list.pop();
				this.erHouse = {
					averagePrice: item.price || 0,
					trendRatio: item.trendRatio>0?item.trendRatio : -(item.trendRatio) || 0,
					trend: item.trendRatio>0?1:-1
				}
			},
			
			// 附近小区均价列表
			drawHouseList(res = {}) {
				let houseList = [];
				let list = res.list || [];
				for (let i = 0; i < list.length; i++) {
					let dataItem = list[i] || {};
					let item = new ErHouseListItem();
					if (!dataItem.buildId) return null;

					let tags = (dataItem.houseTagDesc &&
							dataItem.houseTagDesc.indexOf("|") >= 0) ?
						dataItem.houseTagDesc.split("|") : [];
					if (tags.length > 3) {
						tags = tags.slice(0, 3);
					}
					item.buildId = dataItem.buildId;
					item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
					item.cityId = dataItem.cityId || "";
					item.caseType = dataItem.caseType || "";
					item.houseId = dataItem.houseId || "";
					item.reSource = dataItem.reSource || "";
					item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
					item.houseTitle = dataItem.houseSubject || "";
					item.houseTing = (dataItem.houseRoom ? dataItem.houseRoom + "室" : "") +
						(dataItem.houseWei ? dataItem.houseWei + "卫" : "");
					item.houseArea = dataItem.houseArea || "";
					item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
					item.houseName = dataItem.buildName || "";
					item.houseTotalPrice = dataItem.houseTotalPrice || "";
					item.houseTotalPriceUnit = dataItem.houseTotalPrice ?
						(dataItem.priceUnitCn || "") : "";
					item.housePriceOfArea = dataItem.avgPrice || "";
					item.housePriceOfAreaUnit = dataItem.avgPrice ? "元/m²" : "";
					item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
					item.hasVideo = !!(dataItem.videoNum && dataItem.videoNum > 0);
					item.houseTags = tags;
					item.houseUseage = dataItem.houseUseage || "";
					item.houseUseageCn = dataItem.houseUseageCn || "";
					item.chainRatio = dataItem.ratioByLastMonthForSalePrice*100 || '';
					item.trend = dataItem.trend || '';
					houseList.push(item);
				}
				this.houseList = houseList;
			},

			// 我要贷款
			wantDaiKaun() {
				uni.navigateTo({
					url: "/pages/webView/webView?bgColor=#ff6300&color=#ffffff&" +
						"url=https://zdzfapi.haofang.net/App/Index/loanApplyIndex" +
						"&title=悠居客贷款查询"
				});
			},

			gobackBtn() {
				document.title="房价评估"
				if(typeof(window.zshft) != 'undefined'){
				    window.zshft.setVcTitle('房价评估');
				}else if(typeof(window.kdb) != 'undefined'){
					window.kdb.setVcTitle('房价评估');
				}
				uni.navigateBack({
					delta: 1
				});
			},
			
			jumpDetail(item){
				console.log("item: " ,item);
				if(!item.buildId){return}
				console.log("item: " ,item);
				uni.navigateTo({
					url: "./villagePriceTrend?buildName=" + item.houseName + "&buildId=" + item.buildId+"&cityId="+item.cityId
				});
			},
			
			
		},
	}
</script>

<style>
	.new_title{
		font-size: 36upx;
		color: #191f25;
		margin-left: 40upx;
		font-weight: bold;
	}
	.house-list {
		height: 130upx;
		border-top: solid 1px #ededed;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.m-build-name{
		font-size: 36upx;
		color: #191f25;
		padding: 50upx 0 0upx 40upx;
		
	}
	.house-list-left {}

	.house-list-title {
		font-size: 32upx;
		color: #191f25;
	}
	.house-list-title span{
		padding-left: 15upx;
	}
	.house-list-data {
		font-size: 28upx;
	}

	.house-list-data-img {
		width: 20upx;
		height: 12upx;
		vertical-align: middle;
		margin-left: 10upx;
	}

	.house-list-right {
		height: 24upx;
		margin-top: -24upx;
	}
	.house-chain-ratio{
		font-size: 24upx;
	}
	
	.house-list-right-img {
		width: 13upx;
		height: 24upx;
		margin-left: 16upx;
	}
	.u-go-up{
		color: #fa5741;
	}
	.u-lower{
		color: #44bc6e;
	}
	.num_change_view {
		/* width:100%; */
		height: 180upx;
		background: #fff;
		box-sizing: border-box;
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
		border-radius: 12upx;
		margin: 50upx 40upx;
	}

	.num_change_view-new {
		height: 180upx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12upx;
		border: solid 1px #E1E2E3;
		margin: 50upx 40upx;
	}

	.num_change_item {
		width: 100%;
		height: 100%;
		position: relative;
		padding-left: 36upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.num_change_item:last-child::after {
		content: "";
		display: none;
	}

	.num_change_item::after {
		content: "";
		position: absolute;
		right: 0;
		top: 50%;
		width: 2upx;
		height: 84upx;
		transform: translateY(-50%);
		background: #ECECEC;
	}

	.num_change_title {
		font-size: 24upx;
		color: #89909D;
		line-height: 50upx;
		color: #a3a5a8;

		/* margin-top: 25upx; */
	}

	.num_change_num {
		/* 	line-height: 48upx;
		margin-top: 10upx; */
		font-size: 50upx;
		/* font-weight: bold; */
		color: #101D36;
	}

	.top_view {
		width: 690upx;
		height: 340upx;
		background: -webkit-linear-gradient(left, #FC9813, #FFB009);
		/* padding: 64upx 0 0 40upx; */
		box-sizing: border-box;
		margin: 30upx;
		border-radius: 20upx;
		box-shadow: 0px 2upx 30upx 0px rgba(253, 162, 15, 0.55);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.top_price_view {
		color: #FFFFFF;
		margin-top: 18upx;
		min-height: 94upx;
	}

	.top-view-bottom {
		color: #ffffff;
		font-size: 24upx;
	}

	.top-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 20upx;
	}

	.top-ips {
		font-size: 24upx;
		padding: 0 30upx;
		color: #c0c1c3;
	}

	.left-margin {
		margin-left: 60upx;
	}

	.right-margin {
		margin-right: 60upx;
	}

	.no_price {
		font-size: 40upx !important;
	}

	.top_price {
		font-size: 48upx;
		font-weight: bold;
		position: relative;
		top: 16upx;
	}

	/* #ifdef H5 */
	.top_price {
		/* margin-bottom: -14upx; */
		top: 0;
	}

	/* #endif */
	.top_price_unit {
		margin-right: 17upx;
	}

	.top_build_name {
		font-size: 30upx;
		line-height: 40upx;
		font-weight: bold;
		color: #FFFFFF;
		margin-top: 28upx;
		text-align: center;
	}

	.top_build_name span {
		font-size: 24upx;
		opacity: 0.6;
	}

	.top_house_des {
		line-height: 44upx;
		margin-top: 6upx;
		color: #ffc899;
		font-size: 30upx;
	}

	.top_house_room {
		padding-right: 16upx;
		box-sizing: border-box;
		position: relative;
	}

	.top_house_room::after,
	.top_house_area::after {
		content: "";
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
		width: 2upx;
		height: 21upx;
		background: #ffc899;
		flex-shrink: 0;
	}

	.no_chart_view {
		height: 30upx;
		flex-shrink: 0;
		width: 100%;
	}

	.top_house_area {
		padding: 0 16upx;
		box-sizing: border-box;
		position: relative;
	}

	.top_house_floor {
		padding-left: 16upx;
		box-sizing: border-box;
	}

	/* 价格走势 */
	.price_trend_view {
		position: relative;
		width: 100%;
		margin-top: 54upx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin-bottom: 20upx;
	}
	
	.price-content{
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		padding-left: 70upx;
		margin-bottom: 30upx;
	}
	
	.price_trend_title {
		/* width: 100%; */
		height: 86upx;
		color: #101d36;
		font-size: 40upx;
		font-weight: bold;
		padding-left: 40upx;
		box-sizing: border-box;
		line-height: 86upx;
		padding-right: 40upx;
	}
	
	.price-trend-titel {
		font-size: 24upx;
		color: #000000;
		margin-right: 30upx;
		position: relative;
		margin-right: 40upx;
	}
	
	/* .price-trend-titel::before{
				content: "";
				width: 13upx;
				height: 13upx;
				border-radius: 50%;
				background: #5786f2;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				left: -20upx;
			} */
	.radius-1::before {
		content: "";
		width: 13upx;
		height: 13upx;
		border-radius: 50%;
		background: #ffb109;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: -20upx;
	}
	
	.radius-2::before {
		content: "";
		width: 13upx;
		height: 13upx;
		border-radius: 50%;
		background: #37bc84;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: -20upx;
	}
	
	.radius-3::before {
		content: "";
		width: 13upx;
		height: 13upx;
		border-radius: 50%;
		background: #fa5741;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: -20upx;
	}

	/* .price_trend_title {
		width: 100%;
		height: 86upx;
		color: #101d36;
		font-size: 36upx;
		font-weight: bold;
		padding-left: 40upx;
		box-sizing: border-box;
		line-height: 86upx;
		padding-right: 40upx;
	} */

	.price-trend-jia {
		font-size: 26upx;
		color: #a3a5a8;
		margin-left: 40upx;
	}

	.price_trend {
		height: 210px;
		/* border-bottom:10px solid #f6f6f6; */
		position: relative;
		padding-left: 19upx;
		padding-right: 40upx;
		margin-bottom: 40upx;
		display: flex;
		box-sizing: border-box;
	}

	/* 房源 */
	/* .er_last_item >>> .er_house_item {
		border-bottom: none;
	} */
	.house_list_view {
		padding: 0 40upx;
		box-sizing: border-box;
		width: 100%;
		background: #FFFFFF;
		margin-bottom: 20upx;
	}

	.house_list_title {
		line-height: 60upx;
		color: #101D36;
		font-size: 36upx;
		font-weight: bold;
		/* margin-bottom: -23upx; */
	}

	.look_more {
		font-size: 24upx;
		color: #7A8190;
		font-weight: normal;
	}

	.right_arrow {
		width: 14upx;
		height: 24upx;
		margin: auto 0 auto 11upx;
	}

	/* 底部按钮 */
	.bootom_view {
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

	.dai_kuan_view {
		width: 235upx;
		text-align: center;
		margin-right: 30upx;
		flex-shrink: 0;
	}

	.dai_kuan_icon {
		width: 44upx;
		height: 47upx;
		flex-shrink: 0;
		margin: 0 auto;
	}

	.dai_kuan_text {
		color: #101d36;
		font-size: 26upx;
		margin-top: 10upx;
	}

	.want_view {
		width: 100%;
	}

	.want_view view {
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		border-radius: 10upx;
		box-sizing: border-box;
		overflow: hidden;
		text-align: center;
		color: #FFFFFF;
		font-size: 30upx;
		margin: auto 0;
		font-weight: bold;
	}

	.want_view .want_buy {
		background: #ff9402;
		background: -webkit-linear-gradient(left, #ffcb00, #ff9402);
		margin-right: 14upx;
	}

	.want_view .want_lease {
		background: #ab7f2e;
		background: -webkit-linear-gradient(left, #ff8400, #ab7f2e);
	}

	.empty_bottom {
		height: 180upx;
		width: 100%;
	}

	.expert_view {
		padding: 40upx;
		box-sizing: border-box;
	}

	/* 暂无数据 */
	.no-data-box {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100000;
	}

	.no-img {
		position: relative;
		top: 300upx;
		margin: 0 auto;
		width: 298upx;
		height: 322upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/trendImg/no-data_new.png)no-repeat center;
		background-size: 100%;
	}

	.goback-btn {
		position: relative;
		top: 350upx;
		margin: 0 auto;
		width: 288upx;
		height: 90upx;
		text-align: center;
		line-height: 90upx;
		background: #fcde15;
		color: #191f25;
		font-size: 30upx;
		border-radius: 10upx;
	}
</style>
