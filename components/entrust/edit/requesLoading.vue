<template>
	<!-- 数据提交中 -->
	<view class="load">
		<view class="load-content">
			<view class="loading-pic"></view>
			<view class="loading-text">数据提交中</view>
		</view>
	</view>
</template>

<script>
</script>

<style scoped>
	.load {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		max-width: 1280upx;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0);
		z-index: 300;
	}
	.load-content {
		position: absolute;
		left: 50%;
		top: 40%;
		width: 160upx;
		height: 160upx;
		margin-left: -60upx;
		background-color: rgba(0, 0, 0, .6);
		border-radius: 12upx;
		will-change: transform;
	}
	.loading-text {
		font-size: 24upx;
		color: #fff;
		text-align: center;
	}
	.loading-pic {
		display: block;
		width: 60upx;
		height: 60upx;
		margin: 26upx auto 20upx;
		background: url(https://zdzfapi.haofang.net/PublicC/images/publish/index/loading_circle_white.png) center no-repeat;
		background-size: 100% 100%;
		animation: loading 3s linear infinite;
		-webkit-animation: loading 3s linear infinite;
	}
	@keyframes loading {
		0% {
			transform: rotate(0deg)
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
