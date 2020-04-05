<template>
	<view class="entrust_title_common">{{ title }}</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ""
			},
		},
	}
</script>

<style scoped>
	.entrust_title_common{
		text-align: left;
		font-size: 36upx;
		color: #101d36;
		height: 40upx;
		line-height: 40upx;
		position: relative;
		font-weight: bold;
		padding-left: 20upx;
		box-sizing: border-box;
	}
	.entrust_title_common::before{
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		content: ' ';
		width: 8upx;
		height: 34upx;
		border-radius: 4upx;
		will-change: transform;
		flex-shrink: 0;
		background-color: #ffd900;
		box-shadow: 1upx 0 9upx 0 rgba(255, 217, 0, 0.38);
		margin: auto 8upx auto 0;
	}
</style>
