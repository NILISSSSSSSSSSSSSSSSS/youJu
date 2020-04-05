<template>
	<view class="houseMeView" v-if="item.content" @click="lookHouseDatail(item.content)">
		<view class="houseMeView_img_view">
			<image mode="aspectFill" :src="item.content.houseImg"></image>
		</view>
		<view class="houseMeView_title">{{ item.content.houseTitle }}</view>
		<view class="f_r_s">
			<view class="houseMeView_cont">
				<view class="houseMeView_name">
					<text v-if="item.content.houseTing">{{ item.content.houseTing }}</text>
					<!-- {{ item.content.houseAreaUnit }} -->
					<text v-if="item.content.houseArea">{{ item.content.houseArea }}㎡</text>
					<text v-if="item.houseFloors">{{item.houseFloor?item.houseFloor+"/":''}}{{item.houseFloors}}</text>
					<text v-if="item.content.houseName">{{ item.content.houseName }}</text>
				</view>
			<!-- 	<view class="f_r_s houseMeView_ting">
					<view class="houseMeView_ting_info">{{ item.content.houseTing }}asdasds</view>
					<view v-if="item.content.houseArea">面积{{ item.content.houseArea }}{{ item.content.houseAreaUnit }}asdasas</view>
				</view> -->
				<view class="main_color">
					<text class=" houseMeView_total" v-if="item.content.houseTotalPrice">
						{{ item.content.houseTotalPrice }}{{ item.content.houseTotalPriceUnit?item.content.houseTotalPriceUnit:'' }}
					</text>
					
					<block v-if="item.content.houseTags.length > 0"  v-for="(tagInfo, index) in item.content.houseTags" :key="index">
						<view class="g_house_tag f_r_c" v-if="tagInfo">{{ tagInfo }}</view>
					</block>
				</view>
				<!-- <view class="gray_color houseMeView_no_price" v-else>价格面议</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: {}
			},
		},
		
		
		methods: {
			lookHouseDatail(item) {
				// #ifdef MP-WEIXIN || H5
				let cityId = item.cityId || "";
				let caseId = item.houseId || "";
				let buildId = item.houseId || "";
				let caseType = item.caseType || "";
				let resource = item.reSource || "";
				let houseName = item.houseName || "";
				 uni.navigateTo({
				  url: "/pagesKaidanbao/houseDetail/houseDetail?cityId="+cityId+"&caseId="+caseId+"&buildId="+buildId
				    +"&caseType="+caseType+"&resource="+resource+"&houseName="+houseName+"&pageFrom=im"
				});
				// #endif
			}
		},
	}
</script>

<style scoped>
	.houseMeView{
		background-color: #FFFFFF;
		color: #fff;
		word-break: break-all;
		line-height: 1.5;
		position:relative;
		margin-right:22upx;
		min-height:40px;
		padding:19upx 20upx;
		box-sizing: border-box;
		max-width:65%;
		width: 65%;
		border-radius:15upx;
		text-align:left;
		font-size:15px;
	}
	.houseMeView_title{
		width: 420upx;
		margin-bottom:20upx;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		font-size:30upx;
		color:#424242;
		font-weight:800;
	}
	.houseMeView_img_view{
		width: 428upx;
		/* height: 120upx; */
		margin-right:20upx;
		flex-shrink: 0;
		/* background:url("http://cdn.haofang.net/static/kdbweb/zdzfminiapp/image_wutu.png") no-repeat center center; */
		/* background-size:100% 100%; */
		overflow: hidden;
	}
	.houseMeView_img_view>image{
		width:100%;
		max-height: 270upx;
	}
	.houseMeView_cont{
		overflow:hidden;
		-webkit-box-flex:1;
	}
	.houseMeView_name{
		max-width:100%;
		text-overflow:ellipsis;
		overflow:hidden;
		line-height:1;
		white-space:nowrap;
		padding-bottom:10upx;
		color:#898989;
		font-size:28upx;
	}
	 .g_house_tag{
		font-size:22upx;
		display:inline-block;
		color: #89909d !important;
		background: #f3f6f6 !important;
		padding:4upx 6upx 6upx;
		border-radius:4upx;
		margin-left: 10upx;
	}
	/* #ifdef MP-BAIDU */
	.g_house_tag{
		border-radius:0.5vw!important;
	}
	/* #endif */
	  /* #ifdef MP-ALIPAY*/
	  .g_house_tag{
	      padding:4upx 6upx 2upx !important;
	  }
	  /* #endif */
	.houseMeView_name text{
		color:#101d37;
	}
	.houseMeView_name text::after{
		content: "|";
		font-size: 16upx;
		color: #babfc5;
		margin-left: 10upx;
		margin-right: 10upx;
		position: relative;
		top: -2upx;
	}
	.houseMeView_name text:last-child::after{
		content: ''
	}
	.houseMeView_ting{
		font-size:26rpx;
		color:#898989;
		line-height:1.5;
		max-width:100%;
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
	}
	.houseMeView_ting_info{
		margin-right: 10upx;
	}
	.houseMeView_total{
		line-height:1.5;
		max-width:100%;
		text-overflow:ellipsis;
		overflow:hidden;
		white-space:nowrap;
		font-size:33rpx;
		font-weight: bold;
		margin-right: 3upx;
	}
	.houseMeView_total>text{
		display:inline-block;
		font-size:22rpx!important;
		font-weight:normal;
	}
	.houseMeView_no_price{}
</style>
