<template>
	<view class="entrust_small_title">{{ title }}</view>
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
	.entrust_small_title{
		font-size:26upx;
		color:#101d36;
	}
</style>
