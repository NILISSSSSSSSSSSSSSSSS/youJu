<template>
	<view>
		<view class="reason_title">请选择举报原因</view>
		
		<view class="reason_cont">
			<block v-for="(item, index) in reasonList" :key="index">
				<view :class="{ reason_item_active : chooseId == item.id }" @click="chooseReason(item)" 
					class="reason_item">{{ item.text }}</view>
			</block>
		</view>
		
		<view class="reason_des">
			“假一赔百”房源均为真实存在、真实在售(在租)、真实图片、真实价格的房源。
			用户在发布委托看房后，发现“假一赔百”房源有不符合上述四个特点的，可进行...
			<text @click="lookDetail" class="look_detail">点击了解详情</text>
		</view>
		
		<view class="empty_view"></view>
		
		<view class="submit_view">
			<view class="submit global-confirm-btn" @click="submit">提交</view>
		</view>
	</view>
</template>

<script>
	import { GetEntrustList } from "../../net/entrust/GetEntrustList.js";
	import { GetArchiveInfo } from "../../net/entrust/GetArchiveInfo.js";
	import { FakeHouse } from "../../net/entrust/FakeHouse.js";
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import { UserInfoModel } from "../../model/UserInfoModel.js";
	import { Const } from "../../utils/Const";

	let privateData = {
		hasEntrust: false
	};
	
	export default {
		data() {
			return {
				chooseId: "",
				archiveId: "",  // 经纪人id
				caseId: "",   // 房源id
				caseType: "",
				reasonList: [
					{id: "1", text: "房源不存在"},
					{id: "2", text: "房源已售"},
					{id: "3", text: "价格不真实"},
					{id: "4", text: "图片不真实"},
					{id: "5", text: "服务态度不好（不涉及赔付）"}
				]
			}
		},
		
		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},
		
		onLoad(params) {
			this.initParams(params);
			this.initReasonList();
			this.checkIsHaveEntrust();
		},
        
        onShow() {
            new this.SetMetaInfo().initDefault();
        },
		
		methods: {
			initParams(params = {}) {
				let keyMap = ["archiveId", "caseId", "caseType"];
				keyMap.map((key) => {
					if(params[key] !== undefined) {
						this[key] = params[key];
					}
				});
			},
			
			initReasonList() {
				let item = {id: "2", text: "房源已售"};
				if(this.caseType != 1) {
					item = {id: "2", text: "房源已租"};
				}
				this.reasonList[1] = item;
			},
			
			// 查看是否有委托
			checkIsHaveEntrust() {
				let me = new UserInfoModel().getModel("me") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				return new GetEntrustList({
					cityId: cityInfo.cityId || "",
					youyouUserId: me.userId || "",
					pageNum: 1,
					pageSize: 10
				}).send()
					.then(res => {
						privateData.hasEntrust = false;
						res.DATA = res.DATA.DATA || {};
						let list = res && res.DATA ? res.DATA.list || [] : [];
						list.map((item) => {
							let entrustUsers = item.entrustUsers || [];
							entrustUsers.map((info) => {
								if(info.brokerArchiveId && info.brokerArchiveId == this.archiveId) {
									privateData.hasEntrust = true;
								}
							});
						});
					});
			},
			
			lookDetail() {
				uni.navigateTo({
					url: "/pages/webView/webView?title=真房源详细规则"
						+ "&type=urlParams" + "&url="
						+ this.Config.realHouseRuleWebUrl
				});
			},
			
			chooseReason(item) {
				this.chooseId = item.id;
			},
			
			submit() {
				let that = this;
				let me = new UserInfoModel().getModel("me") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				
				if(!this.chooseId) {
					uni.showToast({
						icon: "none",
						title: "请先选择投诉原因",
						duration: 1000
					});
					return;
				}
				
				if(!privateData.hasEntrust) {
					uni.showModal({
						title: "",
						content: "系统检测该经纪人没有给你提供过看房服务,立即给TA发委托，带看完成后再进行反馈！",
						cancelText: "取消",
						cancelColor: "#101D36",
						confirmText: "去发布",
						confirmColor: "#ab7f2e",
						success(res) {
							if(res.confirm) {
								new GetArchiveInfo({archiveId: that.archiveId, cityId: cityInfo.cityId || ""}).send()
									.then(archiveInfo => {
									    let caseType = 3;
									    if([2, 3, "2", "3"].includes(that.caseType)) {
                                            caseType = 4;
                                        }
										let queryUrl = "serviceRegs=" + archiveInfo.serviceReg.join(',')
											+ "&caseType=" + caseType + "&test=10&archiveId="
											+ that.archiveId + "&isVip=1&userMobile="
											+ archiveInfo.brokerMobile + "&archiveName="
											+ archiveInfo.brokerName + "&rentMoney=20&buyMoney=100&archiveHeadImg="
											+ (archiveInfo.brokerUserPicUrl && archiveInfo.brokerUserPicUrl != null
														? archiveInfo.brokerUserPicUrl : Const.imDefaultHeadImg);
										
										uni.navigateTo({
											url: "/pagesEntrust/entrust/entrust?" + queryUrl
										});	
									});
							}
						}
					});
					return;
				}
				
				uni.showLoading({
					title: "提交中..."
				});
				new FakeHouse({
					chik: this.chooseId,
					userId: me.userId,
					archiveId: this.archiveId,
					caseId: this.caseId,
					caseType: this.caseType
				}).send()
					.then(res => {
						uni.hideLoading();
						uni.showToast({
							title: res.msg || "投诉成功",
							success() {
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 2000);
							}
						});
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: "投诉失败啦！请稍后重试。",
							icon: "none"
						});
					});
			}
		},
	}
</script>

<style>
	.reason_title{
		width:100%;
		height:70upx;
		line-height:70upx;
		background:#f8f8f8;
		font-size:28upx;
		color:#999999;
		padding-left:40upx;
		box-sizing:border-box;
	}
	.reason_cont{
		width:100%;
		padding-left:40upx;
		box-sizing:border-box;
		border-top:2upx solid #e9e9e9;
		margin-bottom:40upx;
	}
	.reason_item{
		position:relative;
		width:100%;
		height:109upx;
		font-size:32upx;
		color:#101D36;
		line-height:109upx;
		border-bottom:2upx solid #e9e9e9;
	}
	.reason_cont .reason_item_active{
		color:#ab7f2e;
	}
	.reason_cont .reason_item_active::after{
		position: absolute;
		top: 0;
		bottom: 0;
		margin: auto;
		right: 26upx;
		content: "";
		width: 33upx;
		height: 24upx;
		background: url('http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/check_icon.png') center center no-repeat;
		background-size:100%;
	}
	.reason_des{
		width:100%;
		padding:40upx;
		box-sizing:border-box;
		color:#aaa;
		line-height:1.5;
		font-size:24upx;
	}
	.look_detail{
		font-size:24upx;
		text-align:center;
		color:#25b764;
		display:inline-block;
		margin-left:20upx;
		font-weight:bold;
	}
	.empty_view{
		height: 140upx;
		flex-shrink: 0;
		width: 100%;
	}
	.submit_view{
		position:fixed;
		left:0;
		right:0;
		bottom:45upx;
		width: 100%;
		height: 90upx;
		padding: 0 40upx;
		box-sizing: border-box;
	}
	.submit{
		height: 100%;
		width: 100%;
		line-height:90upx;
		font-size:34upx;
		color:#ffffff;
		background:-webkit-linear-gradient(left, rgb(255,111,46) , rgb(254,142,13));
		border-radius:6upx;
		text-align:center;
	}
</style>
