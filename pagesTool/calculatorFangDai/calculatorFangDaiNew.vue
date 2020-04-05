<template>
	<!--计算结果-->
	<view class="resultView">
		<view class="result-title">等额本息</view>
		<!--新版UI计算结果-->
		<view class="res_cont">
			<view class="res_cont_view">

				<view class="flexRowStart">

					<!--文字展示-->
					<view class="resultTextCont">

						<view class="flexRowCenter">
							<view style="background: #5da8fe;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
								<view class="flexRowStart">
									<view class="resultPriceLabel">贷款总额(万元)<br>
										<span>{{ formDataBenXi.daiKuanPrice }}</span></view>

									<!-- <view class="resultPriceVal">{{ formData[topTabCurrentIndex].daiKuanPrice }}万</view> -->
								</view>
							</view>
						</view>

						<view class="flexRowCenter">
							<view style="background: #f6cf41;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
								<view class="flexRowStart">
									<view class="resultPriceLabel">支付利息(万元)<br>
										<span>{{ formDataBenXi.liXiPrice }}</span></view>

									<!-- <view class="resultPriceVal">{{ formData[topTabCurrentIndex].liXiPrice }}万</view> -->
								</view>
							</view>
						</view>


					</view>
					<!--图表-->
					<div class="canvasView" id="pieChartId"></div>
					
				</view>

				<view class="bottom">
					<view class="bottom-content">
						<view class="bottom-content-titel">还款总额(万元)</view>
						<view class="bottom-content-money">{{ Number(formDataBenXi.daiKuanPrice) + Number(formDataBenXi.liXiPrice) }}</view>
					</view>
					<view class="bottom-content">
						<view class="bottom-content-titel">月均还款(元)</view>
						<view class="bottom-content-money">{{ formDataBenXi.monthPrice }}</view>
					</view>
					<view class="bottom-content">
						<view class="bottom-content-titel">贷款年限(年)</view>
						<view class="bottom-content-money">{{ formDataBenXi.yearNum }}</view>
					</view>
				</view>

			</view>
		</view>

		<view class="result-title">等额本金</view>
		<!--新版UI计算结果-->
		<view class="res_cont">
			<view class="res_cont_view">

				<view class="flexRowStart">

					<!--文字展示-->
					<view class="resultTextCont">

						<view class="flexRowCenter">
							<view style="background: #5da8fe;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
								<view class="flexRowStart">
									<view class="resultPriceLabel">贷款总额(万元)<br>
										<span>{{ formDataBenJin[topTabCurrentIndex].daiKuanPrice }}</span></view>

									<!-- <view class="resultPriceVal">{{ formData[topTabCurrentIndex].daiKuanPrice }}万</view> -->
								</view>
							</view>
						</view>

						<view class="flexRowCenter">
							<view style="background: #f6cf41;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
								<view class="flexRowStart">
									<view class="resultPriceLabel">支付利息(万元)<br>
										<span>{{ formDataBenJin[topTabCurrentIndex].liXiPrice }}</span></view>

									<!-- <view class="resultPriceVal">{{ formData[topTabCurrentIndex].liXiPrice }}万</view> -->
								</view>
							</view>
						</view>


					</view>
					<!--图表-->
					<div class="canvasView" id="pieChartId2"></div>

				</view>

				<view class="bottom">
					<view class="bottom-content">
						<view class="bottom-content-titel">还款总额(万元)</view>
						<view class="bottom-content-money">{{ Number(formDataBenJin[topTabCurrentIndex].daiKuanPrice) + Number(formDataBenJin[topTabCurrentIndex].liXiPrice) }}</view>
					</view>
					<view class="bottom-content">
						<view class="bottom-content-titel">月均还款(元)</view>
						<view class="bottom-content-money">{{ formDataBenJin[topTabCurrentIndex].monthPrice }}</view>
					</view>
					<view class="bottom-content">
						<view class="bottom-content-titel">贷款年限(年)</view>
						<view class="bottom-content-money">{{ formDataBenJin[topTabCurrentIndex].yearNum }}</view>
					</view>
				</view>

			</view>
		</view>

	</view>

</template>

<script>
	import {
		CalculatorModel
	} from "@/model/CalculatorModel.js";
	// const wxCharts = require('../../utils/wxcharts.js');
	const echarts = require('../../utils/echarts.min.js');


	export default {
		data() {
			return {
				topTabCurrentIndex: 0,
				formDataBenXi: "",
				formDataBenJin: "",
				newErHouseTabIndex: 1
			}
		},
		methods: {

			// 图表
			upEchartNoZuHe() {
					let chartIdMap = {
						0: "pieChartId"
						,1: "pieChartId"
						,2: "pieChartId"
						,3: "newHouse_pieChartId"
					};
					let myChart = echarts.init(document.getElementById(chartIdMap[this.topTabCurrentIndex]));
				
					let formData = this.formDataBenXi;
					
					let seriesNew =  [
						{value: parseInt(formData.liXiPrice)}
						,{value: parseInt(formData.daiKuanPrice)}
					];
					if (Number(this.topTabCurrentIndex) === 3
						&& Number(this.newErHouseTabIndex) === 1) {
						series = [
							{data: parseInt(formData[this.topTabCurrentIndex].gongZhengShui)
								, color: "#6ebfff"}
							,{data: parseInt(formData[this.topTabCurrentIndex].qiShui)
								, color: "#ff70a0"}
							,{data: parseInt(formData[this.topTabCurrentIndex].weiTuoChanPanShouXuFei)
								, color: "#c3eaa4"}
							,{data: parseInt(formData[this.topTabCurrentIndex].buyMaiShouXuFei)
								, color: "#3a61a8"}
							,{data: parseInt(formData[this.topTabCurrentIndex].weiXiuJiJinFei)
								, color: "#b0753a"}
						];
					}
					if (Number(this.topTabCurrentIndex) === 3
						&& Number(this.newErHouseTabIndex) === 2) {
						series = [
							{data: parseInt(formData[this.topTabCurrentIndex].gongBenYinHuaShui)
								, color: "#ff70a0"}
							,{data: parseInt(formData[this.topTabCurrentIndex].yinHuaShui)
								, color: "#ffda7c"}
							,{data: parseInt(formData[this.topTabCurrentIndex].qiShui)
								, color: "#6ebfff"}
							,{data: parseInt(formData[this.topTabCurrentIndex].mySuoDeShui)
								, color: "#c3eaa4"}
							,{data: parseInt(formData[this.topTabCurrentIndex].zengZhiShui)
								, color: "#3a61a8"}
							,{data: parseInt(formData[this.topTabCurrentIndex].zongHeDiJiaShui)
								, color: "#b0753a"}
						];
					}
				myChart.setOption({
					series: [
						{
							name: '访问来源',
							type: 'pie',
							radius: ['30%', '70%'],
							avoidLabelOverlap: false,
							label: {
								normal: {
									show: false,
									position: 'center'
								},
								emphasis: {
									show: true,
									textStyle: {
										fontSize: '30',
										fontWeight: 'bold'
									}
								}
							},
							color:['#f6cf41','#5da8fe'],
							data: seriesNew
						}
					]
				})
			},
			upEchartNoZuHe2() {
				// let myChart = echarts.init(document.getElementById('pieChartIdNew'));
					let chartIdMap = {
						0: "pieChartId2"
						,1: "pieChartId2"
						,2: "pieChartId2"
						,3: "newHouse_pieChartId"
					};
					let myChart = echarts.init(document.getElementById(chartIdMap[this.topTabCurrentIndex]));
					let formData = this.formDataBenJin;
					let seriesNew =  [
						{value: parseInt(formData[this.topTabCurrentIndex].liXiPrice)}
						,{value: parseInt(formData[this.topTabCurrentIndex].daiKuanPrice)}
					];
					if (Number(this.topTabCurrentIndex) === 3
						&& Number(this.newErHouseTabIndex) === 1) {
						series = [
							{data: parseInt(formData[this.topTabCurrentIndex].gongZhengShui)
								, color: "#6ebfff"}
							,{data: parseInt(formData[this.topTabCurrentIndex].qiShui)
								, color: "#ff70a0"}
							,{data: parseInt(formData[this.topTabCurrentIndex].weiTuoChanPanShouXuFei)
								, color: "#c3eaa4"}
							,{data: parseInt(formData[this.topTabCurrentIndex].buyMaiShouXuFei)
								, color: "#3a61a8"}
							,{data: parseInt(formData[this.topTabCurrentIndex].weiXiuJiJinFei)
								, color: "#b0753a"}
						];
					}
					if (Number(this.topTabCurrentIndex) === 3
						&& Number(this.newErHouseTabIndex) === 2) {
						series = [
							{data: parseInt(formData[this.topTabCurrentIndex].gongBenYinHuaShui)
								, color: "#ff70a0"}
							,{data: parseInt(formData[this.topTabCurrentIndex].yinHuaShui)
								, color: "#ffda7c"}
							,{data: parseInt(formData[this.topTabCurrentIndex].qiShui)
								, color: "#6ebfff"}
							,{data: parseInt(formData[this.topTabCurrentIndex].mySuoDeShui)
								, color: "#c3eaa4"}
							,{data: parseInt(formData[this.topTabCurrentIndex].zengZhiShui)
								, color: "#3a61a8"}
							,{data: parseInt(formData[this.topTabCurrentIndex].zongHeDiJiaShui)
								, color: "#b0753a"}
						];
					}
				myChart.setOption({
					series: [
						{
							name: '访问来源',
							type: 'pie',
							radius: ['30%', '70%'],
							avoidLabelOverlap: false,
							label: {
								normal: {
									show: false,
									position: 'center'
								},
								emphasis: {
									show: true,
									textStyle: {
										fontSize: '30',
										fontWeight: 'bold'
									}
								}
							},
							color:['#f6cf41','#5da8fe'],
							data: seriesNew
						}
					]
				})
			}
		},
		onLoad(options) {
			this.topTabCurrentIndex = options.topTabCurrentIndex
			let formData = new CalculatorModel().getModel("formData")
			formData[0].monthPrice = Number(formData[0].monthPrice).toFixed(1)
			
			if(formData[0].liXiPrice == 'NaN'){formData[0].liXiPrice = 0}
			if(formData[0].monthPrice == 'NaN'){formData[0].monthPrice = 0}
			
			this.formDataBenXi = formData[0]
			this.formDataBenJin = formData[1]
			// 			console.log(new CalculatorModel().getModel("formData"));
		},
		onReady() {
			new this.SetH5BrowerTitle().init();
			this.upEchartNoZuHe()
			this.upEchartNoZuHe2()
			// document.title="税费明细"
			// if(typeof(window.zshft) != 'undefined'){
			//     window.zshft.setVcTitle('税费明细');
			// }else if(typeof(window.kdb) != 'undefined'){
			// 	window.kdb.setVcTitle('税费明细');
			// }
		}
	}
</script>

<style>
	/*结果*/
	.result-title {
		font-size: 32upx;
		color: #191f25;
		padding: 0 40upx;
		font-weight: bold;
	}

	.flexRowStart {
		display: flex;
	}

	.flexRowCenter {
		display: flex;
		justify-content: center;
	}

	.contentScrollView {
		padding-top: 30upx;
		padding-bottom: 60upx;
	}

	.resultView {
		width: 100%;
		margin-top: 30upx;
		background-color: #ffffff;
		box-sizing: border-box;
		padding-bottom: 30upx;
	}

	.result_tab_btn_view {
		padding: 0;
		box-sizing: border-box;
		flex-shrink: 0;
	}

	.result_tab_btn_view>.result_tab_btn_active {
		border-color: #ab7f2e;
		color: #ab7f2e;
	}

	.result_tab_btn {
		width: 173upx;
		height: 70upx;
		line-height: 70upx;
		background-color: #ffffff;
		color: #182024;
		text-align: center;
		font-size: 28upx;
		border: 1upx solid #d8d8d8;
		/*margin-bottom: 1upx;*/
	}

	.result_tab_btn_l {
		border-radius: 50upx 0 0 50upx;
		margin-left: 1upx;
	}

	.result_tab_btn_r {
		border-radius: 0 50upx 50upx 0;
		margin-right: 1upx;
	}

	.resultDesView {
		color: #b3b6be;
		font-size: 28upx;
		margin-top: 30upx;
	}

	.resultDes {
		width: 380upx;
		margin: 0 auto;
		text-align: center;
	}

	.canvasView {
		width: 150px;
		height: 150px;
		flex-shrink: 0;
		position: relative;
		margin-left: -55upx;
		margin-top: -50upx;
	}

	.canvas_title {
		position: absolute;
		left: 50%;
		top: 45%;
		transform: translate(-50%, -50%);
		color: #83868f;
		font-size: 32upx;
		text-align: center;
	}

	.canvas_val {
		position: absolute;
		left: 50%;
		top: 55%;
		transform: translate(-50%, -50%);
		color: #83868f;
		font-size: 32upx;
	}

	.resultTextCont {
		margin: 0 0 0upx 20upx;
	}

	.resultPriceView {
		height: 120upx;
		line-height: 40upx;
		font-size: 32upx;
		width: 370upx;
		color: #3c3c3c;
	}

	.resultPriceView span {
		color: #3c3c3c;
	}

	.resultPriceView .resultPriceLabel_five {
		width: 100%;
	}

	.resultPriceView .resultPriceLabel_five::after {
		content: "";
		display: inline-block;
		width: 175upx;
	}

	.resultPriceLabel {
		text-align: left;
		flex-shrink: 0;
		width: 100%;
		font-size: 30upx;
		color: #191f25;
	}

	.resultPriceVal {
		color: #10191d;
		font-size: 30upx;
		font-weight: bold;
	}

	.resultPoint {
		width: 12upx;
		height: 12upx;
		box-sizing: border-box;
		border-radius: 100%;
		margin: 12upx 12upx 0 -24upx;
	}

	.resultBottomDes {
		color: #b3b6be;
		font-size: 23upx;
		width: 100%;
		text-align: center;
		margin-top: 30upx;
		margin-bottom: 30upx;
	}


	/*税费计算*/
	.radioLabel {
		display: inline-block;
		margin-right: 50upx;
	}

	.radioLabel:last-child {
		margin-right: 0;
	}

	.radioView {
		margin: auto 10upx auto 0;
		position: relative;
		top: -3upx;
	}


	/*新版UI房贷计算结果*/
	.res_cont {
		padding: 0 40upx;
		box-sizing: border-box;
		margin-top: 30upx;
		margin-bottom: 60upx;
	}

	.res_cont_view {
		padding: 30upx 36upx 0;
		box-sizing: border-box;
		border-radius: 12upx;
		box-shadow: 0upx 0upx 10upx #e6e6e6;
		overflow: hidden;
	}

	.res_cont_title {
		line-height: 90upx;
		box-sizing: border-box;
		border-top: 1upx solid #f0f3f5;
	}

	.bottom {
		display: flex;
		border-top: 1upx solid #f0f3f5;
		height: 200upx;
		align-items: center;
	}

	.bottom-content {
		width: 47%;
		display: flex;
		text-align: center;
		align-content: center;
		flex-direction: column;
	}

	.bottom-content-titel {
		font-size: 24upx;
		line-height: 33upx;
		color: #a3a5a8;
		opacity: 0.8;
		margin-bottom: 30upx;
	}

	.bottom-content-money {
		font-size: 48upx;
		line-height: 33upx;
		color: #3c3c3c;
	}

	.res_cont_title_text {
		color: #8e94a1;
		font-size: 28upx;
	}

	.res_cont_title_detail {
		font-size: 24upx;
		color: #7a8190;
		margin-right: -8upx;
	}

	/*首付切换*/
	.first_pay_img {
		width: 41upx;
		height: 31upx;
		margin: auto 18upx;
		flex-shrink: 0;
	}

	.first_pay_des {
		flex-shrink: 0;
		color: #8e94a1;
		font-size: 28upx;
	}

	.change_radio_icon {
		width: 46upx;
		height: 46upx;
		margin: auto 0;
	}



	/*弹窗*/
	.calculatorToast {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		font-family: '微软雅黑';
		z-index: 99999;
	}

	.calculator_toast_view {
		display: flex;
		flex-direction: column;
		position: fixed;
		bottom: 0;
		left: 0;
		top: 50%;
		background-color: #FFFFFF;
		z-index: 999999;
		right: 0;
	}

	.calculator_toast_title {
		height: 100upx;
		line-height: 100upx;
		background: #fff;
		font-size: 32upx;
		border-bottom: 1upx solid #e5e5e5;
		box-sizing: border-box;
		flex-shrink: 0;
		padding: 0 40upx;
		display: flex;
		color: #101d36;
		flex-direction: row;
		justify-content: space-between;
	}

	.calculator_toast_title .calculator_toast_confirm {
		color: #ab7f2e;
	}

	.calculator_picker {
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 32upx;
		background: #fff;
		border-color: #ab7f2e;
	}

	.calculator_toast_picker_item {
		color: #ab7f2e;
		height: 50px;
		line-height: 50px;
	}

	.calculator_toast_item {
		color: #101d36;
		font-size: 32upx;
		text-align: center;
		height: 50px;
		line-height: 50px;
	}
</style>
