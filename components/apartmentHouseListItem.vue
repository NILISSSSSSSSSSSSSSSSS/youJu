<template>
	<!-- 支付宝小程序button无法撑高 -->
	<!-- 首页的公寓列表样式 -->
	<form report-submit @submit="formSubmit">
		<!--  #ifdef MP-ALIPAY -->
		<view hover-class="none" @click="checkApartmentDetail(item)" form-type="submit" class="apartment_item">
		<!-- #endif -->
		<!--  #ifndef MP-ALIPAY -->
		<button hover-class="none" @click="checkApartmentDetail(item)" form-type="submit" class="apartment_item">
		<!-- #endif -->
			<image class="apartment_item_img" :src="item.houseImg"></image>
			<view class="f_r_s apartment_item_des">
				<view class="f_r_c houseResourceText apartment_item_tag">{{ item.houseResourceText }}</view>
				<view v-if="item.housePriceOfMonth"
					  class="f_c_c housePriceOfMonth apartment_item_tag">{{ item.housePriceOfMonth }}{{ item.housePriceOfMonthUnit }}</view>
				<block v-for="(tagInfo, index) in item.houseTags" :key="index">
					<view v-if="index < 2" :class="[apartmentTagColorMap[index]] || 'apartment_item_info_0'"
						  class="f_c_c apartment_item_tag">{{ tagInfo }}</view>
				</block>
			</view>
			<view class="apartment_item_bottom">
				{{ item.houseAddress ? item.houseAddress + "  " : "" }}
				{{ item.houseName ? item.houseName + "  " : "" }}
				{{ item.houseTing || "" }}
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

		data() {
        	return {
        	    apartmentTagColorMap: {
        	        0: "apartment_item_info_0",
        	        1: "apartment_item_info_1",
        	        2: "apartment_item_info_2",
        	        3: "apartment_item_info_0",
        	        4: "apartment_item_info_1",
        	        5: "apartment_item_info_2",
				}
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

<style>
    .apartment_item{
        width:500upx;
        padding:20upx 26upx;
        flex-shrink:0;
        background:#fff;
        overflow:hidden;
        position:relative;
    }
    .apartment_item_img{
        width:100%;
        height:350upx;
    }
    .apartment_item_des{
        max-height:44upx;
        margin-top: 20upx;
    }
    .apartment_item_tag{
        white-space: nowrap;
        font-size:22upx;
        display:flex;
        flex-direction: column;
        justify-content: center;
        padding:2upx 6upx 4upx;
        border-radius:2upx;
        margin-right:10upx;
        box-sizing: border-box;
    }
    /* #ifdef MP-BAIDU */
    .apartment_item_tag{
    	border-radius:0.5vw!important;
    }
    /* #endif */
    /* #ifdef MP-ALIPAY */
    .apartment_item_tag{
        padding:4upx 6upx 2upx!important;
    }
    /* #endif */
    .houseResourceText{
        background:#ff8a00;
        color:#fff;
        border:1upx solid #ff8a00;
    }
    .housePriceOfMonth{
        border:1upx solid #ff8a00;
        color:#ff8a00;
        background:#fff;
    }
    .apartment_item_info_0{
        border: 1upx solid rgb(27, 201, 100);
        color: rgb(27, 201, 100);
    }
    .apartment_item_info_1{
        color: #ff8a00;
        border: 1upx solid #ff8a00;
    }
    .apartment_item_info_2{
      border: 1upx solid rgb(0, 158, 224);
      color: rgb(0, 158, 224);
    }
    .apartment_item_bottom{
        font-size:30upx;
        color:#000;
        padding:10upx 0;
        box-sizing: border-box;
		text-align: left;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
    }
    .apartment_item_addr{
        margin-right: 8upx;
    }
    .apartment_item_name{
        margin-right: 8upx;
    }
</style>
