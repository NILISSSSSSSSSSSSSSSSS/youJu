<template>
	<!-- 接收B端定位显示 -->
	<view class="siteReceiveView" @click="guidance"><image mode="widthFix" :src="item.content"></image></view>
</template>

<script>
export default {

	methods: {
		guidance(){
			
		}
	}
};
</script>

<style scoped>
.siteReceiveView {
	background-color: #ffffff;
	color: #fff;
	word-break: break-all;
	line-height: 1.5;
	position: relative;
	margin-right: 22upx;
	min-height: 40px;
	padding: 19upx 20upx;
	box-sizing: border-box;
	max-width: 65%;
	border-radius: 15upx;
	text-align: left;
	font-size: 15px;
}
</style>
