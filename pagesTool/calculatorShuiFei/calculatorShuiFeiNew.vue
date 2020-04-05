<template>
	<view class="resultView">
		<!--新版UI计算结果-->
		<view class="res_cont">
			<view class="res_cont_view">

				<view class="flexRowStart">
					<!--文字展示-->
					<view class="resultTextCont">
					
						<view v-show="newErHouseTabIndex == 1">
							<view class="flexRowCenter">
								<view style="background: #5ea5fc;" class="resultPoint"></view>
												
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">契税(元)<br><span>{{ formData[topTabCurrentIndex].qiShui }}</span></view>
									</view>
								</view>
							</view>
							
							<view class="flexRowCenter">
								<view style="background: #ff9f9c;" class="resultPoint"></view>
					
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">公证费(元)<br><span>{{ formData[topTabCurrentIndex].gongZhengShui }}</span></view>
									</view>
								</view>
							</view>
					
					
							<view class="flexRowCenter">
								<view style="background: #fad75c;" class="resultPoint"></view>
					
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">产权手续费(元)<br><span>{{ formData[topTabCurrentIndex].weiTuoChanPanShouXuFei }}</span></view>
									</view>
								</view>
							</view>
					
							<view class="flexRowCenter">
								<view style="background: #84dd60;" class="resultPoint"></view>
					
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">买卖手续费(元)<br>
										<span>{{ formData[topTabCurrentIndex].buyMaiShouXuFei }}</span></view>
									</view>
								</view>
							</view>
					
							<!-- <view class="flexRowCenter">
								<view style="background: #cc8bee;" class="resultPoint"></view>
					
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">维修基金费(元)<br>
										<span>{{ formData[topTabCurrentIndex].weiXiuJiJinFei }}</span></view>
									</view>
								</view>
							</view> -->
						</view>
					
						<view v-show="newErHouseTabIndex == 2">
					
							<view class="flexRowCenter">
								<view style="background: #5ea5fc;" class="resultPoint"></view>
					
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">契税(元)<br>
										<span>{{ formData[topTabCurrentIndex].qiShui }}</span></view>
									</view>
								</view>
							</view>
							
							<view class="flexRowCenter">
								<view style="background: #ff9f9c;" class="resultPoint"></view>
												
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">增值税(元)<br>
										<span>{{ formData[topTabCurrentIndex].zengZhiShui }}</span></view>
									</view>
								</view>
							</view>
												
							<view class="flexRowCenter">
								<view style="background: #fad75c;" class="resultPoint"></view>
					
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">个人所得税(元)<br>
										<span>{{ formData[topTabCurrentIndex].mySuoDeShui }}</span></view>
									</view>
								</view>
							</view>
					
							
							<!-- <view class="flexRowCenter">
								<view style="background: #37adff;" class="resultPoint"></view>
					
								<view class="flexRowSpaceBetween resultPriceView">
									<view class="flexRowStart">
										<view class="resultPriceLabel_five resultPriceLabel">综合地价税(元)<br>
										<span>{{ formData[topTabCurrentIndex].zongHeDiJiaShui }}</span></view>
									</view>
								</view>
							</view> -->
						</view>
					
					</view>
					<!-- 图表-->
					<div class="canvasView" id="newHouse_pieChartId"></div>
					<!-- <canvas  class="canvasView"
					 canvas-id="newHouse_pieChartId" id="newHouse_pieChartId"></canvas> -->
				</view>
				
				<view class="bottom">
					<view class="bottom-content">
						<view class="bottom-content-titel">房款总价(万元)</view>
						<view class="bottom-content-money">{{ formData[topTabCurrentIndex].totalPrice ? parseInt(formData[topTabCurrentIndex].totalPrice) : 0 }}</view>
					</view>
					<view class="bottom-content">
						<view class="bottom-content-titel">税金总额(元)</view>
						<view class="bottom-content-money">{{ formData[topTabCurrentIndex].shuiFeiTotal }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tps">以上结果仅供参考，请以当地实际情况为准</view>
	</view>
</template>
<script>
	import { CalculatorModel } from "@/model/CalculatorModel.js";
	// const wxCharts = require('../../utils/wxcharts.js');
	const echarts = require('../../utils/echarts.min.js');

	export default {
		data(){
			return{
				newErHouseTabIndex:1,
				topTabCurrentIndex:3,
				formData:{}
			}
		},
		methods:{
			// 图表
			upEchartNoZuHe() {
					let chartIdMap = {
						0: "pieChartId"
						,1: "pieChartId"
						,2: "pieChartId"
						,3: "newHouse_pieChartId"
					};
					let myChart = echarts.init(document.getElementById(chartIdMap[this.topTabCurrentIndex]));
					let formData = this.formData;
					
					// 优化处理
					if(formData.liXiPrice == 'NaN'){ formData.liXiPrice = 0 }
					if(formData.monthPrice == 'NaN'){ formData.monthPrice = 0 }
					
					let seriesNew =  [
						{value: parseInt(formData.liXiPrice)}
						,{value: parseInt(formData.daiKuanPrice)}
					];
					let colorNew=['#f6cf41','#5da8fe'];
					if (Number(this.topTabCurrentIndex) === 3
						&& Number(this.newErHouseTabIndex) === 1) {
						seriesNew = [
							{value: parseInt(formData[this.topTabCurrentIndex].qiShui)}
							,{value: parseInt(formData[this.topTabCurrentIndex].gongZhengShui)}
							,{value: parseInt(formData[this.topTabCurrentIndex].weiTuoChanPanShouXuFei)}
							,{value: parseInt(formData[this.topTabCurrentIndex].buyMaiShouXuFei)}
							// ,{value: parseInt(formData[this.topTabCurrentIndex].weiXiuJiJinFei)}
						];
						colorNew=["#5ea5fc","#ff9f9c","#fad75c","#84dd60"]
					}
					if (Number(this.topTabCurrentIndex) === 3
						&& Number(this.newErHouseTabIndex) === 2) {
						seriesNew = [
							// {value: parseInt(formData[this.topTabCurrentIndex].gongBenYinHuaShui)}
							{value: parseInt(formData[this.topTabCurrentIndex].qiShui)}
							,{value: parseInt(formData[this.topTabCurrentIndex].zengZhiShui)}
							,{value: parseInt(formData[this.topTabCurrentIndex].mySuoDeShui)}
							// ,{value: parseInt(formData[this.topTabCurrentIndex].zongHeDiJiaShui)}
						];
						colorNew=["#5ea5fc","#ff9f9c","#fad75c"]
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
							color:colorNew,
							data: seriesNew
						}
					]
				})
			}
		},
		onLoad(options) {
			this.newErHouseTabIndex=options.newErHouseTabIndex
			this.formData=new CalculatorModel().getModel("formData");
		},
		onReady() {
			new this.SetH5BrowerTitle().init();
			this.upEchartNoZuHe()
		},
		onShow(){
			document.title="税金明细"
			if(typeof(window.zshft) != 'undefined'){
			    window.zshft.setVcTitle('税金明细');
			}else if(typeof(window.kdb) != 'undefined'){
				window.kdb.setVcTitle('税金明细');
			}
		},
	}
</script>
<style>
	/*结果*/
	.tps{
		font-size: 24upx;
		color: #c0c1c3;
		margin-top: 30upx;
		text-align: center;
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
		margin-top: 30upx;
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
	.resultPriceView span{
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
	.bottom{
		display: flex;
		border-top: 1upx solid #f0f3f5;
		height: 200upx;
		align-items: center;
	}
	.bottom-content{
		width: 50%;
		display: flex;
		text-align: center;
		align-content: center;
		flex-direction: column;
	}
	.bottom-content-titel{
		font-size: 24upx;
		line-height: 33upx;
		color: #a3a5a8;
		opacity: 0.8;
		margin-bottom: 30upx;
	}
	.bottom-content-money{
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
