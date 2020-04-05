<template>
	<!-- 支付宝小程序button无法撑高 -->
	<!-- 公寓列表样式 -->
	<form report-submit @submit="formSubmit">
		<!--  #ifdef MP-ALIPAY -->
		<view hover-class="none" @click="checkApartmentDetail(item)" form-type="submit" class="apartment_item">
		<!-- #endif -->
		<!--  #ifndef MP-ALIPAY -->
		<button hover-class="none" @click="checkApartmentDetail(item)" form-type="submit" class="apartment_item">
		<!-- #endif -->
			<view class="apartment_item_img_view">
				<image mode="aspectFill" class="apartment_item_img" :src="houseImgUrl" lazy-load></image>
				<view class="houseSource">{{ item.houseSource }}</view>
			</view>
			
			<view class="f_r_s apartment_item_bottom">
				{{ item.houseAddress ? item.houseAddress + "  " : "" }} 
				{{ item.houseName ? item.houseName + "  " : "" }} 
				{{ item.houseTing || "" }}
			</view>
			
			<view v-if="item.housePriceOfMonth" 
				class="f_r_s housePriceOfMonth">
				<view>{{ item.housePriceOfMonth }}</view>
				<view class="housePriceOfMonthUnit">{{ item.housePriceOfMonthUnit }}</view>
			</view>
			
			<view class="f_r_s apartment_item_des">
				<block v-for="(tagInfo, index) in item.houseTags" :key="index">
					<view v-if="index < 2" class="f_c_c apartment_item_tag apartment_item_info">{{ tagInfo }}</view>
				</block>
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
	export default {
        props: ["item"],
		
		mounted() {
			new this.InitFormSubmit(this);
		},
        
        computed:{
            houseImgUrl() {
                return (this.item.houseImg || "");
            }
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

<style>
    .apartment_item{
        width: 100%;
        padding: 10upx 0 40upx;
		box-sizing: border-box;
        background:#fff;
        position:relative;
    }
	.apartment_item_img_view{
		width:100%;
		height:448upx;
		background:url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png?t=20190717) no-repeat center center;
		background-size:cover;
		border-radius: 14upx;
		overflow: hidden;
		box-sizing: border-box;
		position:relative;
	}
    .apartment_item_img{
        width:100%;
        height: 100%;
    }
	.houseSource{
		position:absolute;
		bottom:30upx;
		right:0;
		background-color:#41cbc0;
		height:44upx;
		width:143upx;
		text-align:center;
		color:#fff;
		font-size:26upx;
		line-height:42upx;
		border-radius:22upx 0 0 22upx;
	}
	
    .apartment_item_des{
        overflow: hidden;
        height: 30upx;
        margin-bottom: 10upx;
        margin-top: 6upx;
    }
    .apartment_item_tag{
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
    /* #ifdef MP-ALIPAY*/
    .apartment_item_tag{
        padding:4upx 6upx 2upx !important;
    }
    /* #endif */
    .housePriceOfMonth{
        color:#ab7f2e;
        background:#fff;
		font-size: 30upx;
		font-weight: bold;
		line-height: 40upx;
		margin-bottom: 10upx;
    }
	.housePriceOfMonthUnit{
		font-weight: normal;
	}
    .apartment_item_bottom{
        color:#101D36;
		margin-top: 11upx;
        box-sizing: border-box;
		font-size: 32upx;
		line-height: 50upx;
		font-weight: bold;
		text-align: left;
    }
    .apartment_item_addr{
        margin-right: 12upx;
    }
    .apartment_item_name{
        margin-right: 12upx;
    }
</style>

