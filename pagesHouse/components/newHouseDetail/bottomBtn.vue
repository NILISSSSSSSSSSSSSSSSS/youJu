<template>
	<view :class="{ x_bottom : isInponeX }" class="bottom_btn f_r_b">
		<button v-if="pageFrom != 'jk'" form-type="submit" hover-class="none" @click="collectBtn(item)" class="collect_view_new f_c_c">
			<image v-if="collectMap[isCollected]" class="collect_img_new"
				:src="collectMap[isCollected].src"></image>
			<view v-if="collectMap[isCollected]"
				class="collect_text_new">{{ collectMap[isCollected].text }}</view>
		</button>

		<view class="f_r_e bottom_cont">
			<block v-if="item.showBackIndex">
				<button v-if="item.hasGuWen" form-type="submit"
                    hover-class="none" @click="ziXunZhiYeGuWen(item)"
					class="bottom_btn_click zi_xun global-confirm-btn">咨询置业顾问</button>

				<button v-else form-type="submit" hover-class="none" @click="ziXunShouLouBu(item)"
					class="bottom_btn_click zi_xun global-confirm-btn">咨询售楼部</button>

				<button form-type="submit" hover-class="none" @click="goBackIndex"
					class="bottom_btn_click back_index global-confirm-btn">返回首页</button>
			</block>

			<block v-if="!item.showBackIndex">
				<button v-if="item.hasGuWen" form-type="submit" hover-class="none"
					@click="ziXunZhiYeGuWen(item)" class="bottom_btn_click zi_xun_one global-confirm-btn">咨询置业顾问</button>

				<button v-else form-type="submit" hover-class="none"
					@click="ziXunShouLouBu(item)" class="bottom_btn_click zi_xun_one global-confirm-btn">咨询售楼部</button>
			</block>

		</view>

		<!-- 置业顾问的弹窗 -->
		<view @touchmove.stop.prevent="" v-if="isShowGuWenTc" @click="closeGuWenTc" class="gu_wen_fixed">
			<view class="gu_wen_info" @click.stop="stopCloseGuWenTc">
				<view class="gu_wen_title f_r_b">
					<view class="gu_wen_title_text">咨询置业顾问</view>
					<view class="gu_wen_title_close" @click="closeGuWenTc">×</view>
				</view>

				<view class="gu_wen_list_view">
				<swiper class="gu_wen_list" @change="guWenChange">
						<block v-for="(info, index) in item.guWenList" :key="index">
							<swiper-item class="gu_wen_list_item">
									<view class="f_r_c gu_wen_item_head_view">
											<image mode="aspectFill" :src="info.headerImg"></image>
									</view>

									<view class="gu_wen_item_name">{{ info.name }}</view>

									<view class="f_r_c">
										<view class="f_r_s gu_wen_item_star_view">
												<image class="gu_wen_item_star" v-for="(url, urlIndex) in info.starList"
														:src="url"></image>
										</view>

										<view class="gu_wen_item_star_num">{{ info.starNum }}</view>
									</view>

									<view class="gu_wen_item_des">{{ info.des }}</view>
							</swiper-item>
						</block>
				</swiper>

					<view class="f_r_c gu_wen_list_btn">
						<view @click="guWenOnLineChart" class="gu_wen_btn_view f_c_c">
							<image class="gu_wen_online_img"
								src="https://static.haofang.net/Public/images/wap/zhiye_sms.png"></image>
							<view>在线聊天</view>
						</view>

						<view @click="wifiChart" class="gu_wen_btn_view f_c_c">
							<image class="gu_wen_wifi_img"
								src="https://static.haofang.net/Public/images/wap/zhiye_voice.png"></image>
							<view>网络通话</view>
						</view>

						<view @click="takePhone" class="gu_wen_btn_view f_c_c">
							<image class="gu_wen_tel_img"
								src="https://static.haofang.net/Public/images/wap/zhiye_call.png"></image>
							<view>拨打电话</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 网络通话提示窗 -->
		<view @touchmove.stop.prevent="" v-if="isShowWifiChartTc" @click="closeWifiTc" class="gu_wen_fixed">
			<view class="wifi_chart_view" @click.stop="stopCloseWifiTc">
				<view class="wifi_chart_top_img"></view>
				<view class="wifi_chart_title">网络通话 远离骚扰</view>
				<view class="wifi_chart_des">下载 悠居客APP，享受免电话注册找好房</view>
				<view @click="closeWifiTc" class="wifi_chart_btn">我知道了</view>
			</view>
		</view>
	</view>
</template>

<script>
	class GuWenListItem {
		headerImg = "";  // 顾问头像
		name = "";  // 顾问名称
		starList = [];  // 星数组
		starNum = 3;  // 星数 最少三颗
		telephone = "";  // 顾问电话
		messageId = "";  // 顾问的id
		des = "";  // 描述
	}

	class BottomBtnItem {
		isCollected = false;  // 是否收藏
		showBackIndex = false;  // 是否显示回到首页
		caseId = "";  // 房源id
		caseType = "";  // 房源类型
		reSource = "";  // 房源来源 == 房源类型
		cityId = "";  // 房源所在城市id
		archiveId = "";  // 经纪人id
		telphone = "";  //咨询售楼部电话
		hasGuWen = false;  // 是否有置业顾问
		guWenList = [];  // 顾问列表
	}

	import {AddOrDeleteCollect} from "@/net/houseApi/AddOrDeleteCollect.js";
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
				isInponeX: this.CheckIsIphoneX.init(),
				guWenTel: "",  // 顾问 tel
				guWenId: "",  // 顾问id
				guWenName: "",  // 顾问姓名
				isShowWifiChartTc: false,  // 网络电话提示框
				isShowGuWenTc: false,  // 置业顾问弹窗
				isCollected: this.item ? this.item.isCollected || false : false,
			}
		},

		props: {
			item: {
				type: Object,
				default: {}
			},
			pageFrom: {
				type: String,
				default: ""
			}
		},

		mounted() {
			this.initCollectStatus();
			this.initGuWenInfo();
		},

		watch: {
			item() {
				this.initGuWenInfo();
				this.initCollectStatus();
			}
		},

		methods: {
			initCollectStatus() {
				this.isCollected = this.item ? this.item.isCollected || false : false;
			},

			// 初始化顾问信息
			initGuWenInfo() {
				if(!this.item || !this.item.guWenList || this.item.guWenList.length == 0) return;

				this.guWenChange({detail: {current: 0}});
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

			// 咨询置业顾问
			ziXunZhiYeGuWen(item) {
				this.isShowGuWenTc = true;
			},

			// 回到首页
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
					caseId: item.caseId,
					caseType: item.caseType,
					cityId: item.cityId,
					reSource: item.reSource,
					userId: new UserInfoModel().getModel("me").userId,
				};
				if(item.archiveId) {
					requestData["archiveId"] = item.archiveId;
				}

				new AddOrDeleteCollect(requestData).send()
					.then(res => {
						if(res.STATUS != 1) {
							this.isClickCollectIng = false;
							return;
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
					});
			},

			// 拨打电话
			takePhone() {
				this.DifferenceApi.makePhoneCall(this.guWenTel);
			},

			// 网络电话
			wifiChart() {
				this.closeGuWenTc();
				this.isShowWifiChartTc = true;
			},

			// 关闭顾问弹窗
			closeGuWenTc() {
				this.isShowGuWenTc = false;
			},
			stopCloseGuWenTc() {},

			// 关闭网络通话弹窗
			closeWifiTc() {
				this.isShowWifiChartTc = false;
			},
			stopCloseWifiTc() {},

			// 切换顾问
			guWenChange(e) {
				let current = e.detail.current;
				this.guWenTel = this.item.guWenList[current] ? this.item.guWenList[current].telephone : "";
				this.guWenId = this.item.guWenList[current] ? this.item.guWenList[current].messageId : "";
				this.guWenName = this.item.guWenList[current] ? this.item.guWenList[current].name : "";
			},

			// 在线聊天
			guWenOnLineChart() {
                let me = new UserInfoModel().getModel("me") || {};
				if (!this.guWenId) {
					uni.showToast({
						title: '暂无顾问id, 无法在线聊天。',
						icon: "none"
					});
					return;
				}

                let url = "/pagesTool/messageDetail/messageDetailH5";
                // #ifdef H5 || MP-WEIXIN
                url = "/pagesTool/messageDetail/messageDetail";
                // #endif
				uni.navigateTo({
					url: url + "?messageId=" + this.guWenId
						+ "&name=" + this.guWenName
                        + "&userId=" + me.userId
                        + "&openId=" + me.openId
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
		/* padding: 0 40upx; */
		box-sizing: border-box;
        z-index: 100;
	}
	.x_bottom{
		height: 180upx!important;
	}
	.collect_view_new{
	    flex-shrink: 0;
	    position:relative;
	    font-size:28upx;
		width: 100%;
        flex-shrink: 1;
	    color:#101D36;
	    text-align:center;
		height: 140upx;
	}
	.collect_img_new{
	    margin:0 auto 8upx;
	    width:38upx;
	    height:38upx;
	}
	.collect_text_new{
	    color:#101D36;
	    font-size:22upx;
		line-height: 33upx;
	    text-align:center;
	}
	.bottom_cont{
		height: 140upx;
				flex-shrink: 0;
				margin-right: 40upx;
	}
	.bottom_btn_click{
		width:230upx;
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

	/* 置业顾问 */
	.gu_wen_fixed{
		position:fixed;
		width:100%;
		height:100%;
		top:0;
		left:0;
		background:rgba(0, 0, 0, 0.5);
		z-index:100;
	}
	.gu_wen_info{
		background:#fff;
		position:absolute;
		width:100%;
		bottom:0;
		left:0;
	}
	.gu_wen_title{
		border-bottom:1upx solid #d6d6d6;
		box-sizing: border-box;
	}
	.gu_wen_title_text{
		height:103upx;
		line-height:103upx;
		font-size:30upx;
		color:#404040;
		padding-left:43upx;
		letter-spacing:1px;
	}
	.gu_wen_title_close{
		width:103upx;
		height:103upx;
		line-height:103upx;
		text-align:center;
		color:#5d5d5d;
		font-size:40upx;
	}
	.gu_wen_list_view{
		padding-top:38upx;
		box-sizing: border-box;
	}
	.gu_wen_list_view .gu_wen_list{
		height:400upx!important;
		width: 100%;
	}
	.gu_wen_list_item{
		width: 100%;
		height: 100%;
	}
	.gu_wen_item_head_view{
		width:154upx;
		height:154upx;
		overflow:hidden;
		border-radius:77upx;
		will-change: transform;
		margin:0 auto;
	}
	.gu_wen_item_head_view>image{
		width:100%;
		height:100%;
	}
	.gu_wen_item_name{
		color:#000;
		letter-spacing:1px;
		font-size:28upx;
		line-height:1;
		padding-top:42upx;
		padding-bottom:10upx;
		text-align:center;
	}
	.gu_wen_item_star_view{
		margin: auto 0;
	}
	.gu_wen_item_star{
		height: 23upx;
		width: 23upx;
		margin-right: 5upx;
	}
	.gu_wen_item_star_num{
		background:#feae00;
		color:#fff;
		font-size:20upx;
		line-height:1;
		padding:7upx 14upx;
		border-radius:8upx;
		will-change: transform;
		margin: auto 0 auto 15upx;
		flex-shrink: 0;
	}
	.gu_wen_item_des{
		width:515upx;
		text-align:center;
		color:#606060;
		line-height:34upx;
		margin:10upx auto;
		font-size:24upx;
	}
	.gu_wen_list_btn{
		width:100%;
		height:156upx;
		box-sizing:border-box;
		border-bottom:1upx solid #eee;
		border-top:1upx solid #eee;
		display:-webkit-box;
		-webkit-box-align:center;
		-webkit-box-pack:center;
		padding:0 34upx;
		flex-shrink: 0;
	}
	.gu_wen_btn_view{
		-webkit-box-flex:1;
		text-align:center;
		color:#666;
		font-size:26upx;
		width:100%;
	}
	.gu_wen_online_img{
		width: 62upx;
		height: 62upx;
		flex-shrink: 0;
		margin: 0 auto 8upx;
	}
	.gu_wen_wifi_img{
		width: 52upx;
		height: 70upx;
		flex-shrink: 0;
		margin: 0 auto;
	}
	.gu_wen_tel_img{
		width: 54upx;
		height: 60upx;
		flex-shrink: 0;
		margin: 0 auto 10upx;
	}

	/* 网络通话弹窗 */
	.wifi_chart_view{
		position:fixed;
		top:50%;
		left:50%;
		width:600upx;
		transform:translate(-50%, -50%);
		z-index:9999;
		box-sizing:border-box;
		border-radius:5px;
		will-change: transform;
		background:#fff;
	}
	.wifi_chart_top_img{
		width:582upx;
		height:265upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/im/d-top.png) no-repeat center;
		background-size:100%;
		margin:10upx auto;
	}
	.wifi_chart_title{
		font-size:30upx;
		padding-top:30upx;
		margin-bottom:10upx;
		text-align:center;
		font-weight:bold;
	}
	.wifi_chart_des{
		font-weight:normal;
		color:#6b6f84;
		font-size:26upx;
		text-align:center;
	}
	.wifi_chart_btn{
		background:#01ca86;
		color:#fff;
		font-size:32upx;
		width:490upx;
		height:90upx;
		line-height:90upx;
		text-align:center;
		margin:40upx auto;
		border-radius:8upx;
		will-change: transform;
	}
</style>
