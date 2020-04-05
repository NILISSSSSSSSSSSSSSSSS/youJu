<template>
	<view class="trust_list_view">
		<!-- 加载中 -->
		<view class="loading_view f_r_c" v-if="!trustList || isRefresh">
		    <view class="pullUpIcon"></view>
		    <view class="pullUpLabel">努力加载中...</view>
		</view>

		<!-- 成功认领委托 -->
		<view class="success_get_trust_view" v-if="isfromClaimEntrust == 1">
			<view class="success_get_trust">成功认领委托，赶紧与经纪人沟通看房吧！</view>
		</view>
		<!-- 成功认领委托没有时的顶部占位 -->
		<view class="top_empty_view" v-else></view>

		<!-- 委托列表 -->
		<view v-if="trustList && trustList.length > 0">
			<block v-for="(item, index) in trustList" :key="index">
				<!--物业版委托 买房/租房委托-->
				<wantBuyLeaseWuYe @onMoveDelChange="onMoveDelChange"
				  	@onStopScrollChange="onStopScrollChange"
				  	:currentDelItem="currentDelItem" :item="item"
				  	@onRefreshChanged="onRefreshChanged"
				  	@onDelChange="onDelChange" :index="index"
				  	v-if="item.toSend == 2 && (item.caseType == 3 || item.caseType == 4)">
				</wantBuyLeaseWuYe>

				<!--物业版委托 出租/出售委托-->
				<saleLeaseWuYe v-else-if="item.toSend == 2"
					:item="item" :currentDelItem="currentDelItem"
				   	:index="index" @onMoveDelChange="onMoveDelChange"
				   	@onStopScrollChange="onStopScrollChange"
				   	@onRefreshChanged="onRefreshChanged"
				   	@onDelChange="onDelChange"></saleLeaseWuYe>

				<!--联卖 卖房、出租委托-->
				<saleLeaseLianMai v-else-if="item.toSend == 3 && item.isVip != 1"
						:item="item" :currentDelItem="currentDelItem"
						:index="index" @onMoveDelChange="onMoveDelChange"
						@onStopScrollChange="onStopScrollChange"
						@onRefreshChanged="onRefreshChanged"
						@onDelChange="onDelChange"></saleLeaseLianMai>

				<!-- 买房/租房委托 -->
				<wantBuyLease @onMoveDelChange="onMoveDelChange"
					@onStopScrollChange="onStopScrollChange"
					:currentDelItem="currentDelItem" :item="item"
					@onRefreshChanged="onRefreshChanged"
					@onDelChange="onDelChange" :index="index"
					v-else-if="item.caseType == 3 || item.caseType == 4"></wantBuyLease>

				<!-- 出租/出售委托 -->
				<saleLease v-else :item="item" :currentDelItem="currentDelItem"
					:index="index" @onMoveDelChange="onMoveDelChange"
					@onStopScrollChange="onStopScrollChange"
					@onRefreshChanged="onRefreshChanged"
					@onDelChange="onDelChange"></saleLease>
			</block>

			<view class="loading_view f_r_c" v-if="isScrollIng && haveMoreData">
			    <view class="pullUpIcon"></view>
			    <view class="pullUpLabel">努力加载中...</view>
			</view>
			<view v-if="!isScrollIng && !haveMoreData" class="no_more_data">没有更多数据了！</view>
		</view>

		<!-- 发布四种委托委托按钮 -->
		<view @click="pushAllTrust" class="push_all_trust_btn"></view>
		<!-- 首页按钮在非旗舰店入口进入时显示 -->
		<view @click="goBackIndex" v-if="pageForm != 'compStore'" class="go_back_home"></view>

		<!-- 多种委托弹窗 -->
		<allTrustListTc @onAllTrustCancelChange="onAllTrustCancelChange"
			v-if="publishEntrustShow"></allTrustListTc>

		<!-- 暂无数据 -->
		<noData :caseType="caseType" v-if="trustList && trustList.length == 0"></noData>
	</view>
</template>

<script>
	import { GetEntrustList } from "../../net/entrust/GetEntrustList.js";
	import { Notification } from "../../utils/Notification.js";
	import { Notify } from "../../utils/Notify.js";
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import { UserInfoModel } from "../../model/UserInfoModel.js";
	import wantBuyLease from "../../components/entrust/list/wantBuyLease.vue";
	import { Const } from "../../utils/Const.js";
	import { GetStarList } from "../../utils/common.js";
	import allTrustListTc from "../../components/entrust/list/allTrustListTc.vue";
	import saleLease from "../../components/entrust/list/saleLease.vue";
	import saleLeaseLianMai from "../../components/entrust/list/saleLeaseLianMai.vue";
	import saleLeaseWuYe from "../../components/entrust/list/saleLeaseWuYe.vue";
	import wantBuyLeaseWuYe from "../../components/entrust/list/wantBuyLeaseWuYe.vue";
	import noData from "../../components/entrust/list/noData.vue";

	let privateData = {
		trustTypeMap : {
			3: {
				text: "买房委托",
				event: "dealWantBuyLeaseLsit"
			},
			4: {
				text: "租房委托",
				event: "dealWantBuyLeaseLsit"
			},
			1: {
				text: "卖房委托",
				event: "dealSaleLsit"
			},
			2: {
				text: "出租委托",
				event: "dealSaleLsit"
			}
		},
		cityId: "",
		pageNum: 1,
		pageSize: 10
	};

	class TrustAgentItem {
		haedImg = "";  // 经纪人头像
		agentName = "";  // 经纪人姓名
		yongJinVal = "";  // 佣金值 例如: 1.5
		yongJinUnit = "%";  // 佣金单位
		starNum = 3;  // 评分
		starList = [];  // 评分列表
		getTime = "";  // 抢单时间 例如: 2018-11-23 09:29
		isUpdateRedFlag = 0;  // 更新红点是否显示 1: 显示
		pushStatus = 0;  // 推送状态
		pushLogId = "";  // 推送的id
		entrustHouseNum = 0; // 推荐房源数量
		cancelStatus = 0;  // 取消状态
		archiveId = "";  // 经纪人id

		// ---------- caseType == 1 || 2 ---------
		requireStatus = "";
		rewardStatus = "";
		validTime = "";
	}

	class TrustListItem {
		propertyUserVO = "";  // 经纪人信息
		resource = "";  // 来源
		buildName = "";  // 小区名称
		trustId = "";  // 委托id
		cityId = "";  // 委托的cityId
		vipCaseId = "";  // 委托的房源id
		caseType = "";
		regisonName = "";  // 区域名称
		positionInfo = "";  // 位置信息 例如: 青白江 110-130万
		priceVal = "";  // 价格 例如: 40-50
		pricaUnit = "";  // 单位 例如: 万
		usageName = "";  // 用途 例如: 住宅
		usageType = "";  // 用途 type 例如： 1
		room = "";  // 几室  例如: 3室
		houseImg = "";  // 房源图片
		zhuangXiuStatus = "";  // 装修情况  例如: 精装
		yongJinVal = "";  // 佣金范围  例如: 1-1.5%
		pushCityName = "";  // 发布城市 例如: 成都
		pushTime = "";  // 发布时间 例如: 2019-01-20 10:30
		pushContent = "";  // 发布的内容 例如: 成都 2019-01-20 10:30
		trustStatus = 0; // 委托状态 0: 取消  1: 抢单中 , 2: 取消委托
		isVip = 0;  // 是否是专属委托 1: 是
		isHezu = 0;  // 是否是合租
		toSend = "";  // 不知道是做啥的, 再次委托接口用到了
		entrustUsers = [];  // 委托经纪人列表

		// ----- caseType == 1 || 2 -----
		rewardType = "";  // 有奖图标  1: 有
		totalPrice = "";  // 房屋价格
		priceUnit = "";  // 价格单位
		houseArea = "";  // 房屋面积
		browseNum = 0;  // 浏览次数
		consultationNum = 0; // 咨询人数
		rewardMoney = 0; // 有奖委托奖金
		differPerson = null; // 相差的经纪人数量
		rewardStatus = ""; // 是否是有奖委托
		isRewardDelegate = "";
	}

	export default {
		data() {
			return {
				trustList: null,
				caseType: "",   // 3: 买房委托, 4: 租房委托, 1: 卖房委托, 2: 出租委托
				isfromClaimEntrust: 0,  // 是否从认领委托进入 1: 是 其他: 否
				pageForm: "",  //页面来源 旗舰店：compStore
				compId: "", // 公司id 旗舰店使用
				currentDelItem: new TrustListItem(),  // 当前删除的item
				isScrollIng: false,
				haveMoreData: true,
				pageHeight: "100%",
				publishEntrustShow: false,  // 委托弹窗显示
				stopScroll: false,  // 禁止穿透
                isRefresh: false, // 是否调用刷新
			}
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		components: {
			wantBuyLease,
			allTrustListTc,
			saleLease,
			noData,
            saleLeaseLianMai,
			saleLeaseWuYe,
			wantBuyLeaseWuYe
		},

		onLoad(params) {
			this.initParams(params);
			// 监听gps变化
			new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
            if(!this.trustList) {
                this.isRefresh = true;
            }
        	this.upGpsInfo().then(res => {
                if(this.trustList) {
                    this.isRefresh = false;
                }
            });
        },

		onUnload() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
		},

		onReachBottom() {
		    this.scrollBottom();
		},

		onReady() {
			this.getPhoneInfo();
		},

		onPullDownRefresh() {
			this.upGpsInfo();
		},

		methods: {
			initParams(params = {}) {
				let keyMap = new Map()
					.set("isfromClaimEntrust", "isfromClaimEntrust")
					.set("caseType", "caseType")
					.set("pageForm", "pageForm")
				for(let key in params) {
					if(params[key] && keyMap.has(key)) {
						this[keyMap.get(key)] = params[key];
					}

				}
				uni.setNavigationBarTitle({
					title: (privateData.trustTypeMap[params.caseType]
						? privateData.trustTypeMap[params.caseType].text || "" : "")
				});
			},

			// 获取设备信息
			getPhoneInfo() {
			    let res = uni.getSystemInfoSync();
			    this.pageHeight = res.windowHeight + "px";
			},

			 // 更新定位信息
			upGpsInfo() {
				if(!new GpsInfoModel().getModel("cityInfo")) {
					return Promise.resolve("finish");
				}

				let item = new GpsInfoModel().getModel("cityInfo") || {};
				privateData.cityId = item.cityId || "1";
				privateData.pageNum = 1;
				return this.initData().then(list => {
					this.trustList = list;
					uni.stopPullDownRefresh();
					return list;
				}).catch((err) => {
					uni.stopPullDownRefresh();
					return Promise.resolve(err);
				})
			},

			// gps change 回调
			GpsChanged(name, item) {
				if(privateData.cityId == ((new GpsInfoModel().getModel("cityInfo") || {}).cityId || "")) return;

			    this.upGpsInfo();
			},

			// 删除显示回调
			onMoveDelChange(item) {
				this.currentDelItem = item;
			},


			scrollBottom() {
			    if (this.isScrollIng || !this.haveMoreData) return;

			    privateData.pageNum++;
			    this.isScrollIng = true;
			    this.initData()
			        .then((list) => {
			            this.isScrollIng = false;
			            this.trustList = (this.trustList || []).concat(list);
			        })
			        .catch(() => {
			            this.isScrollIng = false;
			        });
			},

			initData() {
				let me = new UserInfoModel().getModel("me") || {};
				if(!privateData.cityId) {
					return Promise.resolve("暂无 cityId");
				}

				if(!me.userId) {
					return Promise.resolve("暂无 userId");
				}

				let requestApi = {
					cityId: privateData.cityId,
					youyouUserId: me.userId,
					// youyouUserId: "1635453",  // 里面有专属委托的id
					// youyouUserId: "363979",  // 普通委托情况比较多的id
					pageNum: privateData.pageNum,
					pageSize: privateData.pageSize,
				};
				if(this.caseType) {
					requestApi["caseType"] = this.caseType;
				}

				return new GetEntrustList(requestApi).send()
					.then(res => {
						let list = res.DATA ? res.DATA.list || [] : [];
						if(list.length < privateData.pageSize) {
							this.haveMoreData = false;
						}else{
							this.haveMoreData = true;
						}
						return this.dealList((res.DATA || {list: []}));
					})
					.catch(err => {
						uni.showModal({
							confirmText: "我知道了",
							confirmColor: "#ab7f2e",
							showCancel: false,
							title: "温馨提示",
							content: "获取委托列表失败了，请稍后重试。"
						});
					});
			},

			dealList(data) {
				if(!this.caseType) {
					uni.setNavigationBarTitle({
						title: "我的委托"
					});
					return this.dealMyLsit(data);
				}

				if (!privateData.trustTypeMap[this.caseType] || !this[privateData.trustTypeMap[this.caseType].event]) {
					return [];
				}

				return this[privateData.trustTypeMap[this.caseType].event](data);
			},

			// 处理我的委托
			dealMyLsit(data = {}) {
				let trustList = [];
				let list = data.list || [];
				for(let i = 0;i<list.length;i++) {
					let listItem = list[i] || {};
					if(!listItem.vipQueueId) continue;

					if(listItem.caseType == 1 || listItem.caseType == 2) {
						trustList.push(this.drawSaleListItem(listItem));
						continue;
					}

					if(listItem.caseType == 3 || listItem.caseType == 4) {
						trustList.push(this.drawWantBuyLeaseLsitItem(listItem));
						continue;
					}
				}
				return trustList;
			},

			// 处理卖房/出租委托列表数据
			dealSaleLsit(data = {}) {
				let trustList = [];
				let list = data.list || [];
				for(let i = 0;i<list.length;i++) {
					let listItem = list[i] || {};
					if(!listItem.vipQueueId) continue;

					trustList.push(this.drawSaleListItem(listItem));
				}
				return trustList;
			},
			drawSaleListItem(listItem = {}) {
				let trustItem = new TrustListItem();
				trustItem.propertyUserVO = listItem.propertyUserVO || null;
				trustItem.buildName = listItem.buildName || "";
				trustItem.resource = listItem.sourceType || "";
				trustItem.trustId = listItem.vipQueueId || "";
				trustItem.caseType = listItem.caseType || "";
				trustItem.regisonName = listItem.regionName || "";
				trustItem.positionInfo = listItem.infoSubject || "";
				trustItem.usageName = listItem.houseUseageCn || "";
				trustItem.usageType = listItem.houseType || "";
				trustItem.room = listItem.houseRoom ? parseInt(listItem.houseRoom) : "";
				trustItem.zhuangXiuStatus = listItem.houseFitmentCn || "";
				trustItem.yongJinVal = listItem.wfFee || "";
				trustItem.pushContent = listItem.infoCreateTime || "";
				trustItem.trustStatus = listItem.wfStatus || "";
				trustItem.houseImg = listItem.thumbUrl || "";
				trustItem.rewardType = listItem.rewardType || "";
				trustItem.totalPrice = listItem.houseTotalPrice ? parseInt(listItem.houseTotalPrice) : "";
				trustItem.priceUnit = listItem.priceUnitCn || "";
				trustItem.houseArea = listItem.houseArea ? parseInt(listItem.houseArea) : "";

				trustItem.isVip = listItem.isVip || 0;
				trustItem.cityId = listItem.cityId || "";
				trustItem.vipCaseId = listItem.vipCaseId || "";
				trustItem.toSend = listItem.toSend || "";

				trustItem.browseNum = listItem.browseNum || 0;
				trustItem.consultationNum = listItem.consultationNum || 0;
				trustItem.rewardMoney = listItem.rewardMoney || 0;
				trustItem.differPerson = listItem.differPerson != undefined ? listItem.differPerson : null;
				trustItem.rewardStatus = listItem.rewardStatus || "";
				trustItem.isHezu = listItem.isHezu || 0;
				trustItem.isRewardDelegate = listItem.isRewardDelegate || "";
                trustItem.unionHouseInfoVO = listItem.unionHouseInfoVO || {};

                // 物业版
                trustItem.houseRoof = listItem.houseRoof;  // 栋
                trustItem.houseUnit = listItem.houseUnit;  // 单元
                trustItem.houseFloor = listItem.houseFloor;  // 楼
                trustItem.houseNum = listItem.houseNum;  // 号
                trustItem.hhouseFloor = listItem.hhouseFloor;  // 当前楼层
                trustItem.hhouseFloors = listItem.hhouseFloors;  // 总楼层数

				let agentList = listItem.entrustUsers || [];
				let entrustUsers = [];
				for(let j = 0;j<agentList.length;j++) {
					let agentListItem = agentList[j] || {};
					let entrustUsersItem = new TrustAgentItem();
					entrustUsersItem.haedImg = agentListItem.brokerUserPicUrl || Const.defaultHeadImg;
					entrustUsersItem.agentName = agentListItem.brokerName || "";
					entrustUsersItem.yongJinVal = agentListItem.broberComitionRage
						? parseInt(agentListItem.broberComitionRage) : "";
					entrustUsersItem.yongJinUnit = agentListItem.broberComitionRage
						? agentListItem.broberComitionRage.substr(-1, 1) : "";
					entrustUsersItem.starNum = agentListItem.starLevel || 3;
					entrustUsersItem.starList = new GetStarList((agentListItem.starLevel || 3)).getList();
					entrustUsersItem.getTime = agentListItem.pushLogTime || "";
					entrustUsersItem.isUpdateRedFlag = agentListItem.isUpdateRedFlag || 0;
					entrustUsersItem.pushStatus = agentListItem.pushStatus || 0;

					entrustUsersItem.entrustHouseNum = agentListItem.entrustHouseNum || 0;
					entrustUsersItem.cancelStatus = agentListItem.cancelStatus || 0;
					entrustUsersItem.pushLogId = agentListItem.pushLogId || "";

					entrustUsersItem.requireStatus = agentListItem.requireStatus || "";
					entrustUsersItem.rewardStatus = agentListItem.rewardStatus || "";
					entrustUsersItem.validTime = agentListItem.validTime || "";
					entrustUsersItem.archiveId = agentListItem.brokerArchiveId || "";
					entrustUsers.push(entrustUsersItem);
				}
				trustItem.entrustUsers = entrustUsers;
				return trustItem;
			},

			// 处理买房/求组委托列表数据
			dealWantBuyLeaseLsit(data = {}) {
				let trustList = [];
				let list = data.list || [];
				for(let i = 0;i<list.length;i++) {
					let listItem = list[i] || {};
					if(!listItem.vipQueueId) continue;

					trustList.push(this.drawWantBuyLeaseLsitItem(listItem));
				}
				return trustList;
			},
			drawWantBuyLeaseLsitItem(listItem = {}) {
				let trustItem = new TrustListItem();
				trustItem.propertyUserVO = listItem.propertyUserVO || null;
				trustItem.trustId = listItem.vipQueueId || "";
				trustItem.caseType = listItem.caseType || "";
				trustItem.regisonName = listItem.regionName || "";
				trustItem.positionInfo = listItem.infoSubject || "";
				trustItem.usageName = listItem.houseUseageCn || "";
				trustItem.usageType = listItem.houseType || "";
				trustItem.room = listItem.houseRoom ? parseInt(listItem.houseRoom) : "";
				trustItem.zhuangXiuStatus = listItem.houseFitmentCn || "";
				trustItem.yongJinVal = listItem.wfFee || "";
				trustItem.pushContent = listItem.infoCreateTime || "";
				trustItem.trustStatus = listItem.wfStatus || "";
				trustItem.isVip = listItem.isVip || 0;
				trustItem.cityId = listItem.cityId || "";
				trustItem.vipCaseId = listItem.vipCaseId || "";
				trustItem.toSend = listItem.toSend || "";
				trustItem.isHezu = listItem.isHezu || 0;

				// 物业版
				trustItem.houseRoof = listItem.houseRoof;  // 栋
				trustItem.houseUnit = listItem.houseUnit;  // 单元
				trustItem.houseFloor = listItem.houseFloor;  // 楼
				trustItem.houseNum = listItem.houseNum;  // 号
				trustItem.hhouseFloor = listItem.hhouseFloor;  // 当前楼层
				trustItem.hhouseFloors = listItem.hhouseFloors;  // 总楼层数

				let agentList = listItem.entrustUsers || [];
				let entrustUsers = [];
				for(let j = 0;j<agentList.length;j++) {
					let agentListItem = agentList[j] || {};
					let entrustUsersItem = new TrustAgentItem();
					entrustUsersItem.haedImg = agentListItem.brokerUserPicUrl || Const.defaultHeadImg;
					entrustUsersItem.agentName = agentListItem.brokerName || "";
					entrustUsersItem.yongJinVal = agentListItem.broberComitionRage
						? parseInt(agentListItem.broberComitionRage) : "";
					entrustUsersItem.yongJinUnit = agentListItem.broberComitionRage
						? agentListItem.broberComitionRage.substr(-1, 1) : "";
					entrustUsersItem.starNum = agentListItem.starLevel || 3;
					entrustUsersItem.starList = new GetStarList((agentListItem.starLevel || 3)).getList();
					entrustUsersItem.getTime = agentListItem.pushLogTime || "";
					entrustUsersItem.isUpdateRedFlag = agentListItem.isUpdateRedFlag || 0;
					entrustUsersItem.pushStatus = agentListItem.pushStatus || 0;
					entrustUsersItem.entrustHouseNum = agentListItem.entrustHouseNum || 0;
					entrustUsersItem.cancelStatus = agentListItem.cancelStatus || 0;
					entrustUsersItem.pushLogId = agentListItem.pushLogId || "";
					entrustUsers.push(entrustUsersItem);
				}
				trustItem.entrustUsers = entrustUsers;
				return trustItem;
			},

			// 发布多种委托按钮
			pushAllTrust() {
				let that = this;
				let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				if(this.pageForm == "compStore") {
					uni.showToast({
						title: "跳转到旗舰店委托",
						icon: "none"
					});
					return;
				}

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

				this.publishEntrustShow = true;
			},

			// 取消多种委托的回调
			onAllTrustCancelChange(boolean) {
				this.publishEntrustShow = boolean;
			},

			// 禁止滚动的回调
			onStopScrollChange(boolean) {
				this.stopScroll = true;
			},

			// 返回首页
			goBackIndex() {
				uni.reLaunch({
					url: "/pages/index/index"
				});
			},

			// 删除caseType = 3 || 4 委托
			onDelChange(index) {
				uni.showToast({
					icon: "success",
					title: "删除成功"
				});
				this.trustList.splice(index, 1);
			},

			// 重新刷新回调
			onRefreshChanged(index) {
				this.upGpsInfo();
			}
		},
	}
</script>

<style>
	page{
		background: #F2F2F2;
		width: 100%;
		overflow-x: hidden;
	}
	.trust_list_view{
		background: #F2F2F2;
		width: 100%;
		padding: 0 20upx;
		box-sizing: border-box;
		overflow-x: hidden;
	}
	.success_get_trust_view{
		width: 100%;
		padding: 30upx 20upx;
		box-sizing: border-box;
	}
	.success_get_trust{
		width: 100%;
		height:60upx;
		background-color:#fef6e9;
		border-radius:30upx;
		will-change: transform;
		color:#f68000;
		font-size:26upx;
		text-align:center;
		line-height:60upx;
	}
	.top_empty_view{
		height: 30upx;
		width: 100%;
		flex-shrink: 0;
	}
	.no_more_data{
	    height: 80upx;
	    line-height: 80upx;
	    text-align: center;
	    font-size:26upx;
	    color:#666666;
	}
	.loading_view{
	    transform-origin: 0px 0px 0px;
	    opacity: 1;
	    transform: scale(1, 1);
	    height:40px;
	    line-height:40px;
	    font-size:12px;
	    text-align:center;
	    margin-top: 10upx;
	}
	.pullUpIcon{
	    display:inline-block;
	    height:15px;
	    width:15px;
	    border-radius:100%;
		will-change: transform;
	    margin:auto 6px;
	    border:2px solid #666;
	    border-bottom-color:transparent;
	    vertical-align:middle;
	    animation:loading 1s linear infinite;
	}
	@keyframes loading {
	    0% {
	        transform: rotate(0deg);
	    }
	    50% {
	        transform: rotate(180deg);
	    }
	    100% {
	        transform: rotate(360deg);
	    }
	}

	/* 发布多种委托按钮 */
	.push_all_trust_btn{
		width:98upx;
		height:98upx;
		background:url('http://cdn.haofang.net/static/wxPlusApp/yjk/btn_fabu.png') center center no-repeat;
		background-size:100% 100%;
		position:fixed;
		right:30upx;
		bottom:180upx;
		z-index:50;
		box-shadow: 0 0 33.2upx 1.8upx rgba(116, 116, 116, 0.2);
		border-radius: 50%;
	}

	/* 返回首页 */
	.go_back_home{
		width:98upx;
		height:98upx;
		background:url('http://cdn.haofang.net/static/wxPlusApp/yjk/btn_home.png') center center no-repeat;
		background-size:100% 100%;
		position:fixed;
		right:30upx;
		bottom:60upx;
		z-index:50;
		box-shadow: 0 0 33.2upx 1.8upx rgba(116, 116, 116, 0.2);
		border-radius: 50%;
	}
</style>
