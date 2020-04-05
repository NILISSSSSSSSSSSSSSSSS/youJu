<template>
	<form report-submit @submit="formSubmit">
		<view class="top_name_view">
			<!-- 新房name -->
			<view class="house_name">{{ item.buildName }}</view>

			<!-- 房源标签 -->
			<view class="tags_view f_r_s">
				<view class="f_c_c greenTag" v-if="item.buildStatus == 2">在售</view>
				<view class="f_c_c blueTag" v-if="item.buildStatus == 1">待售</view>
				<view class="f_c_c grayTag" v-if="item.buildStatus == 3">售罄</view>
				<view class="f_c_c" v-for="(info, index) in item.houseTags" :key="info">{{info}}</view>
			</view>

			<!-- 参考均价+参考总价+最小户型 -->
			<view class="price_view f_r_b">
				<view class="f_c_e price_view_item" style="width: 80%;">
					<view v-if="item.unitPrice" class="totalPrice_val main_color"><text class="top_name_val">{{ item.unitPrice }}</text><text class="totalPrice_unit">/㎡</text></view>

					<view class="gray_color no_price_val" v-else>价格待定</view>

					<view class="totalPrice_text">参考均价</view>
				</view>

				<view class="f_c_e price_view_item" style="width: 80%;">
					<view v-if="item.totalPrice" class="totalPrice_val main_color"><text class="top_name_val">{{ item.totalPrice }}</text><text class="totalPrice_unit">万/起</text></view>

					<view class="gray_color no_price_val" v-else>价格待定</view>

					<view class="totalPrice_text">参考总价</view>
				</view>

				<view class="f_c_e price_view_item">
					<view class="totalPrice_val main_color"><text class="top_name_val">{{ item.minArea || '--' }}</text><text class="totalPrice_unit" v-if="item.minArea">㎡/起</text></view>

					<view class="totalPrice_text">最小户型</view>
				</view>
			</view>

			<!-- 建面+在售户型+产权年限+装修情况+开盘时间+楼盘地址 -->
			<view class="f_r_s house_other_new_house">
				<view class="f_r_s house_other_item">
					<view class="f_r_b new_house_other_title">建面:</text></view>
					<view class="new_house_other_cont">{{ item.maxArea && item.minArea ? item.minArea + "-" + item.maxArea + "㎡" : (!item.minArea && !item.maxArea) ? "--" : (item.minArea || "") + (item.maxArea || "") + "㎡"}}</view>
				</view>

				<view class="f_r_s house_other_item">
					<view class="f_r_b new_house_other_title">在售户型:</text></view>
					<view class="new_house_other_cont">{{ item.roomText ? item.roomText + "室" : "--" }}</view>
				</view>

				<view class="f_r_s house_other_item">
					<view class="f_r_b new_house_other_title">产权年限:</text></view>
					<view class="new_house_other_cont">{{ item.chanQuanYear }}</view>
				</view>

				<view class="f_r_s house_other_item">
					<view class="f_r_b new_house_other_title">装修情况:</view>
					<view class="new_house_other_cont">{{ item.zhaungXiu || "--" }}</view>
				</view>

				<view class="f_r_s house_other_item">
					<view class="f_r_b new_house_other_title">开盘时间:</view>
					<view class="new_house_other_cont">{{ item.kaiPanTime || "--" }}</view>
				</view>

				<view @click="lookMap" style="width: 100%;" class="f_r_s house_other_item">
					<view class="f_r_b new_house_other_title">楼盘地址:</view>
					<view class="f_r_b address_view">
						<view class="address">{{ item.address || "--" }}</view>

						<image class="address_arrow" mode="aspectFill" src="http://static.haofang.net/Public/images/wap/arrow-right-gray.png"></image>
					</view>
				</view>
			</view>
		</view>
	</form>
</template>

<script>
    class TopNameItem {
		buildName = "";  // 新房名称
		buildStatus = "";  // 2 在售 1 待售  3 售罄
        houseTags = [];  // 标签  例如：["text"]
		totalPrice = "";  // 总价
        unitPrice = "";  // 单位价格 例如：10000/㎡
		minArea = "";  // 最小面积
		maxArea = ""; // 最大面积
		roomText = "";  // 户型 例如 2/3室
		chanQuanYear = ""; // 产权年限
		zhaungXiu = "";  // 装修 例如： 毛坯
		kaiPanTime = "";  // 开盘时间
		address = "";  // 楼盘地址
		lat = ""; //  纬度 --  经度 > 纬度
		lng = "";  // 经度
    }

	import { Notification } from "@/utils/Notification.js";
	import { Notify } from "@/utils/Notify.js";

	export default {
		data() {
			return {
			};
		},

        props: ["item", "pageFrom"],

		mounted() {
			new this.InitFormSubmit(this);
		},

        methods: {
			lookMap() {
				new Notification().postNotification(Notify.NearInfoMapBtnChanged.Name
					, {item: {type: "transit",text: "公交"}, index: 0});
			}
        }
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
	.top_name_val{
		font-size: 40upx;
		font-weight: bold;
	}

	 /* 售价+户型+面积 */
    .price_view{
        background:#ffffff;
        color:#89909d;
        box-sizing: border-box;
        width: calc(100% + 80upx);
		margin-left: -40upx;
        margin-top: 45upx;
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
    .totalPrice_val{
        font-size: 40upx;
		line-height: 44upx;
		font-weight: bold;
        white-space: nowrap;
        margin-bottom: 8upx;
    }
	.totalPrice_text{
		font-size: 24upx;
		color: #8E94A1;
		margin-bottom: 0;
	}
    /* #ifdef MP-ALIPAY */
    .totalPrice_text{
        margin-bottom: 0 !important;
    }
    /* #endif */

	.totalPrice_unit{
		font-size: 30upx;
	}
     /* #ifdef  MP-ALIPAY */
    .totalPrice_val{
        margin-bottom: 8upx;
    }
    .no_price_val{
        margin-bottom: 8upx;
    }
    /* #endif */


    .total_unit{
        color:#fd5438;
        margin-left:4upx;
        font-size: 26upx;
        line-height: 1;
        position: relative;
        top: -6upx;
    }
    .unit_price{
        color:#444444;
        font-size:26upx;
        margin-right:20upx;
        margin-left: 40upx;
    }

    .house_info{
        background:#ffffff;
        color:#333333;
        font-size:36upx;
        font-weight:bold;
        margin: 20upx 0;
    }
    .house_info view{
        margin-right: 44upx;
    }

    .tags_view{
        font-size:22upx;
		flex-wrap: wrap;
		margin-top: 15upx;
    }
    .tags_view view{
			height: 30upx;
			white-space: nowrap;
			font-size:22upx;
			display:flex;
			flex-direction: row;
			justify-content: center;
			color:#7991a6;
			background: #edf0f3;
			padding:0 10upx;
			border-radius:2upx;
			will-change: transform;
			margin-right: 8upx;
			box-sizing: border-box;
			 margin-bottom: 10upx;
			align-items: center;
    }
    /* #ifdef MP-ALIPAY */
    .tags_view view{
        padding:6upx 10upx 4upx !important;
    }
    /* #endif */
	.tags_view .greenTag{
		background: #3d96fd;
	}
	.tags_view .blueTag{
		background: #fbb057;
	}
	.tags_view .grayTag{
		background: #d1d1d1;
	}
	.tags_view .greenTag, .tags_view .blueTag, .tags_view .grayTag {
		color: #FFFFFF;
		font-size: 22upx;
		display: inline-block;
		height: 30upx;
		padding: 0 5upx;
		border-radius: 4upx;
		margin-right: 8upx;
		box-sizing: border-box;
	}


	/* 单价+楼层+装修+朝向+年代+类型+小区 */
    .house_other_new_house{
        width:100%;
        box-sizing:border-box;
        background:#fff;
        flex-wrap: wrap;
        box-sizing: border-box;
        margin-top: 50upx;
        font-size: 30upx;
				color: #121c34;
    }
    .house_other_item{
        width:50%;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
		text-align: left;
		line-height: 66upx;
    }
    .new_house_other_title{
        color: #8E94A1;
        font-size: 32upx;
        margin-right: 17upx;
		flex-shrink: 0;
    }
    .new_house_other_cont{
        text-align:left;
        max-width:100%;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
    }
	.address_view{
		width: 50%;
		flex: 1;
	}
	.address{
		text-align: left;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.address_arrow{
		flex-shrink: 0;
		height: 20upx;
		width: 15upx;
		margin: auto 0 auto 20upx;
	}
</style>
