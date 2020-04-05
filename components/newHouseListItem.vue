<template>
	<!-- 支付宝小程序button无法撑高 -->
	<!--  #ifdef MP-ALIPAY -->
	<view hover-class="none"  @click="newHouseDetail(item)" form-type="submit"
		class="new_house_100_item f_r_s">
	<!-- #endif -->
	<!--  #ifndef MP-ALIPAY -->
	<button hover-class="none"  @click="newHouseDetail(item)" form-type="submit"
		class="new_house_100_item f_r_s">
	<!-- #endif -->
		<view class="er_house_img_view">
			<view class="er_house_img_cont">
				<image mode="aspectFill" class="er_house_img" :src="houseImgUrl" lazy-load></image>
			</view>
			<view class="new_house_hot_icon"
				v-if="item.isHotSale && item.caseType != 9"></view>
			<view v-if="item.caseType == 9"
				class="new_house_luju_icon"></view>
		</view>

		<!-- buildStatus = 1 ? 待售 2 ？ 在售 ？ 3 ？ 售馨 -->
		<view class="er_house_cont">
			<view class="new_house_title f_r_b">
				<view class="new_build_name_box">
                    <view class="coupon-icon" v-if="item.couponFlag == 1"></view>
                    <view class="new_build_name">{{ item.buildName }}</view>
                </view>
				<view v-if="item.buildStatus == 1" class="wait_house house_status_tag">待售</view>
				<view v-if="item.buildStatus == 2" class="selling_house house_status_tag">在售</view>
				<view v-if="item.buildStatus == 3" class="soldOut_house house_status_tag">售罄</view>
			</view>

			<view class="f_r_s er_house_des">
				<view class="er_house_ting">{{ item.buildAddress }}</view>
			</view>

			<view v-if="item.buildTags && item.buildTags.length > 0"
				  class="er_house_tag_info f_r_s">
				<view class="er_house_tag_view f_r_s">
					<block v-for="(tagInfo, index) in item.buildTags" :key="index">
						<view class="er_house_tag f_r_c">{{ tagInfo }}</view>
					</block>
				</view>
			</view>

			<view class="er_house_price_view f_r_s">
				<view v-if="item.buildPriceOfArea && item.buildPriceOfArea != 0"
					class="main_color er_house_price f_r_s">
					<view>{{ item.buildPriceOfArea }}</view>
					<view class="buildPriceOfAreaUnit">{{ item.buildPriceOfAreaUnit }}</view>
				</view>
				<view v-if="!item.buildPriceOfArea || item.buildPriceOfArea == 0"
					class="gray_color er_house_price">价格待定</view>
				<view v-if="item.buildArea" class="er_house_area">建面{{ item.buildArea }}<text>{{ item.buildAreaUnit }}</text></view>
			</view>
		</view>
	<!--  #ifdef MP-ALIPAY -->
	</view>
	<!-- #endif -->
	<!--  #ifndef MP-ALIPAY -->
	</button>
	<!-- #endif -->
</template>

<script>
	export default {
		data() {
			return {

			};
        },
        
        computed:{
            houseImgUrl() {
                let url = this.item.buildImg || "";
                if(url.indexOf("?x-oss-process=image") >= 0) {
                    return url;
                }
                
                return (url ? url + "?x-oss-process=image/resize,m_fill,h_120,w_180" : "");
            }
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
			newHouseDetail(item) {
			    let cityId = item.cityId || new GpsInfoModel().getModel("cityInfo").cityId || "";
			    let buildId = item.buildId || "";
			    let buildName = item.buildName || "";
			    uni.navigateTo({
			        url: "/pagesHouse/newHouseDetail/newHouseDetail?cityId="+cityId+"&buildId="+buildId
			            +"&buildName="+buildName
			    });
			}
		},
	}
</script>

<style scoped>
    .new_house_100_item{
        padding: 40upx 0 40upx 0;
        box-sizing: border-box;
        border-bottom: 2upx solid #F5F5F5;
		width: 100%;
        background: #FFFFFF;
    }
    .er_house_img_view{
        position: relative;
        width:216upx;
		height:165upx;
        flex-shrink: 0;
    }
	.er_house_img_cont{
		border-radius: 4upx;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
    .er_house_img{
        width: 100%;
        height: 100%;
    }
    .new_house_hot_icon,.new_house_luju_icon{
        height:17px;
        width:46px;
        position: absolute;
        top: -8upx;
        left: 10upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/house_list_sprites.png)  no-repeat;
		background-size:215px 30px;
    }
	.new_house_hot_icon{
		background-position:-123px 0;
	}
	.new_house_luju_icon{
		background-position:-77px 0;
	}

    .er_house_cont{
        padding-left: 30upx;
        box-sizing: border-box;
        width: calc(100% - 220upx);
    }
    .new_house_title{
        font-size:32upx;
        color:#333333;
        line-height:45upx;
        text-align: left;
		margin-top: -4upx;
        margin-bottom:15upx;
    }
    .new_build_name_box{
        width: auto;
        width: 80%;
        height: 44upx;
        display: flex;
        align-items: center;
        padding-right: 12upx;
        box-sizing: border-box;
    }
    .new_build_name {
        overflow: hidden;
		color: #101D36;
        text-align: left;
        max-width: calc(100% - 55upx);
        margin-left: 10upx;
        text-overflow: ellipsis;
        white-space: nowrap;
		/* line-height: 1; */
		font-weight: bold;
    }
    .coupon-icon {
        width: 45upx;
        height: 30upx;
        background-image: url('http://cdn.haofang.net/static/uuminiapp/common/coupon_icon.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .new_house_title .house_status_tag{
        color:#fff;
        font-size: 22upx;
		height: 30upx;
		line-height: 30upx;
        text-align: center;
        padding: 0 5upx;
		border-radius: 4upx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: auto 0;
		word-break: keep-all;
    }
    .new_house_title .wait_house{
        background: #fbb057;
    }
    .new_house_title .selling_house{
        background: #46a5fe;
    }
    .new_house_title .soldOut_house{
        background: #d1d1d1;
    }
    .er_house_des{
        height: 30upx;
        font-size:26upx;
        line-height: 30upx;
        color:#89909D;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .er_house_ting{
        margin-right: 8upx;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .er_house_tag_info{
		overflow: hidden;
		height: 30upx;
		margin-bottom: 10upx;
    }
    /* #ifdef MP-ALIPAY*/
    .er_house_tag_info{
        height: 30upx;
    }
    /* #endif */
	.er_house_tag_view{
		flex-wrap: wrap;
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
        height: 100%;
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
        flex-shrink: 0;
        align-items: center;
	}
    /* #ifdef MP-ALIPAY*/
    .er_house_tag{
        padding:0 6upx !important;
    }
    /* #endif */

    .er_house_price_view{
		font-size: 30upx;
        height:30upx;
        line-height:30upx;
    }
	.buildPriceOfAreaUnit{
		font-weight: normal;
	}
    .er_house_price{
        font-size:30upx;
        font-weight:bold;
        margin-right: 20upx;
    }
	.er_house_area{
	    font-size: 22upx;
		color: #89909D;
	}
</style>
