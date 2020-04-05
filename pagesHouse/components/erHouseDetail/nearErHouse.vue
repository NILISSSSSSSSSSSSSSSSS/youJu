<template>
	<form report-submit @submit="formSubmit">
		<view class="f_r_s near_er_house">
			<block v-for="(item,index) in list" :key="index">
				<view @click="erHouseDetail(item)" class="near_er_house_item f_c_s">
					<view class="near_er_house_img_view">
						<image mode="aspectFill" class="er_house_img" :src="item.houseImg"></image>
					</view>

					<view class="near_er_house_cont">
						<view class="near_er_house_title">{{ item.houseTitle }}</view>

						<view class="f_r_s er_house_des" v-if="item.houseUseage == 1">
							<view v-if="item.houseTing" class="er_house_ting">{{ item.houseTing }}</view>
							<view v-if="!item.houseTing" class="er_house_ting">{{ item.houseUseageCn }}</view>
							<view v-if="item.houseArea" class="er_house_area">{{ item.houseArea }}<text>{{ item.houseAreaUnit }}</text></view>
						</view>
						<view class="f_r_s er_house_des" v-else>
							<view class="er_house_addr">{{ item.houseUseageCn }}</view>
						</view>

						<view class="near_er_house_price_view f_r_s" v-if="item.houseTotalPrice">
							<view class="near_er_house_price main_color f_r_s">
								<view>{{ item.houseTotalPrice }}</view>
								<view style="font-weight: normal;">{{ item.houseTotalPriceUnit }}</view>
							</view>

							<view class="near_er_house_unit_price">{{ item.housePriceOfArea }}{{ item.housePriceOfAreaUnit }}</view>
						</view>
						<view class="near_er_house_price_view f_r_s" v-if="!item.houseTotalPrice">
							<view class="near_er_house_unit_price gray_color">价格面议</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</form>
</template>

<script>
    import { GpsInfoModel } from "@/model/GpsInfoModel.js";

	export default {
		data() {
			return {

			};
		},

        props: ["list"],

        watch: {
            list: {
                handler(newItem, oldItem) {
                },
                immediate: true
            }
        },

		mounted() {
			new this.InitFormSubmit(this);
		},

        methods: {
        	erHouseDetail(item) {
                let cityId = item.cityId || new GpsInfoModel().getModel("cityInfo").cityId || "";
                let caseId = item.houseId || "";
                let caseType = item.caseType || "";
                let resource = item.reSource || "";
                let houseName = item.houseName || "";
                uni.navigateTo({
                    url: "/pagesHouse/erHouseDetail/erHouseDetail?cityId="+cityId+"&caseId="+caseId
                        +"&caseType="+caseType+"&resource="+resource+"&houseName="+ houseName
						+ "&archiveId=" + (item.archiveId || "")
                });
        	}
        },
	}
</script>

<style scoped>
	.near_er_house{
		flex-wrap: wrap;
		padding: 0 40upx;
		box-sizing: border-box;
		width: 100%;
	}
    .near_er_house_item{
        padding: 0 0 40upx 0;
        box-sizing: border-box;
		width: 48%;
		margin-right: 4%;
    }
	.near_er_house_item:nth-child(2n) {
		margin-right: 0;
	}
    .near_er_house_img_view{
        position: relative;
        width: 100%;
        height: 228upx;
        flex-shrink: 0;
		background:#f8f8f8 url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png?t=20190716) no-repeat center center;
		background-size:cover;
		border-radius: 4upx;
		will-change: transform;
		overflow: hidden;
		box-sizing: border-box;
    }
    .er_house_img{
        width: 100%;
        height: 100%;
    }
    .near_er_house_cont{
        box-sizing: border-box;
        width: 100%;
    }
    .near_er_house_title{
		width:100%;
		font-size:32upx;
		font-weight:bold;
		color:#101d36;
		line-height:52upx;
		overflow:hidden;
		word-wrap:break-word;
		word-break:break-all;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:1;
		-webkit-box-orient:vertical;
		margin-top: 6upx;
    }
    .er_house_des{
        font-size:26upx;
        line-height: 42upx;
        color:#101d37;
		font-size: 26upx;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
	.er_house_des view{
		color:#7A8190;
	}
    .near_er_house_price_view{
        line-height:40upx;
		margin-top: -3upx;
    }
    .near_er_house_price{
        font-size:30upx;
        color:#ab7f2e;
        font-weight:bold;
        margin-right: 20upx;
		margin-bottom: -4upx;
    }
    .near_er_house_unit_price{
        color: #8E94A1;
        font-weight:normal;
        font-size:22upx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		line-height: initial;
    }
	.er_house_addr{
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>

