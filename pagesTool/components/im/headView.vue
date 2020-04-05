<template>
	<view class="head_view">
		<image mode="aspectFill" :src="headImg"></image>
	</view>
</template>

<script>
	export default {
		props: {
			headImg: {
				type: String,
				default: "http://cdn.haofang.net/static/uuminiapp/im/defaultHead.png?t=20180427"
			},
		},
	}
</script>

<style scoped>
	.head_view{
		width:40px;
		height:40px;
		overflow:hidden;
		background-color:#F2F2F2;
		flex-shrink: 0;
	}
	.head_view>image{
		width:40px;
		display:inline;
	}
</style>
