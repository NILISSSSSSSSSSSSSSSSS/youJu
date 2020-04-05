<template>
	<view :class="{ x_bottom_view : isInponeX }" class="bottom_btn f_r_b">
		<view @click="collectBtn(item)" class="collect_view f_c_c">
			<image v-if="collectMap[isCollected]" class="collect_img"
				:src="collectMap[isCollected].src"></image>
			<view v-if="collectMap[isCollected]"
				class="collect_text">{{ collectMap[isCollected].text }}</view>
		</view>

		<view class="f_r_e bottom_btn_cont">
			<block v-if="item.showBackIndex">
				<view v-if="item.telphone" @click="ziXunShouLouBu(item)"
                    class="bottom_btn_click zi_xun global-confirm-btn-another">免费电话</view>

				<view @click="goBackIndex" class="bottom_btn_click back_index global-confirm-btn">返回首页</view>
			</block>

			<view v-else-if="!item.showBackIndex && item.telphone"
				@click="ziXunShouLouBu(item)" class="bottom_btn_click zi_xun_one global-confirm-btn">免费电话</view>

            <view v-else class="bottom_btn_empty"></view>
		</view>
	</view>
</template>

<script>
	class BottomBtnItem {
		isCollected = false;  // 是否收藏
		showBackIndex = false;  // 是否显示回到首页
		telphone = "";  //免费电话
		rentType = "";  // 出租类型
		roomUuid = "";
	}

	import {CollectApartment} from "@/net/houseApi/CollectApartment.js";
	import {UserInfoModel} from "@/model/UserInfoModel.js";

	export default {
		data() {
			return {
				collectMap: {
				    true: {
				        text: "收藏",
				        src: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/detail_btn_collect_selected.png"
				    },
				    false: {
				        text: "收藏",
				        src: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/detail/detail_btn_collect_nomal.png"
				    }
				},
				isClickCollectIng: false,
				isCollected: this.item ? this.item.isCollected || false : false,
				isInponeX: this.CheckIsIphoneX.init()
			}
		},

		props: {
			item: {
				type: Object,
				default: {}
			},
		},

		mounted() {
			this.initCollectStatus();
		},

		watch: {
			item: {
				handler() {
					this.initCollectStatus();
				},
				deep: true
			}
		},

		methods: {
			initCollectStatus() {
				this.isCollected = this.item ? this.item.isCollected || false : false;
			},

			// 咨询售楼部
			ziXunShouLouBu(item) {
				if(!item.telphone) {
					uni.showToast({
						title: "暂无电话",
						icon: "none"
					});
					return;
				}

				this.DifferenceApi.makePhoneCall(item.telphone);
			},

			goBackIndex() {
				uni.reLaunch({
					url: "/pages/index/index"
				});
			},

			// 收藏
			collectBtn(item) {
			    let that = this;
			    if(this.isClickCollectIng) return;

				if (!new UserInfoModel().getModel("me")) return;

				if (!new UserInfoModel().getModel("me").userId) return;

				this.isClickCollectIng = true;
				let requestData = {
					uuid: item.roomUuid,
					rentType: item.rentType,
					youyouUserId: new UserInfoModel().getModel("me").userId,
				};

				new CollectApartment(requestData).send()
					.then(res => {
						if(res.STATUS != 1) {
							this.isClickCollectIng = false;
							return Promise.reject(res);
						}

						let toastText = "";
						do{
							if(this.isCollected) {
							    this.isCollected = false;
								toastText = "已取消";
							    break;
							}

							this.isCollected = true;
							toastText = "收藏成功";
						}while(false);

						this.PlatformUserBehavior.collectHouse(this.isCollected);
						uni.showToast({
						    title: toastText,
						    icon: "none",
						    success: function() {
						        that.isClickCollectIng = false;
						    }
						});
					})
					.catch(err => {
						uni.showToast({
							title: err.INFO || "操作失败",
							icon: "none",
							success: function() {
								that.isClickCollectIng = false;
							}
						});
					});
			}
		}
	}
</script>

<style scoped>
	.bottom_btn{
		position: fixed;
		bottom: 0;
		left: 0;
		height: 140upx;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0px -1upx 32upx 0upx  rgba(97, 97, 97, 0.11);
		padding: 0 40upx;
		box-sizing: border-box;
        z-index: 100;
	}
	.x_bottom_view{
		height: 180upx!important;
	}
	.collect_view{
	    position:relative;
	    font-size:28upx;
		width: 100%;
	    color:#101D36;
		height: 140upx;
	    text-align:center;
	}
	.collect_img{
	    margin:0 auto 8upx;
	    width:38upx;
	    height:38upx;
	}
	.collect_text{
	    color:#101D36;
	    font-size:22upx;
		line-height: 33upx;
	    text-align:center;
	}
	.bottom_btn_cont{
		height: 140upx;
	}
    .bottom_btn_empty{
        width: 402upx;
        flex-shrink: 0;
        height:100upx;
    }
	.bottom_btn_click{
		width:230upx;
		flex-shrink: 0;
		height:100upx;
		border-radius:10upx;
		will-change: transform;
		font-size:30upx;
		text-align:center;
		color:#fff;
		line-height:100upx;
		font-weight:bold;
		margin: auto 0;
	}
	.bottom_btn .back_index{
		background:-webkit-linear-gradient(left, rgb(255, 132, 0), rgb(255, 84, 0));
	}
	.bottom_btn .zi_xun{
		background:-webkit-linear-gradient(left, rgb(255, 203, 0), rgb(255, 148, 2));
		margin-right: 14upx;
	}
	.bottom_btn .zi_xun_one{
		background:-webkit-linear-gradient(left, rgb(255, 132, 0), rgb(255, 84, 0));
		width: 402upx;
	}
</style>
