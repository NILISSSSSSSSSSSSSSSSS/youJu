<template>
	<view @click="housePhoneBtn" class="f_r_b pay_month_view">
		<view class="f_r_s pay_month">
			<image class="pay_month_img" mode="aspectFit" src="https://zdzfapi.haofang.net/Public/wxApp/images/detail/fzyf.png"></image>

			<view class="pay_month_text">房租按月付,好房轻松住</view>
		</view>
		
		<image class="pay_month_arrow" mode="aspectFill" src="http://cdn.haofang.net/static/uuminiapp/index/l-jtt.png"></image>
	</view>
</template>

<script>
	import { Config } from "@/utils/config.js";
	
	export default {
		props: {
			housePhone: {
				type: String,
				default: ""
			},
		},
		
		methods: {
			housePhoneBtn() {
				if(!this.housePhone) return;
				
				let url = Config.uuweb + "/App/Index/crashPrize?userMobile=" + this.housePhone;
				uni.navigateTo({
				    url: "../../pages/webView/webView?bgColor=#ffffff&color=#000000&" + "url=" + url + "&title=房租按月付,好房轻松住"
				});
			}
		},
	}
</script>

<style scoped>
	.pay_month_view{
		padding: 0 40upx;
		box-sizing: border-box;
		margin-top: 54upx;
	}
	.pay_month_img{
		width: 145upx;
		height: 34upx;
		flex-shrink: 0;
		margin: auto 10upx auto 0;
	}
	.pay_month_text{
		height:100%;
		font-size:24upx;
		color:#101D36;
		line-height:60upx;
	}
	.pay_month_arrow{
		flex-shrink: 0;
		width: 15upx;
		height: 24upx;
		margin: auto 0;
	}
</style>
