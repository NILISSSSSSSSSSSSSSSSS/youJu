<template>
	<form v-if="tcShow" report-submit @submit="formSubmit">
		<view @click="closeTc" class="link_me f_c_c">
			<view class="f_c_s link_me_cont">
				<view class="f_r_c link_me_title">
					<view class="line"></view>
					<view class="link_me_title_text">选择联系方式</view>
					<view class="line"></view>
				</view>

				<view class="f_r_c link_me_btn_view">
					<view @click.stop="onlineChart" hover-class="none" form-type="submit" class="f_c_s link_me_btn">
						<image src="http://cdn.haofang.net/static/uuminiapp/detail/chat_pic.png"></image>
						<view>在线聊天</view>
					</view>

					<view @click.stop="markPhone" hover-class="none" form-type="submit" class="f_c_s link_me_btn">
						<image src="http://cdn.haofang.net/static/wxPlusApp/yjk/tel_pic.png"></image>
						<view>拨打电话</view>
					</view>
				</view>
			</view>
		</view>
	</form>
</template>

<script>
	import {Notification} from "../../../utils/Notification";
	import {Notify} from "../../../utils/Notify";
	import {UserInfoModel} from "../../../model/UserInfoModel";

	class BuildExpertItem {
		buildName = "";  // 小区名称
		buildAddress = "";  // 服务地址
		agentHeaderImg = ""; // 专家头像
		agentName = "";  // 专家姓名
		agentPhone = "";  // 专家电话
		archiveId = ""; // id
		noBoxShadow = false;  // 不显示view 的 box-shadow style
		caseId = ""; // 房源id
		caseType = "";  // 房源类型
		cityId = ""; // 城市id
		reSource = 1;  // 来源

		shareInfoFlag = false;  // 经纪人个人微店 进入及掌通分享:新房显示、小区专家显示
		houseList = [];  // 负责的房源列表 类型同房源列表
	}

	export default {
		data() {
			return {
				tcShow: false
			};
		},

		watch: {
			show(newValue, oldValue) {
				this.tcShow = newValue;
			}
		},

		// show 控制显示和隐藏
		props: {
			telephone: {
				type: String,
				default: ""
			},
			show: {
				type: Boolean,
				default: false
			},
			archiveId: {
				type: String | Number,
				default: ""
			},
			item: {
				type: Object,
				default() {
					return new BuildExpertItem();
				}
			}
		},

		mounted() {
			this.tcShow = this.show;
		},

		methods: {
			markPhone() {
				if(!this.telephone) {
					uni.showToast({
						title: "暂无电话",
						icon: "none"
					});
					return;
				}

                this.closeTc();
				this.DifferenceApi.makePhoneCall(this.telephone);
			},

			onlineChart() {
				if(!this.archiveId) {
					uni.showToast({
						title: "暂无id，无法在线聊天",
						icon: "none"
					});
					return;
				}

                this.closeTc();
				let me = new UserInfoModel().getModel("me") || {};
				let url = "/pagesTool/messageDetailH5/messageDetail";
				// #ifdef H5 || MP-WEIXIN
				url = "/pagesTool/messageDetail/messageDetail";
				// #endif
				uni.navigateTo({
					url: url + '?messageId=' + this.archiveId
						+ '&caseId=' + this.item.caseId + '&caseType=' + this.item.caseType
						+ "&name=" + this.item.agentName + "&userId=" + me.userId
						+ "&openId=" + me.openId + "&pageFrom=villageExpert"
						+ "&buildName=" + this.item.buildName
						+ '&cityId=' + this.item.cityId + '&reSource=' + this.item.reSource
				});
			},

			closeTc() {
				this.tcShow = false;
				new Notification().postNotification(Notify.HouseListAgentChanged.Name, false);
			}
		},
	}
</script>

<style scoped>
	.link_me{
		position: fixed;
		background-color:rgba(0,0,0,.6);
		z-index: 999999;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		padding: 0 100upx;
		box-sizing: border-box;
	}
	.link_me_cont{
		background: #FFFFFF;
		border-radius:10upx;
		overflow: hidden;
		box-sizing: border-box;
		padding: 40upx 20upx;
	}
	.link_me_title{
		font-size:30upx;
		margin-bottom:40upx;
		height: 40upx;
		line-height: 40upx;
	}
	.link_me_title_text{
		color: #101D36;
		padding: 0 15upx;
		box-sizing: border-box;
		flex-shrink: 0;
		text-align: center;
	}
	.line{
		width:100%;
		height:1upx;
		background: #E6E6E6;
		margin: auto 0;
	}
	.link_me_btn:nth-child(2){
		margin-left: 100upx;
	}
	.link_me_btn>image{
		width: 90upx;
		height: 90upx;
		flex-shrink: 0;
		margin: 0 auto;
	}
	.link_me_btn>view{
		font-size: 28upx;
		color: #101D36;
		text-align: center;
		margin-top: 20upx;
	}
</style>
