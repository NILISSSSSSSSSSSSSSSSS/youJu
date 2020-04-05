<template>
	<view class="go_back_home_view" 
		@click="goBackHome"
		:class="isIphoneX ? 'go_back_home_view_iphoneX' : ''"></view>
</template>

<script>
	export default {
		data() {
			return {
				isIphoneX: this.CheckIsIphoneX.init()
			}
		},
		
		methods: {
			// 回到首页
			goBackHome() {
				this.$emit("onGoBackHomeChanged", true);
				uni.switchTab({
					url: "/pages/index/index"
				});
			}
		},
	}
</script>

<style scoped>
	.go_back_home_view{
		position:fixed;
		right:2upx;
		bottom:120upx;
		z-index:101;
		background:url('http://cdn.haofang.net/static/wxPlusApp/yjk/btn_home.png')  no-repeat center center;
		background-size:100%;
		height:106upx;
		width:106upx;
		box-shadow: 0 0 33.2upx 1.8upx rgba(116, 116, 116, 0.2);
		border-radius: 50%;
	}
	.go_back_home_view.go_back_home_view_iphoneX{
		bottom: 154upx;
	}
</style>
