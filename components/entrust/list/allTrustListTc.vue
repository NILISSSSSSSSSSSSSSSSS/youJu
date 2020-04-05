<template>
	<view class="allTrustListTc" @touchmove.stop.prevent="moveHandle"
		  @click="allTrustListTcCancel">
		<view class="allTrustListTc_cont">
			<view @click="pushEntrust('4')" class="allTrustListTc_item f_r_c">
				<image mode="aspectFill"
					src="http://cdn.haofang.net/static/uuminiapp/personalCenter/trust-zufang-icon.png"></image>
				<view>我要租房</view>
			</view>
			
			<view @click="pushEntrust('3')" class="allTrustListTc_item f_r_c">
				<image mode="aspectFill"
					src="http://cdn.haofang.net/static/uuminiapp/personalCenter/trust-maifang-icon.png"></image>
				<view>我要买房</view>
			</view>
			
			<view @click="pushEntrust('2')" class="allTrustListTc_item f_r_c">
				<image mode="aspectFill"
					src="http://cdn.haofang.net/static/uuminiapp/personalCenter/trust-chuzu-icon.png"></image>
				<view>我要出租</view>
			</view>
			
			<view @click="pushEntrust('1')" class="allTrustListTc_item f_r_c">
				<image mode="aspectFill"
					src="http://cdn.haofang.net/static/uuminiapp/personalCenter/trust-chushou-icon.png"></image>
				<view>我要出售</view>
			</view>
			
			<view @click.stop="allTrustListTcCancel" class="allTrustListTc_cancel">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			moveHandle() {},
			allTrustListTcCancel() {
				this.$emit("onAllTrustCancelChange", false);
			},
			
			pushEntrust(caseType) {
				let url = "/pagesEntrust/entrust/entrust?caseType=" + caseType;
				if(caseType == 1 || caseType == 2) {
					url = "/pagesEntrust/registration/registration?caseType=" + caseType;
				}
				uni.navigateTo({
					url: url
				});
				this.allTrustListTcCancel();
			}
		},
	}
</script>

<style scoped>
	.allTrustListTc{
		position:fixed;
		top:0;
		bottom:0;
		left:0;
		right:0;
		margin:auto;
		height:100%;
		z-index:1110;
		width:100%;
		background:rgba(0,0,0,0.3);
	}
	.allTrustListTc_cont{
		position:absolute;
		bottom:0;
		width:100%;
		background:#fff;
		text-align:center;
	}
	.allTrustListTc_item{
		font-size:30upx;
		color:#333;
		padding:30upx 0;
		border-bottom:1px solid #efefef;
	}
	.allTrustListTc_item>image{
		width: 38upx;
		height: 38upx;
		margin: auto 15upx auto 0;
		flex-shrink: 0;
	}
	.allTrustListTc_cancel{
		font-size:30upx;
		color:#333;
		padding:30upx 0;
	}
</style>
