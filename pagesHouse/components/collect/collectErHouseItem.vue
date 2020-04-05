<template>
	<view @click="erHouseDetail(item)" class="near_er_house_item f_c_s">
		<view class="near_er_house_img_view">
			<image mode="aspectFill" class="collect_er_house_img" :src="item.houseImg"></image>
			
			<!-- #ifndef MP-ALIPAY -->
			<image v-if="item.hasVr" class="collect_vr_img" src="http://cdn.haofang.net/static/uuminiapp/index/720_icon.png"></image>
			<image v-if="!item.hasVr && item.hasVideo" class="collect_big_video_img" 
				src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/house/video_icon.png"></image>
			<!-- <image v-if="!item.hasVr && item.hasVideo" class="small_video_img"
				src="http://cdn.haofang.net/static/uuminiapp/index/video_icon.png"></image> -->
			<!-- #endif -->
		</view>
		
		<view class="near_er_house_cont">
			<view class="near_er_house_title">{{ item.houseTitle }}</view>
			
			<view class="f_r_s collect_er_house_des" v-if="item.houseUseage == 1">
				<view v-if="item.houseTing" class="collect_er_house_ting">{{ item.houseTing }}</view>
				<view v-if="!item.houseTing" class="collect_er_house_ting">{{ item.houseUseageCn }}</view>
				<view v-if="item.houseArea" class="collect_er_house_area">{{ item.houseArea }}<text>{{ item.houseAreaUnit }}</text></view>
				<view class="collect_er_house_area">{{ item.houseName }}</view>
			</view>
			<view class="f_r_s collect_er_house_des" v-else>
				<view class="collect_er_house_addr">{{ item.houseUseageCn }}</view>
			</view>
			
			<view v-if="!(!item.trueHouse && item.houseTags.length == 0)" class="collect_er_house_tag_info f_r_s">
				<image class="collect_er_house_true"
					v-if="item.trueHouse"
					src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/jiayipeibai_tag.png"></image>
				<block v-for="(tagInfo, index) in item.houseTags" :key="index">
					<view v-if="tagInfo == '房租月付'" class="collect_er_house_tag f_r_c">{{ tagInfo }}</view>
					<view v-else-if="tagInfo == '业主房源'" class="collect_er_house_tag f_r_c">{{ tagInfo }}</view>
					<view v-else-if="tagInfo && tagInfo.length > 1" class="collect_er_house_tag f_r_c">{{ tagInfo }}</view>
				</block>
			</view>
			
			<view class="near_er_house_price_view f_r_s" v-if="item.houseTotalPrice">
				<view class="near_er_house_price main_color f_r_s">
					<view>{{ item.houseTotalPrice }}</view>
					<view style="font-weight: normal;">{{ item.houseTotalPriceUnit }}</view>
				</view>
				
				<view v-if="item.caseType == 1" class="near_er_house_unit_price">{{ item.housePriceOfArea }}{{ item.housePriceOfAreaUnit }}</view>
			</view>
			<view class="near_er_house_price_view f_r_s" v-if="!item.houseTotalPrice">
				<view class="near_er_house_unit_price gray_color">价格面议</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { GpsInfoModel } from "@/model/GpsInfoModel.js"; 
	
	export default {
		data() {
			return {
				
			};
		},
	    
	    props: ["item"],
	   
	    methods: {
	    	erHouseDetail(item) {
	            let cityId = item.cityId || new GpsInfoModel().getModel("cityInfo").cityId || "";
	            let caseId = item.houseId || "";
	            let caseType = item.caseType || "";
	            let resource = item.reSource || "";
	            let houseName = item.houseName || "";
	            uni.navigateTo({
	                url: "/pagesHouse/erHouseDetail/erHouseDetail?cityId="+cityId+"&caseId="+caseId
	                    +"&caseType="+caseType+"&resource="+resource+"&houseName="+houseName
	            });
	    	}
	    },
	}
</script>

<style scoped>
	.collect_vr_img{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 115upx;
		height: 115upx;
		z-index: 20;
	}
	.collect_big_video_img{
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    width: 115upx;
	    height: 115upx;
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
	.collect_er_house_area{
		margin-left: 10upx;
	}
	.near_er_house_item{
	    width:600upx;
		margin-right:28upx;
		margin-bottom: auto;
		flex-shrink:0;
		flex-shrink: 0;
	}
	.near_er_house_img_view{
	    position:relative;
		width:600upx;
		height:396upx;
		border-radius:10upx;
		overflow:hidden;
		background:#f8f8f8 url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png) no-repeat center center;
		background-size:60%;
		flex-shrink: 0;
	}
	.collect_er_house_img{
	    width: 100%;
	    height: 100%;
	}
	.near_er_house_cont{
	    box-sizing: border-box;
	    width: 100%;
	}
	.near_er_house_title{
		text-align: left;
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
	.collect_er_house_des{
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
	.collect_er_house_des view{
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
	.collect_er_house_addr{
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	
	.collect_er_house_tag_info{
		overflow: hidden;
		height: 38upx;
		margin-bottom: 10upx;
	}
	.collect_er_house_tag_view{
		flex-wrap: wrap;
	}
	.collect_er_house_true{
	    width: 81upx;
	    height: 21upx;
	    margin: auto 10upx auto 0;
		flex-shrink: 0;
	}
	.collect_er_house_tag_info .collect_er_house_tag:nth-of-type(4n+1){
	    color: #18acf0;
	    background: #ddf3fd;
	}
	.collect_er_house_tag_info .collect_er_house_tag:nth-of-type(4n+2){
	    color: #ff9600;
	    background: #fff1dc;
	}
	.collect_er_house_tag_info .collect_er_house_tag:nth-of-type(4n+3){
	    color: #f3685f;
	    background: #fde8e7;
	}
	.collect_er_house_tag_info .collect_er_house_tag:nth-of-type(4n+4){
	    color: #1bc964;
	    background: #ddf7e8;
	}
	.collect_er_house_tag{
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
	.collect_er_house_tag{
		border-radius:0.5vw!important;
	}
	/* #endif */
	/* #ifdef MP-ALIPAY*/
	.collect_er_house_tag{
	    padding:4upx 6upx 2upx !important;
	}
	/* #endif */
</style>
