<template>
	<view class="message_detail">
		<loadingData v-if="scrollLoading"></loadingData>

		<view v-show="showSendHouseLinkView">
			<sendHouseLink :item="sendHouseLinkItem" :messageId="messageId" :autoSendLisk="autoSendLiskStatus"></sendHouseLink>
		</view>

		<view @click="scrollClick" class="message_cont">
			<view v-show="showSendHouseLinkView" class="empty_link_view"></view>

			<view class="top_empty_view"></view>

			<!-- 优惠券提示 -->
			<view class="coupon-success" v-if="couponInfo.couponStatus == 1">
				优惠券已经失效，直接联系经纪人看看是否还有优惠券吧。您也可以直接拨打TA的电话（{{ agentInfoItem.userMobile }}）哦
			</view>
			<view class="coupon-success" v-if="couponInfo.couponStatus == 2">
				恭喜您已成功领取此经纪人发放的优惠券，成交后线下可以抵扣等额中介费用，经纪人稍后就会联系你，您也可以直接拨打TA的电话（{{ agentInfoItem.userMobile }}）哦
			</view>

			<!-- 经纪人推荐的房源列表 -->
			<recomendHouseList :list="recomendHouseList" v-if="recomendHouseList.length > 0"></recomendHouseList>

			<!-- 消息内容 -->
			<block v-for="(item, index) in chartList" :key="index">
				<!-- 消息时间 -->
				<view v-if="item.showTime" class="msg_send_time_view f_r_c">
					<view class="msg_send_time_text">{{ item.time }}</view>
				</view>

				<!-- 客服链接 -->
				<block v-if="item.type == 'service' && serviceLinkShow">
					<view class="service_link_view">
						<view class="service_link_cont">
							<view class="service_link_title">我已等候您多时，快看看下面有没有您想了解的，就直接戳问题吧，也可以随意向我提问哟！您是不是想问：</view>
							<view v-for="(item, kefu_index) in serviceLinkArr" :key="kefu_index"
										class="service_link_item global-font-color" @click="sendServiceProblem(item)">{{item.num}}、{{item.nlgSubject}}</view>
						</view>
					</view>
				</block>

				<block v-else>
					<block v-if="item.time">
						<!-- 接收的非可点击事件类型 -->
						<view v-if="!item.mySend && !receiveTypes[item.type]" :id="'msg_' + index" class="message_item f_r_s">
							<head-view :headImg="(item.mySend ? meHeadeImg : otherHeadImg)"></head-view>

							<textReceiveView v-if="item.type == 'text'" :item="item"></textReceiveView>
						</view>

						<!-- 接收的可点击类型 -->
						<view @click.stop="clickChartDetail(item)" :id="'msg_' + index" class="message_item f_r_s" v-if="!item.mySend && receiveTypes[item.type]">
							<head-view v-if="item.type != 'houseLiaoKe'" :headImg="(item.mySend ? meHeadeImg : otherHeadImg)"></head-view>

							<imgReceiveView v-if="item.type == 'img'" :item="item"
											@lookMaxImgChange="lookMaxImgChange"></imgReceiveView>
							<voiceReceiveView v-if="item.type == 'voice'"
								@voicePlayChange="voicePlayChange"
								:index="index"
								:currentClickIndex="currentClickIndex"
								:item="item"></voiceReceiveView>
							<entrustReceiveView v-if="item.type == 'entrust'" :isShield="isShield" :archiveId="messageId"
							 @onEntrustHouseChanged="onEntrustHouseChanged" :item="item"></entrustReceiveView>
							<positionReceiveView v-if="item.type == 'position'" :item="item"></positionReceiveView>
							<houseLiaoKeReceiveView v-if="item.type == 'houseLiaoKe'" :item="item"></houseLiaoKeReceiveView>
							<videoReceiveView
									@videoPlayChange="videoPlayChange"
									v-if="item.type == 'video'"
									:item="item"></videoReceiveView>
						</view>

						<!-- 我的非可点击类型 -->
						<view v-if="item.mySend && !meTypes[item.type]" :id="'msg_' + index" class="message_item f_r_e">
							<textMeView v-if="item.type == 'text'" :item="item"></textMeView>

							<houseWuYeTextMeView v-if="item.type == 'houseWuYeText'" :item="item"></houseWuYeTextMeView>

							<head-view v-if="item.type != 'evaluate'" :headImg="(item.mySend ? meHeadeImg : otherHeadImg)"></head-view>
						</view>

						<!-- 我的可点击类型 -->
						<view @click.stop="clickChartDetail(item)" :id="'msg_' + index" class="message_item f_r_e" v-if="item.mySend && meTypes[item.type]">
							<imgMeView v-if="item.type == 'img'" :item="item"
									   @lookMaxImgChange="lookMaxImgChange"></imgMeView>
							<voiceMeView @voicePlayChange="voicePlayChange"
										 :currentClickIndex="currentClickIndex"
										 :index="index"
										 v-if="item.type == 'voice'"
										 :item="item"></voiceMeView>
							<houseMeView v-if="item.type == 'house'" :item="item"></houseMeView>
							<videoMeView v-if="item.type == 'video'"
										 @videoPlayChange="videoPlayChange"
										 :item="item"></videoMeView>
							<houseWuYeMeView v-if="item.type == 'houseWuYe'" :item="item"></houseWuYeMeView>

							<head-view :headImg="(item.mySend ? meHeadeImg : otherHeadImg)"></head-view>
						</view>
					</block>
				</block>
			</block>

			<!--评价弹窗-->
			<evaluateView v-if="evaluateViewShow" :archiveId="messageId" @onEvaluateChanged="onEvaluateChanged"></evaluateView>

			<!-- 底部按钮fixed后的空占位view -->
			<view :style="{height: emptyViewHeight}"></view>
			<view class="iphone_x" v-if="isIphoneX"></view>
		</view>

		<!-- 底部按钮 -->
		<view v-if="!scrollLoading" class="sned_msg_view">
			<send-msg @OnMoreSendChanged="OnMoreSendChanged" :isShield="isShield" @onEvaluateChanged="onEvaluateChanged"
			 :chartList="chartListNoEntrustHouse" :messageId="messageId"></send-msg>
			<view class="iphone_x" v-if="isIphoneX"></view>
		</view>

		<!-- 拨打电话 -->
		<takePhone v-if="!couponId && messageId != serviceId && !isMoreSendInfo" :item="agentInfoItem"></takePhone>

		<!-- 优惠券 -->
		<couponView :item="couponInfo" v-if="showCouponTc"
					@onCouponReceiveChanged="onCouponReceiveChanged"
		 			@onCloseCouponChanged="onCloseCouponChanged">
		</couponView>

		<!-- 回到首页 -->
		<view class="goBackHomePage" v-if="showBackIndex && !isMoreSendInfo">
			<goBackHomePage></goBackHomePage>
		</view>
		<!-- 优惠券弹窗隐藏btn -->
		<view class="coupon_hide_btn" v-show="showBackIndex && !showCouponTc && couponId">
			<view @click="lookCouponInfo" class="coupon_hide_btn_text">专属红包</view>
		</view>

		<!--视频播放-->
		<video v-if="videoSrc && videoTcShow" class="receive_video" id="myVideo"
			   objectFit="cover" show-mute-btn :poster="videoFirstImg"
			   autoplay :src="videoSrc"></video>

		<loginView></loginView>
	</view>
</template>

<script>
	import {
		GpsInfoModel
	} from "@/model/GpsInfoModel.js";
	import {
		UserInfoModel
	} from "@/model/UserInfoModel.js";
	import {
		formatTimeNew,
		compare,
		ShareVisiting
	} from "@/utils/common.js";
	import {
		ChartListItem,
		UpUnReadNumTab,
		DealChartDetail,
		ChartDetailItem
	} from "@/utils/ImChart.js";
	import {
		Notify
	} from "@/utils/Notify.js";
	import {
		Notification
	} from "@/utils/Notification.js";
	import {
		UnReadMsgModel
	} from "@/model/im/UnReadMsgModel.js";
	import {
		GetChartDetail
	} from "@/net/im/GetChartDetail.js";
	import {
		GetServiceProblemList
	} from "@/net/im/GetServiceProblemList.js"

	// 接受的组件
	import imgReceiveView from "../components/im/receive/imgReceiveView.vue";
	import textReceiveView from "../components/im/receive/textReceiveView.vue";
	import voiceReceiveView from "../components/im/receive/voiceReceiveView.vue";
	import entrustReceiveView from "../components/im/receive/entrustReceiveView.vue";
	import positionReceiveView from "../components/im/receive/positionReceiveView.vue";
	import houseReceiveView from "../components/im/receive/houseReceiveView.vue";
	import houseLiaoKeReceiveView from "../components/im/receive/houseLiaoKeReceiveView.vue";
	import videoReceiveView from "../components/im/receive/videoReceiveView.vue";

	// me的组件
	import textMeView from "../components/im/me/textMeView.vue";
	import voiceMeView from "../components/im/me/voiceMeView.vue";
	import imgMeView from "../components/im/me/imgMeView.vue";
	import houseMeView from "../components/im/me/houseMeView.vue";
	import sendHouseLink from "../components/im/me/sendHouseLink.vue";
	import evaluateMeView from "../components/im/me/evaluateMeView.vue";
	import videoMeView from "../components/im/me/videoMeView.vue";
	import houseWuYeMeView from "../components/im/me/houseWuYeMeView.vue";
	import houseWuYeTextMeView from "../components/im/me/houseWuYeTextMeView.vue";

	import headView from "../components/im/headView.vue";
	import sendMsg from "../components/im/sendMsg.vue";
	import couponView from "../components/im/couponView.vue";
	import recomendHouseList from "../components/im/recomendHouseList.vue";
	import evaluateView from "../components/im/evaluateView.vue";
	import takePhone from "../components/im/takePhone.vue";

	import goBackHomePage from "@/components/goBackHomePage.vue";

	import {
		InitImChart
	} from "@/net/im/InitImChart.js";
	import {
		Const,
		ErHouseListItem
	} from "@/utils/Const.js";
	import {
		SmartService
	} from "@/net/im/SmartService.js";
	import {
		DealLastMsgTime,
		ImSendMessage
	} from "@/utils/ImChart.js";
	import {
		GetCouponDetail
	} from "@/net/im/CouponDetail.js";
	import {
		GetImEntrustHouseList
	} from "@/net/im/GetImEntrustHouseList.js";
	import {
		ImEvaluateDeal
	} from "@/utils/ImEvaluateDeal";
	import Evaluate from "@/components/entrust/detail/evaluate";

	let privateData = {
		pageScrollTimeOutVal: null,
		imgList: [],
		caseId: "",
		cityId: "",
		caseType: "",
		reSource: "",

		params: {}, // url参数
		ImEvaluateDeal: null, // 聊天评价

		chartListNoEntrustHouse: [], // 去除委托房源的数组
		videoPlayerVal: null,
	};

	// 语音播放管理
	let innerAudioContext = uni.createInnerAudioContext();

	export default {
		data() {
			return {
				receiveTypes: {
					img: true,
					voice: true,
					entrust: true,
					position: true,
					houseLiaoKe: true,
					video: true
				},
				meTypes: {
					img: true,
					voice: true,
					house: true,
					video: true,
					houseWuYe: true,
				},

				serviceId: this.ImChart.getServiceId(),
				accid: "",
				scrollLoading: true,
				messageId: "", // 经纪人id
				titleText: "",
				isShield: 0, // 是否是屏蔽 1:屏蔽
				chartList: [], // 聊天内容
				meHeadeImg: Const.imDefaultHeadImg,
				otherHeadImg: Const.platformIcon,
				emptyViewHeight: "51px",
				serviceLinkShow: false, // 是否显示客服连接
				serviceLinkArr: [], // 客服问题数组
				showSendHouseLinkView: false, // 是否显示发送房源连接的view
				sendHouseLinkItem: new ChartDetailItem(),

				agentInfoItem: {}, //  经纪人信息
				showBackIndex: false, // 回到首页

				couponId: "", // 优惠券id
				showCouponTc: false, // 是否显示优惠券弹窗
				couponInfo: {}, // 优惠券信息
				noClickBackIndex: null, // 3s没操作返回到首页

				recomendHouseList: [], // 经纪人推送的房源列表
				isMoreSendInfo: false, // 是否是展示更多

				autoSendLiskStatus: 1, // 自动发送房源状态吗  不等1都自动发

				chartListNoEntrustHouse: [], // 去除委托房源的数组

				evaluateViewShow: false, // 是否显示聊天评价弹窗

				// 视频播放相关参数
				videoTcShow: false,
				videoSrc: "",
				videoFirstImg: "",

				currentClickIndex: "err",
				isIphoneX: false,
			}
		},

		components: {
			Evaluate,
			imgReceiveView,
			textReceiveView,
			voiceReceiveView,
			entrustReceiveView,
			positionReceiveView,
			houseReceiveView,
			houseLiaoKeReceiveView,
			videoReceiveView,

			textMeView,
			voiceMeView,
			imgMeView,
			houseMeView,
			evaluateMeView,
			videoMeView,
			houseWuYeMeView,
			houseWuYeTextMeView,

			headView,
			sendMsg,
			sendHouseLink,
			takePhone,
			couponView,
			goBackHomePage,
			recomendHouseList,
			evaluateView,
		},

		onLoad(params) {
			if (uni.getSystemInfoSync().model.indexOf("iPhone X") >= 0) {
				this.isIphoneX = true;
			}

			this.initParams(params);
			if (params.userId) {
				new UserInfoModel().setModel({
					userId: params.userId,
					openId: params.openId
				}, "me");
			}
			this.ImChart.messageId = params.messageId || "";
			this.ImChart.initImUserInfo()
				.then((info) => {
					this.initData();
					this.scrollLoading = false;
				});
			this.ImChart.inChartDetail = true;
			let showBackIndex = false;
			if (!getCurrentPages() || getCurrentPages().length == 1) {
				showBackIndex = true;
			}
			this.showBackIndex = showBackIndex;
			// 监听用户信息事件
			new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
			// 监听已读回执
			new Notification().addObserver(this, "MsgReadChanged", Notify.MsgReadChanged.Name);
			// 监听委托新消息
			new Notification().addObserver(this, "NewMsgChanged", Notify.NewMsgChanged.Name);
			// 监听消息发送成功
			new Notification().addObserver(this, "MsgSendSuccessChange", Notify.MsgSendSuccessChange.Name);
			// 监听消息
			new Notification().addObserver(this, "UpChartMsgChanged", Notify.UpChartMsgChanged.Name);
			// 监听发送点击
			new Notification().addObserver(this, "ClickChartMoreInfo", Notify.ClickChartMoreInfo.Name);
		},

		onShow() {
			new this.SetMetaInfo().initDefault();
			this.ImChart.inChartDetail = true;
		},

		onHide() {
			this.ImChart.inChartDetail = false;
			this.voicePlayChange({isPlayIng: true});
		},

		onUnload() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
			this.ImChart.inChartDetail = false;
			this.ImChart.messageId = "";
			this.ImChart.imDetailName = "";
			this.voicePlayChange({isPlayIng: true});
		},

		methods: {
			// 委托新消息回调
			NewMsgChanged(name, item) {
				// 委托类型在执行
				if(item.type === Notify.NewMsgChanged.Type_entrust) {
					this.onEntrustHouseChanged();
				}
			},

			// 聊天评价回调
			onEvaluateChanged(info) {
				this.evaluateViewShow = info.show || false;
				this.scrollToBottom();
			},

			// 消息发送成功回调
			MsgSendSuccessChange(name, info) {
				console.log("发送成功了");
				for (let [i, item] of this.chartList.entries()) {
					if (info.type && info.type === "position") {
						// let content = JSON.parse(info.msg.content);
						// if (content.data.locationImageUrl === item.content.staticImg) {
						// 	item.isSendUser = false;
						// 	item.msg = info.msg || {};
						// 	item.sendFail = item.sendFail || false;
						// 	this.$set(this.chartList, i, item);
						// 	break;
						// }
						continue;
					}

					if (info.url === item.content) {
						item.isSendUser = false;
						item.msg = info.msg || {};
						item.sendFail = item.sendFail || false;
						this.$set(this.chartList, i, item);
						break;
					}
				}
			},

			// 已读回执
			MsgReadChanged(name, time) {
				let chartList = this.chartList || [];
				for (let item of chartList) {
					if (item.timeStr != undefined && item.timeStr <= time) {
						item.isRead = true;
					}
				}
				this.chartList = chartList;
			},

			// 更多切换回调
			OnMoreSendChanged(val) {
				this.isMoreSendInfo = val;
			},

			// 用户消息回调
			UserInfoChanged() {
				this.ImChart.initImUserInfo()
					.then(() => {
						this.initData();
						this.scrollLoading = false;
					});
				this.ImChart.inChartDetail = true;
			},

			// 领取优惠券回调
			onCouponReceiveChanged() {
				clearTimeout(this.noClickBackIndex);
				this.noClickBackIndex = null;
				this.initCouponDetail(false, true);
			},

			// 关闭优惠券弹窗回调
			onCloseCouponChanged() {
				this.showCouponTc = false;
			},

			// 查看大图回调
			lookMaxImgChange(item) {
				this.lookImgMax(item.content);
			},

			// 委托房源状态变化回调
			onEntrustHouseChanged() {
				let me = new UserInfoModel().getModel("me") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};

				new GetImEntrustHouseList({
						cityId: cityInfo.cityId || "1",
						youyouUserId: me.userId || "",
						brokerArchiveId: this.messageId
					}).send()
					.then(res => {
						this.dealChatList((privateData.chartListNoEntrustHouse || []), (res && res.DATA ? res.DATA.houseList || [] : []));
					});
			},

			// 视频播放回调
			videoPlayChange(item) {
				this.videoSrc = item.url;
				this.videoFirstImg = item.videoFirstImg;
				this.videoTcShow = true;
				let videoValue = uni.createVideoContext('myVideo');
				videoValue.hideStatusBar();
				videoValue.requestFullScreen({direction: 0});
				videoValue.play();

				// #ifdef APP-PLUS
				// var barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
				// 	top: '0',
				// 	left:'0px',
				// 	width: '100%',
				// 	bottom: '0',
				// 	position: 'fixed'
				// });
				// var pages = getCurrentPages();
				// var page = pages[pages.length - 1];
				// var currentWebview = page.$getAppWebview();
				// currentWebview.append(barcode);
				//
				// if(!privateData.videoPlayerVal){
				// 	console.error("url",item.url);
				// 	privateData.videoPlayerVal = plus.video.createVideoPlayer('videoplayer', {
				// 		src: item.url,
				// 		top: '0',
				// 		left:'0px',
				// 		width: '100%',
				// 		height: "500px",
				// 		bottom: '0',
				// 		position: 'static'
				// 	});
				// 	this.$mp.page.$getAppWebview().append(privateData.videoPlayerVal);
				// 	privateData.videoPlayerVal.play();
				// 	// plus.webview.currentWebview().append(privateData.videoPlayerVal);
				// }
				// #endif
			},

			// 语音播放回调
			voicePlayChange(item) {
				if(item.isPlayIng) {
					this.currentClickIndex = "err";
					if(innerAudioContext && innerAudioContext.pause) {
						innerAudioContext.pause();
					}
					if(innerAudioContext && innerAudioContext.stop) {
						innerAudioContext.stop();
					}
					if(innerAudioContext && innerAudioContext.destroy) {
						innerAudioContext.destroy();
					}
					return;
				}

				innerAudioContext = uni.createInnerAudioContext();
				this.currentClickIndex = item.index;
				innerAudioContext.src = item.url;
				innerAudioContext.play();
				innerAudioContext.onError((res) => {
					this.currentClickIndex = "err";
				});
				innerAudioContext.onStop(res => {
					this.currentClickIndex = "err";
				});
				innerAudioContext.onEnded((res) => {
					this.currentClickIndex = "err";
				});
			},

			// 查看优惠券弹窗信息
			lookCouponInfo() {
				this.showCouponTc = true;
			},

			// 初始化参数
			initParams(params = {}) {
				privateData.params = params;
				if (params.name) {
					this.titleText = params.name;
					this.ImChart.imDetailName = params.name;
					uni.setNavigationBarTitle({
						title: params.name
					});
				}
				if (params.messageId) {
					this.messageId = params.messageId;
					this.ImChart.messageId = params.messageId;
				}
				if (params.isShield != undefined) {
					this.isShield = params.isShield;
				}
				if (new UserInfoModel().getModel("accid")) {
					this.accid = new UserInfoModel().getModel("accid");
					this.ImChart.setUuAccid(this.accid);
				}
				if (params.accid) {
					this.accid = params.accid;
					new UserInfoModel().setModel(params.accid, "accid");
					this.ImChart.setUuAccid(params.accid);
				}
				if (params.couponId) {
					this.couponId = params.couponId;
				}
				let privateKeys = ["caseId", "cityId", "caseType", "reSource"];
				privateKeys.map((key) => {
					privateData[key] = params[key] || "";
				});
				if(!privateData.reSource) {
					privateData.reSource = "1";
				}
			},

			initData() {
				this.initChartDetail();
				this.initCouponDetail();
			},

			// 初始化优惠券信息
			initCouponDetail(pageTo = true, isGetSuccess = false) {
				let me = new UserInfoModel().getModel("me") || {};
				if (!me.userId || !this.couponId || !this.messageId) return;

				new GetCouponDetail({
						couponId: this.couponId,
						shareArchiveId: this.messageId,
						youyouUserId: me.userId
					}).send()
					.then(res => {
						let data = res.DATA || {};
						if (data.DATA) {
							data = data.DATA || {};
						}
						this.couponInfo = {
							archiveId: this.messageId,
							agentName: data.userName || "",
							agentHead: data.userPhoto || Const.imDefaultHeadImg,
							couponStatus: data.couponStatus || "",
							discountType: data.discountType || "",
							couponMoney: data.couponMoney || "",
							validTime: data.validTime || "--",
							deptName: data.deptName || "",
							voucherUrl: data.voucherUrl || "",
							couponId: this.couponId,
							userId: me.userId
						};
						if(data.couponStatus && isGetSuccess && data.couponStatus == 2) {
							this.showCouponTc = true;
						} else if (data.couponStatus && data.couponStatus == 2) {
							this.showCouponTc = false;
						}else {
							this.showCouponTc = true;
						}

						if (pageTo && data.couponStatus && data.couponStatus == 1) {
							this.noClickBackIndex = setTimeout(() => {
								if (!this.showCouponTc) {
									clearTimeout(this.noClickBackIndex);
									this.noClickBackIndex = null;
									return;
								}

								uni.switchTab({
									url: "/pages/index/index"
								});
							}, 3000)
						}
					});
			},

			initChartDetail() {
				let me = new UserInfoModel().getModel("me") || {};
				let accid = new UserInfoModel().getModel("accid") || "";
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				let houseInfo = {};
				if (!me.userId || !accid) return;

				return Promise.all([
						this.ImChart.getChartDetail(this.messageId),
						new InitImChart({
							accid: accid,
							toUserId: this.messageId,
							caseId: privateData.caseId,
							caseType: privateData.caseType,
							cityId: privateData.cityId,
							reSource: privateData.reSource,
							isRefresh: 0
						}).send(),
						new GetImEntrustHouseList({
							cityId: cityInfo.cityId || "1",
							youyouUserId: me.userId,
							brokerArchiveId: this.messageId
						}).send()
					])
					.then(res => {
						let meInfo = res && res[1] && res[1].data ? res[1].data.userInfo : {};
						let otherInfo = res[1] && res[1].data ? res[1].data.toUserInfo : {};
						houseInfo = res[1] && res[1].data ? res[1].data.houseInfo : {};
						this.meHeadeImg = meInfo ? meInfo.icon || Const.imDefaultHeadImg : Const.imDefaultHeadImg;

						if(this.ImChart.serviceId == otherInfo.accid){
							otherInfo.icon = Const.platformIcon;
						}
						this.otherHeadImg = otherInfo.icon || Const.imDefaultHeadImg;

						this.agentInfoItem.userMobile = otherInfo.brokerMobile || "";
						uni.setNavigationBarTitle({
							title: (otherInfo.name || "")
						});
						this.upSendHouseLinkItem(houseInfo);
						privateData.chartListNoEntrustHouse = res[0];
						this.dealChatList((res[0] || []), (res[2] && res[2].DATA ? res[2].DATA.houseList || [] : []));
						this.upServiceInfo();
						this.upImgList();
						return this.initServiceProblemList();
					})
					.then(res => {
						// 如果没有聊天并且是房源进入则主动推送房源和寮经纪人文案
						if (privateData.caseId) {
							if (privateData.chartListNoEntrustHouse.length == 0 && privateData.params.pageFrom == "houseDetail") {
								this.showSendHouseLinkView = false;
								this.autoSendLiskStatus = 2;
								setTimeout(() => {
									let autoSendText = "你好，我想了解这套房子，能为我详细介绍一下吗？";
									new ImSendMessage(this.messageId).sendText(autoSendText)
										.then(() => {
											let emoji = new DealChartDetail().dealEmoji(autoSendText);
											let item = new ChartDetailItem();
											item.type = "text";
											item.content = autoSendText;
											item.mySend = true;
											item.timeStr = new Date().getTime();
											item.time = formatTimeNew(new Date().getTime());
											item.emoji = emoji;
											item.isRead = false;
											item.hasEmoji = (emoji[1].length > 0);
											item.showTime = DealLastMsgTime.checkShowTime(this.messageId, new Date().getTime());
											DealLastMsgTime.setTime(new Date().getTime(), this.messageId);
											new Notification().postNotification(Notify.UpChartMsgChanged.Name, item);
										});
									setTimeout(() => {
										this.scrollToBottom();
									}, 500);
								}, 1000);
							} else {
								if (houseInfo.STATUS == undefined || houseInfo.STATUS != 0) {
									this.showSendHouseLinkView = true;
								}
							}
						}
						// 如果没有聊天并且是小区专家进入
						if (privateData.params && privateData.params.pageFrom == "villageExpert" &&
							privateData.chartListNoEntrustHouse.length == 0) {
							let autoSendText = "你好，我正在看" + privateData.params.buildName +
								"的房子，有房推荐吗？";
							new ImSendMessage(this.messageId).sendText(autoSendText)
								.then(() => {
									let emoji = new DealChartDetail().dealEmoji(autoSendText);
									let item = new ChartDetailItem();
									item.type = "text";
									item.content = autoSendText;
									item.mySend = true;
									item.timeStr = new Date().getTime();
									item.time = formatTimeNew(new Date().getTime());
									item.emoji = emoji;
									item.isRead = false;
									item.hasEmoji = (emoji[1].length > 0);
									item.showTime = DealLastMsgTime.checkShowTime(this.messageId, new Date().getTime());
									DealLastMsgTime.setTime(new Date().getTime(), this.messageId);
									new Notification().postNotification(Notify.UpChartMsgChanged.Name, item);
								});
							setTimeout(() => {
								this.scrollToBottom();
							}, 500);
						}
						// 是客服消息再显示
						if (this.serviceLinkShow) {
							this.serviceLinkArr = res;
							let item = new ChartDetailItem();
							item.type = "service";
							item.content = "";
							item.mySend = true;
							item.time = formatTimeNew(new Date().getTime());
							item.emoji = [];
							item.hasEmoji = false;
							this.chartList.push(item);
						}
						// 初始化聊天评价的类
						this.chartListNoEntrustHouse = privateData.chartListNoEntrustHouse;
						privateData.ImEvaluateDeal = new ImEvaluateDeal(privateData.chartListNoEntrustHouse);
						privateData.ImEvaluateDeal.autoEvaluateTc((val) => {
							console.log(val, "---判断是否自动显示评价---");
							this.evaluateViewShow = false;
							// this.evaluateViewShow = val;
						});

						// 回到底部（延迟的目的是保证所有数据渲染完）
						setTimeout(() => {
							this.scrollToBottom();
						}, 500);
					})
					.catch(err => {
						console.log(err);
					});
			},

			// 处理详情列表
			dealChatList(chartDetailList = [], houseList = []) {
				let list = [];
				for (let chartItem of chartDetailList) {
					// 将优优好房替换悠居客
					if(typeof chartItem.content == 'string'
							&& this.ImChart.serviceId == this.messageId){
						chartItem.content = chartItem.content.replace('优优好房',Const.platformTitle);
						if(chartItem.content && chartItem.content.indexOf("成交还可抽取4999元现金补贴") >= 0) {
							chartItem.content = chartItem.content.replace('成交还可抽取4999元现金补贴',"成交还能抽取购房佣金全返奖励");
						}
						if(chartItem.content && chartItem.content.indexOf("如何才能拿4999元补贴") >= 0) {
							chartItem.content = chartItem.content.replace('如何才能拿4999元补贴',"如何才能拿购房佣金全返奖励");
						}
						if(chartItem.content.indexOf("补贴4999元") >= 0) {
							chartItem.content = chartItem.content.replace('补贴4999元',"享受购房佣金全返奖励");
						}
						if(chartItem.content.indexOf("小优") >= 0) {
							chartItem.content = chartItem.content.replace('小优',"");
						}
					}
					list.push(chartItem);
				}
				let houseListEnd = [];
				let pushLogId = "";
				let entrustHouseList = [];
				for (let houseItem of houseList) {
					if (houseItem.seeStatus == 4) {
						houseListEnd.push(houseItem);
						pushLogId = houseItem.pushLogId || "";
						continue;
					}

					if (!pushLogId || pushLogId != houseItem.pushLogId) {
						houseListEnd.push(houseItem);
					}
				}
				entrustHouseList = houseListEnd.length === 0 ? houseList : houseListEnd;
				let alreadyAddHouseList = [];
				let houseLength = entrustHouseList.length;
				for (let a in list) {
					for (let k in entrustHouseList) {
						let data = entrustHouseList[k];
						let houseItem = new ErHouseListItem();
						let item = new ChartDetailItem();
						houseItem.houseTitle = (data.caseType == 1 ? "[出售]" : "[出租]") +
							(data.buildName ? data.buildName + " " : "") +
							(data.houseSubject || "");
						houseItem.houseTing = (data.houseRoom && parseInt(data.houseRoom) ?
								data.houseRoom + "室" : "") +
							(data.houseRoom && parseInt(data.houseRoom) &&
								data.houseHall && parseInt(data.houseHall) ?
								data.houseHall + "厅" : "");
						houseItem.houseArea = data.houseArea || "";
						houseItem.houseAreaUnit = "㎡";
						houseItem.houseName = data.buildName || "";
						houseItem.houseTotalPrice = data.houseTotalPrice || "";
						houseItem.houseTotalPriceUnit = data.caseType == 1 ? "万" : "元/月";
						houseItem.houseImg = data.thumbUrl || Const.houseDefaultImg;
						houseItem.houseId = data.houseId || "";
						houseItem.cityId = data.cityId || new GpsInfoModel().getModel("cityInfo").cityId || "";
						houseItem.caseType = data.caseType || "";
						houseItem.reSource = data.reSource || "";

						houseItem.seeStatus = data.seeStatus || "";
						houseItem.delStatus = data.delStatus || "";
						houseItem.brokerMoney = data.brokerMoney || "";
						houseItem.isEvaluate = data.isEvaluate || "";
						houseItem.recomInfoId = data.recomInfoId || "";
						houseItem.isVip = data.isVip || "";
						houseItem.entrustId = data.pushLogId || "";
						houseItem.tips = data.tips || "";

						item.type = "entrust";
						item.content = houseItem;
						item.time = formatTimeNew(data.actTime);
						item.timeStr = new Date(data.actTime).getTime();
						item.mySend = false;
						item.emoji = [];
						item.hasEmoji = false;
						item.showTime = DealLastMsgTime.checkShowTime(this.messageId, data.actTime);
						DealLastMsgTime.setTime(data.actTime, this.messageId);
						if(alreadyAddHouseList.length < houseLength) {
							alreadyAddHouseList.push(item);
						}
						if (item.timeStr < list[a].timeStr) {
							list.splice(Number(a), 0, item);
							entrustHouseList.splice(k, 1);
						}
					}
				}
				if(entrustHouseList.length > 0) {
					list = list.concat(alreadyAddHouseList.slice(
							alreadyAddHouseList.length - entrustHouseList.length
					));
				}
				this.chartList = list;
			},

			// 初始化房源信息
			upSendHouseLinkItem(dataItem) {
				if (Object.keys(dataItem).length <= 0 ||
					(dataItem.STATUS != undefined && dataItem.STATUS == 0)) {
					this.showSendHouseLinkView = false;
					return;
				}

				let sendHouseLinkItem = new ChartDetailItem();
				let item = new ErHouseListItem();
				let tags = (dataItem.houseTagDesc &&
						dataItem.houseTagDesc.indexOf("|") >= 0) ?
					dataItem.houseTagDesc.split("|") : [];
				if (tags.length > 3) {
					tags = tags.slice(0, 3);
				}
				item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
				item.cityId = dataItem.cityId || "";
				item.caseType = dataItem.caseType || "";
				item.houseId = privateData.caseId || "";
				item.reSource = dataItem.resource || "";
				item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
				item.houseTitle = dataItem.houseSubject || "";
				item.shareTitle = dataItem.shareTitle || "";
				item.houseTing = (dataItem.houseRoom ? dataItem.houseRoom + "室" : "") +
					(dataItem.houseHall ? dataItem.houseHall + '厅' : "") +
					(dataItem.houseWei ? dataItem.houseWei + "卫" : "");
				item.houseRoom = dataItem.houseRoom || "";
				item.houseHall = dataItem.houseHall || "";
				item.houseWei = dataItem.houseWei || "";
				item.houseArea = dataItem.houseArea || "";
				item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
				item.houseName = dataItem.buildName || "";
				item.houseTotalPrice = dataItem.houseTotalPrice || "";
				item.houseTotalPriceUnit = dataItem.houseTotalPrice ?
					(dataItem.priceUnitCn || "") : "";
				item.housePriceOfArea = dataItem.houseUnitPrice && parseInt(dataItem.houseUnitPrice) ?
					parseInt(dataItem.houseUnitPrice) || "" : "";
				item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
				item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
				item.hasVideo = !!(dataItem.videoNum && dataItem.videoNum > 0);
				item.houseTags = tags;
				item.houseUseage = dataItem.houseUseage || "";
				item.houseUseageCn = dataItem.houseUseageCn || "";
				item.regionName = dataItem.regionName || "";
				item.sectionName = dataItem.sectionName || "";


				sendHouseLinkItem.type = "house";
				sendHouseLinkItem.content = item;
				sendHouseLinkItem.mySend = true;
				sendHouseLinkItem.time = formatTimeNew(new Date().getTime());
				this.sendHouseLinkItem = sendHouseLinkItem;
				if (!privateData.caseId) {
					this.showSendHouseLinkView = false;
				}
			},

			// 判断是否显示客服问题
			upServiceInfo() {
				if (this.messageId == this.ImChart.getServiceId()) {
					this.serviceLinkShow = true;
				} else {
					this.serviceLinkShow = false;
				}
			},

			// 获取问题列表
			initServiceProblemList() {
				let dafaultList = [{
						nlgId: 1,
						num: 1,
						nlgSubject: '如何租房/买房？',
						nlgContent: '客官可以点击首页--补贴直通车--发布订单--一分钟为您秒推荐；客官还可以点击首页--浏览“假一赔百”真房源直接联系房源人。'
					},
					{
						nlgId: 2,
						num: 2,
						nlgSubject: '如何才能拿购房佣金全返奖励？',
						nlgContent: '发布悬赏金委托，并且在悠居客平台成交，符合要求后会从100户抽取1户获得购房佣金全返奖励。'
					},
					// {
					// 	nlgId: 3,
					// 	num: 3,
					// 	nlgSubject: '支付意向金有何好处？',
					// 	nlgContent: '支付悬赏金可以向经纪人表明您的找房诚意，大幅提高找房成功率；支付悬赏金委托可抵扣500元购房中介费（租房抵扣200元），成交还可抽取购房0佣金奖励。'
					// },
					{
						nlgId: 4,
						num: 4,
						nlgSubject: '如何查看委托进度？',
						nlgContent: '点击“我的”选择您的委托类型即可查看委托进度。'
					},
					{
						nlgId: 5,
						num: 5,
						nlgSubject: '平台找房收费吗？',
						nlgContent: '平台是免费为客官找房的，如果客官满意房子，直接把银子支付给对方就可以啦，在平台成交还可以获得住房补贴福利。'
					},
					{
						nlgId: 6,
						num: 6,
						nlgSubject: '平台的房子真实吗？',
						nlgContent: '真实哦，建议客官可以优先浏览带有“假一赔百”标签的真房源，我们挑选全城优质经纪人为您服务！'
					},
					{
						nlgId: 7,
						num: 7,
						nlgSubject: '这个房子还在吗？',
						nlgContent: '客官如看中这套房子，请直接下拉房源页面--拨打挂牌经纪人进行详细了解哦。同时您还可以点击“特权找好房”填写您对房屋的具体要求，一键为您推荐更多好房，让你更多选择哦。'
					},
					{
						nlgId: 8,
						num: 8,
						nlgSubject: '区域房价是多少？',
						nlgContent: '客官可以直接点击首页--房价评估--输入小区--查询房价哦；亦可点击首页--浏览您心仪的房源--咨询经纪人或小区专家了解更多。'
					},
					{
						nlgId: 9,
						num: 9,
						nlgSubject: '如何办理贷款/买房政策？',
						nlgContent: '客官如需了解贷款和买房政策，建议您可以通过我们“假一赔百”真房源咨询经纪人为您专业解答。'
					},
					{
						nlgId: 10,
						num: 10,
						nlgSubject: '如何代理和加盟？',
						nlgContent: '客官如需了解代理和加盟，请拨打4008908890转1哦。'
					},
					{
						nlgId: 11,
						num: 11,
						nlgSubject: '如何登记房源？',
						nlgContent: '客户请点击首页--更多服务--房源登记--我要出租/出售--按照提示操作即可登记成功哦'
					}
				];
				if (this.messageId != this.ImChart.getServiceId()) {
					return Promise.resolve([]);
				}

				return new GetServiceProblemList().send()
					.then(res => {
						let list = res.DATA ? res.DATA.list || [] : [];
						list = list.length > 0 ? list : dafaultList;
						let index = 0;
						let newList = [];
						for (let i = 0;i<list.length;i++) {
							let item = list[i] || {};
							index++;
							item.num = index;

							// 将优优好房替换悠居客
							if(this.ImChart.serviceId == this.messageId){
								item.nlgContent = item.nlgContent.replace('优优好房',Const.platformTitle);
								item.nlgSubject = item.nlgSubject.replace('优优好房',Const.platformTitle);
								if(item.nlgContent && item.nlgContent.indexOf("成交还可抽取4999元现金补贴") >= 0) {
									item.nlgContent = item.nlgContent.replace('成交还可抽取4999元现金补贴',"成交还能抽取购房佣金全返奖励");
								}
								if(item.nlgSubject && item.nlgSubject.indexOf("成交还可抽取4999元现金补贴") >= 0) {
									item.nlgSubject = item.nlgSubject.replace('成交还可抽取4999元现金补贴',"成交还能抽取购房佣金全返奖励");
								}

								if(item.nlgContent && item.nlgContent.indexOf("小优") >= 0) {
									item.nlgContent = item.nlgContent.replace('小优',"");
								}
								if(item.nlgSubject && item.nlgSubject.indexOf("小优") >= 0) {
									item.nlgSubject = item.nlgSubject.replace('小优',"");
								}

								if(item.content && item.content.indexOf("如何才能拿4999元补贴") >= 0) {
									item.content = item.content.replace('如何才能拿4999元补贴',"如何才能拿购房佣金全返奖励");
								}
								if(item.nlgSubject && item.nlgSubject.indexOf("如何才能拿4999元补贴") >= 0) {
									item.nlgSubject = item.nlgSubject.replace('如何才能拿4999元补贴',"如何才能拿购房佣金全返奖励");
								}

								if(item.content && item.content.indexOf("4999元现金大奖") >= 0) {
									item.content = item.content.replace('4999元现金大奖',"购房佣金全返奖励");
								}
								if(item.nlgSubject && item.nlgSubject.indexOf("4999元现金大奖") >= 0) {
									item.nlgSubject = item.nlgSubject.replace('4999元现金大奖',"购房佣金全返奖励");
								}
							}

							newList.push(item);
						}
						return newList;
					})
					.catch(err => {
						return Promise.resolve(dafaultList);
					});
			},

			// 点击滑动区域隐藏更多展示
			scrollClick() {
				// this.isMoreSendInfo = true;
				// new Notification().postNotification(Notify.ClickChartDetailScroll.Name);
			},

			// 点击底部按钮的回调
			ClickChartMoreInfo(name, info) {
				let view = this.DifferenceApi.createSelectorQuery(this).select(".sned_msg_view");
				view.boundingClientRect(data => {
					this.emptyViewHeight = data.height + "px";
				}).exec();
				if (!info.disabledScroll) {
					// #ifndef APP-PLUS || APP-PLUS-NVUE
					this.scrollToBottom();
					// #endif
				}
			},

			// 滚动到底部
			scrollToBottom() {
				let view = this.DifferenceApi.createSelectorQuery(this).select(".message_detail");
				view.boundingClientRect(data => {
					clearTimeout(privateData.pageScrollTimeOutVal);
					privateData.pageScrollTimeOutVal = null;
					privateData.pageScrollTimeOutVal = setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: data.height,
							duration: 150
						});
					}, 300);
				}).exec();
			},

			// 聊天内的图片资源
			upImgList() {
				privateData.imgList = [];
				for (let item of this.chartList) {
					if (item.type == 'img') {
						privateData.imgList.push(item.content);
					}
				}
			},
			lookImgMax(url = "") {
				uni.previewImage({
					current: url,
					urls: privateData.imgList,
					indicator: "number"
				});
			},
			clickChartDetail(item) {
				if (item.type == 'img') {
					this.lookImgMax(item.content);
				}
			},

			// 新消息回调
			UpChartMsgChanged(name, item) {
				if (item) {
					if (item.type == "house" && item.mySend) {
						this.showSendHouseLinkView = false;
					}
					this.SendChartMsgChanged();
					this.chartList.push(item);
					privateData.chartListNoEntrustHouse.push(item);
					this.chartListNoEntrustHouse = privateData.chartListNoEntrustHouse;
					this.upImgList();
					// #ifndef APP-PLUS || APP-PLUS-NVUE
					this.scrollToBottom();
					// #endif
				}
			},
			initSendMsgDate () {
				let id = this.messageId || 0;
				let obj = uni.getStorageSync('sendMsgDate') || {};
				let sendMsgDate = new Date();
				let sendMsgDateStr = (sendMsgDate.getMonth() + 1) + '-' + sendMsgDate.getDate()
				if (obj[id] && obj[id] === sendMsgDateStr) {
					return false
				} else {
					obj[id] = sendMsgDateStr
					uni.setStorageSync('sendMsgDate', obj)
					return true
				}
			},
			// 采集数据
			SendChartMsgChanged () {
				if (this.initSendMsgDate()) {
					let me = new UserInfoModel().getModel("me") || {};
					new ShareVisiting().behavior({
							archiveId: this.messageId || '', // 经济人档案id
							cUserId: me.userId || '', // c端用户id，分享时无
							caseId: '', // 房源id
							caseType: '', // 房源类型：1.出售，2.出租，6.新盘
							cityId: '',
							sourceType: uni.getStorageSync('imSourceTypeId'), // 统计子分类
							statisType: 3, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
							appSource: 'zdzf-im'
					}).then(res => {
							console.log(res)
					})
				}
			},

			// 发送客服消息
			sendServiceProblem(item) {
				let that = this;
				this.sendTextMsgCommon(item.nlgSubject, function() {
					// kwd 预留字段
					new SmartService({
						userId: that.ImChart.getUuAccid(),
						msg: item.nlgContent,
						kwd: null
					}).send();
				});
			},
			// 发送文本消息
			sendTextMsgCommon(text, callback = function() {}) {
				new ImSendMessage(this.messageId).sendText(text)
					.then(() => {
						let emoji = new DealChartDetail().dealEmoji(text);
						let item = new ChartDetailItem();
						item.type = "text";
						item.content = text;
						item.mySend = true;
						item.time = formatTimeNew(new Date().getTime());
						item.emoji = emoji;
						item.hasEmoji = (emoji[1].length > 0);
						this.chartList.push(item);
						item.showTime = DealLastMsgTime.checkShowTime(this.messageId, new Date().getTime());
						DealLastMsgTime.setTime(new Date().getTime(), this.messageId);
						this.scrollToBottom();
						callback(item);
					});
			},
		},
	}
</script>

<style>
	.iphone_x{
		height: 30upx;
	}
	.goBackHomePage {
		position: fixed;
		right: 7upx;
		bottom: -5upx;
		transform: translateY(-50upx);
	}

	page {
		height: 100%;
		background-color: #f2f2f2;
		width: 100%;
		margin: 0;
		font-family: "微软雅黑", "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
	}

	.empty_link_view {
		height: 310upx;
		width: 100%;
		flex-shrink: 0;
	}

	.message_detail {
		width: 100%;
		background: #f2f2f2;
		box-sizing: border-box;
	}

	.message_cont {
		width: 100%;
		height: 100%;
		padding: 0 30upx 40upx;
		box-sizing: border-box;
		background: #f2f2f2;
	}

	.message_item {
		width: 100%;
		margin-bottom: 25upx;
		padding-right: 20upx;
	}

	.msg_send_time_view {
		text-align: center;
		font-size: 24upx;
		margin: 40upx 0;
	}

	.msg_send_time_text {
		color: #fff;
		background: #D2D2D2;
		padding: 4upx 10upx;
		border-radius: 4upx;
		will-change: transform;
		max-width: 230upx;
		text-align: center;
		margin: 0 auto;
	}

	.sned_msg_view {
		width: 100%;
		bottom: 0;
		border-top: 1px solid #efefef;
		background-color: #fff;
		box-sizing: border-box;
		position: fixed;
		z-index: 99;
	}

	.service_link_view {
		background: #FFFFFF;
		width: 90%;
		border-radius: 3px;
		will-change: transform;
		box-sizing: border-box;
		padding: 20upx 30upx;
		font-size: 28upx;
		color: #333333;
		line-height: 42upx;
		margin: 30upx auto;
	}

	.service_link_cont {
		padding-bottom: 20upx;
	}

	.service_link_title {
		margin-bottom: 20upx;
	}

	.service_link_item {
		color: #4DAAF0;
		text-decoration: underline;
		margin-bottom: 6upx;
	}

	.top_empty_view {
		height: 30upx;
		width: 100%;
	}

	/* 优惠券隐藏btn */
	.coupon_hide_btn {
		position: fixed;
		right: 10upx;
		bottom: 250upx;
		width: 90upx;
		height: 100upx;
		opacity: 0.9;
		background: url(http://cdn.haofang.net/static/uuminiapp/im/coupon/coupon_redbag.png) no-repeat 0 0;
		background-size: 100%;
		margin-bottom: 30upx;
		text-align: center;
		vertical-align: middle;
		display: flex;
		display: -webkit-flex;
		align-items: center;
	}

	.coupon_hide_btn_text {
		width: 100%;
		height: 18upx;
		font-size: 18upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 37upx;
		letter-spacing: 0px;
		color: #ffd800;
		text-align: center;
	}

	.coupon-success {
		width: 590upx;
		background-color: #fef6e9;
		margin: 0 auto;
		text-align: left;
		font-size: 24upx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 50upx;
		letter-spacing: 0px;
		color: #fe943e;
		padding: 25upx 30upx;
		margin-bottom: 20upx;
	}
</style>
