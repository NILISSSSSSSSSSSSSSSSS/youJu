<template>
	<view class="imgReceiveView">
		<image mode="widthFix" :src="item.content"></image>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: {}
			},
		}
	}
</script>

<style scoped>
	.imgReceiveView {
		color:#041c0c;
		line-height:1.5;
		position:relative;
		margin-left:22upx;
		min-height:40upx;
		padding:0;
		box-sizing:border-box;
		max-width:65%;
		border-radius:15upx;
		text-align:left;
		word-break:break-all;
		font-size:15px;
		background: transparent;
		overflow: hidden;
	}
	.imgReceiveView>image{
		border-top-right-radius:20upx;
		border-bottom-left-radius:20upx;
		border-bottom-right-radius:20upx;
		width:200px;
	}
</style>
