<template>
	<view>
		<!--顶部tab-->
		<scroll-view class="g-top-scroll-tab" scroll-x scroll-with-animation>
		    <block v-for="(item, index) in topTab" :key="index">
		      <button hover-class="none" @click="changeTopBar(item.index)"
		              :style="{width: item.width}" class="f-top-btn">
					<text :class="{ 'f-top-btn-active' : item.index === topTabCurrentIndex}"
						class="f-top-btn-text">{{ item.text }}</text>
		      </button>
		    </block>
		</scroll-view>

		<!--内容-->
		<view class="contentScrollView">
			<!--商业贷-->
			<view v-show="topTabCurrentIndex == 0">
				<view class="contentInfoView">
				  <view class="contentView">
					<!--贷款总价-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel">房屋售价</view>
					  </view>

					  <view style="width: 100%;" class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].totalPrice"
							   @input="totalPriceInputChange"
							   placeholder-class="input_placeholder"
							   class="inputView" placeholder="请输入房屋售价"/>

						<view v-if="formData[topTabCurrentIndex].totalPrice" class="unit">万</view>
					  </view>
					</view>

					<!--首付比例-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="flexRowSpaceBetween">
						  <view @click="changeFirstPayType"
							class="inputLabel one_four_width_label">{{ firstPayTextMap[firstPayTextMapIndex].title }}</view>

						  <view @click="changeFirstPayType" class="flexRowStart">
							  <image class="first_pay_img"
								src="http://cdn.haofang.net/static/wxPlusApp/yjk/first_pay.png"></image>
							  <view class="first_pay_des">{{ firstPayTextMap[firstPayTextMapIndex].des }}</view>
						  </view>
						</view>

						<view v-if="firstPayTextMapIndex == 2" class="flexRowEnd">
							<input maxlength="4" type="number"
								 :value="firstPayPriceNumber"
								 @input="firstPayPriceInputChange"
								 placeholder-class="input_placeholder"
								 class="inputView" placeholder="请输入首付金额"/>

							<view v-if="firstPayPriceNumber" class="unit">万</view>
						</view>

						<view v-if="firstPayTextMapIndex == 1" @click="showToast('firstPayToastViewShow')"
							class="flexRowEnd">
						  <view class="flexRowStart firstPayVal">{{ firstPayVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>

					<!--贷款总额-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel">贷款总额</view>
					  </view>

					  <view class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].daiKuanPrice"
							   disabled="true"
							   placeholder-class="input_placeholder"
							   class="inputView" placeholder="请输入贷款总额"/>

						<view v-if="formData[topTabCurrentIndex].daiKuanPrice" class="unit">万</view>
					  </view>

					</view>

					<!--贷款年限-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="inputLabel">贷款年限</view>

						<view class="flexRowEnd" @click="showToast('yearNumToastViewShow')">
						  <view class="flexRowStart firstPayVal">{{ yearNumVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>

					<!--利率-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="inputLabel">商贷利率</view>

						<view class="flexRowEnd" @click="showToast('businessLiLvToastViewShow')">
						  <view class="flexRowStart firstPayVal">{{ businessLiLvVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>
				  </view>

				  <!--开始计算-->
				  <view class="startCalculationView">
					<button hover-class="hoverClass"
							@click="startCalculation"
							class="startCalculation global-confirm-btn">开始计算</button>

					<view class="calculation_res_tips">此结果仅供参考，实际费用以当地缴费为准</view>
				  </view>
				</view>

				<!--计算结果-->
				<view class="resultView" v-show="startCalculatorMap[topTabCurrentIndex]">
				  <!--新版UI计算结果-->
				  <view class="res_cont">
					<view class="res_cont_view">

					  <view class="flexRowCenter">
						<view class="result_tab_btn_view flexRowCenter">
						  <button hover-class="hoverClass"
								  @click="resultTabChange(1)"
								  :class="{'result_tab_btn_active global-confirm-btn' : resultTabCurrentType == 1}"
								  class="result_tab_btn_l result_tab_btn">等额本息
						  </button>

						  <button hover-class="hoverClass"
								  @click="resultTabChange(2)"
								  :class="{'result_tab_btn_active global-confirm-btn' : resultTabCurrentType == 2}"
								  class="result_tab_btn_r result_tab_btn">等额本金
						  </button>
						</view>
					  </view>

					  <view class="flexRowStart">
						<!--图表-->
                        <!-- #ifndef MP-ALIPAY -->
                        <canvas v-show="!firstPayToastViewShow && !yearNumToastViewShow && !businessLiLvToastViewShow && !commonLiLvToastViewShow"
                        	width="150" height="150"
							class="canvasView" canvas-id="pieChartId"></canvas>
                        <!-- #endif -->
                        <!-- #ifdef MP-ALIPAY -->
                        <canvas v-show="!firstPayToastViewShow && !yearNumToastViewShow && !businessLiLvToastViewShow && !commonLiLvToastViewShow"
                        	width="150" height="150"
							class="canvasView" id="pieChartId"></canvas>
                        <!-- #endif -->

						<!--文字展示-->
						<view class="resultTextCont">
						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">房屋售价</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].totalPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">首付金额</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].firstPayPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view style="background: #5da8fe;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">贷款总额</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].daiKuanPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view style="background: #f6cf41;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">支付利息</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].liXiPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">利率</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].business_liLv }}%</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">月供</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].monthPrice }}元</view>
							  </view>
							</view>
						  </view>

						  <view v-show="resultTabCurrentType == 2" class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">每月递减</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].monthLessPrice }}元</view>
							  </view>
							</view>
						  </view>
						</view>
					  </view>
					</view>
				  </view>
				</view>
			  </view>

			<!--公积金贷-->
			<view v-show="topTabCurrentIndex == 1">
				<view class="contentInfoView">
				  <view class="contentView">
					<!--贷款总价-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel">房屋售价</view>
					  </view>

					  <view style="width: 100%;" class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].totalPrice"
							   @input="totalPriceInputChange"
							   placeholder-class="input_placeholder"
							   class="inputView" placeholder="请输入房屋售价"/>

						<view v-if="formData[topTabCurrentIndex].totalPrice" class="unit">万</view>
					  </view>
					</view>

					<!--首付比例-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						  <view class="flexRowStart">
							  <view @click="changeFirstPayType"
								class="inputLabel one_four_width_label">{{ firstPayTextMap[firstPayTextMapIndex].title }}</view>

							  <view @click="changeFirstPayType" class="flexRowStart">
								  <image class="first_pay_img"
									src="http://cdn.haofang.net/static/wxPlusApp/yjk/first_pay.png">
								  </image>
								  <view class="first_pay_des">{{ firstPayTextMap[firstPayTextMapIndex].des }}</view>
							  </view>
						  </view>

						  <view v-if="firstPayTextMapIndex == 2" class="flexRowEnd">
							  <input maxlength="4" type="number"
									 :value="firstPayPriceNumber"
									 @input="firstPayPriceInputChange"
									 placeholder-class="input_placeholder"
									 class="inputView" placeholder="请输入首付金额"/>

							  <view v-if="firstPayPriceNumber" class="unit">万</view>
						  </view>

						  <view v-if="firstPayTextMapIndex == 1"
								@click="showToast('firstPayToastViewShow')" class="flexRowEnd">
							<view class="flexRowStart firstPayVal">{{ firstPayVal }}</view>

							<view class="right_arrow_view flexColumnCenter">
							  <image class="right_arrow_img" :src="rightArrow"></image>
							</view>
						  </view>
					  </view>
					</view>

					<!--贷款总额-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel">贷款总额</view>
					  </view>

					  <view class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].daiKuanPrice"
							   disabled="true"
							   placeholder-class="input_placeholder"
							   class="inputView" placeholder="请输入贷款总额"/>

						<view v-if="formData[topTabCurrentIndex].daiKuanPrice" class="unit">万</view>
					  </view>
					</view>

					<!--贷款年限-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="inputLabel">贷款年限</view>

						<view class="flexRowEnd"
							  @click="showToast('yearNumToastViewShow')">
						  <view class="flexRowStart firstPayVal">{{ yearNumVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>

					<!--利率-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="inputLabel">公积金利率</view>

						<view class="flexRowEnd"
							  @click="showToast('commonLiLvToastViewShow')">
						  <view class="flexRowStart firstPayVal">{{ commonLiLvVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>
				  </view>

				  <!--开始计算-->
				  <view class="startCalculationView">
					<button hover-class="hoverClass"
							@click="startCalculation"
							class="startCalculation global-confirm-btn">开始计算</button>

					<view class="calculation_res_tips">此结果仅供参考，实际费用以当地缴费为准</view>
				  </view>
				</view>

				<!--计算结果-->
				<view class="resultView" v-show="startCalculatorMap[topTabCurrentIndex]">
				  <!--新版UI计算结果-->
				  <view class="res_cont">
					<view class="res_cont_view">
					  <view class="flexRowCenter">
						<view class="result_tab_btn_view flexRowCenter">
						  <button hover-class="hoverClass"
								  @click="resultTabChange(1)"
								  :class="{'result_tab_btn_active global-confirm-btn' : resultTabCurrentType == 1 }"
								  class="result_tab_btn_l result_tab_btn">等额本息
						  </button>

						  <button hover-class="hoverClass"
								  @click="resultTabChange(2)"
								  :class="{'result_tab_btn_active global-confirm-btn' : resultTabCurrentType == 2 }"
								  class="result_tab_btn_r result_tab_btn">等额本金
						  </button>
						</view>
					  </view>

					  <view class="flexRowStart">
						<!--图表-->
                        <!-- #ifdef MP-ALIPAY -->
                        <canvas v-show="!firstPayToastViewShow && !yearNumToastViewShow && !businessLiLvToastViewShow && !commonLiLvToastViewShow"
                        	width="150" height="150"
							class="canvasView" id="common_pieChartId"></canvas>
                        <!-- #endif -->
                        <!-- #ifndef MP-ALIPAY -->
                        <canvas v-show="!firstPayToastViewShow && !yearNumToastViewShow && !businessLiLvToastViewShow && !commonLiLvToastViewShow"
							width="150" height="150"
							class="canvasView" canvas-id="common_pieChartId"></canvas>
                        <!-- #endif -->

						<!--文字展示-->
						<view class="resultTextCont">
						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">房屋售价</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].totalPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">首付金额</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].firstPayPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view style="background: #5da8fe;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">贷款总额</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].daiKuanPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view style="background: #f6cf41;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">支付利息</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].liXiPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">利率</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].common_liLv }}%</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">月供</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].monthPrice }}元</view>
							  </view>
							</view>
						  </view>

						  <view v-show="resultTabCurrentType == 2" class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel">每月递减</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].monthLessPrice }}元</view>
							  </view>
							</view>
						  </view>
						</view>
					  </view>
					</view>
				  </view>
				</view>
			  </view>

			<!--组合贷-->
			<view v-show="topTabCurrentIndex == 2">
				<view class="contentInfoView">
				  <view class="contentView">
					<!--贷款总价-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel_right inputLabel_five inputLabel">房屋售价</view>
					  </view>

					  <view style="width: 100%;" class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].totalPrice"
							   @input="totalPriceInputChange"
							   placeholder-class="input_placeholder"
							   class="inputView" placeholder="请输入房屋售价"/>

						<view v-if="formData[topTabCurrentIndex].totalPrice" class="unit">万</view>
					  </view>
					</view>

					<!--首付比例-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						  <view class="flexRowStart">
							  <view @click="changeFirstPayType"
									class="inputLabel one_four_width_label">{{ firstPayTextMap[firstPayTextMapIndex].title }}</view>

							  <view @click="changeFirstPayType" class="flexRowStart">
								  <image class="first_pay_img" src="http://cdn.haofang.net/static/wxPlusApp/yjk/first_pay.png"></image>
								  <view class="first_pay_des">{{ firstPayTextMap[firstPayTextMapIndex].des }}</view>
							  </view>
						  </view>

						  <view v-if="firstPayTextMapIndex == 2" class="flexRowEnd">
							  <input maxlength="4" type="number"
									 :value="firstPayPriceNumber"
									 @input="firstPayPriceInputChange"
									 placeholder-class="input_placeholder"
									 class="inputView" placeholder="请输入首付金额"/>

							  <view v-if="firstPayPriceNumber" class="unit">万</view>
						  </view>

						  <view v-if="firstPayTextMapIndex == 1"
								@click="showToast('firstPayToastViewShow')" class="flexRowEnd">
							<view class="flexRowStart firstPayVal">{{ firstPayVal }}</view>

							<view class="right_arrow_view flexColumnCenter">
							  <image class="right_arrow_img" :src="rightArrow"></image>
							</view>
						  </view>
					  </view>
					</view>

					<!--贷款总额-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel_right inputLabel_five inputLabel">贷款总额</view>
					  </view>

					  <view style="width: 100%;" class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].daiKuanPrice"
							   disabled="true"
							   placeholder-class="input_placeholder"
							   class="inputView" placeholder="请输入贷款总额"/>

						<view v-if="formData[topTabCurrentIndex].daiKuanPrice" class="unit">万</view>
					  </view>
					</view>

					<!--商业贷款-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel_right inputLabel_five inputLabel">商业贷款</view>
					  </view>

					  <view style="width: 100%;" class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].businessPrice"
							   @input="groupBusinessInputChange"
							   placeholder-class="input_placeholder"
							   class="inputView" placeholder="请输入商业贷款"/>

						<view v-if="formData[topTabCurrentIndex].businessPrice" class="unit">万</view>
					  </view>
					</view>

					<!--商业贷款利率-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="inputLabel_five inputLabel">商贷利率</view>

						<view class="flexRowEnd" @click="showToast('businessLiLvToastViewShow')">
						  <view class="flexRowStart firstPayVal">{{ businessLiLvVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>

					<!--公积金贷款-->
					<view class="flexRowSpaceBetween contentInput">
					  <view class="flexRowStart inputLabelView">
						<view class="inputLabel_five inputLabel">公积金贷款</view>
					  </view>

					  <view style="width: 100%;" class="flexRowEnd">
						<input maxlength="4" type="number"
							   :value="formData[topTabCurrentIndex].commonPrice"
							   placeholder-class="input_placeholder"
							   @input="groupCommonInputChange"
							   class="inputView" placeholder="请输入公积金贷款"/>

						<view v-if="formData[topTabCurrentIndex].commonPrice" class="unit">万</view>
					  </view>
					</view>

					<!--公积金利率-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="inputLabel_five inputLabel">公积金利率</view>

						<view class="flexRowEnd"
							  @click="showToast('commonLiLvToastViewShow')">
						  <view class="flexRowStart firstPayVal">{{ commonLiLvVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>

					<!--贷款年限-->
					<view class="flexRowSpaceBetween contentInput">
					  <view style="width: 100%;" class="flexRowSpaceBetween inputLabelView">
						<view class="inputLabel_right inputLabel_five inputLabel">贷款年限</view>

						<view class="flexRowEnd" @click="showToast('yearNumToastViewShow')">
						  <view class="flexRowStart firstPayVal">{{ yearNumVal }}</view>

						  <view class="right_arrow_view flexColumnCenter">
							<image class="right_arrow_img" :src="rightArrow"></image>
						  </view>
						</view>
					  </view>
					</view>
				  </view>

				  <!--开始计算-->
				  <view class="startCalculationView">
					<button hover-class="hoverClass"
							@click="startCalculation"
							class="startCalculation global-confirm-btn">开始计算</button>

					<view class="calculation_res_tips">此结果仅供参考，实际费用以当地缴费为准</view>
				  </view>
				</view>

				<!--计算结果-->
				<view class="resultView" v-show="startCalculatorMap[topTabCurrentIndex]">
				  <!--新版UI计算结果-->
				  <view class="res_cont">
					<view class="res_cont_view">
					  <view class="flexRowCenter">
						<view class="result_tab_btn_view flexRowCenter">
						  <button hover-class="hoverClass"
								  @click="resultTabChange(1)"
								  :class="{'result_tab_btn_active global-confirm-btn' : resultTabCurrentType == 1}"
								  class="result_tab_btn_l result_tab_btn">等额本息
						  </button>

						  <button hover-class="hoverClass"
								  @click="resultTabChange(2)"
								  :class="{'result_tab_btn_active global-confirm-btn' : resultTabCurrentType == 2}"
								  class="result_tab_btn_r result_tab_btn">等额本金
						  </button>
						</view>
					  </view>

					  <view class="flexRowStart">
						<!--图表 (有下拉选择项的时候不展示)-->
                        <!-- #ifdef MP-ALIPAY -->
                        <canvas v-show="!firstPayToastViewShow && !yearNumToastViewShow && !businessLiLvToastViewShow && !commonLiLvToastViewShow"
                        	width="150" height="150"
							class="canvasView" id="group_pieChartId"></canvas>
                        <!-- #endif -->
                        <!-- #ifndef MP-ALIPAY -->
                        <canvas v-show="!firstPayToastViewShow && !yearNumToastViewShow && !businessLiLvToastViewShow && !commonLiLvToastViewShow"
                        	width="150" height="150"
							class="canvasView" canvas-id="group_pieChartId"></canvas>
                        <!-- #endif -->

						<!--文字展示-->
						<view class="resultTextCont">
						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">房屋售价</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].totalPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">首付金额</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].firstPayPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view style="background: #5da8fe;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">贷款总额</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].daiKuanPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view style="background: #f6cf41;" class="resultPoint"></view>

							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">支付利息</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].liXiPrice }}万</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">商贷利率</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].business_liLv }}%</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">公积金利率</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].common_liLv }}%</view>
							  </view>
							</view>
						  </view>

						  <view class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">月供</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].monthPrice }}元</view>
							  </view>
							</view>
						  </view>

						  <view v-show="resultTabCurrentType == 2" class="flexRowCenter">
							<view class="flexRowSpaceBetween resultPriceView">
							  <view class="flexRowStart">
								<view class="resultPriceLabel_five resultPriceLabel">每月递减</view>

								<view class="resultPriceVal">{{ formData[topTabCurrentIndex].monthLessPrice }}元</view>
							  </view>
							</view>
						  </view>
						</view>
					  </view>
					</view>
				  </view>
				</view>
			</view>
		</view>

		<!-- picker弹窗 -->
		<view v-if="firstPayToastViewShow" @click="cancelToast('firstPayToastViewShow')" class="calculatorToast">
			<view class="calculator_toast_view">
				<view class="calculator_toast_title">
				  <view @click="cancelToast('firstPayToastViewShow')">取消</view>
				  <view @click="confirmToast('firstPayToastViewShow')" class="calculator_toast_confirm global-font-color">确定</view>
				</view>

				<picker-view indicator-class="calculator_toast_picker_item"
							 class="calculator_picker"
							 indicator-style="height: 50px;"
							 :value="[firstPickerIndex]"
							 @change="toastPickerChange">
				  <picker-view-column>
					<view v-for="(item,index) in firstPayPickerArr" :key="index"
						  class="calculator_toast_item">{{item.text}}</view>
				  </picker-view-column>
				</picker-view>
			</view>
		</view>

		<view v-if="yearNumToastViewShow" @click="cancelToast('yearNumToastViewShow')" class="calculatorToast">
			<view class="calculator_toast_view">
				<view class="calculator_toast_title">
					<view @click="cancelToast('yearNumToastViewShow')">取消</view>
					<view @click="confirmToast('yearNumToastViewShow')" class="calculator_toast_confirm global-font-color">确定</view>
				</view>

				<picker-view indicator-class="calculator_toast_picker_item"
						   class="calculator_picker"
						   indicator-style="height: 50px;"
						   :value="[yearNumIndex]"
						   @change="toastPickerChange">
					<picker-view-column>
					  <view v-for="(item,index) in yearNumPickerArr" :key="index"
							class="calculator_toast_item">{{item.text}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>

		<view v-if="businessLiLvToastViewShow" @click="cancelToast('businessLiLvToastViewShow')" class="calculatorToast">
			<view class="calculator_toast_view">
				<view class="calculator_toast_title">
					<view @click="cancelToast('businessLiLvToastViewShow')">取消</view>
					<view @click="confirmToast('businessLiLvToastViewShow')" class="calculator_toast_confirm global-font-color">确定</view>
				</view>

				<picker-view indicator-class="calculator_toast_picker_item"
					class="calculator_picker"
					:value="[businessLiLvIndex]"
					indicator-style="height: 50px;"
					@change="toastPickerChange">
					<picker-view-column>
						<view v-for="(item, index) in liLvPickerArr" :key="index"
							class="calculator_toast_item">{{item.text}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>

		<view v-if="commonLiLvToastViewShow" @click="cancelToast('commonLiLvToastViewShow')" class="calculatorToast">
			<view class="calculator_toast_view">
				<view class="calculator_toast_title">
					<view @click="cancelToast('commonLiLvToastViewShow')">取消</view>
					<view @click="confirmToast('commonLiLvToastViewShow')" class="calculator_toast_confirm global-font-color">确定</view>
				</view>

				<picker-view indicator-class="calculator_toast_picker_item"
					class="calculator_picker"
					:value="[commonLiLvIndex]"
					indicator-style="height: 50px;"
					@change="toastPickerChange">
					<picker-view-column>
						<view v-for="(item,index) in liLvPickerArr" :key="index"
							class="calculator_toast_item">{{item.text}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
    </view>
</template>

<script>
	const wxCharts = require('../../utils/wxcharts.js');
	const tenThousand = 10000;

	export default {
		data() {
			return {
				// 顶部tab
				topTab: [
					{
						text: "公积金贷款"
						,event: "commonCalculator"
						,width: "38%"
						,index: 1
					}
					,{
						text: "商业贷款"
						,event: "businessCalculator"
						,width: "38%"
						,index: 0
					}
					,{
						text: "组合贷款"
						,event: "groupCalculator"
						,width: "38%"
						,index: 2
					}
				]
				,topTabCurrentIndex: 1  // 0: 商业贷 , 1: 公积金贷 , 2: 组合贷

				,rightArrow: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/icon_jt.png"

				,everyBtnTextBeiFenBiVal: ""

				,swiperHeight: "100%"

				,firstPayTextMapIndex: 1
				,firstPayPriceNumber: 0
				,firstPayTextMap: {
					1: {
						title: "首付比例"
						,des: "自定义首付金额"
					}
					,2: {
						title: "首付金额"
						,des: "切换首付比例"
					}
				}

				// 数据data
				,formData: {
					0: {
						totalPrice: "100"     			// 总价
						,firstPayPrice: ""    			// 首付
						,daiKuanPrice: ""     			// 贷款总价
						,yearNum: ""          			// 年数
						,business_liLv: ""            // 商业贷利率
						,monthPrice: ""      			// 月供
						,liXiPrice: ""          		// 利息
						,monthLessPrice: ""  			//每月减少
					}
					,1: {
						totalPrice: "100"     			// 总价
						,firstPayPrice: ""    			// 首付
						,daiKuanPrice: ""     			// 贷款总价
						,yearNum: ""          			// 年数
						,common_liLv: ""             	// 公积金贷利率
						,monthPrice: ""      			// 月供
						,liXiPrice: ""          		// 利息
						,monthLessPrice: ""  			//每月减少
					}
					,2: {
						totalPrice: "100"     			// 总价
						,firstPayPrice: ""    			// 首付
						,daiKuanPrice: ""     			// 贷款总价
						,businessPrice: ""            //  商业贷的input
						,commonPrice: ""              //  公积金贷的input
						,yearNum: ""          			// 年数
						,business_liLv: ""            // 商业贷利率
						,common_liLv: ""             	// 公积金贷利率
						,monthPrice: ""      			// 月供
						,liXiPrice: ""          		// 利息
						,monthLessPrice: ""  			//每月减少
					}
					,3: {
						houseArea: ""       // 房屋面积
						,unitPrice: ""      // 单价
						,houseType: ""      // 房屋性质
						,firstBuy: 1        // 1 是第一次购买, 2 no
						,totalPrice: ""     //  总价

						,houseOldPrice: ""             //  房屋原价
						,jiSuanMethod: ""              //  计算方法
						,buyYear: ""                   //  购买年限
						,onlyHouse: 1                   //  唯一住房 1 yes, 2 no

						// 新房
						,qiShui: ""                      //  契税
						,gongZhengShui: ""  		     // 公证费
						,weiTuoChanPanShouXuFei: ""    // 委托办理产权手续费
						,buyMaiShouXuFei: ""           // 房屋买卖手续费
						,weiXiuJiJinFei: ""            // 维修基金费
						,shuiFeiTotal: ""              // 税费合计

						// 二手房
						,gongBenYinHuaShui: ""     	// 工本印花税
						,yinHuaShui: ""     			 // 印花税
						,mySuoDeShui: ""                // 个人所得税
						,zengZhiShui: ""                // 增值税
						,zongHeDiJiaShui: ""            // 综合地价税
					}
				}

				// 首付比例
				,firstPickerIndex: 2
				,firstPayPickerArr: [
					{text: "1成", value: 0.1}
					,{text: "2成", value: 0.2}
					,{text: "3成", value: 0.3}
					,{text: "4成", value: 0.4}
					,{text: "5成", value: 0.5}
					,{text: "6成", value: 0.6}
					,{text: "7成", value: 0.7}
					,{text: "8成", value: 0.8}
					,{text: "9成", value: 0.9}
				]
				,firstPayVal: ""

				// 按揭年数
				,yearNumIndex: 19
				,yearNumPickerArr: []
				,yearNumVal: ""


				,liLvPickerArr: [
					{text: "基准利率", value: "1"}
					,{text: "7折", value: "0.7"}
					,{text: "7.5折", value: "0.75"}
					,{text: "8折", value: "0.8"}
					,{text: "8.5折", value: "0.85"}
					,{text: "9折", value: "0.9"}
					,{text: "1.05倍", value: "1.05"}
					,{text: "1.1倍", value: "1.1"}
					,{text: "1.2倍", value: "1.2"}
					,{text: "1.3倍", value: "1.3"}
				]
				// 商业贷利率
				,businessLiLvIndex: 0
				,businessLiLvVal: ""
				// 公积金贷利率
				,commonLiLvIndex: 0
				,commonLiLvVal: ""


				// 结果
				,resultTabCurrentType: 1

				// 结果展示的map  索引：topTabCurrentIndex
				,startCalculatorMap: {
					0: false
					,1: false
					,2: false
					,3: false
				}

				// 新房&二手房切换
				,newErHouseTabIndex: 1

				// 房屋性质picker
				,houseTypePickerArr: [
					{text: "普通住宅", value: "1"}
					,{text: "非普通住宅", value: "2"}
					,{text: "经济适用房", value: "3"}
				]
				,houseTypeIndex: 0
				,houseTypeVal: ""

				// 计算方法 picker
				,jiSuanMethodPickerArr: [
					{text: "总价", value: "1"}
					,{text: "差价", value: "2"}
				]
				,jiSuanMethodIndex: 0
				,jiSuanMethodVal: ""

				// 购置年限 picker
				,buyYearPickerArr: [
					{text: "满2年", value: "1"}
					,{text: "满5年", value: "2"}
					,{text: "不满2年", value: "3"}
				]
				,buyYearIndex: 0
				,buyYearVal: ""


				// picker 弹窗
				,firstPayToastViewShow: false
				,yearNumToastViewShow: false
				,businessLiLvToastViewShow: false
				,commonLiLvToastViewShow: false

				,private: {
					businessLiLvBiLi: 0.049  // 商业贷lilv基本比例
					,commonLiLvBiLi: 0.0325 // 公积金lilv基本比例

					,pickerChangeIndex: 0
				}
			}
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad(params) {
			if(params.price) {
				let formData = this.formData;
				for(let key in formData) {
					if(formData[key] && formData[key].totalPrice != undefined) {
						formData[key].totalPrice = Number(params.price);
					}
				}
				this.formData = formData;
			}
			this.initData();
			this.initTopBarBtnTextBaiFenBi();
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		onReady() {
			new this.SetH5BrowerTitle().init();
		},

		methods: {
			setData(obj = {}) {
				for(let key in obj) {
					this[key] = obj[key];
				}
			}

			,initData() {
				this.changeTopBar(1,true);
			}
			//初始化 按揭年数 picker 数组
			,initYearNumPickerArr() {
				let yearNumPickerArr = [];
				for (let i = 1;i <= 30;i++) {
					yearNumPickerArr.push({
						text: i+"年"+" ( "+ i*12 +"期 )"
						,value: i
					});
				}
				this.setData({
					yearNumPickerArr: yearNumPickerArr
				});
			}

			,initTopBarBtnTextBaiFenBi() {
				let topTab = this.topTab;
				let totalLength = 0;
				for (let i = 0;i<topTab.length;i++) {
					totalLength += topTab[i].text.length;
				}
				let everyBtnTextBeiFenBiVal = (100 / totalLength).toFixed(1);
				for (let j = 0;j<topTab.length;j++) {
					topTab[j].width = parseInt(everyBtnTextBeiFenBiVal * topTab[j].text.length)+"%";
				}
				this.setData({
					everyBtnTextBeiFenBiVal: everyBtnTextBeiFenBiVal
					,topTab: topTab
				});
			}


			// 顶部切换tab
			,changeTopBar(index, boolean = false) {
				if (Number(index)
					=== Number(this.topTabCurrentIndex) && !boolean) return;

				this.setData({
					topTabCurrentIndex: index
				});
				if (Number(this.topTabCurrentIndex) !== 3) {
					this.upFirstPayVal();

					this.initYearNumPickerArr();
					this.upYearNumVal();
				} else {
					this.upHouseTypeVal();
					this.upJiSuanMethodVal();
					this.upBuyYearVal();
				}

				let liLvMap = {
					0: {
						liLv: "businessLiLvBiLi"
						,liLvIndex: "businessLiLvIndex"
					}
					,1: {
						liLv: "commonLiLvBiLi"
						,liLvIndex: "commonLiLvIndex"
					}
				};
				if (liLvMap[this.topTabCurrentIndex]
					&& (Number(this.topTabCurrentIndex) === 0
						|| Number(this.topTabCurrentIndex) === 1)) {
					this.upLiLvVal(this.private[liLvMap[this.topTabCurrentIndex].liLv]
						, this[liLvMap[this.topTabCurrentIndex].liLvIndex]);
				}
				if (Number(this.topTabCurrentIndex) === 2) {
					this.upLiLvVal(this.private.businessLiLvBiLi
						, this.businessLiLvIndex);
					this.upLiLvVal(this.private.commonLiLvBiLi
						, this.commonLiLvIndex);
				}
				if (this.startCalculatorMap[this.topTabCurrentIndex]) {
					this.startCalculation(false);
				}
			}


			// 切换首付类型
			,changeFirstPayType() {
				let firstPayTextMapIndex = this.firstPayTextMapIndex;
				firstPayTextMapIndex = 2;
				this.firstPayPriceInputChange({detail:{value: (this.firstPayPriceNumber || "")}});
				if (this.firstPayTextMapIndex === 2) {
					this.upFirstPayVal();
					firstPayTextMapIndex = 1;
				}
				this.setData({
					firstPayTextMapIndex: firstPayTextMapIndex
				});
			}


			// 总价input change
			,totalPriceInputChange(e) {
				let formData = this.formData;
				formData[this.topTabCurrentIndex].totalPrice = e.detail.value;
				this.setData({
					formData: formData
				});
				this.upFirstPayVal();
			}

			// 组合贷  商业贷input change
			,groupBusinessInputChange(e) {
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let daiKuanPrice = this.formData[topTabCurrentIndex].daiKuanPrice;
				if (!this.checkGroupInputValIsNeed(e.detail.value || 0
					, formData[topTabCurrentIndex].commonPrice || 0)) {
					formData[this.topTabCurrentIndex].businessPrice = "";
					this.setData({
						formData: formData
					});
					return;
				}

				formData[this.topTabCurrentIndex].businessPrice = e.detail.value;
				formData[this.topTabCurrentIndex].commonPrice =
					Number(daiKuanPrice) - Number(e.detail.value);
				this.setData({
					formData: formData
				});
			}

			// 组合贷  公积金input change
			,groupCommonInputChange(e) {
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let daiKuanPrice = this.formData[topTabCurrentIndex].daiKuanPrice;
				if (!this.checkGroupInputValIsNeed(formData[topTabCurrentIndex].businessPrice || 0
					, e.detail.value || 0)) {
					formData[this.topTabCurrentIndex].commonPrice = "";
					this.setData({
						formData: formData
					});
					return;
				}

				formData[topTabCurrentIndex].commonPrice = e.detail.value;
				formData[this.topTabCurrentIndex].businessPrice =
					Number(daiKuanPrice) - Number(e.detail.value);
				this.setData({
					formData: formData
				});
			}
			,checkGroupInputValIsNeed(businessPrice = 0, commonPrice = 0) {
				let daiKuanPrice = this.formData[this.topTabCurrentIndex].daiKuanPrice;
				if ((Number(daiKuanPrice) < Number(businessPrice))
					|| (Number(daiKuanPrice) < Number(commonPrice))) {
					uni.showToast({
						title: "小于等于"+daiKuanPrice+"万",
						icon: "none",
						duration: 2000
					});
					return false;
				}

				return true;
			}


			// 建筑面积 input change
			,taxationAreaInputChange(e) {
				let formData = this.formData;
				formData[this.topTabCurrentIndex].houseArea = e.detail.value;
				this.setData({
					formData: formData
				});
			}
			// 面积单价 input change
			,taxationUnitPriceInputChange(e) {
				let formData = this.formData;
				formData[this.topTabCurrentIndex].unitPrice = e.detail.value;
				this.setData({
					formData: formData
				});
			}
			// 房屋原价 input change
			,taxationHouseOldPriceInputChange(e) {
				let formData = this.formData;
				formData[this.topTabCurrentIndex].houseOldPrice = e.detail.value;
				this.setData({
					formData: formData
				});
			}


			// 首付比例 picker
			,firstPayPickerChange(e) {
				this.private.pickerChangeIndex = e.detail.value[0];
			}
			,upFirstPayVal() {
				let item = this.firstPayPickerArr[this.firstPickerIndex];
				let totalPrice = this.formData[this.topTabCurrentIndex].totalPrice || 0;
				let formData = this.formData;
				let businessPrice = formData[this.topTabCurrentIndex].businessPrice
					? Number(formData[this.topTabCurrentIndex].businessPrice) : 0;
				formData[this.topTabCurrentIndex].firstPayPrice =
					(totalPrice*item.value).toFixed(1);
				formData[this.topTabCurrentIndex].daiKuanPrice =
					(totalPrice - formData[this.topTabCurrentIndex].firstPayPrice).toFixed(1);
				if (this.topTabCurrentIndex === 2) {
					formData[this.topTabCurrentIndex].commonPrice =
						Number(formData[this.topTabCurrentIndex].daiKuanPrice) - Number(businessPrice);
				}
				this.setData({
					formData: formData
					,firstPayVal: item.text
					,firstPayPriceNumber: formData[this.topTabCurrentIndex].firstPayPrice
					// ,firstPayVal: item.text + " ( " +
					// 	formData[this.topTabCurrentIndex].firstPayPrice + "万 )"
				});
			}
			,firstPayPriceInputChange(e) {
				let totalPrice = this.formData[this.topTabCurrentIndex].totalPrice || 0;
				let val = e.detail.value || "";
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let businessPrice = formData[this.topTabCurrentIndex].businessPrice
					? Number(formData[this.topTabCurrentIndex].businessPrice) : 0;

				if (!val) {
					formData[topTabCurrentIndex].firstPayPrice = "";
					this.setData({
						firstPayPriceNumber: "",
						formData: formData
					});
					return;
				}

				val = Number(val);
				if (val > Number(totalPrice)) {
					formData[this.topTabCurrentIndex].daiKuanPrice = 0;
					if (this.topTabCurrentIndex === 2) {
						formData[this.topTabCurrentIndex].commonPrice = 0;
						formData[this.topTabCurrentIndex].businessPrice = 0;
					}
					uni.showToast({
						title: "首付应小于总价",
						icon: 'none',
						duration: 2000
					});
					formData[topTabCurrentIndex].firstPayPrice = totalPrice;
					this.setData({
						firstPayPriceNumber: totalPrice
						,formData: formData
					});
					return;
				}

				formData[this.topTabCurrentIndex].daiKuanPrice = (totalPrice - val).toFixed(1);
				if (this.topTabCurrentIndex === 2) {
					formData[this.topTabCurrentIndex].commonPrice =
						Number(formData[this.topTabCurrentIndex].daiKuanPrice) - Number(businessPrice);
				}
				formData[topTabCurrentIndex].firstPayPrice = val;
				this.setData({
					firstPayPriceNumber: val
					,formData: formData
				});
			}

			// 按揭年数 picker
			,yearNumPickerChange(e) {
				this.setData({
					yearNumIndex: e.detail.value
				});
				this.upYearNumVal();
			}
			,upYearNumVal() {
				let item = this.yearNumPickerArr[this.yearNumIndex];
				let formData = this.formData;
				formData[this.topTabCurrentIndex].yearNum = item.value;
				this.setData({
					yearNumVal: item.text
					,formData: formData
				});
			}


			// 商业贷利率 picker
			,businessLiLvPickerChange(e) {
				this.setData({
					businessLiLvIndex: e.detail.value
				});
				this.upLiLvVal(this.private.businessLiLvBiLi, e.detail.value);
			}
			// 公积金贷利率 picker
			,commonLiLvPickerChange(e) {
				this.setData({
					commonLiLvIndex: e.detail.value
				});
				this.upLiLvVal(this.private.commonLiLvBiLi, e.detail.value);
			}
			,upLiLvVal(liLvVal = this.private.businessLiLvBiLi
					   , liLvIndex = this.businessLiLvIndex) {
				let item = this.liLvPickerArr[liLvIndex];
				let formData = this.formData;
				if (this.private.businessLiLvBiLi === liLvVal) {
					formData[this.topTabCurrentIndex].business_liLv =
						parseFloat(item.value) * parseFloat(liLvVal) * 100;
					formData[this.topTabCurrentIndex].business_liLv =
						formData[this.topTabCurrentIndex].business_liLv.toFixed(2);
					this.setData({
						businessLiLvVal: item.text
						,formData: formData
					});
					return;
				}

				formData[this.topTabCurrentIndex].common_liLv =
					parseFloat(item.value) * parseFloat(liLvVal) * 100;
				formData[this.topTabCurrentIndex].common_liLv =
					formData[this.topTabCurrentIndex].common_liLv.toFixed(2);
				this.setData({
					commonLiLvVal: item.text
					,formData: formData
				});
			}


			// 房屋性质 picker
			,houseTypePickerChange(e) {
				this.setData({
					houseTypeIndex: e.detail.value
				});
				this.upHouseTypeVal();
			}
			,upHouseTypeVal() {
				let houseTypeIndex = this.houseTypeIndex;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let item = this.houseTypePickerArr[houseTypeIndex];
				let formData = this.formData;
				formData[topTabCurrentIndex].houseType = item.value;
				this.setData({
					formData: formData
					,houseTypeVal: item.text
				});
			}
			// 计算方法 picker
			,jiSuanMethodPickerChange(e) {
				this.setData({
					jiSuanMethodIndex: e.detail.value
				});
				this.upJiSuanMethodVal();
			}
			,upJiSuanMethodVal() {
				let jiSuanMethodIndex = this.jiSuanMethodIndex;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let item = this.jiSuanMethodPickerArr[jiSuanMethodIndex];
				let formData = this.formData;
				formData[topTabCurrentIndex].jiSuanMethod = item.value;
				this.setData({
					formData: formData
					,jiSuanMethodVal: item.text
				});
			}
			// 购置年限 picker
			,buyYearPickerChange(e) {
				this.setData({
					buyYearIndex: e.detail.value
				});
				this.upBuyYearVal();
			}
			,upBuyYearVal() {
				let buyYearIndex = this.buyYearIndex;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let item = this.buyYearPickerArr[buyYearIndex];
				let formData = this.formData;
				formData[topTabCurrentIndex].buyYear = item.value;
				this.setData({
					formData: formData
					,buyYearVal: item.text
				});
			}

			// 结果 tab
			,resultTabChange(type) {
				let resultTabCurrentType = type;
				// if (Number(resultTabCurrentType) === Number(this.resultTabCurrentType)) return;

				this.setData({
					resultTabCurrentType: resultTabCurrentType
				});
				if (Number(resultTabCurrentType) === 1) {
					this.upBenXiResult();
					return;
				}

				this.upBenJinResult();
			}

			// 新房&二手房切换 tab
			,newErHouseTabChange(e) {
				let newErHouseTabIndex = e.target.dataset.type;
				if (Number(newErHouseTabIndex) === Number(this.newErHouseTabIndex)) return;

				this.setData({
					newErHouseTabIndex: newErHouseTabIndex
				});
				if (Number(newErHouseTabIndex) === 1) {
					this.newHouseTaxation();
					return;
				}

				this.erHouseTaxation();
			}

			// 首次购买 radio
			,firstBuyRadioChange(e) {
				let formData = this.formData;
				formData[this.topTabCurrentIndex].firstBuy = e.detail.value;
				this.setData({
					formData: formData
				});
			}
			//  唯一住房 radio
			,onlyHouseRadioChange(e) {
				let formData = this.formData;
				formData[this.topTabCurrentIndex].onlyHouse = e.detail.value;
				this.setData({
					formData: formData
				});
			}


			// 开始计算
			,startCalculation(noTab = true) {
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let startCalculatorMap = this.startCalculatorMap;
				let formData = this.formData;
				if (Number(topTabCurrentIndex) === 2
					&& !formData[topTabCurrentIndex].businessPrice
					&& !formData[topTabCurrentIndex].commonPrice) {
					uni.showToast({
						title: "请输入贷款金额",
						icon: 'none',
						duration: 2000
					});
					return;
				}

				if (Number(topTabCurrentIndex) === 3 && !this.checkTaxIsNeed()) return;

				startCalculatorMap[topTabCurrentIndex] = true;
				this.setData({
					startCalculatorMap: startCalculatorMap
					,resultTabCurrentType: 1
				});
				let eventMap = {
					0: ["upBenXiResult"]
					,1: ["upBenXiResult"]
					,2: ["upBenXiResult"]
					,3: ["newHouseTaxation"]
				};
				let eventArr = eventMap[topTabCurrentIndex];
				for (let i = 0;i<eventArr.length;i++) {
					this[eventArr[i]]();
				}

				// #ifndef MP-ALIPAY || MP-BAIDU
				if (noTab) {
					const query = this.DifferenceApi.createSelectorQuery(this);
					query.select('.contentScrollView').boundingClientRect();
					query.selectViewport().scrollOffset();
					query.exec(function (res) {
						setTimeout(() => {
							uni.pageScrollTo({
								scrollTop: res[0].height + res[0].top,
								duration: 0
							}, 300);
						});
					});
				}
				// #endif

				setTimeout(() => {
					this.resultTabChange(1);
				}, 500);
			}

			,checkTaxIsNeed() {
				let map = {
					1: [
						{key:"houseArea", msg: "请输入面积"}
						,{key: "unitPrice", msg: "请输入单价"}
					]
					,2: [
						{key:"houseArea", msg: "请输入面积"}
						,{key: "unitPrice", msg: "请输入单价"}
						,{key: "houseOldPrice", msg: "请输入原价"}
					]
				};
				let newErHouseTabIndex = this.newErHouseTabIndex;
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let items = map[newErHouseTabIndex];
				for (let i = 0;i<items.length;i++) {
					let item = items[i];
					if (!formData[topTabCurrentIndex][item.key]) {
						uni.showToast({
							title: item.msg,
							icon: "none",
							duration: 1500
						});
						return false;
					}
				}

				return true;
			}


			// 等额本息计算
			,upBenXiResult() {
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let eventMap = {
					0: "benXiBusinessCalculator"
					,1: "benXiCommonCalculator"
					,2: "benXiGroupCalculator"
				};
				this[eventMap[topTabCurrentIndex]]();
				this.upEchartNoZuHe();
			}
			,benXiBusinessCalculator(){
				let formData = this.formData;
				formData[this.topTabCurrentIndex].monthPrice =
					this.getBenXiYearPrice();
				formData[this.topTabCurrentIndex].liXiPrice =
					((formData[this.topTabCurrentIndex].monthPrice
						* formData[this.topTabCurrentIndex].yearNum * 12
					- formData[this.topTabCurrentIndex].daiKuanPrice * tenThousand)
						/tenThousand).toFixed(1);
				this.setData({
					formData: formData
				});
			}
			,benXiCommonCalculator(){
				let formData = this.formData;
				formData[this.topTabCurrentIndex].monthPrice =
					this.getBenXiYearPrice(this.formData[this.topTabCurrentIndex].daiKuanPrice, "common_liLv");
				formData[this.topTabCurrentIndex].liXiPrice =
					((formData[this.topTabCurrentIndex].monthPrice
						* formData[this.topTabCurrentIndex].yearNum * 12
						- formData[this.topTabCurrentIndex].daiKuanPrice * tenThousand)
						/tenThousand).toFixed(1);
				this.setData({
					formData: formData
				});
			}
			,benXiGroupCalculator(){
				let formData = this.formData;
				formData[this.topTabCurrentIndex].monthPrice =
					Number(this.getBenXiYearPrice(this.formData[this.topTabCurrentIndex].businessPrice
						, "business_liLv"))
					+ Number(this.getBenXiYearPrice(this.formData[this.topTabCurrentIndex].commonPrice
					, "common_liLv"));
				formData[this.topTabCurrentIndex].liXiPrice =
					((formData[this.topTabCurrentIndex].monthPrice
						* formData[this.topTabCurrentIndex].yearNum * 12
						- formData[this.topTabCurrentIndex].daiKuanPrice * tenThousand)
						/tenThousand).toFixed(1);
				this.setData({
					formData: formData
				});
			}
			,getBenXiYearPrice(price = this.formData[this.topTabCurrentIndex].daiKuanPrice
							   ,liLv_key = "business_liLv") {
				let formData = this.formData;
				let liLv = formData[this.topTabCurrentIndex][liLv_key] * 0.01;
				let daiKuanPrice = price * tenThousand;
				let month = formData[this.topTabCurrentIndex].yearNum * 12;
				let liLv_month = liLv / 12;
				return (((daiKuanPrice * liLv_month * Math.pow(1 + liLv_month, month)
					/ (Math.pow(1 + liLv_month, month) - 1))*1000)/1000).toFixed(1);
			}

			// 等额本金
			,upBenJinResult() {
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let eventMap = {
					0: "benJinBusinessCalculator"
					,1: "benJinCommonCalculator"
					,2: "benJinGroupCalculator"
				};
				this[eventMap[topTabCurrentIndex]]();
				this.upEchartNoZuHe();
			}
			,benJinBusinessCalculator(){
				let formData = this.formData;
				let month = formData[this.topTabCurrentIndex].yearNum * 12;
				let huanKuan = 0, firstMonth = 0, secondMonth = 0, all_total1 = 0;
				for (let j = 0; j < month; j++) {
					huanKuan = this.getBenJinYearPrice(j);
					all_total1 += huanKuan;
					if (j === 0) {
						firstMonth = huanKuan;
						continue;
					}

					if (j === 1) {
						secondMonth = huanKuan;
					}
				}

				formData[this.topTabCurrentIndex].monthPrice = firstMonth.toFixed(1);
				formData[this.topTabCurrentIndex].liXiPrice =
					((parseFloat(all_total1)
					- formData[this.topTabCurrentIndex].daiKuanPrice
					* tenThousand)/tenThousand).toFixed(1);
				formData[this.topTabCurrentIndex].monthLessPrice =
					(parseFloat(firstMonth) - parseFloat(secondMonth)).toFixed(1);
				this.setData({
					formData: formData
				});
			}
			,benJinCommonCalculator(){
				let formData = this.formData;
				let month = formData[this.topTabCurrentIndex].yearNum * 12;
				let huanKuan = 0, firstMonth = 0, secondMonth = 0, all_total1 = 0;
				for (let j = 0; j < month; j++) {
					huanKuan = this.getBenJinYearPrice(j
						, this.formData[this.topTabCurrentIndex].daiKuanPrice
						, "common_liLv");
					all_total1 += huanKuan;
					if (j === 0) {
						firstMonth = huanKuan;
						continue;
					}

					if (j === 1) {
						secondMonth = huanKuan;
					}
				}

				formData[this.topTabCurrentIndex].monthPrice = firstMonth.toFixed(1);
				formData[this.topTabCurrentIndex].liXiPrice =
					((parseFloat(all_total1)
						- formData[this.topTabCurrentIndex].daiKuanPrice
						* tenThousand)/tenThousand).toFixed(1);
				formData[this.topTabCurrentIndex].monthLessPrice =
					(parseFloat(firstMonth) - parseFloat(secondMonth)).toFixed(1);
				this.setData({
					formData: formData
				});
			}
			,benJinGroupCalculator(){
				let formData = this.formData;
				let month = formData[this.topTabCurrentIndex].yearNum * 12;
				let huanKuan = 0, firstMonth = 0, secondMonth = 0, all_total1 = 0;
				for (let j = 0; j < month; j++) {
					huanKuan = Number(this.getBenJinYearPrice(j
						, formData[this.topTabCurrentIndex].businessPrice
						, "business_liLv"))
						+ Number(this.getBenJinYearPrice(j
							, formData[this.topTabCurrentIndex].commonPrice
							, "common_liLv"));
					all_total1 += huanKuan;
					if (j === 0) {
						firstMonth = huanKuan;
						continue;
					}

					if (j === 1) {
						secondMonth = huanKuan;
					}
				}

				formData[this.topTabCurrentIndex].monthPrice = firstMonth.toFixed(1);
				formData[this.topTabCurrentIndex].liXiPrice =
					((parseFloat(all_total1)
						- formData[this.topTabCurrentIndex].daiKuanPrice
						* tenThousand)/tenThousand).toFixed(1);
				formData[this.topTabCurrentIndex].monthLessPrice =
					(parseFloat(firstMonth) - parseFloat(secondMonth)).toFixed(1);
				this.setData({
					formData: formData
				});
			}
			,getBenJinYearPrice(cur_month
								, price = this.formData[this.topTabCurrentIndex].daiKuanPrice
								, liLv_key = "business_liLv") {
				let formData = this.formData;
				let liLv = formData[this.topTabCurrentIndex][liLv_key] * 0.01;
				let liLv_month = liLv / 12;
				let daiKuanPrice = price * tenThousand;
				let benJin_money = daiKuanPrice / (formData[this.topTabCurrentIndex].yearNum*12);
				return (daiKuanPrice - benJin_money * cur_month) * liLv_month + benJin_money;
			}


			// 新房税费计算
			,newHouseTaxation() {
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let houseArea = Number(formData[topTabCurrentIndex].houseArea);
				let unitPrice = Number(formData[topTabCurrentIndex].unitPrice);
				let totalPrice = (houseArea *unitPrice).toFixed(1);
				formData[topTabCurrentIndex].totalPrice = (totalPrice/tenThousand).toFixed(1);
				formData[topTabCurrentIndex].gongZhengShui = (totalPrice * 0.003).toFixed(1);
				formData[topTabCurrentIndex].qiShui =
					(totalPrice * Number(this.getDeedTaxRate())).toFixed(1);
				formData[topTabCurrentIndex].weiTuoChanPanShouXuFei = (totalPrice * 0.003).toFixed(1);
				formData[topTabCurrentIndex].buyMaiShouXuFei =
					Number(this.getDealHandlingCharge(houseArea)).toFixed(1);
				formData[topTabCurrentIndex].weiXiuJiJinFei = (totalPrice * 0.03).toFixed(1);
				formData[topTabCurrentIndex].shuiFeiTotal =
					(Number(formData[topTabCurrentIndex].gongZhengShui)
					+ Number(formData[topTabCurrentIndex].qiShui)
					+ Number(formData[topTabCurrentIndex].weiTuoChanPanShouXuFei)
					+ Number(formData[topTabCurrentIndex].buyMaiShouXuFei)
					+ Number(formData[topTabCurrentIndex].weiXiuJiJinFei)).toFixed(1);
				this.setData({
					formData: formData
				});
				this.upEchartNoZuHe();
			}
			// 获取契税税率
			,getDeedTaxRate() {
				let deedTaxRate = 0.03;
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let firstBuy = Number(formData[topTabCurrentIndex].firstBuy);
				let houseType = Number(formData[topTabCurrentIndex].houseType);
				let houseArea = formData[topTabCurrentIndex].houseArea;
				let unitPrice = formData[topTabCurrentIndex].unitPrice;
				do {
					//非普通住宅
					if (houseType === 2) {
						deedTaxRate = 0.03;
						break;
					}

					if (houseType !== 1) {
						deedTaxRate = 0.01;
						break;
					}

					//普通住宅
					if (houseArea >= 90 && firstBuy === 1) {
						deedTaxRate = 0.015;
						break;
					}

					if (houseArea >= 90) {
						deedTaxRate = 0.015;
						break;
					}

					//面积90㎡以下
					if (houseArea < 90 && firstBuy === 1){
						deedTaxRate = 0.01;
						break;
					}

					if (houseArea < 90) {
						deedTaxRate = 0.03;
						break;
					}
				}while (false);
				return deedTaxRate;
			}
			// 房屋买卖手续费
			,getDealHandlingCharge(area) {
				if (area <= 120) {
					return 500.0;
				}

				return 1500.0;
			}


			// 二手房税费计算
			,erHouseTaxation() {
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let houseArea = Number(formData[topTabCurrentIndex].houseArea);
				let unitPrice = Number(formData[topTabCurrentIndex].unitPrice);
				let totalPrice = (houseArea *unitPrice).toFixed(1);
				formData[topTabCurrentIndex].totalPrice = (totalPrice/tenThousand).toFixed(1);
				formData[topTabCurrentIndex].gongBenYinHuaShui = 5;
				//印花税 注：从2009年至今国家暂免征收住宅印花税
				formData[topTabCurrentIndex].yinHuaShui = 0;
				formData[topTabCurrentIndex].qiShui =
					(totalPrice * Number(this.getDeedTaxRate())).toFixed(1);
				formData[topTabCurrentIndex].mySuoDeShui =
					(this.getIndividualIncomeTax(totalPrice)).toFixed(1);
				formData[topTabCurrentIndex].zengZhiShui =
					(this.getAddedValueTax(totalPrice)).toFixed(1);
				formData[topTabCurrentIndex].zongHeDiJiaShui =
					(this.getLandTransferringFees(totalPrice)).toFixed(1);
				formData[topTabCurrentIndex].shuiFeiTotal =
					(Number(formData[topTabCurrentIndex].gongBenYinHuaShui)
						+ Number(formData[topTabCurrentIndex].qiShui)
						+ Number(formData[topTabCurrentIndex].mySuoDeShui)
						+ Number(formData[topTabCurrentIndex].zengZhiShui)
						+ Number(formData[topTabCurrentIndex].zongHeDiJiaShui)).toFixed(1);
				this.setData({
					formData: formData
				});
				this.upEchartNoZuHe();
			}
			// 个人所得税
			,getIndividualIncomeTax(totalPrice) {
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let jiSuanMethod = Number(formData[topTabCurrentIndex].jiSuanMethod);
				let buyYear = Number(formData[topTabCurrentIndex].buyYear);
				let houseOldPrice = Number(formData[topTabCurrentIndex].houseOldPrice) * tenThousand;
				if (buyYear === 2) {
					return 0.0;
				}

				//按总价计算
				if (jiSuanMethod === 1) {
					return totalPrice * 0.01;
				}

				//按差额计算
				let priceSpread = totalPrice - houseOldPrice;
				if (priceSpread < 0) {
					return 0.00;
				}

				return priceSpread * 0.2;
			}
			// 增值税
			,getAddedValueTax(totalPrice) {
				let formData = this.formData;
				let topTabCurrentIndex = this.topTabCurrentIndex;
				let buyYear = Number(formData[topTabCurrentIndex].buyYear);
				if (buyYear !== 3) {
					return 0.0;
				}

				return totalPrice * 0.0556;
			}
			/**
			 * 土地出让金
			 * @param  土地出让金 = 平均指导价 * 建筑面积 * 1%
			 * @return 平均指导价 这个每个地方不一样，我们的计算器就按单价计算
			 */
			,getLandTransferringFees(totalPrice) {
				return totalPrice * 0.01;
			}


			// 更新图表
			,upEchartNoZuHe() {
				let chartIdMap = {
					0: "pieChartId"
					,1: "common_pieChartId"
					,2: "group_pieChartId"
					,3: "newHouse_pieChartId"
				};
				let id = chartIdMap[this.topTabCurrentIndex];
				let formData = this.formData;
				let series =  [
					{data: parseInt(formData[this.topTabCurrentIndex].liXiPrice)
						, color: "#f6cf41"}
					// ,{data: parseInt(formData[this.topTabCurrentIndex].firstPayPrice)
					// 	, color: "#6ebfff"}
					,{data: parseInt(formData[this.topTabCurrentIndex].daiKuanPrice)
						, color: "#5da8fe"}
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

				new wxCharts({
					canvasId: id,
					type: "ring",
					series: series,
					background: "#ffffff",
					disablePieStroke: true,
					animation: false,
					width: 150,
					height: 150,
					dataLabel: false,
					legend:false,
					extra:{
						pie:{
							offsetAngle:-90
						},
						ringWidth : 32
					}
				});
			}


			// 查看计算结果详情
			,lookResDetail() {
				console.log("计算结果详情");
			}


			// picker点击弹窗
			,cancelToast(type) {
				if (!type) return;

				let obj = {};
				obj[type] = false;
				this.setData(obj);
			}
			,confirmToast(type) {
				if (!type) return;

				this.cancelToast(type);
				let eventMap = {
					"firstPayToastViewShow": "firstPayToastEvent"
					,"yearNumToastViewShow": "yearNumToastEvent"
					,"businessLiLvToastViewShow": "businessLiLvToastEvent"
					,"commonLiLvToastViewShow": "commonLiLvToastEvent"
				};
				this[eventMap[type]]();

			}
			,showToast(type) {
				if (!type) return;

				let obj = {};
				obj[type] = true;
				this.setData(obj);
			}
			,toastPickerChange(e) {
				this.private.pickerChangeIndex = e.detail.value[0];
			}

			,firstPayToastEvent() {
				let pickerChangeIndex = this.private.pickerChangeIndex;
				this.setData({
					firstPickerIndex: pickerChangeIndex
				});
				this.upFirstPayVal();
			}
			,yearNumToastEvent() {
				let pickerChangeIndex = this.private.pickerChangeIndex;
				this.setData({
					yearNumIndex: pickerChangeIndex
				});
				this.upYearNumVal();
			}
			,businessLiLvToastEvent() {
				let pickerChangeIndex = this.private.pickerChangeIndex;
				this.setData({
					businessLiLvIndex: pickerChangeIndex
				});
				this.upLiLvVal(this.private.businessLiLvBiLi, pickerChangeIndex);
			}
			,commonLiLvToastEvent() {
				let pickerChangeIndex = this.private.pickerChangeIndex;
				this.setData({
					commonLiLvIndex: pickerChangeIndex
				});
				this.upLiLvVal(this.private.commonLiLvBiLi, pickerChangeIndex);
			}
		},
	}
</script>

<style>
	page{
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}
	.hoverClass{
		opacity: 0.5;
	}
	button{
		padding: 0;
		margin: 0;
		line-height: 0;
		border-radius: 0;
		border: none;
	}
	button:after{
		border: none;
	}

	.flexRowStart{
		display: flex;
	}
	.flexRowSpaceBetween{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.flexRowCenter{
		display: flex;
		justify-content: center;
	}
	.flexRowEnd{
		display: flex;
		justify-content: flex-end;
	}
	.flexColumnStart{
		display: flex;
		flex-direction: column;
	}
	.flexColumnSpaceBetween{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.flexColumnCenter{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/*顶部tab*/
	.g-top-scroll-tab{
		height: 100upx;
		line-height: 100upx;
		background-color: #FFFFFF;
		border-bottom: 1upx solid #f0f3f5;
		padding: 0 40upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 100%;
	}
	button.f-top-btn,.f-top-btn{
		line-height: 108upx;
		height: 100%;
		width: 25%;
		flex-shrink: 0;
		text-align: center;
		color: #8e94a1;
		background: #FFFFFF;
		font-size: 32upx;
		display: inline-block;
        border-radius: 0;
	}
	.f-top-btn[disabled]{
		color: #10191d;
	}
    /* #ifdef MP-ALIPAY */
    button.f-top-btn,.f-top-btn{
        height: 98upx!important;
    }
    /* #endif */
	.f-top-btn-text{
		display: inline-block;
		height: 100%;
		box-sizing: border-box;
	}
	.f-top-btn-active{
		position: relative;
		color: #10191d;
		display: block;
		font-weight: bold;
	}
	.f-top-btn-active::after{
		content: "";
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 12upx;
		height: 8upx;
		background: #ffd900;
		width: 50upx;
		border-radius: 4upx;
		box-sizing: border-box;
	}


	/*内容 swiper*/
	.swiperView{
		width: 100%;
		height: 500%;
	}
	.swiperViewItem{
		width: 100%;
		height: 100%;
	}

	.contentInfoView{
		width: 100%;
		background-color: #ffffff;
		padding-bottom: 30upx;
		box-sizing: border-box;
	}
	.contentView{
		padding-left: 40upx;
		box-sizing: border-box;
		width: 100%;
		border-bottom: 1upx solid #f5f5f5;
		background-color: #ffffff;
	}
	.contentInput{
		padding-right: 40upx;
		box-sizing: border-box;
		width: 100%;
		height: 120upx;
		line-height: 120upx;
		border-bottom: 1upx solid #f5f5f5;
	}
	.contentView .contentInput:last-child{
		border-bottom: none;
	}
	.inputLabelView{
		height: 120upx;
		line-height: 120upx;
		color: #83868f;
        flex-shrink: 0;
	}
	.inputLabel{
		color: #10191d;
		font-weight: bold;
		font-size: 32upx;
		text-align: left;
		flex-shrink: 0;
		margin-right: 2upx;
	}
	.one_four_width_label{
		width: 145upx!important;
	}
	.inputLabel::after{
		content: "";
		display: inline-block;
		width: 150upx;
	}
	.inputLabelView .inputLabel_right{
		text-align: right;
	}
	.unit{
		color: #8e94a1;
		font-size: 32upx;
		text-align: right;
		padding-left: 5upx;
		box-sizing: border-box;
		flex-shrink: 0;
		line-height: 124upx;
	}
	.contentInput .inputViewPicker{
		padding-right: 0;
		width: 100%;
		display: inline-block;
	}
	.inputView{
		height: 40upx;
		line-height: 40upx;
		box-sizing: border-box;
		font-size: 32upx;
		color: #0c0d0e;
        width: 80%;
		border: none;
		text-align: right;
        padding: 0;
        margin: auto 0;
		display: flex;
	}
	.inputView[disabled]{
		color: #bbbbbb;
	}
	.input_placeholder{
		font-weight: normal;
        color: #b5bcc1;
	}

	.right_arrow_view{
		flex-shrink: 0;
		line-height: 120upx;
		height: 120upx;
	}
	.right_arrow_img{
		width: 44upx;
		height: 44upx;
		flex-shrink: 0;
		box-sizing: border-box;
		margin: auto 0 auto auto;
	}
	.firstPayVal{
		text-align: right;
		height: 100%;
		color: #0c0d0e;
		font-size: 32upx;
	}

	.startCalculationView{
		width: 100%;
		padding: 24upx 30upx 0;
		box-sizing: border-box;
	}
	.calculation_res_tips{
		color: #8e94a1;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		font-size: 24upx;
	}
	button.startCalculation{
		width: 100%;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		background-color: #ff6f2e;
		color: #ffffff;
		font-size: 32upx;
		border-radius: 12upx;
		box-sizing: border-box;
		background: linear-gradient(to right, #fe8e0d 0%,#ff6f2e 100%);
	}


	/*结果*/

	.resultView{
		width: 100%;
		background-color: #ffffff;
		box-sizing: border-box;
		padding-bottom: 30upx;
	}
	.result_tab_btn_view{
		border-radius: 70upx;
		box-sizing: border-box;
		flex-shrink: 0;
	}
	.result_tab_btn_view > .result_tab_btn_active{
		background-color: #fd8f0c;
		color: #ffffff;
		border: none;
	}
	.result_tab_btn{
		width: 180upx;
		height: 70upx;
		line-height: 70upx;
		background-color: #ffffff;
		color: #162125;
		text-align: center;
		font-size: 30upx;
	}
	button.result_tab_btn_l{
		border-radius: 70upx 0 0 70upx;
		border-top: 1upx solid #d8d8d8;
		border-left: 1upx solid #d8d8d8;
		border-bottom: 1upx solid #d8d8d8;
	}
	button.result_tab_btn_r{
		border-radius: 0 70upx 70upx 0;
		border-top: 1upx solid #d8d8d8;
		border-right: 1upx solid #d8d8d8;
		border-bottom: 1upx solid #d8d8d8;
	}

	.contentScrollView{
		padding-bottom: 60upx;
	}

	.resultDesView{
		color: #b3b6be;
		font-size: 28upx;
		margin-top: 30upx;
	}
	.resultDes{
		width: 380upx;
		margin: 0 auto;
		text-align: center;
	}

	.canvasView{
		width: 150px;
		height: 150px;
		flex-shrink: 0;
		position: relative;
		margin-left: -45upx;
		margin-top: 30upx;
	}
	.canvas_title{
		position: absolute;
		left: 50%;
		top: 45%;
		transform: translate(-50%, -50%);
		color: #83868f;
		font-size: 32upx;
		text-align: center;
	}
	.canvas_val{
		position: absolute;
		left: 50%;
		top: 55%;
		transform: translate(-50%, -50%);
		color: #83868f;
		font-size: 32upx;
	}

	.resultTextCont{
		margin: 60upx 0 20upx 35upx;
	}
	.resultPriceView{
		height: 70upx;
		line-height: 70upx;
		font-size: 32upx;
		width: 370upx;
		color: #b3b6be;
	}
	.resultPriceView .resultPriceLabel_five{
		width: 175upx;
	}
	.resultPriceView .resultPriceLabel_five::after{
		content: "";
		display: inline-block;
		width: 175upx;
	}
	.resultPriceLabel{
		text-align: left;
		flex-shrink: 0;
		width: 160upx;
		font-size: 30upx;
		color: #8e94a1;
	}
	.resultPriceVal{
		color: #10191d;
		font-size: 30upx;
		font-weight: bold;
	}
	.resultPoint{
		width: 12upx;
		height: 12upx;
		box-sizing: border-box;
		border-radius: 100%;
		margin: auto 12upx auto -24upx;
	}

	.resultBottomDes{
		color:#b3b6be;
		font-size:23upx;
		width:100%;
		text-align:center;
		margin-top:30upx;
		margin-bottom:30upx;
	}


	/*税费计算*/
	.radioLabel{
		display: inline-block;
		margin-right: 50upx;
	}
	.radioLabel:last-child{
		margin-right: 0;
	}
	.radioView{
		margin: auto 10upx auto 0;
		position: relative;
		top: -3upx;
	}


	/*新版UI房贷计算结果*/
	.res_cont{
		padding: 0 40upx;
		box-sizing: border-box;
	}
	.res_cont_view{
		padding: 57upx 36upx 0;
		box-sizing: border-box;
		border-radius: 12upx;
		box-shadow: 0upx 0upx 10upx #e6e6e6;
		overflow: hidden;
	}
	.res_cont_title{
		line-height: 90upx;
		box-sizing: border-box;
		border-top: 1upx solid #f0f3f5;
	}
	.res_cont_title_text{
		color: #8e94a1;
		font-size: 28upx;
	}
	.res_cont_title_detail{
		font-size: 24upx;
		color: #7a8190;
		margin-right: -8upx;
	}

	/*首付切换*/
	.first_pay_img{
		width: 41upx;
		height: 31upx;
		margin: auto 18upx;
		flex-shrink: 0;
	}
	.first_pay_des{
		flex-shrink: 0;
		color: #8e94a1;
		font-size: 28upx;
        z-index: 9999;
	}



	/*弹窗*/
	.calculatorToast{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
		font-family: '微软雅黑';
		z-index: 99999;
	}
	.calculator_toast_view{
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
	.calculator_toast_title{
		height: 100upx;
		line-height: 100upx;
		background: #fff;
		font-size:32upx;
		border-bottom: 1upx solid #e5e5e5;
		box-sizing: border-box;
		flex-shrink: 0;
		padding: 0 40upx;
		display: flex;
		color: #101d36;
		flex-direction: row;
		justify-content: space-between;
	}
	/* .calculator_toast_title .calculator_toast_confirm{
		color: #ab7f2e;
	} */
	.calculator_picker{
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 32upx;
		background: #fff;
		border-color: #ab7f2e;
	}
	.calculator_toast_picker_item{
		color: #ab7f2e;
		height: 50px;
		line-height: 50px;
	}
	.uni-picker-view-indicator{
		height: 50px!important;
	}
	.calculator_toast_item{
		color: #101d36;
		font-size: 32upx;
		text-align: center;
		height: 50px;
		line-height: 50px;
	}
</style>
