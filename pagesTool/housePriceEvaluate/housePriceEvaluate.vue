<template>
	<view>
		<view class="evaluate_top_view">
			<image src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/evaluate/evaluate_bg.png" mode="aspectFill"></image>

			<view class="f_c_s evaluate_top_cont">
				<view class="f_r_s name_monthVal">
					<view>{{ item.cityName }}</view>
					<view class="top_point"></view>
					<view>{{ item.monthVal }}月参考均价</view>
				</view>

				<view class="unit_price"><text class="price_val">{{ item.unitPrice }}</text><text class="unit">元/平</text></view>
			</view>
		</view>

		<view class="evaluate_cont">
			<view class="num_change_view f_r_c">
				<view class="num_change_item">
					<view class="num_change_title">昨日新增房(套)</view>
					<view class="num_change_num">{{ item.newAddHouseNum != undefined && !item.newAddHouseNum ? "暂无" : item.newAddHouseNum }}</view>
				</view>

				<view class="num_change_item">
					<view class="num_change_title">昨日新增客(人)</view>
					<view class="num_change_num">{{ item.newAddKeNum != undefined && !item.newAddKeNum ? "暂无" : item.newAddKeNum }}</view>
				</view>

				<view class="num_change_item">
					<view class="num_change_title">昨日带看量(次)</view>
					<view class="num_change_num">{{ item.daiKanNum != undefined && !item.daiKanNum ? "暂无" : item.daiKanNum }}</view>
				</view>
			</view>

			<view class="canvas_cont">
				<view class="canvas_title f_r_b">
                    价格走势

                    <view class="canvas_cityName f_r_e">
                        <view class="canvas_point"></view>
                        {{ item.cityName }}
                    </view>
                </view>

				<view class="canvas_view">
                    <canvas class="lineCanvas" id="lineCanvas" canvas-id="lineCanvas"
                        style="width:100%;height:100%;transform:scale(1)"></canvas>
				</view>
			</view>

			<view class="f_r_b canvas_des">
				<view>数据来源：由Saas系统提供</view>
				<view>更新时间：{{ item.upTime }}</view>
			</view>

			<view class="evaluate_btn_view">
				<view @click="evaluateConditionChoose" class="evaluate_btn global-confirm-btn">查看我感兴趣的小区房价</view>
			</view>

			<view class="empty_view"></view>
		</view>
    </view>
</template>

<script>
    import wxCharts from "@/utils/wxchartsNew.js";
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import { GetCityPriceTrend } from "../../net/evaluate/GetCityPriceTrend.js";

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
	let windowWidth = 320;

	export default {
		data() {
			return {
				cityId: "",
				item: new EvaluateItem()
			}
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad() {
			this.initData();
		},

		methods: {
			initData() {
				this.initCityInfo();
				let that = this;
				uni.getSystemInfo({
					  success: function (res) {
						windowWidth = res.windowWidth;
					  },
					  complete: function() {
						  that.initPageData();
					  }
				});
			},

			initCityInfo() {
				let cityInfo = new GpsInfoModel().getModel("cityInfo");
				this.cityName = cityInfo.cityName || "";
				this.cityId = cityInfo.cityId || "";
			},

			initPageData() {
				if(!this.cityId) {
					return Promise.reject("没有cityId");
				}

				return new GetCityPriceTrend({cityId: this.cityId}).send()
					.then(res => {
						let item = new EvaluateItem();
                        item.upTime = res.months;
						item.cityName = res.cityName || "";
						item.monthVal = res.months.slice(5);
						item.newAddHouseNum = res.houseNum ? Number(res.houseNum) : 0;
						item.newAddKeNum = res.custNum ? Number(res.custNum) : 0;
						item.daiKanNum = res.dkNum ? Number(res.dkNum) : 0;
						let index = 0;
						let currentPrice = 0;
						(res.list || []).map((info) => {
							if(info.priceMonths) {
								item.timeList.push(info.priceMonths.substr(info.priceMonths.length-2
									, info.priceMonths.length-1)+"月");
								item.priceList.push(parseInt(info.price));
							}
							if(index+1 <= (res.list || []).length-1 && info.price && info.price != 0
								&& (!(res.list || [])[index+1].price || (res.list || [])[index+1].price == 0)){
								currentPrice = info.price;
							}
							index++;
						});
						res.currentMonth = res.currentMonth ? Number(res.currentMonth) || "" : "";
						item.unitPrice = res.currentMonth || currentPrice || "";
						this.item = item;
						this.initChart();
					})
					.catch(err => {
						console.error(err);
						this.failModel();
					});
			},

			failModel() {
				uni.showModal({
					title: "温馨提示",
					content: "获取房价评估数据失败啦！请稍后重试。",
					confirmText: "我知道了",
					confirmColor: "#ab7f2e",
					showCancel: false
				});
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

			initChart() {
				if(!this.item || this.item.timeList.length == 0) return;

				let timeArr = this.item.timeList.length > 6
					? this.item.timeList.slice(this.item.timeList.length-6,this.item.timeList.length)
					: this.item.timeList;
				let cityArr = this.item.priceList.length > 6
					? this.item.priceList.slice(this.item.priceList.length-6,this.item.priceList.length)
					: this.item.priceList;
				uni.setNavigationBarTitle({
				  title: (this.item.cityName ? this.item.cityName + "房价评估报告" : "城市均价")
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
					"https://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_huang.png",
					"https://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/image_xian.png"
				]).then(imgs => {
					new wxCharts({
						$this:this,
						canvasId: "lineCanvas",
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
								name: this.item.cityName,
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
									color: "#fbcc5b",
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

			evaluateConditionChoose() {
				uni.navigateTo({
					url: "/pagesTool/housePriceEvaluate/evaluateConditionChoose"
				});
			}
		}
	}
</script>

<style>
    .canvas_cityName{
        position: relative;
        color: #101D36;
        font-size: 26upx;
        font-weight: normal;
        width: 200upx;
        text-align: right;
    }
    .canvas_point{
        width: 12upx;
        height: 12upx;
        margin: auto 12upx auto 0;
        border-radius: 100%;
		will-change: transform;
        overflow: hidden;
        background: #fbcc5b;
    }
	.evaluate_top_view{
		position: relative;
	}
	.evaluate_top_view image{
		width: 100%;
		height: 322upx;
	}
	.evaluate_top_cont{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		background: inherit;
		padding: 55upx 0 0 40upx;
		box-sizing: border-box;
		height: 100%;
		color: #FFFFFF;
	}
	.name_monthVal{
		line-height: 50upx;
		text-align: left;
		font-size: 30upx;
	}
	.top_point{
		width: 6upx;
		height: 6upx;
		background: #FFFFFF;
		overflow: hidden;
		margin: auto 15upx;
		border-radius: 6upx;
		will-change: transform;
	}
	.unit_price{
		font-size: 94upx;
		font-weight: normal;
        color: #FFFFFF;
        margin-left: 0;
		margin-top: 10upx;
	}
	.unit{
		font-size: 30upx;
		font-weight: normal;
	}
	.price_val{
		position: relative;
		bottom: -4upx;
		margin-right: 4upx;
	}
	.evaluate_cont{
		padding: 0 25upx;
		box-sizing: border-box;
		margin-top: -47upx;
		position: relative;
		z-index: 99;
	}
	.num_change_view{
		width:100%;
		height:180upx;
		background:#fff;
		box-sizing:border-box;
		box-shadow:0upx 10upx 50upx #ececec;
	}
	.num_change_item{
		width: 100%;
		height: 100%;
		position: relative;
		padding-left: 36upx;
		box-sizing: border-box;
	}
	.num_change_item:last-child::after{
		content: "";
		display: none;
	}
	.num_change_item::after{
		content: "";
		position: absolute;
		right: 0;
		top: 50%;
		width: 2upx;
		height: 84upx;
		transform: translateY(-50%);
		background: #ECECEC;
	}
	.num_change_title{
		font-size: 26upx;
		color: #89909D;
		line-height: 50upx;
		margin-top: 25upx;
	}
	.num_change_num{
		line-height: 48upx;
		margin-top: 10upx;
		font-size: 44upx;
		font-weight: bold;
		color: #101D36;
	}
	.lineCanvas{
		width: 100%;
		height: 100%;
	}
	.canvas_view{
		height:200px;
		padding-top:27upx;
		position:relative;
		margin-left: -20upx;
        margin-bottom: 20upx;
	}
	.canvas_title{
		width:100%;
		height:57upx;
		font-weight:bold;
		color:#101d36;
		font-size:34upx;
		line-height:57upx;
		box-sizing:border-box;
	}
	.canvas_cont{
		width:100%;
		background:#fff;
		margin-top:43upx;
		padding: 0 15upx;
		box-sizing:border-box;
	}
	.canvas_des{
		padding: 0 15upx;
		width:100%;
		box-sizing:border-box;
		font-size:22upx;
		color:#8e94a1;
	}
	.evaluate_btn_view{
		width: 100%;
		padding: 0 15upx;
		box-sizing: border-box;
	}
	.evaluate_btn{
		width:100%;
		height:100upx;
		line-height:100upx;
		background:#ff6f2e;
		background:-webkit-linear-gradient(left, #fe8e0d , #ff6f2e);
		color:#fff;
		text-align:center;
		font-size:32upx;
		display:flex;
		justify-content:center;
		align-items:center;
		margin-top:70upx;
		border-radius:10upx;
		will-change: transform;
		box-sizing:border-box;
	}
	.empty_view{
		height: 60upx;
		width: 100%;
	}
</style>
