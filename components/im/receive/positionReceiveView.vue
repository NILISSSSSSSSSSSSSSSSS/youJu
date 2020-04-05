<template>
	<view @click="lookPosition" class="positionReceiveView f_c_s">
		<view class="positionReceiveName"
			v-if="item.content && item.content.name">{{ item.content.name }}</view>
		<view class="positionReceiveAddress"
			v-if="item.content && item.content.address">{{ item.content.address }}</view>
		<view class="positionReceiveView_img">
			<image src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/map/local-icon.png" 
				class="position_map_center_icon"></image>

			<image mode="aspectFill" class="positionReceiveView_url" 
				v-if="item.content && item.content.staticImg"
				:src="item.content.staticImg"></image>
		</view>	
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default() {
					return {};
				}
			},
		},
		methods: {
			lookPosition() {
				uni.openLocation({
					name: this.item.content.name,
					address: this.item.content.address,
					latitude: Number(this.item.content.lat),
					longitude:Number(this.item.content.lng),
				});
			}
		},
	}
</script>

<style scoped>
	.positionReceiveView {
		position:relative;
		margin-left:22upx;
		min-height:40upx;
		padding:0;
		box-sizing:border-box;
		width:65%;
		border-radius:15upx;
		text-align:left;
		word-break:break-all;
		background: #FFFFFF;
		overflow: hidden;
		padding: 20upx 30upx 20upx;
	}
	.positionReceiveName{
		font-size: 34upx;
		line-height: 40upx;
		color: #101D36;
		text-align: left;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		box-sizing: border-box;
	}
	.positionReceiveAddress{
		font-size: 26upx;
		line-height: 36upx;
		color: #1e18185e;
		margin: 10upx 0 20upx;
		text-align: left;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		box-sizing: border-box;
	}
	.positionReceiveView_img{
		width: 100%;
		height: 200upx;
		position: relative;
	}
	.positionReceiveView_url{
		width: 100%;
		height: 200upx;
	}
	.position_map_center_icon{
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -60upx;
		margin-left: -16upx;
		width: 36upx;
		height: 60upx;
		z-index: 1;
	}
</style>

