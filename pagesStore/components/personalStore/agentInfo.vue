<template>
	<view class="f_r_b store_agent_view">
		<view class="f_c_s store_agent_left">
			<!--姓名 签名 服务区域-->
			<view class="agent_name_info_view">
				<view class="agent_name_text">{{ item.agentName }}</view>

				<view :class="(item.serviceZoneCn || item.serviceZone) ? 'agent_person_sign_max' : ''"
					  class="agent_person_sign"
					  v-if="item.personSign">{{ item.personSign }}</view>

				<view class="agent_service_info"
					  v-if="item.serviceRegArr && item.serviceRegArr.length > 0">
					<block v-for="(info, index) in item.serviceRegArr" :key="index">
						<text class="agent_service_reg" v-if="info.REG_NAME">{{ info.REG_NAME }}</text>
						<text class="agent_service_section"
							  v-if="info.SECTION">（{{ info.SECTION }}）</text>
					</block>
				</view>
				<view class="house-total"><block v-if="item.saleCount">在售{{item.saleCount}}套</block><block v-if="item.saleCount && item.leaseCount">，</block><block v-if="item.leaseCount">在租{{item.leaseCount}}套</block></view>
			</view>

			<!--消息和电话-->
			<view class="f_r_s" style="margin-top: 30upx;">
				<view class="agent_phone" @click="callTel"></view>

				<view :class="haveNewMsg ? 'agent_new_msg' : ''" class="agent_im" @click="skipToIm"></view>
			</view>
		</view>

		<!--头像和是否关注-->
		<view class="f_c_s store_agent_right">
			<view class="agent_head_view f_c_c">
				<image mode="aspectFill" :src="agentHeadImg"></image>
			</view>

			<view :class="isGuanZhu ? 'agent_is_gaunzhu' : ''"
				  @click="changeGuanZhuStatus"
				  class="f_r_s agnet_guanzhu">{{ isGuanZhu ? "已关注" : "＋ 关注" }}
			</view>
		</view>
	</view>
</template>

<script>
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import { AddOrRemoveAttention } from "@/net/personalStore/CheckIsAttentionBroker.js";
	import { Notify } from "@/utils/Notify.js";
	import { Notification } from "@/utils/Notification.js";
	import { UpUnReadNumTab } from "@/utils/ImChart.js";
	import { Const } from "@/utils/Const.js";

	class AgentInfoItem {
		archiveId = "";   // 经纪人id
		agentName = "";   // 经纪人姓名
		agentHead = ""; // 经纪人头像
		personSign = "";  // 个人签名
		serviceZone = "";
		serviceZoneCn = "";
		telephone = "";  // 经纪人电话
		cityId = "";  // 经纪人城市id
		serviceReg = "";  // 服务的区域
		serviceRegArr = [];  // 服务区域数组{REG_ID: "5", REG_NAME, ROW_NUMBER, SECTION: "双桥子 万年场 双林路 "}
	}

	export default {
		props: {
			item: {
				type: Object,
				default() {
					return new AgentInfoItem();
				}
			},
			guanZhuStatus: {
				type: String | Number,
				default: 0
			}
		},

		watch: {
			guanZhuStatus(newValue, oldValue) {
				this.isGuanZhu = !!(this.guanZhuStatus == 1);
			}
		},

		data() {
			return {
				isGuanZhu: false,  // 是否已关注
				haveNewMsg: false,  // 是否有新消息
			}
		},

		computed: {
			agentHeadImg() {
				return (this.item.agentHead
					&& this.item.agentHead.indexOf("datalib_esf/jjr_df_bsk.jpg") == -1
					? this.item.agentHead : Const.imDefaultHeadImg);
			}
		},

		mounted() {
			this.isGuanZhu = !!(this.guanZhuStatus == 1);
			// 更新消息体NC
			new Notification().addObserver(this, "UpChartMsgChanged", Notify.UpChartMsgChanged.Name);
		},

		destroyed() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
		},

		methods: {
			// 新消息回调
			UpChartMsgChanged(name, item) {
				if(item.messageId == this.item.archiveId) {
					this.haveNewMsg = true;
				}
			},

			// im聊天
			skipToIm() {
				this.PlatformUserBehavior.storeOnlineChart();
				this.haveNewMsg = false;
				UpUnReadNumTab.removeReadNum(this.item.archiveId);
				let me = new UserInfoModel().getModel("me") || {};
				let url = "/pagesTool/messageDetail/messageDetail";
				uni.navigateTo({
					url: url + '?messageId=' + this.item.archiveId
						+ "&userId=" + me.userId + "&openId=" + me.openId
						+ "&name=" + this.item.agentName
				});
			},

			// 拨打电话
			callTel() {
				this.PlatformUserBehavior.storeMakePhone();
				this.DifferenceApi.makePhoneCall(this.item.telephone);
			},

			// 改变关注状态
			changeGuanZhuStatus() {
				let me = new UserInfoModel().getModel("me") || {};
				this.isGuanZhu = !this.isGuanZhu;
				new AddOrRemoveAttention({
					wxId: me.userId,
					archiveId: this.item.archiveId,
					status: (this.isGuanZhu ? 1 : 0), //0 取消关注 1 添加关注
					cityId: this.item.cityId
				}).send()
					.then(res => {
						if(res.code == 200) {
							uni.showToast({
								icon: "none",
								title: (this.isGuanZhu ? '关注成功' : "取消成功")
							});
							return;
						}

						uni.showToast({
							icon: "none",
							title: (this.isGuanZhu ? '关注失败' : "取消失败")
						});
					})
					.catch(err => {
						uni.showToast({
							icon: "none",
							title: (this.isGuanZhu ? '关注失败' : "取消失败")
						});
					});
			},
		},
	}
</script>

<style>
	.store_agent_view{
		background-color:#2491FF;
		background-size:cover;
		position: relative;
		box-sizing: border-box;
		padding: 35upx;
		margin: 20upx 40upx;
		background-image: linear-gradient(-30deg, rgba(70, 153, 245, 0.86) 0%, rgba(70, 153, 245, 0.77) 0%, rgba(70, 153, 245, 0.69) 0%, rgba(70, 153, 245, 0.85) 0%, #4699f5 0%, #55b8f9 100%), linear-gradient( #000000, #000000);
		background-blend-mode: normal, normal;
		box-shadow: 0upx 0upx 24upx 0upx rgba(106, 173, 247, 0.2);
		border-radius: 10upx;
	}
	.store_agent_left{
		width: calc(100% - 160upx);
	}
	.store_agent_right{
		flex-shrink: 0;
	}
	.agent_name_info_view{
		width: 100%;
	}
	.agent_head_view{
		position:relative;
		width:115upx;
		height:115upx;
		border-radius:50%;
		will-change: transform;
		background-size:100%;
		overflow:hidden;
		flex-shrink: 0;
	}
	.agent_head_view image{
		width: 100%;
		height: 100%;
	}
	.agnet_guanzhu{
		padding:0 9upx;
		text-align:center;
		font-weight:normal;
		display:flex;
		justify-content:center;
		align-items:center;
		border:solid 1upx #ededed;
		width: 100upx;
		height: 38upx;
		line-height: 38upx;
		margin: 20upx auto 0;
		border-radius: 8upx;
		text-indent: 10upx;
		font-size: 22upx;
		position: relative;
		color: #fff;
	}
	.agnet_guanzhu::before{
		content: '';
		position: relative;
		display: block;
		vertical-align: middle;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/personal_store_sprites.png)  no-repeat;
		background-size:426px 50px;
		height:10px;
		width:10px;
		background-position:0 0;
	}
	.agent_name_view .agent_is_gaunzhu::before{
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/personal_store_sprites.png)  no-repeat;
		background-size:426px 50px;
		height:10px;
		width:11px;
		background-position:-10px 0;
	}
	.agent_name_view{
		display:flex;
		align-items:center;
		width:100%;
		font-size:36upx;
		font-weight:bold;
		color: #FFFFFF;
	}
	.agent_name_text{
		display:block;
		max-width:60%;
		font-size:42upx;
		font-weight:bold;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		margin-right: 6upx;
		font-family: PingFang-SC-Bold;
		color: #ffffff;
	}
	.agent_service_info{
		margin-top:12upx;
		position:relative;
		padding-left:22upx;
		font-size:24upx;
		text-align:left;
		max-width: 100%;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		color: #FFFFFF;
	}
	.agent_service_info::before{
		content: '';
		position: absolute;
		display: block;
		vertical-align: middle;
		left: 0;
		top: 50%;
		margin-top: -9upx;
		width: 23upx;
		height: 23upx;
		background: url(https://cdn.haofang.net/static/weidian-uniapp/static/images/personal/icon_map.png) center center no-repeat;
		background-size: 100% 100%;
		margin-right: 8upx;
	}
	.agent_service_reg{
		font-size: 26upx;
		color: #ffffff;
	}
	.agent_service_section{
		opacity: 0.58;
		font-size: 26upx;
		color: #ffffff;
	}
	.agent_person_sign{
		color: #FFFFFF;
		width: 100%;
		font-size:24upx;
		overflow:hidden;
		word-wrap:break-word;
		word-break:break-all;
		white-space:nowrap;
		text-overflow:ellipsis;
		margin: 15upx 0;
		opacity: 0.58;
	}
	.agent_name_info_view .agent_person_sign_max{
		width: calc(100% + 160upx);
	}
	.agent_im{
		width: 85upx;
		height: 85upx;
		background: url("https://cdn.haofang.net/static/weidian-uniapp/static/images/personal/btn_xiaoxi@2x.png")no-repeat center;
		background-size: 100%;
	}
	.agent_phone{
		background: url("https://cdn.haofang.net/static/weidian-uniapp/static/images/personal/btn_callphpne@2x.png")no-repeat center;
		width: 85upx;
		height: 85upx;
		background-size: 100%;
		margin-right: 24upx;
	}
	.agent_new_msg{
		position: relative;
	}
	.agent_new_msg::before{
		content: " ";
		border: 6upx solid red;
		border-radius: 6upx;
		position: absolute;
		z-index: 1000;
		right: 0;
		margin-right: 0upx;
		margin-top: 0upx;
	}
	.house-total{
		color: #fff;
		font-size: 26upx;
		padding-left: 22upx;
	}
</style>
