<template>
	<form report-submit @submit="formSubmit">
		<view class="lou_pan_view">
			<scroll-view scroll-x>
				<block v-for="(item, index) in list" :key="index">
					<!--  #ifdef MP-ALIPAY || MP-BAIDU -->
					<view @click="lookMoreLouPanTuku(item)" class="lou_pan_item" hover-class="none" form-type="submit">
					<!-- #endif -->
					<!--  #ifndef MP-ALIPAY || MP-BAIDU -->
					<button @click="lookMoreLouPanTuku(item)" class="lou_pan_item" hover-class="none" form-type="submit">
					<!-- #endif -->
						<view class="lou_pan_img">
							<image mode="aspectFill" :src="item.imgUrl"></image>
						</view>
						<view class="f_r_c lou_pan_text">{{ item.type }}</view>
					<!--  #ifdef MP-ALIPAY || MP-BAIDU -->
					</view>
					<!-- #endif -->
					<!--  #ifndef MP-ALIPAY || MP-BAIDU -->
					</button>
					<!-- #endif -->
				</block>
			</scroll-view>
		</view>
	</form>
</template>

<script>
	class HuXingJieShaoItem {
		imgUrl = ""; // 楼盘图
		type = "";  // 类型
		buildId = "";
	}

	export default {
		data() {
			return {
			}
		},

		props: {
			list: {
				type: Array,
				default: []
			},
		},

		mounted() {
			new this.InitFormSubmit(this);
		},

		methods: {
			lookMoreLouPanTuku(item) {
				this.PlatformUserBehavior.newHouseLouPanTuKu();
				uni.navigateTo({
					url: "/pagesHouse/newHouseLouPanTuKu/newHouseLouPanTuKu?buildId=" + item.buildId
				});
			}
		},
	}
</script>

<style scoped>
	.lou_pan_view{
		width: 100%;
		overflow: hidden;
		background: #FFFFFF;
		white-space: nowrap;
		padding: 0 0 0 40upx;
		box-sizing: border-box;
	}
	button.lou_pan_item, .lou_pan_item{
		display: inline-block;
		margin-right: 20upx;
		flex-shrink: 0;
        border-radius: 0;
		will-change: transform;
	}
    button.lou_pan_item::after{
        border-radius: 0;
		will-change: transform;
    }
	.lou_pan_img{
		width: 229upx;
		height: 232upx;
		box-sizing: border-box;
		border-radius: 4upx;
		will-change: transform;
		overflow: hidden;
	}
	.lou_pan_img image{
		width: 100%;
		height: 100%;
	}
	.lou_pan_text{
		color: #101D36;
		font-size: 26upx;
		text-align: center;
		line-height: 58upx;
	}
</style>
