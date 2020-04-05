<template>
	<form report-submit @submit="formSubmit">
		<view class="hu_xing_view">
			<scroll-view scroll-x>
				<block v-for="(item,index) in list" :key="index">
					<!--  #ifdef MP-ALIPAY || MP-BAIDU -->
					<view @click="lookMoreHuXing(item)" class="hu_xing_item" hover-class="none" form-type="submit">
					<!-- #endif -->
					<!--  #ifndef MP-ALIPAY || MP-BAIDU -->
					<button @click="lookMoreHuXing(item)" class="hu_xing_item" hover-class="none" form-type="submit">
					<!-- #endif -->
						<view class="room_img_view">
							<image mode="aspectFill" :src="item.huXingUrl"></image>
						</view>

						<view class="hu_ting_view">
							<text class="hu_ting">{{ item.shiTingWei }}</text>

							<text class="greenTag common_tag" v-if="item.buildStatus == 2">在售</text>
							<text class="blueTag common_tag" v-if="item.buildStatus == 1">待售</text>
							<text class="grayTag common_tag" v-if="item.buildStatus == 3">售罄</text>
						</view>

						<view class="f_r_s">
							<view v-if="item.totalPrice" class="totalPrice main_color"><text>{{ item.totalPrice }}</text><text class="totalPrice_unit">万起</text></view>

							<view class="gray_color f_c_e" v-else>价格待定</view>

							<text class="area f_c_e">{{ item.area ? item.area + "㎡" : "" }}</text>
						</view>

						<view class="tags_view f_r_s" v-if="item.tags && item.tags.length > 0">
							<view class="f_c_c" v-for="(info, info_index) in item.tags" :key="info">{{ info }}</view>
						</view>
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
		huXingUrl = ""; // 户型图
		shiTingWei = "";  // 室厅卫
		buildStatus = "";  // 2 在售 1 待售  3 售罄
		totalPrice = "";  // 总价
		area = "";  // 面积
		tags = "";  // 标签
		buildId = "";  // 新房id
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
			lookMoreHuXing(item) {
				this.PlatformUserBehavior.newHouseHuXingInfo();
				uni.navigateTo({
					url: "/pagesHouse/newHouseHuXing/newHouseHuXing?buildId=" + item.buildId
				});
			}
		},
	}
</script>

<style scoped>
	.hu_xing_view{
		width: 100%;
		overflow: hidden;
		background: #FFFFFF;
		white-space: nowrap;
		padding: 0 0 0 40upx;
		box-sizing: border-box;
	}
	button.hu_xing_item,.hu_xing_item{
		display: inline-block;
		width: 360upx;
		margin-right: 20upx;
		flex-shrink: 0;
		vertical-align: top;
        border-radius: 0;
		will-change: transform;
	}
    button.button.lou_pan_item::after{
        border-radius: 0;
		will-change: transform;
    }
	.room_img_view{
		width:360upx;
		height:274upx;
		position:relative;
		overflow:hidden;
		background:url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png) no-repeat center center;
		background-color:#f5f5f5;
		background-size:contain;
		border-left: 1upx solid #EEEEEE;
		border-right: 1upx solid #EEEEEE;
		box-sizing: border-box;
		border-radius: 4upx;
		will-change: transform;
	}
	.room_img_view image{
		width: 100%;
		height: 100%;
	}
	.hu_ting_view{
		line-height: 50upx;
		margin-top: 8upx;
	}
	.hu_ting{
		font-size:32upx;
		color: #101D36;
		position: relative;
		top: 6upx;
	}
	.area{
		font-size:22upx;
		color:#89909d;
		line-height:28upx;
		margin-left:20upx;
	}

	.totalPrice{
	    font-size: 30upx;
		line-height: 44upx;
		margin-bottom: -6upx;
	}
	.totalPrice_text{
		font-size: 22upx;
		color: #89909d;
	}
	.totalPrice_unit{
		font-size: 30upx;
	}
	.tags_view{
	    font-size:22upx;
		flex-wrap: wrap;
		margin-top: 15upx;
	}
	.tags_view view{
	    white-space: nowrap;
	    font-size:22upx;
	    display:flex;
	    flex-direction: column;
	    justify-content: center;
	    color:#7991a6;
	    background:#edf0f3;
	    padding:4upx 10upx 6upx;
	    border-radius:2upx;
	    margin-right:10upx;
	    box-sizing: border-box;
		will-change: transform;
	}
	.common_tag{
		white-space: nowrap;
		font-size:22upx;
		color:#7991a6;
		background:#edf0f3;
		padding:4upx 10upx 6upx;
		border-radius:4upx;
		will-change: transform;
		box-sizing: border-box;
		font-size:22upx;
		margin: auto 0 auto 10upx;
	}
	.greenTag{
		background: #3d96fd!important;
		padding: 2upx 5upx !important;
		color: #FFFFFF!important;
	}
	.blueTag{
		background: #fbb057!important;
		padding: 2upx 5upx !important;
		color: #FFFFFF!important;
	}
	.grayTag{
		background: #d1d1d1!important;
		padding: 2upx 5upx !important;
		color: #FFFFFF!important;
	}
</style>
