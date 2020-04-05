<template>
	<view class="top_name_view">
		<!-- title -->
		<view class="house_name">{{ item.sectionName }}  {{ item.buildName }}  {{ item.shiTingWei }}</view>

		<!-- 房源标签 -->
		<view class="tags_view f_r_s">
			<view class="f_c_c redTag">{{ item.rentType == 1 ? '整租' : '合租' }}</view>
			<view class="f_c_c" v-for="(info, index) in item.houseTags" :key="info">{{ info }}</view>
		</view>

		<!-- 户型+面积+楼层 -->
		<view class="price_view f_r_b">
			<view class="f_c_e price_view_item">
				<view class="totalPrice main_color">{{ item.shiTingWei || "--" }}</view>

				<view class="totalPrice_text">户型</view>
			</view>

			<view class="f_c_e price_view_item">
				<view class="totalPrice main_color">{{ item.area || "--" }}<text v-if="item.area" class="totalPrice_unit">㎡</text></view>

				<view class="totalPrice_text">面积</view>
			</view>

			<view class="f_c_e price_view_item">
				<view class="totalPrice main_color">{{ item.showFloor || "--" }}<text class="totalPrice_unit" v-if="item.showFloor">层</text></view>

				<view class="totalPrice_text">楼层</view>
			</view>
		</view>

		<view class="street_cont">
			<!-- 小区 -->
			<view class="street_view">
				<text class="f_r_s house_other_title_more">
					<text class="street_title">小区:</text>
					<text class="street_text">{{ item.street || "--" }}</text>
				</text>
			</view>

			<!-- 可租日期 -->
			<view class="rent_view" v-if="item.canRentTime && item.canRentTime > '2000-01-01'">
				<text class="f_r_s house_other_title_more">
					<text class="street_title">可租日期:</text>
					<text class="street_text">{{ item.canRentTime || "--" }}</text>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
    class TopNameItem {
		buildName = "";  // 新房名称
		sectionName = ""; // 所在商圈
		houseTags = [];  // 标签  例如：["text"]
		shiTingWei = "";  // 室厅卫
		area = "";  // 面积
		floor = "";  // 当前楼层
		totalFloor = ""; // 总楼层
		showFloor = ""; // 当前楼层/总楼层
		rentType = "";  // 出租类型
		street = ""; // 街道
		canRentTime = ""; // 可租日期
    }

	export default {
		data() {
			return {
			};
		},

        props: ["item"],
	}
</script>

<style scoped>
    .top_name_view{
        padding: 0 40upx;
        box-sizing: border-box;
        background-color: #FFFFFF;
    }
    .house_name{
		margin-top: 40upx;
        font-size:48upx;
		font-weight: bold;
        -webkit-box-flex:1;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:normal;
        font-weight:bold;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        -webkit-box-pack:center;
        box-sizing:border-box;
		font-size:48upx;
		color: #101D36;
		padding-right: 20upx;
    }

	 /* 售价+户型+面积 */
    .price_view{
        background:#ffffff;
        color:#89909d;
        box-sizing: border-box;
        width: calc(100% + 80upx);
		margin-left: -40upx;
        margin-top: 55upx;
		text-align: left;
    }
	.price_view_item{
		padding-left: 40upx;
		box-sizing: border-box;
		width: 100%;
		text-align: left;
		position: relative;
		height: 70upx;
		padding-right: 10upx;
		font-family: PingFang-SC-Heavy;
	}
	.price_view_item::after{
		content: "";
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 2upx;
		background: #EEEEEE;
	}
	.price_view>.price_view_item:last-child::after{
		content: "";
		width: 0;
		display: none;
	}
    .totalPrice{
        font-size: 40upx;
		line-height: 44upx;
		font-weight: bold;
        white-space: nowrap;
    }
	.totalPrice_text{
		font-size: 24upx;
		color: #8E94A1;
		margin-bottom: -10upx;
	}
    /* #ifdef  MP-ALIPAY */
    .totalPrice_text{
        margin-top: 8upx;
    }
    /* #endif */

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
		will-change: transform;
        margin-right:10upx;
        box-sizing: border-box;
    }
    /* #ifdef MP-ALIPAY */
    .tags_view view{
        padding:6upx 10upx 4upx !important;
    }
    /* #endif */
	.tags_view .redTag{
		background: #fe6363!important;
		color: #FFFFFF!important;
	}

	.street_cont{
		border-bottom: 1upx solid #F5F5F5;
	}
	.rent_view{
		padding-bottom: 30upx;
	}
	.street_view{
		margin-top: 74upx;
		padding-bottom: 30upx;
		box-sizing: border-box;
	}
	.street_title{
		margin-right: 8upx;
		color: #8e94a1;
	}
	.street_text{
		color: #101D36;
	}
</style>
