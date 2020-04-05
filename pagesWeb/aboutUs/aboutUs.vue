<template>
	<view>
		<view class="logo_view">
			<image :src="platformIcon"></image>
		</view>
		<view class="logo_title">{{platformTitle}}</view>
		<view class="about_cont">{{platformTitle}}，全国物业房源，覆盖全国365个城市，业务涵盖新房、二手房、整租、合租、公寓等业务，每日更新上万条物业房源为您提供专业安全找房服务</view>
		<view @click="takePhone" class="service_tel">客服电话<text style="margin-left: 8upx;">{{servicePhone}} 转1</text></view>
	</view>
</template>

<script>
	export default {
		computed: {
			servicePhone() {
				return this.Const.servicePhone;
			},
			platformTitle(){
				return this.Const.platformTitle;
			},
			platformIcon(){
				let platformIcon = this.Const.platformLogonIcon?this.Const.platformLogonIcon:'https://cdn.haofang.net/static/storeWxApp/uu_platform/im_service_icon.png';
				return platformIcon
			},
		},
		methods: {
			takePhone() {
				this.DifferenceApi.makePhoneCall(this.Const.serviceTakePhone);
			}
		}
	}
</script>

<style>
	.logo_view {
		width: 136upx;
		height: 136upx;
		overflow: hidden;
		margin: 150upx auto 0;
		flex-shrink: 0;
		border-radius: 30upx;
	}

	.logo_view image {
		width: 100%;
		height: 100%;
	}

	.logo_title {
		font-family: PingFang-SC-Bold;
		font-size: 36upx;
		color: #101d36;
		line-height: 73upx;
		text-align: center;
		font-weight: 600;
	}

	.about_cont {
		margin-top: 53upx;
		padding: 0 93upx;
		box-sizing: border-box;
		text-align: justify;
		color: #101d36;
		font-size: 30upx;
	}

	.service_tel {
		font-size: 28upx;
		color: #8e94a1;
		line-height: 56upx;
		text-align: center;
		position: fixed;
		bottom: 65upx;
		left: 50%;
		flex-shrink: 0;
		transform: translateX(-50%);
	}
</style>
