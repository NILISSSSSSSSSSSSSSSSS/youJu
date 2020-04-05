<template>
	<view>
		<view class="houseReceiveView" v-if="item.content">
			<view @click="lookHouseDatail(item.content)" 
				class="houseReceiveView_title">{{ item.content.houseTitle }}</view>
			<view @click="lookHouseDatail(item.content)" class="f_r_s">
				<view class="houseReceiveView_img_view">
					<image mode="aspectFill" :src="item.content.houseImg"></image>
				</view>
		
				<view class="houseReceiveView_cont">
					<view class="houseReceiveView_name">{{ item.content.houseName }}</view>
					<view class="f_r_s houseReceiveView_ting">
						<view class="houseReceiveView_ting_info">{{ item.content.houseTing }}</view>
						<view v-if="item.content.houseArea">面积{{ item.content.houseArea }}{{ item.content.houseAreaUnit }}</view>
					</view>
					<view v-if="item.content.houseTotalPrice" 
						class="main_color houseReceiveView_total">{{ item.content.houseTotalPrice }}<text>{{ item.content.houseTotalPriceUnit }}</text></view>
					<view class="gray_color houseReceiveView_no_price" v-else>价格面议</view>
				</view>
			</view>
		
			<!-- 委托状态标签 -->
			<view class="house-status-tag" :class="'tag-' + item.content.delStatus"></view>
		
			<!-- 看房/不看 -->
			<view v-if="item.content.seeStatus == 0 && item.content.delStatus != 1" 
				class="f_r_c entrust_re_look_or">
				<view @click="noLookHouse(item.content)" class="entrust_re_no">不看该房</view>
				<view @click="agreeLookHouse(item.content)">同意看房</view>
			</view>
			
			<view class="entrust-btns"
				style="display: none;"
				v-else-if="item.content.seeStatus == 0 && item.content.delStatus == 1">
			</view>
			<!-- 已同意看房 -->
			<view class="entrust-btns" v-else-if="item.content.seeStatus == 1">
				<view class="has-see-house">已同意看房</view>
			</view>
			
			<!-- 带看评价 -->
			<view class="entrust-btns" v-else-if="item.content.seeStatus == 2">
				<view @click="writeEvaluate(item.content)" 
					class="see-house-prise">带看评价</view>
			</view>
			
			<!-- 匿名带看评价已提交 -->
			<view class="entrust-btns"
				v-else-if="item.content.seeStatus == 3 && item.content.brokerMoney == -1 && item.content.delStatus != 1">
				<view class="has-see-house">匿名带看评价已提交</view>
			</view>
			
			<!-- 佣金支付 -->
			<view class="entrust-btns" 
				v-else-if="item.content.seeStatus == 3 && item.content.brokerMoney >= 0">
				<view @click="payMoney(item.content)" class="see-house-prise">佣金支付</view>
			</view>
		
			<!-- 服务评价(匿名) -->
			<view class="entrust-btns"
				v-else-if="item.content.seeStatus == 4 && item.content.isEvaluate == 0">
				<view @click="serviceFinishWrite(item.content)" class="house-eva">服务评价(匿名)</view>
				<view class="entrust-success"></view>
			</view>
			
			<!-- 完成交易 -->
			<view class="entrust-success"
				v-else-if="item.content.seeStatus == 4 && item.content.isEvaluate==1"></view>
		
			<!-- 带看评价弹窗 -->
			<evaluate v-if="evaluateTc" :recomInfoId="recomInfoId"
				:entrustId="entrustId"
				@onEvaluateFinishChanged="onEvaluateFinishChanged"
				@onEvaluateChanged="onEvaluateChanged">
			</evaluate>
			
			<!-- 服务评价弹窗 -->
			<serviceStar v-if="serviceStarTc" :evaStar="starNum"
				:entrustId="entrustId" :archiveId="archiveId"
				:payMoney="payMoneyVal" :cityId="cityId"
				@onServiceCloseChanged="onServiceCloseChanged"
				@onFinishServiceChanged="onFinishServiceChanged">
			</serviceStar>
		</view>
		
		<view v-if="item.content.tips" class="house-tips">{{ item.content.tips }}</view>
	</view>
</template>

<script>
	import { DisAgreeLookHouse, AgreeLookHouse,
		WriteServiceEvaluate } from "@/net/entrust/EntrustDetail.js";
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import evaluate from "@/components/entrust/detail/evaluate.vue";
	import serviceStar from "@/components/entrust/detail/serviceStar.vue";
	
	// 处理二手房item外的其他字段
	class EntrustReceiveItem {
		delStatus = "";
		seeStatus = "";  // 带看状态
		brokerMoney = ""; // 支付的钱
		isEvaluate = "";
		recomInfoId = "";
		isVip = "";
		entrustId = "";  // 委托id
		tips = "";  // 描述文案
	}
	
	export default {
		props: {
			item: {
				type: Object,
				default() {
					return {};
				}
			},
			isShield: {
				type: String | Number,
				default() {
					return 0;
				}
			},
			archiveId: {
				type: String | Number,
				default() {
					return "";
				}
			}
		},
		
		data() {
			return {
				recomInfoId: "",
				entrustId: "",
				cityId: "",
				evaluateTc: false,
				serviceStarTc: false,
				starNum: 4,  // 服务评分
				payMoneyVal: "",  // 支付的费用
			}
		},
		
		components: {
			evaluate,
			serviceStar
		},
		
		methods: {
			// 查看房源详情
			lookHouseDatail(item) {
				uni.navigateTo({
				    url: "/pagesHouse/erHouseDetail/erHouseDetail?cityId="+item.cityId+"&caseId="+item.houseId
				        +"&caseType="+item.caseType+"&resource="+item.reSource+"&houseName="+item.houseName
						+"&pageFrom=im"
				});
			},
			
			// 检查屏蔽状态
			checkShiledStatus() {
				if (this.isShield == 1) {
					uni.showToast({ 
						title: '您已把对方屏蔽，解除屏蔽后才能进行联系', 
						icon: 'none',
					});
					return true;
				}
				
				return false;
			},
			
			// 不看该房源
			noLookHouse(item) {
				if(this.checkShiledStatus()) return;

				let that = this;
				new DisAgreeLookHouse({
					recomInfoId: item.recomInfoId,
					isVip: item.isVip
				}).send()
					.then(res => {
						if(res.STATUS != 1) {
							uni.showToast({
								icon: "none",
								title: "操作失败"
							});
							return;
						}
						
						uni.showToast({
							title: '操作成功',
							icon: 'success',
							success:function(){
								that.$emit("onEntrustHouseChanged", true);
							}
						});
					})
					.catch(err => {
						uni.showToast({
							icon: "none",
							title: "操作失败"
						});
					});
			},
			
			// 同意看房
			agreeLookHouse(item) {
				if(this.checkShiledStatus()) return;

				let that = this;
				let me = new UserInfoModel().getModel("me") || {};
				if(!me.userId) return;
				
				new AgreeLookHouse({
					recomInfoId: item.recomInfoId,
					userId: me.userId,
					isVip: item.isVip
				}).send()
					.then(res => {
						if(res.STATUS != 1) {
							uni.showToast({
								icon: "none",
								title: "操作失败"
							});
							return;
						}
						
						uni.showToast({
							title: '操作成功',
							icon: 'success',
							success:function(){
								that.$emit("onEntrustHouseChanged", true);
							}
						});
					})
					.catch(err => {
						uni.showToast({
							icon: "none",
							title: "操作失败"
						});
					});
			},
		
			// 填写评价
			writeEvaluate(item) {
				if(this.checkShiledStatus()) return;

				this.recomInfoId = item.recomInfoId;
				this.entrustId = item.entrustId;
				this.evaluateTc = true;
			},
			// 评价弹窗回调
			onEvaluateChanged(val) {
				this.evaluateTc = val;
			},
			// 评价成功回调
			onEvaluateFinishChanged(val) {
				this.$emit("onEntrustHouseChanged", true);
			},
			
			// 佣金支付
			payMoney(item) {
				// #ifndef MP-WEIXIN
				uni.showModal({
					showCancel: false,
					confirmText: "我知道了",
					confirmColor: "#FF4500",
					title: "温馨提示",
					content: "请使用微信悠居客小程序或悠居客App支付佣金"
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: "/pagesEntrust/payEntrustMoney/payEntrustMoney?recomInfoId="
						+ item.recomInfoId + "&pushLogId=" + item.entrustId
						+ "&money=" + item.brokerMoney
						+ "&caseId=" + item.houseId
						+ "&caseType=" + (item.caseType + 2)
						+ "&cityId=" + item.cityId
				});
				// #endif
			},
			
			// 服务评价
			serviceFinishWrite(item) {
				if(this.checkShiledStatus()) return;
				
				this.entrustId = item.entrustId;
				this.cityId = item.cityId;
				new WriteServiceEvaluate({pushLogId: this.entrustId}).send()
					.then(res => {
						if(res.STATUS != 1) {
							uni.showToast({
								icon: "none",
								title: "获取评价失败"
							});
							return;
						}
						
						this.payMoneyVal = (res.DATA || {}).realPayMoney4C || "";
						let starNum = 4;
						if(res.DATA && res.DATA.evaStar && res.DATA.evaStar > 0) {
							starNum = res.DATA.evaStar;
						}
						this.starNum = starNum;
						this.serviceStarTc = true;
					})
					.catch(err => {
						uni.showToast({
							icon: "none",
							title: "获取评价失败"
						});
					});
			},
			// 服务评价结果回调
			onFinishServiceChanged() {
				this.serviceStarTc = false;
				this.$emit("onEntrustHouseChanged", true);
			},
			// 服务评价关闭回调
			onServiceCloseChanged(val) {
				this.serviceStarTc = val;
			},
		},
	}
</script>

<style scoped>
	.house-tips{
		color: #fea33f;
		font-size: 20upx;
		line-height: 30upx;
		margin-top: 30upx;
		background: #fef6e9;
		border-radius: 10upx;
		padding: 20upx;
		max-width: 80%;
		box-sizing: border-box;
		margin-left: 22upx;
	}
	/* 看/不看 */
	.entrust_re_look_or{
		height:60upx;
		line-height:60upx;
		width:100%;
		text-align:center;
		margin-top:20upx;
	}
	.entrust_re_look_or>view{
		width:40%;
		text-align:center;
		box-sizing: border-box;
		border:2upx solid #4daaf0;
		border-radius: 10upx;
		color:#4daaf0;
	}
	.entrust_re_look_or>.entrust_re_no{
		border:2upx solid #999;
		margin-right:20upx;
		color: #101D36;
	}
	
	/* 委托状态标签 */
	.house-status-tag{
		position: absolute;
		top: 33upx;
		right: 22upx;
		width: 130upx;
		height: 105upx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center center;
	}
	.tag-1{
		background-image: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/refuse_house.png);
	}
	.entrust-btns{
		height: 60upx;
		line-height: 60upx;
		width: 100%;
		text-align: center;
		margin-top: 20upx;
	}
	
	.has-see-house,.has-eva-house{
		width: 100%;
		height: 60upx;
		line-height: 60upx;
		color: #B6B6B6;
		background: #f2f2f2;
		text-align: center;
	}
	.see-house-prise{
		color: #ff864a;
		border: 2upx solid #ff864a;
		width: 50%;
		margin:0 auto;
		border-radius: 10upx;
	}
	.house-eva{
		color: #ff864a;
		border: 2upx solid #ff864a;
		width: 60%;
		margin:0 auto;
		border-radius: 10upx;
	}
	.entrust-success{
		position: absolute;
		top: 20upx;
		right: 0;
		background-size:100% 100%;
		background-position:center center;
		background-repeat:no-repeat;
		width:170upx;
		height:112upx;
		background-image:url('http://cdn.haofang.net/static/uuminiapp/personalCenter/enstrust-chengjiao.png');
	}
	
	
	/* 房源信息 */
	.houseReceiveView{
		position: relative;
		background-color: #FFFFFF;
		color: #fff;
		word-break: break-all;
		line-height: 1.5;
		position:relative;
		margin-left:22upx;
		min-height:40px;
		padding:19upx 20upx;
		box-sizing: border-box;
		max-width: 80%;
		border-radius:15upx;
		text-align:left;
		font-size:15px;
	}
	.houseReceiveView_title{
		margin-bottom:20upx;
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
		font-size:30upx;
		color:#424242;
		font-weight:800;
	}
	.houseReceiveView_img_view{
		width:150upx;
		height:120upx;
		margin-right:20upx;
		flex-shrink: 0;
		background:url('http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png') #f5f5f5 no-repeat center;
		background-size:100% 100%;
	}
	.houseReceiveView_img_view>image{
		width:100%;
		height:100%;
	}
	.houseReceiveView_cont{
		overflow:hidden;
		-webkit-box-flex:1;
	}
	.houseReceiveView_name{
		max-width:100%;
		text-overflow:ellipsis;
		overflow:hidden;
		line-height:1;
		white-space:nowrap;
		padding-bottom:10upx;
		color:#898989;
		font-size:28upx;
	}
	.houseReceiveView_ting{
		font-size:26upx;
		color:#898989;
		line-height:1.5;
		max-width:100%;
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
	}
	.houseReceiveView_ting_info{
		margin-right: 10upx;
	}
	.houseReceiveView_total{
		line-height:1.5;
		max-width:100%;
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
		font-size:33upx;
		font-weight: bold;
	}
	.houseReceiveView_total>text{
		display:inline-block;
		font-size:22upx!important;
		font-weight:normal;
	}
	.houseReceiveView_no_price{}
</style>
