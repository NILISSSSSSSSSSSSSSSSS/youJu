<template>
	<view :class="{ x_bottom_view : isInponeX }" class="f_r_b bottom_btn_view">
		<view class="f_r_s bottom_agent_info_view">
			<image @click="goToStore" mode="aspectFill" class="bottom_agent_img" :src="item.headerImg"></image>

			<view class="f_c_c bottom_agent_cont">
				<view style="font-weight: bold;" class="bottom_agent_name">{{ name }}</view>
				<view v-if="item.compName && item.isAboutTake" class="bottom_comp_name">{{ item.compName }}</view>
				<view class="bottom_agent_star f_r_s" v-else-if="item.caseType != 3 && item.reSource != 3 && item.reSource != 4">
					<block v-for="(url, index) in starList" :key="index">
						<image :src="url" mode="aspectFill"></image>
					</block>
				</view>
				<view class="bottom_agent_star_empty" v-else></view>
			</view>
		</view>

		<view class="f_r_e bottom_btn_info_view">
			<view class="bottom_link_me" v-if="item.reSource == 3 || item.reSource == 4"
				  @click="chartYeZhu">
				咨询业主
			</view>

			<view v-else-if="item.isAboutTake && item.archiveId && item.archiveId != 0"
				  class="bottom_link_me_take" @click="onlieChart">
				在线咨询
			</view>

			<view v-else-if="!item.isAboutTake && item.archiveId && item.archiveId != 0"
				  class="bottom_link_me" @click="onlieChart">
				在线咨询
			</view>

			<view class="bottom_link_me" v-else-if="!item.isAboutTake && item.telephone && !(item.archiveId && item.archiveId != 0)" @click="makePhone">
				联系我
			</view>

			<view class="bottom_agent_btn" v-if="item.showBackIndex" @click="goBackIndex">返回首页</view>

			<view class="bottom_agent_btn" v-if="pageFrom != 'jk' && !item.isAboutTake && !item.showBackIndex && item.reSource != 3 && item.reSource != 4" @click="findeHouse">
				特权找房
			</view>

			<view class="bottom_agent_btn" v-if="pageFrom == 'jk' && !item.isAboutTake && !item.showBackIndex && item.reSource != 3 && item.reSource != 4" @click="makePhone">
				电话咨询
			</view>
		</view>
	</view>
</template>

<script>
	import { GetStarList } from "@/utils/common.js";
	import { GetTelFromHeZuMobileCode } from "@/net/houseApi/GetTelFromHeZuMobileCode.js";
	import { CreateCallHistory } from "@/net/im/CreateCallHistory.js";
	import { GpsInfoModel } from "@/model/GpsInfoModel.js";
	import { Notification } from "@/utils/Notification.js";
	import { Notify } from "@/utils/Notify.js";
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import {GetAesEncrypt} from "../../../net/houseApi/GetHouseOtherInfo";

	class BottomBtnItem {
        compName = ""; // 公司名称
		headerImg = ""; // 经纪人头像
		name = "";  // 经纪人姓名
		starNum = ""; // 评价星数
		archiveId = ""; // 经纪人id
		caseId = ""; // 房源id
		caseType = "";  // 房源类型
		cityId = ""; // 城市id
		telephone = "";
		showBackIndex = false; // 返回首页的按钮
		reSource = 1;  // 来源
		zhuangXiuStatusId = "";  // 装修情况
		zhuangXiuStatusName = "";
		roomId = "";  // 几室id
		roomName = "";
		regionId = "";
		regionName = "";
		houseName = "";
		houseTypeId = ""; // 房屋类型id
		houseTypeName = ""; // 房屋类型文案
		tingId = "";  // 厅
		weiId = "";  // 卫
		houseArea = "";  // 面积
		housePrice = "";  // 价格
	}

	export default {
		props: {
			item: {
				type: Object,
				default: {}
			},
			archiveId: {
				type: String,
				default: ""
			},
			pageFrom: {
				type: String,
				default: ""
			}
		},

		computed: {
			name() {
				let defaultName = "";
				if([3, 4, "3", "4"].includes(this.item.reSource)) {
					defaultName = "房东";
				}
				return (this.item.name || defaultName);
			}
		},

		watch: {
			item(newValue, oldValue) {
				this.dealStarList();
			}
		},

		data() {
			return {
				starList: [],
				isInponeX: this.CheckIsIphoneX.init()
			}
		},

		mounted() {
			this.dealStarList();
		},

		methods: {
			dealStarList() {
				this.starList = new GetStarList((this.item.starNum || 4.5)).getList();
			},

			goBackIndex() {
				uni.reLaunch({
					url: "/pages/index/index"
				});
			},

            makePhone() {
				if(this.item.caseType == 3) {
					new GetTelFromHeZuMobileCode({type: "decrypt", content: this.item.telephone}).send()
						.then(res => {
							if(!res.DATA) {
								uni.showToast({
									icon: "none",
									title: "暂无电话，无法拨打"
								});
								return;
							}

							this.DifferenceApi.makePhoneCall(res.DATA);
						})
						.catch(() => {
							uni.showToast({
								icon: "none",
								title: "暂无电话，无法拨打"
							});
						});
					return;
				}

                this.DifferenceApi.makePhoneCall(this.item.telephone);
            },

			// 在线咨询
			onlieChart() {
				this.PlatformUserBehavior.onlineChart();
				let that = this;
				let system = uni.getSystemInfoSync()['system'];
				let isIOS = !!(system.indexOf('iOS') > -1);
				let me = new UserInfoModel().getModel("me") || {};
				let url = "/pagesTool/messageDetail/messageDetail";
				uni.navigateTo({
					url: url + '?messageId=' + this.item.archiveId
						+ '&caseId=' + this.item.caseId + '&caseType=' + this.item.caseType
						+ "&userId=" + me.userId + "&openId=" + me.openId
						+ "&name=" + this.item.name + "&pageFrom=houseDetail"
						+ '&cityId=' + this.item.cityId + '&reSource=' + that.item.reSource,
					success: function() {
						new CreateCallHistory({
							callType: 5,
							cityId: that.item.cityId,
							callImid: that.ImChart.uuAccid,
							calledImid: that.item.archiveId,
							callSource: 2,
							resource: that.item.reSource,
							deviceType: isIOS ? 2 : 1,
							caseId: that.item.caseId,
							caseType: that.item.caseType
						}).send();
					}
				});
			},

			// 特权找房
			findeHouse() {
				let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				if(cityInfo.cityId != gpsInfo.cityId) {
					uni.showModal({
						showCancel: false,
						confirmColor: "#ab7f2e",
						confirmText: "立即切换",
						title: "切换城市",
						content: "特权找房只能在定位城市发布委托",
						success: (res) => {
							if (res.confirm) {
								cityInfo["cityId"] = gpsInfo.cityId || "";
								cityInfo["cityName"] = gpsInfo.cityName || "";
								cityInfo["regId"] = gpsInfo.regId || "";
								cityInfo["regName"] = gpsInfo.regName || "";
								new GpsInfoModel().setModel(cityInfo, "cityInfo");
								new Notification().postNotification(Notify.GpsChanged.Name);
							}
						}
					});
					return;
				}

				this.PlatformUserBehavior.teQuanFindeHouse();
				let caseType = 4;
				if (this.item.caseType == 1) {
					caseType = 3
				}
				uni.navigateTo({
					url: "/pagesEntrust/entrust/entrust?archiveId="
						+ this.archiveId
						+ "&caseType=" + caseType
						+ "&isVip=0" + "&step=4" + "&isEdit=1"
						+ "&houseTypeId=" + this.item.houseTypeId
						+ "&houseTypeName=" + this.item.houseTypeName
						+ "&regionId=" + this.item.regionId
						+ "&regionName=" + this.item.regionName
						+ "&zhuangXiuStatusId=" + this.item.zhuangXiuStatusId
						+ "&zhuangXiuStatusName=" + this.item.zhuangXiuStatusName
						+ "&roomId=" + this.item.roomId
						+ "&roomName=" + this.item.roomName
						+ "&tingId=" + this.item.tingId
						+ "&weiId=" + this.item.weiId
						+ "&houseArea=" + this.item.houseArea
						+ "&housePrice=" + this.item.housePrice
						+ "&fromType=teQuanFindHouse"
						+ "&wfRelateId=" + this.item.caseId
						+ "&wfRelateName=" + this.item.houseName
						+ "&archiveName=" + this.item.agentName
						+ "&archiveHeadImg=" + this.item.agentHeaderImg
				});
			},

			// 咨询业主
			chartYeZhu() {
				if(!this.item.telephone) {
					uni.showToast({title: "暂无电话，无法拨打", icon: "none"});
					return;
				}

				new GetAesEncrypt({
					type: "decrypt",
					content: this.item.telephone
				}).send().then(res => {
					if(res.STATUS != 1 || !res.DATA) {
						uni.showToast({title: "拨打失败", icon: "none"});
						return;
					}

					this.DifferenceApi.makePhoneCall(res.DATA);
				})
			},

			// 进入微店
			goToStore() {
				if(this.item.reSource == 3 || this.item.reSource == 4) return;
				// 相同的经纪人不需要再次跳转
				// if(this.archiveId == this.item.archiveId) return;

				uni.navigateTo({
					url: "/pagesStore/personalStore/personalStore?archiveId=" + this.item.archiveId
				});
			},
		},
	}
</script>

<style scoped>
	.bottom_btn_view{
		position: fixed;
		bottom: 0;
		left: 0;
		height: 140upx;
		width: 100%;
		background: #FFFFFF;
		box-shadow: 0px -1upx 32upx 0upx  rgba(97, 97, 97, 0.11);
		padding: 0 20upx;
        z-index: 100;
		box-sizing: border-box;
	}
	.x_bottom_view{
		height: 180upx!important;
	}
	.bottom_agent_info_view{
		height: 140upx;
        flex-shrink: 0;
	}
    .bottom_btn_info_view{
        height: 140upx;
        width: 63%;
        padding-left: 20upx;
        box-sizing: border-box;
    }
	.bottom_agent_img{
		flex-shrink: 0;
		width: 90upx;
		height: 90upx;
		border-radius: 100%;
		will-change: transform;
		border: 1upx solid #EEEEEE;
		box-sizing: border-box;
		margin: auto 0;
		/*background: url("http://cdn.haofang.net/static/uuminiapp/im/defaultHead.png?t=20180427") center center no-repeat;*/
		background-size: 100%;
	}
	.bottom_agent_cont{
		padding-left: 15upx;
		box-sizing: border-box;
	}
	.bottom_agent_name{
		font-size: 32upx;
		color: #101D36;
	}
    .bottom_comp_name{
        font-size:26upx;
        color:#89909d;
        text-align:left;
        margin-top:15upx;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
	.bottom_agent_star{
		margin-top: 10upx;
	}
	.bottom_agent_star>image{
		width: 22upx;
		height: 20upx;
		margin: 0 2upx 0 0;
		flex-shrink: 0;
	}
    .bottom_agent_star_empty{
        height: 20upx;
        margin-top: 10upx;
    }
    .bottom_link_me_take{
        width: 100%;
        height:100upx;
        border-radius:10upx;
		will-change: transform;
		background-color: #ffd900;
        box-sizing: border-box;
        font-size:30upx;
        text-align:center;
        color:#101d36;
        line-height:100upx;
        margin: auto 0 auto 14upx;
		font-weight: bold;
    }
	.bottom_agent_btn{
		width:100%;
		height:100upx;
		border-radius:10upx;
		will-change: transform;
		background-image: linear-gradient(90deg,
		rgba(61, 61, 61, 0.9) 0%,
		rgba(61, 61, 61, 0.95) 0%,
		#3d3d3d 0%,
		#000000 100%),
		linear-gradient(
				#ff6600,
				#ff6600);
		background-blend-mode:normal, normal;
		box-sizing: border-box;
		font-size:30upx;
		text-align:center;
		color:#ffd900;
		line-height:100upx;
		margin: auto 0 auto 14upx;
		font-weight: bold;
	}
    .bottom_link_me{
		background-color: #ffd900;
		width:100%;
        height:100upx;
        border-radius:10upx;
		will-change: transform;
        background-blend-mode:normal, normal;
        box-sizing: border-box;
        font-size:30upx;
        text-align:center;
        color:#101d36;
        line-height:100upx;
        margin: auto 0;
		font-weight: bold;
    }
</style>
