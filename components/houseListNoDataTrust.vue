<template>
	<form report-submit @submit="formSubmit">
		<view class="no_trust">
			<view class="f_r_c">
				<image class="no_trust_img" mode="aspectFill" 
				src="http://cdn.haofang.net/static/uuminiapp/new_images/xuans.png?t=20180427"></image>
			</view>
			
			<view class="no_trust_text">抱歉没有找到合适房源</view>
			
			<view class="no_trust_text">发布委托,召唤经纪人为您快速找房</view>
			
			<button @click="trustBtn" hover-class="none" form-type="submit" class="trust_btn global-confirm-btn">立即发布</button>
		</view>
	</form>	
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: "erHouse"
			},
		},
		
		methods: {
			trustBtn() {
				let urlMap = new Map()
					.set("erHouse", {url: "/pagesEntrust/entrust/entrust?casetype=3"})
					.set("lease", {url: "/pagesEntrust/entrust/entrust?casetype=4"});
				if(urlMap.has(this.type)) {
					uni.navigateTo({
						url: urlMap.get(this.type).url
					});
					return;
				}
				
				uni.navigateTo({
					url: "/pagesTool/mapFindHouse/mapFindHouse?type=" + this.type
				});
			}
		},
	}
</script>

<style scoped>
	.no_trust{
		width: 100%;
		padding-top: 200upx;
		box-sizing: border-box;
	}
	.no_trust_img{
		width: 336upx;
		height: 250upx;
		margin: 0 auto;
	}
	.no_trust_text{
		line-height:60upx;
		font-size:28upx;
		color:#999999;
		text-align:center;
	}
	.trust_btn{
		width:510rpx;
		height:76rpx;
		text-align:center;
		line-height:76rpx;
		border-radius:5px;
		color:#ffffff;
		letter-spacing:2px;
		font-size:32rpx;
		margin:42rpx auto 0;
		background: #ab7f2e;
	}
</style>
