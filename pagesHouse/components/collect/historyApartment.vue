<template>
	<!-- 支付宝小程序button无法撑高 -->
	<form report-submit @submit="formSubmit">
		<!--  #ifdef MP-ALIPAY -->
		<view hover-class="none" form-type="submit" @click="checkApartmentDetail(item)" class="er_house_item f_r_s">
		<!-- #endif -->
		<!--  #ifndef MP-ALIPAY -->
		<button hover-class="none" form-type="submit" @click="checkApartmentDetail(item)" class="er_house_item f_r_s">
		<!-- #endif -->
			<view class="er_house_img_view">
				<image mode="aspectFill" class="er_house_img" :src="item.houseImg"></image>
			</view>

			<view class="er_house_cont">
				<view class="er_house_title">{{ item.houseAddress }} {{ item.houseName }} {{ item.houseTing }}{{ item.houseJianText }}</view>

				<view v-if="!(item.houseTags.length == 0)" class="er_house_tag_info f_r_s">
					<block v-for="(tagInfo, index) in item.houseTags" :key="index">
						<view class="er_house_tag f_r_c">{{ tagInfo }}</view>
					</block>
				</view>

				<view class="er_house_price_view f_r_s" v-if="item.housePriceOfMonth">
					<view class="er_house_price main_color f_r_s">
						<view>{{ item.housePriceOfMonth }}</view>
						<view style="font-weight: normal;">{{ item.housePriceOfMonthUnit }}</view>
					</view>
				</view>
				<view class="er_house_price_view f_r_s" v-if="!item.housePriceOfMonth">
					<view class="er_house_unit_price gray_color">价格面议</view>
				</view>
			</view>
		<!--  #ifdef MP-ALIPAY -->
		</view>
		<!-- #endif -->
		<!--  #ifndef MP-ALIPAY -->
		</button>
		<!-- #endif -->
	</form>
</template>

<script>
    import { GpsInfoModel } from "@/model/GpsInfoModel.js";

	export default {
		data() {
			return {

			};
		},

        props: ["item"],

        watch: {
            item: {
                handler(newItem, oldItem) {
                },
                immediate: true
            }
        },

		mounted() {
			new this.InitFormSubmit(this);
		},

        methods: {
        	checkApartmentDetail(item) {
        	    if(!item.apartmentUuid || !item.roomUuid) {
        	    	uni.showModal({
        	    		title: "无法查看",
        	    		content: '无法查看该公寓详情，请联系客服。',
        	    		confirmText: "我知道了",
        	    		showCancel: false,
        	    		confirmColor: "#ab7f2e"
        	    	});
        	    	return;
        	    }
        	    
        	    uni.navigateTo({
        	    	url: "/pagesHouse/apartmentDetail/apartmentDetail?apartmentUuid=" + item.apartmentUuid
        	    		+ "&roomUuid=" + item.roomUuid + "&rentType=" + item.rentType + "&houseName=" + item.houseName
        	    });
        	}
        },
	}
</script>

<style scoped>
    .er_house_item{
        padding: 40upx 0 40upx 0;
        box-sizing: border-box;
        background: #FFFFFF;
        border-bottom: 2upx solid #F5F5F5;
    }
    .er_house_img_view{
        position: relative;
        width:216upx;
        height:164upx;
        flex-shrink: 0;
		background:#f8f8f8 url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png?t=20190716) no-repeat center center;
		background-size:cover;
		border-radius: 4upx;
		box-sizing: border-box;
    }
    .er_house_img{
        width: 100%;
        height: 100%;
    }
    .vr_img{
		position: absolute;
		left: 20upx;
		bottom: 20upx;
		width: 50upx;
		height: 50upx;
		z-index: 20;
    }
    .big_video_img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60upx;
        height: 60upx;
        z-index: 20;
    }
    .small_video_img{
        position: absolute;
        left: 20upx;
        bottom: 20upx;
        width: 50upx;
        height: 50upx;
        z-index: 20;
    }

    .er_house_cont{
        padding-left: 30upx;
        box-sizing: border-box;
        width: calc(100% - 216upx);
    }
    .er_house_title{
		text-align: left;
		width:100%;
		font-size:32upx;
		font-weight:bold;
		color:#101d36;
		line-height:42upx;
		margin-bottom:12upx;
		overflow:hidden;
		word-wrap:break-word;
		word-break:break-all;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
		margin-top: -4upx;
		text-align: left;
    }
    .er_house_des{
        font-size:26upx;
        line-height: 36upx;
        color:#101d37;
		font-size: 26upx;
        /* margin-bottom:7upx; */
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
		margin-bottom: 12upx;
    }
	.er_house_des text{
		color:#101d37;
	}
	.er_house_des text::after{
		content: "|";
		font-size: 16upx;
		color: #babfc5;
		margin-left: 10upx;
		margin-right: 10upx;
		position: relative;
		top: -2upx;
	}
	.er_house_des text:last-child::after{
		content: ''
	}
    .er_house_ting{
        /* margin-right: 8upx; */
    }
    .er_house_area{
        /* margin-right: 8upx; */
    }

    .er_house_tag_info{
		overflow: hidden;
		height: 38upx;
		margin-bottom: 10upx;
    }
	.er_house_tag_view{
		flex-wrap: wrap;
	}
    .er_house_true{
        width: 81upx;
        height: 21upx;
        margin: auto 10upx auto 0;
		flex-shrink: 0;
    }
    .er_house_tag_info .er_house_tag:nth-of-type(4n+1){
        color: #18acf0;
        background: #ddf3fd;
    }
    .er_house_tag_info .er_house_tag:nth-of-type(4n+2){
        color: #ff9600;
        background: #fff1dc;
    }
    .er_house_tag_info .er_house_tag:nth-of-type(4n+3){
        color: #f3685f;
        background: #fde8e7;
    }
    .er_house_tag_info .er_house_tag:nth-of-type(4n+4){
        color: #1bc964;
        background: #ddf7e8;
    }
    .er_house_tag{
        white-space: nowrap;
		font-size:22upx;
		display:flex;
		flex-direction: column;
		justify-content: center;
		color:#7991a6 !important;
		background:#edf0f3 !important;
		padding:4upx 6upx 6upx;
		border-radius:2upx;
		margin-right:10upx;
		box-sizing: border-box;
    }
	/* #ifdef MP-BAIDU */
	.er_house_tag{
		border-radius:0.5vw!important;
	}
	/* #endif */
    /* #ifdef MP-ALIPAY*/
    .er_house_tag{
        padding:4upx 6upx 2upx !important;
    }
    /* #endif */

    .er_house_price_view{
        line-height:40upx;
    }
    .er_house_price{
        font-size:30upx;
        color:#ab7f2e;
        font-weight:bold;
        margin-right: 20upx;
    }
    .er_house_unit_price{
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
