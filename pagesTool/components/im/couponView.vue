<template>
	<!-- 优惠券 -->
	<view class="coupon_view f_c_c" @touchmove.stop.prevent="moveHandle">
		<!-- 领取优惠券 -->
		<view class="coupon_get" v-if="item.couponStatus == 0">
			<view class='coupon-user-img'>
				<image :src='item.agentHead' mode="aspectFill"></image>
			</view>
			<view class='coupon-user-name'>{{ item.agentName }}-{{ item.deptName }}</view>
			<view class='coupon-desc'>送您一张专属{{ item.caseType == 1 ? '买房' : '租房' }}优惠券，成交可在线下抵扣等额中介费用</view>
		
			<view class='coupon-mobile'>
				<input maxlength='11' type="number"
					v-model="couponMobile"
					placeholder="请输入手机号,领取优惠券"
					placeholder-class="phcolor"></input>
			</view>
			<view class='get-coupon-icon' @click='receiveCouponAction'></view>
			
			<image @click="closeCoupon" class="coupon_display_close_get"
				src="http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_close.png"></image>
		</view>
		
		<!-- 优惠券详情 -->
		<view class="coupon_detail" v-else-if="item.couponStatus == 2">
			<view class='display-coupon-top'>{{ item.caseType == 1 ? '买房' : '租房' }}专属优惠券</view>
			<view class='display-coupon-many' v-if="item.discountType == 1">
				<view class='price-num'>{{ item.couponMoney }}</view>
				<view class='price-unit'>折</view>
			</view>
			<view class='display-coupon-many' v-else>
				<view class='price-unit'>￥</view>
				<view class='price-num'>{{ item.couponMoney }}</view>
			</view>
			<view class='display-coupon-time'>有效期至: {{ item.validTime }}</view>
			
			<view class='coupon-archive-img'>
				<image :src="item.agentHead" mode="aspectFill"></image>
			</view>
			
			<view class='coupon-archive-deptname'>{{item.agentName}}-{{item.deptName}}</view>
		
			<view class='coupon-qrcode'><canvas canvas-id="myQrcode" id="myQrcode"></canvas></view>
			<view class='coupon-display-listen'>委托成交后线下展示此二维码，每单可使用一张优惠券抵扣等额中介费用哦</view>
		
			<image @click="closeCoupon" class="coupon_display_close"
				src="http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_close.png"></image>
		</view>
		
		<!-- 失效 -->
		<view class="coupon_no_use" v-else>
			<view class="coupon_no_use_title">此优惠券已失效</view>
			<view class="coupon_no_head_view f_r_c">
				<image :src="item.agentHead" mode="aspectFill"></image>
			</view>
			<view class="coupon_no_name">{{ item.agentName }}</view>
			<view class="coupon_no_des">专属经纪人{{ item.agentName }}送你一个专属优惠券可用来抵用专属买房、租房佣金</view>
			<image @click="closeCoupon" class="coupon_no_close" 
				src="http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_close.png"></image>
		</view>
	</view>
</template>

<script>
	import drawQrcode from '@/static/mp-weixin/weapp.qrcode.esm.js';
	import { ReceiveCoupon } from "@/net/im/CouponDetail.js";
	
	class CouponInfoItem {
		archiveId = "";  // 经纪人id
		agentHead = "";
		agentName = "";
		couponStatus = "";  // 优惠券状态
		discountType = "";   // 打折还是抵扣 1: 打折 其他: 抵扣
		couponMoney = "";  // 优惠券抵扣的钱
		validTime = "";  // 有效期
		deptName = "";  // 公司名称
		voucherUrl = "";  // 二维码canvas路径
		couponId = "";  // 优惠券id
		userId = "";  // 用户userId
	}
	
	export default {
		props: {
			item: {
				type: Object,
				default() {
					return new CouponInfoItem();
				}
			},
		},
		
		watch: {
			item(newValue, oldValue) {
				this.initCanvas();
			}
		},
		
		mounted() {
			this.initCanvas();
		},
		
		data() {
			return {
				couponMobile: "",  // 领取优惠券的手机号
			}
		},
		
		methods: {
			moveHandle() {},

			// 生成优惠券兑换二维码
			initCanvas(callback = function() {}) {
				let windowInfo = uni.getSystemInfoSync();
				let windowWidth = windowInfo.screenWidth / 750 * 180;
				if(!this.item.voucherUrl) return;
				
				setTimeout(() => {
					drawQrcode({
						width: windowWidth,
						height: windowWidth,
						canvasId: 'myQrcode',
						text: this.item.voucherUrl,
						typeNumber: 4
					});
				},200);
			},
			
			// 领取优惠券
			receiveCouponAction() {
				let reg = /^((1[3-9][0-9])+\d{8})$/;
				let couponMobile = this.couponMobile;
				couponMobile = couponMobile.replace(/\s+/g, "");
				if(!couponMobile) {
					uni.showToast({
						icon: "none",
						title: "请输入手机号"
					});
					return;
				}
				
				if(couponMobile.length < 11) {
					uni.showToast({
						icon: "none",
						title: "请输入11位手机号"
					});
					return;
				}
				
				if(!(reg.test(couponMobile))) {
					uni.showToast({
						icon: "none",
						title: "手机号格式不正确"
					});
					return;
				}
				
				if(!this.item.couponId || !this.item.archiveId || !this.item.userId) {
					uni.showToast({
						icon: "none",
						title: "暂无couponId/archiveId/userId"
					});
					return;
				}
			
				uni.showLoading({title: "领取中..."});
				new ReceiveCoupon({
					couponId: this.item.couponId,
					shareArchiveId: this.item.archiveId,
					wxMobile: couponMobile,
					youyouUserId: this.item.userId
				}).send()
					.then(res => {
						uni.hideLoading();
						if(res.errCode != 200) {
							uni.showToast({
								title: res.errMsg || "领取失败",
								icon: "none"
							});
							return;
						}
						
						this.$emit("onCouponReceiveChanged", true);
					})
					.catch(err => {
						uni.showToast({
							title: "领取失败",
							icon: "none"
						});
					});
			},
			
			// 关闭弹窗
			closeCoupon() {
				this.$emit("onCloseCouponChanged", false);
			},
		},
	}
</script>

<style scoped>
	.coupon_view{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 500;
	}
	/* 失效 */
	.coupon_no_use{
		width:570upx;
		height:766upx;
		margin:0 auto;
		position:relative;
		background-image:url(http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_fail_bg.png);
		background-repeat:no-repeat;
		background-size:cover;
		border-radius:40upx;
	}
	.coupon_no_use_title{
		text-align:center;
		margin:160upx auto 0;
		height:47upx;
		font-family:PingFang-SC-Medium;
		font-size:50upx;
		font-weight:normal;
		font-stretch:normal;
		line-height:38upx;
		letter-spacing:0px;
		color:#b11f18;
	}
	.coupon_no_head_view{
		margin:160upx auto 0;
		width:121upx;
		height:121upx;
		background-color:#f97541;
		border:solid 4upx #ffffff;
		border-radius:50%;
		overflow:hidden;
	}
	.coupon_no_head_view>image{
		width:100%;
		height:100%;
		border-radius:50%;
	}
	.coupon_no_name{
		margin:30upx auto 0;
		height:27upx;
		font-size:34upx;
		font-weight:normal;
		font-stretch:normal;
		text-align:center;
		line-height:34upx;
		letter-spacing:0upx;
		color:#ffffff
	}
	.coupon_no_des{
		margin:50upx auto 0;
		width:400upx;
		height:54upx;
		font-family:PingFang-SC-Medium;
		font-size:24upx;
		font-weight:normal;
		font-stretch:normal;
		line-height:30upx;
		letter-spacing:0px;
		color:#ffffff;
		opacity:0.5;
		text-align:center;
	}
	.coupon_no_close{
		width:66upx;
		height:66upx;
		position:absolute;
		bottom:-100upx;
		left:0;
		right:0;
		margin:0 auto;
	}

	/* 详情 */
	.coupon_detail{
		width: 100%;
		height:990upx;
		margin:0 auto;
		position:relative;
		background-image:url(http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_detail_bg.png);
		background-repeat:no-repeat;
		background-size:cover;
		border-radius:40upx;
	}
	.display-coupon-top{
		position: relative;
		width: 470upx;
		top: 120upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
		height: 60upx;
		font-size: 36upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 60upx;
		letter-spacing: 0px;
		color: #ff7c00;
		vertical-align: middle;
	}
	.display-coupon-top::before{
		content:'';
		background-image:url(http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_top_leftbot.png);
		background-size:52upx 25upx;
		position: absolute;
		width:52upx;
		height:25upx;
		z-index: 100;
		left: 30upx;
		top: 50%;
		margin-top: -12upx;
	}
	.display-coupon-top::after{
		content:'';
		background-image:url(http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_top_rightbot.png);
		background-size:52upx 25upx;
		position: absolute;
		width:52upx;
		height:25upx;
		z-index: 100;
		right:30upx;
		top: 50%;
		margin-top: -12upx;
	}
	.display-coupon-many{
		position: relative;
		width: 470upx;
		top: 170upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
		height: 60upx;
		font-size: 36upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 60upx;
		letter-spacing: 0px;
		color: #ff7c00;
		vertical-align: middle;
	}
	.display-coupon-many .price-unit{
		display: inline-block;
		width: 32upx;
		height: 41upx;
		font-family: MicrosoftYaHei-Bold;
		font-size: 54upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 38upx;
		letter-spacing: 0upx;
		color: #ff7c00;
	}
	.display-coupon-many .price-num{
		display: inline-block;
		height: 83upx;
		font-family: PingFang-SC-Heavy;
		font-size: 110upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 38upx;
		letter-spacing: 0upx;
		color: #ff7c00;
		padding-left: 20upx;
	}
	.display-coupon-time{
		position: relative;
		top: 200upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		height: 23upx;
		font-family: MicrosoftYaHei;
		font-size: 22upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 38upx;
		letter-spacing: 0upx;
		color: #cccccc;
		text-align: center;
	}
	.coupon-archive-img{
		position: relative;
		top: 220upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 121upx;
		height: 121upx;
		background-color: #f97541;
		border: solid 4upx #ffffff;
		border-radius: 50%;
		overflow: hidden;
	}
	.coupon-archive-img image{
		width: 121upx;
		height: 121upx;
		border-radius: 50%;
	}
	.coupon-archive-deptname{
		position: relative;
		top: 240upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		height: 27upx;
		font-size: 28upx;
		font-weight: normal;
		font-stretch: normal;
		text-align: center;
		line-height: 34upx;
		letter-spacing: 0upx;
		color: #ffffff;
	}
	.coupon-qrcode{
		position: relative;
		top: 260upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 180upx;
		height: 180upx;
		line-height: 190upx;
		background-color: #ffffff;
		text-align: center;
		vertical-align: middle;
		padding:10upx;
	}
	.coupon-qrcode canvas{
		width: 100%;
		height: 100%;
		vertical-align: middle;
	}
	.coupon-display-listen{
		position: relative;
		top: 290upx;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 450upx;
		height: 59upx;
		font-size: 24upx;
		font-weight: normal;
		font-stretch: normal;
		text-align: center;
		line-height: 31upx;
		letter-spacing: 0upx;
		color: #ffffff;
		opacity: 0.5;
	}
	.coupon-success{
		width: 590upx;
		background-color: #fef6e9;
		margin: 0 auto;
		text-align: left;
		font-size: 24upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 50upx;
		letter-spacing: 0px;
		color: #fe943e;
		padding: 25upx 30upx;
		margin-bottom: 20upx;
	}
	.coupon_display_close{
		width:66upx;
		height:66upx;
		position:absolute;
		bottom:14upx;
		left:0;
		right:0;
		margin:0 auto;
	}
	.coupon_display_close_get{
		width:66upx;
		height:66upx;
		position:absolute;
		bottom:-28upx;
		left:0;
		right:0;
		margin:0 auto;
	}

	/* 领取 */
	.coupon_get{
		width:100%;
		height:961upx;
		margin:auto;
		position:relative;
		background-image:url(http://cdn.haofang.net/static/uuminiapp/im/coupon/get_coupon_bg.png);
		background-repeat:no-repeat;
		background-size:cover;
		border-radius:40upx;
	}
	.coupon-user-img{
		width: 121upx;
		height: 121upx;
		background-color: #f97541;
		border-radius: 50%;
		overflow: hidden;
		position: absolute;
		top: 170upx;
		margin: 0 auto;
		left: 0;
		right: 0;
	}
	.coupon-user-img image{
		width:121upx;
		display: inline;
	}
	.coupon-user-name{
		font-size: 34upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 38upx;
		letter-spacing: 0px;
		color: #ffffff;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
		top: 300upx;
	}
	.coupon-desc{
		width: 420upx;
		height: 54upx;
		text-align: center;
		font-size: 24upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 28upx;
		letter-spacing: 0px;
		color: #ffffff;
		opacity: 0.5;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: 370upx;
	}
	.coupon-mobile{
		width: 450upx;
		height: 80upx;
		background-color: #bf342b;
		border-radius: 10px;
		opacity: 0.7;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: 470upx;
	}
	.coupon-mobile input{
		width: 450upx;
		height: 80upx;
		padding-left: 10upx;
		text-align: center;
		font-size: 36upx;
		color: #ffffff;
	}
	.get-coupon-icon{
		width: 120upx;
		height: 150upx;
		border: none;
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: 600upx;
	}
	.coupon-mobile .phcolor{
		width: 100%;
		height: 33upx;
		font-size: 28upx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0;
		text-align: center;
		color: rgba(0,0,0,0.5);
		margin: auto;
	}
</style>
