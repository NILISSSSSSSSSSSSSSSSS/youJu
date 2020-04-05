<template>
	<view class="gua_pai_list">
		<block v-for="(item, index) in list" :key="index">
			<view :style="{borderBottom: index == list.length - 1 ? 'none' : ''}" class="f_r_b gua_pai_item">
				<view class="f_r_s gua_pai_cont">
					<image class="headerImg" :src="item.headerImg"></image>

					<view class="f_c_c agent_info">
						<view class="agent_name">{{ item.name }}</view>

						<view class="agent_service">服务: {{ item.service || '--' }}</view>
					</view>
				</view>

				<image class="take_phone_icon" src="http://cdn.haofang.net/static/uuminiapp/detail/tel_ico.png"
					@click="takePhone(item)"></image>
			</view>
		</block>

		<view class="gui_pai_des">通过400电话联系经纪人，不会暴露您的真实电话</view>
	</view>
</template>

<script>
	import { CreateCallHistory } from "@/net/houseApi/CreateCallHistory.js";
	import { GetHouse400Phone } from "@/net/houseApi/GetHouse400Phone.js";
	import { GpsInfoModel } from "@/model/GpsInfoModel.js";
	import { UserInfoModel } from "@/model/UserInfoModel.js";

	class GuPaiAgentListItem {
		headerImg = ""; // 经纪人头像
		name = ""; // 经纪人名字
		service = "";  // 经纪人的服务
		fourPhone = "";  // 400电话
		telphone = ""; // 非400电话
		archiveId = "";  // 经纪人id
		caseId = "";  // 房源id
		caseType = "";  //类型
		resource = ""; // 来源
	}

	export default {
		props: {
			list: {
				type: Array,
				default: []
			},
		},

		methods: {
			takePhone(item = {}) {
				let that = this;
				let systemInfo = uni.getSystemInfoSync() || {};
				let fourPhone = item.fourPhone || "";
				let telephone = item.telphone || "";
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				let me = new UserInfoModel().getModel("me") || {};
				let isIos = !!(systemInfo.system && systemInfo.system.indexOf("iOS") >= 0);

				if(fourPhone) {
					if(isIos) {
						that.DifferenceApi.makePhoneCall(fourPhone);
						return;
					}

					that.createCallHistory(fourPhone, item, cityInfo, isIos, me);
					return;
				}

				if(telephone) {
					new GetHouse400Phone({resource: item.resource,cityId: cityInfo.cityId,mobilePhone: telephone}).send()
						.then(res => {
							res.DATA = res.DATA || {};
							let currUser400Mobile = res.DATA.currUser400Mobile || "";
							if(res.DATA.STATUS != 1 || !currUser400Mobile) {
								that.failToast();
								return;
							}

							if (isIos) {
								that.DifferenceApi.makePhoneCall(currUser400Mobile);
								return;
							}

							that.createCallHistory(currUser400Mobile, item, cityInfo, isIos, me);
						})
						.catch(() => {
							that.failToast();
						});
					return;
				}

				that.failToast();
			},

			failToast() {
				uni.showToast({
					icon: "none",
					title: "无号码或号码错误"
				});
			},

			createCallHistory(fourPhone,item = {}, cityInfo = {}, isIos = false, me = {}) {
				let that = this;
				uni.showModal({
					title: '拨打电话',
					content: fourPhone.replace(',', ' 转 '),
					success: function(res) {
						if (res.confirm) {
							that.DifferenceApi.makePhoneCall(fourPhone);
							new CreateCallHistory({
								callType: 5,
								cityId: cityInfo.cityId || "",
								callImid: "uu_" + (me.userId || ""),
								calledImid: item.archiveId,
								callSource: 2,
								resource: item.resource,
								deviceType: isIos ? 2 : 1,
								caseId: item.caseType,
								caseType: item.caseType
							}).send();
						}
					}
				});
			}
		},
	}
</script>

<style scoped>
	.gua_pai_list{
		padding: 0 40upx;
		box-sizing: border-box;
	}
	.gua_pai_item{
		border-bottom: 1upx solid #F5F5F5;
		padding: 40upx 0;
		box-sizing: border-box;
	}
	.gua_pai_list .gua_pai_item:last-child{
		border-bottom: none;
	}
	.gua_pai_cont{
		width: calc(100% - 60upx);
	}
	.headerImg{
		width:92upx;
		height:92upx;
		border-radius:100%;
		will-change: transform;
		margin-right:20upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/detail/fang_default.png) no-repeat center top;
		background-size:cover;
		flex-shrink: 0;
	}
	.agent_info{
		width: calc(100% - 120upx);
	}
	.agent_name{
		color:#394043;
		font-size:30upx;
		margin-bottom:10upx;
		text-align: left;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.agent_service{
		color:#808080;
		font-size:22upx;
		text-align: left;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.take_phone_icon{
		margin:auto 0;
		width:55upx;
		height:55upx;
		flex-shrink: 0;
	}
	.gui_pai_des{
		font-size: 24upx;
		color: #ccc;
		line-height: 98upx;
		text-align: center;
		width: 100%;
	}
</style>
