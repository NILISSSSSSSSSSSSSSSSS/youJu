

<template>
	<view @click="erHouseDetail(item)" class="er_house_item f_r_s">
		<view class="er_house_img_view">
			<image mode="aspectFill" class="er_house_img" :src="houseImgUrl" lazy-load></image>
			<view v-if="item.hasVr" class="vr_img"></view>
			<view v-if="!item.hasVr && item.hasVideo" class="small_video_img"></view>
		</view>

		<view class="er_house_cont">
			<view class="er_house_title">{{ item.houseTitle }}</view>

			<view class="er_house_des" v-if="item.houseUseage == 1">
				<text v-if="item.houseTing" class="er_house_ting">{{ item.houseTing }}</text>
				<text v-if="!item.houseTing" class="er_house_ting">{{ item.houseUseageCn }}</text>
				<text v-if="item.houseArea" class="er_house_area">{{ item.houseArea }}{{ item.houseAreaUnit }}</text>
				<text class="er_house_addr">{{ item.houseName }}</text>
			</view>
			<view class="f_r_s er_house_des" v-else>
				<view class="er_house_addr">{{ item.houseUseageCn }}</view>
			</view>

			<view v-if="!(!item.trueHouse && (!item.houseTags || item.houseTags.length == 0))" class="er_house_tag_info f_r_s">
				<view class="er_house_true" v-if="item.trueHouse"></view>
				<block v-for="(tagInfo, index) in item.houseTags" :key="index">
					<view v-if="tagInfo == '房租月付'" class="er_house_tag f_r_c">{{ tagInfo }}</view>
					<view v-else-if="tagInfo == '业主房源'" class="er_house_tag f_r_c">{{ tagInfo }}</view>
					<view v-else-if="tagInfo && tagInfo.length > 1" class="er_house_tag f_r_c">{{ tagInfo }}</view>
				</block>
			</view>

			<view class="er_house_price_view f_r_s" v-if="item.houseTotalPrice && item.houseTotalPrice != 0">
				<view class="er_house_price main_color f_r_s">
					<view>{{ item.houseTotalPrice }}</view>
					<view style="font-weight: normal;">{{ item.houseTotalPriceUnit }}</view>
				</view>

				<view class="er_house_unit_price">{{ item.housePriceOfArea }}{{ item.housePriceOfAreaUnit }}</view>
			</view>
			<view class="er_house_price_view f_r_s" v-else>
				<view class="er_house_unit_price gray_color">价格面议</view>
			</view>
		</view>

		<view v-if="item.isTopHouse" class="isTopHouse_view">广告</view>
	</view>
</template>

<script>
    import { GpsInfoModel } from "../model/GpsInfoModel.js";

	export default {
        computed:{
            houseImgUrl() {
                let url = this.item.houseImg || "";
                if(url.indexOf("?x-oss-process=image") >= 0) {
                    return url;
                }

                return (url ? url + "?x-oss-process=image/resize,m_fill,h_120,w_180" : "");
            }
        },

        props: ["item"],

        methods: {
        	erHouseDetail(item) {
                let cityId = item.cityId || new GpsInfoModel().getModel("cityInfo").cityId || "";
                let caseId = item.houseId || "";
                let caseType = item.caseType || "";
                let resource = item.reSource || "1";
                let houseName = item.houseName || "";
                uni.navigateTo({
                    url: "/pagesHouse/erHouseDetail/erHouseDetail?cityId="+cityId
						+"&caseId="+caseId
                        +"&caseType="+caseType+"&resource="+resource+"&houseName="+houseName
						+ "&pageFrom=" + item.pageFrom + "&archiveId=" + (item.archiveId || "")
						+ "&compId=" + (item.compId || "") + "&buildId=" + (item.buildId || "")
                });
        	}
        },
	}
</script>

<style>
	.isTopHouse_view{
		position: absolute;
		bottom: 30upx;
		right: 0;
		color: #c8c8c9;
		font-size: 22upx;
		text-align: right;
	}
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
		background:#f8f8f8 url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png) no-repeat center center;
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
		bottom: 10upx;
		z-index: 20;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/house_list_sprites.png)  no-repeat;
		background-size: 179px 24px;
		height: 28px;
		width: 25px;
		background-position: -39px 0;
    }
    .big_video_img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/house_list_sprites.png)  no-repeat;
		background-size: 179px 24px;
		height: 28px;
		width: 25px;
		background-position:-17px 0;
    }
    .small_video_img{
        position: absolute;
        left: 20upx;
        bottom: 10upx;
        z-index: 20;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/house_list_sprites.png)  no-repeat;
		background-size: 179px 24px;
		height: 28px;
		width: 25px;
		background-position:-15px 0;
    }

    .er_house_cont{
        padding-left: 30upx;
        box-sizing: border-box;
        width: calc(100% - 216upx);
    }
    .er_house_title{
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
    }
    .er_house_des{
			height: 30upx;
        font-size:26upx;
        line-height: 30upx;
        color:#101d37;
		font-size: 26upx;
        /* margin-bottom:7upx; */
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
		margin-bottom: 15upx;
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
        text-align: left;
        max-width: 6em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .er_house_tag_info{
			height: 30upx;
		overflow: hidden;
		margin-bottom: 15upx;
    }
	.er_house_tag_view{
		flex-wrap: wrap;
	}
    .er_house_true {
		margin: auto 10upx auto 0;
		flex-shrink: 0;
		background:url('http://cdn.haofang.net/static/wxPlusApp/yjk/home/true_house.png')  no-repeat center;
		background-size: contain;
		height: 30upx;
		width: 96upx;
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
		padding:0 6upx;
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
        padding:0 6upx !important;
    }
    /* #endif */

    .er_house_price_view{
		line-height:30upx;
		height: 30upx;
    }
    .er_house_price{
        font-size:30upx;
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
