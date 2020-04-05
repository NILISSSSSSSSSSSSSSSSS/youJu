<template>
	<view>
		<!-- 内容区 -->
		<view class="collect_view">
			<!-- 收藏的经纪人 -->
			<view v-if="agentList && agentList.length > 0">
				<view class="collect_title">我关注的经纪人</view>

				<view class="collect_agent_list f_r_s">
					<block v-for="(item, index) in agentList" :key="index">
						<view @click="goToStore(item)" class="collect_agent_item f_c_c">
							<view class="collect_agent_img">
								<image :src="item.archiveHeadImg" mode="aspectFill"></image>
							</view>

							<view class="collect_agent_name">{{ item.archiveName }}</view>
							<view class="collect_agent_join">进入微店</view>
						</view>
					</block>
				</view>
			</view>

			<!-- 收藏的房源 -->
			<view v-if="collectHouseList && collectHouseList.length > 0">
				<view class="collect_title">我收藏的房源</view>

				<view class="collect_agent_list f_r_s">
					<view class="f_c_s" v-for="(item, index) in collectHouseList" :key="index">
						<collectErHouseItem v-if="item.caseType == 1 || item.caseType == 2 || item.caseType == 3"
							:item="item"></collectErHouseItem>

						<collectNewHouseItem v-if="item.caseType == 4 || item.caseType == 6 || item.caseType == 9"
							:item="item"></collectNewHouseItem>

						<collectAparmentItem v-if="item.caseType == 5 || item.caseType == 7 || item.caseType == 8"
							:item="item"></collectAparmentItem>
					</view>
				</view>
			</view>

			<!-- 浏览的房源 -->
			<view v-if="haveHistory == 1">
				<view class="collect_title">我浏览的房源</view>

				<view class="collect_history_list_view" v-for="(info, key) in historyHouseMap" :key="key">
					<view class="collect_history_time">{{ key }}</view>
					<view class="collect_history_list">
						<view v-for="(item, index) in info" :key="index">
							<erHouseListItem v-if="item.caseType == 1 || item.caseType == 2 || item.caseType == 3"
								:item="item"></erHouseListItem>

							<newHouseListItem v-if="item.caseType == 4 || item.caseType == 6 || item.caseType == 9"
								:item="item"></newHouseListItem>

							<historyApartment v-if="item.caseType == 5 || item.caseType == 7 || item.caseType == 8"
								:item="item"></historyApartment>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 暂无数据 -->
		<view v-if="(agentList && collectHouseList && haveHistory != 0) && (agentList.length == 0 && collectHouseList.length == 0 && haveHistory == 2)"
			class="no_collect_view f_c_c">
			<image class="no_collect_img" mode="aspectFill"
				src="http://cdn.haofang.net/static/uuminiapp/new_images/nodata_list_new.png"></image>
			<view class="no_collect_text">暂无数据记录</view>
		</view>

		<!-- 授权 -->
		<get-user-info></get-user-info>
	</view>
</template>

<script>
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import { GpsInfoModel } from "@/model/GpsInfoModel.js";
	import { Notification } from "@/utils/Notification.js";
	import { Notify } from "@/utils/Notify.js";
	import {
		GetCollectAgentList,
		GetCollectHouseList,
		GetHistoryHouseList
	} from "@/net/houseApi/GetCollectionList.js";
	import { Const, ErHouseListItem, NewHouseListItem, ApartmentHouseListItem } from "@/utils/Const.js";
	import collectErHouseItem from "@/pagesHouse/components/collect/collectErHouseItem.vue";
	import collectNewHouseItem from "@/pagesHouse/components/collect/collectNewHouseItem.vue";
	import collectAparmentItem from "@/pagesHouse/components/collect/collectAparmentItem.vue";
	import historyApartment from "@/pagesHouse/components/collect/historyApartment.vue";
	import erHouseListItem from "@/components/erHouseListItem.vue";
	import newHouseListItem from "@/components/newHouseListItem.vue";
	import { GetMonthDay } from "@/utils/common.js";

	// 收藏的经纪人数据类型
	class AgentListItem{
		archiveId = "";  // 经纪人id
		archiveName = "";  // 经纪人姓名
		archiveHeadImg = "";  // 经纪人头像
	}

	export default {
		components: {
			collectErHouseItem,
			collectNewHouseItem,
			collectAparmentItem,
			newHouseListItem,
			erHouseListItem,
			historyApartment
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		data() {
			return {
				isRequesting: true,
				agentList: null,
				collectHouseList: null,
				historyHouseMap: null,
				haveHistory: 0,  // 0 不知道 1： 有 2： 没有
			};
		},

		onLoad() {
			// 监听用户信息授权
			new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
            uni.stopPullDownRefresh();
			this.initData();
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		onUnload() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
		},

		methods: {
			// 用户授权回调
			UserInfoChanged() {
				this.initData();
			},

			// 进入微店
			goToStore(item) {
				uni.navigateTo({
					url: "/pagesStore/personalStore/personalStore?archiveId=" + item.archiveId
				});
			},

			// 初始化数据
			initData() {
				let me = new UserInfoModel().getModel("me") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				if(!me.userId || !cityInfo.cityId) return;

				let requestData = {
					wxId: me.userId,
					cityId: cityInfo.cityId
				};
				return Promise.all([
					this.getCollectAgentList(requestData),
					this.getCollectHouseList(requestData),
                    this.getHistoryHouseList(requestData)
				])
                .then(() => {
                    this.isRequesting = false;
                    uni.stopPullDownRefresh();
                })
				.catch(err => {
                    uni.stopPullDownRefresh();
					this.isRequesting = false;
					uni.showModal({
						confirmColor: "#ab7f2e",
						confirmText: "我知道了",
						showCancel: false,
						title: "温馨提示",
						content: "获取列表失败啦！请稍后重试。"
					});
				});
			},

			// 获取经纪人
			getCollectAgentList(requestData) {
				return new GetCollectAgentList(requestData).send()
					.then(res => {
						this.drawAgentList(res || {});
						return res;
					});
			},
			// 获取收藏的房源
			getCollectHouseList(requestData) {
				return new GetCollectHouseList(requestData).send()
					.then(res => {
						this.drawCollectHouseList(res || {});
						return res;
					});
			},
			// 获取浏览的房源
			getHistoryHouseList(requestData) {
				return new GetHistoryHouseList(requestData).send()
					.then(res => {
						this.drawHistoryHouseList(res || {});
						return res;
					});
			},

			// 渲染收藏的经纪人列表
			drawAgentList(res) {
				let agentList = [];
				let attentionVoList = res.DATA ? res.DATA.attentionVoList || [] : [];
				attentionVoList.map((item) => {
					let agentItem = new AgentListItem();
					if(item.archiveId) {
						agentItem.archiveId = item.archiveId || "";
						agentItem.archiveName = item.userName || "";
						agentItem.archiveHeadImg = item.userPhoto || Const.defaultHeadImg;
						agentList.push(agentItem);
					}
				});
				this.agentList = agentList;
			},
			// 渲染收藏房源列表
			drawCollectHouseList(res) {
				let collectHouseList = [];
				let resultList = res && res.DATA ? res.DATA.resultList || [] : [];
				resultList.map((item) => {
					let val = this.conditionEvent(item);
					if(val) {
						collectHouseList.push(val);
					}
				});
				this.collectHouseList = collectHouseList;
			},
			// 渲染浏览的房源列表
			drawHistoryHouseList(res) {
                let list = res && res.DATA ? res.DATA.historyList || [] : [];
                let historyHouseMap = {};
                list.map((item) => {
                    let val = this.conditionHistoryEvent(item);
                    if(val) {
                        let date = item.viewTime;
                        date = date.substring(0, 19);
                        date = date.replace(/-/g, '/');
                        let newDate = new GetMonthDay().init(new Date(date));
                        if (historyHouseMap[newDate]) {
                            historyHouseMap[newDate].push(val);
                        } else {
                            historyHouseMap[newDate] = [val];
                        }
                    }
                });
                if(Object.keys(historyHouseMap).length > 0) {
                	this.haveHistory = 1;
				}else {
                	this.haveHistory = 2;
				}
                this.historyHouseMap = historyHouseMap;
			},

			// 处理记录房源事件分发处理
			conditionHistoryEvent(item) {
				let eventMap = new Map()
					.set("9", "dealHistoryNewHouseItem")
					.set("6", "dealHistoryNewHouseItem")
					.set("4", "dealHistoryNewHouseItem")
					.set("3", "dealHistoryErHouseItem")
					.set("2", "dealHistoryErHouseItem")
					.set("1", "dealHistoryErHouseItem")
					.set("5", "dealHistoryApaetmentHouseItem")
					.set("7", "dealHistoryApaetmentHouseItem")
					.set("8", "dealHistoryApaetmentHouseItem")
				let caseType = item.caseType ? item.caseType + "" : "";
				if(!caseType) return null;

				if(!eventMap.has(caseType)) return null;

				if(!this[eventMap.get(caseType)]) return null;

				return this[eventMap.get(caseType)](item);
			},
			// 处理记录公寓数据
			dealHistoryApaetmentHouseItem(dataItem = {}) {
				let item = new ApartmentHouseListItem();
				let tags = (dataItem.gyRoomTags
				    && dataItem.gyRoomTags.indexOf(",") >= 0)
				    ? dataItem.gyRoomTags.split(",") : [];
				if (tags.length > 3) {
				    tags = tags.slice(0, 3);
				}
				item.caseType = dataItem.caseType || "";
				item.houseId = dataItem.gyUuId || "";
				item.houseImg = dataItem.gyThumbUrl ? dataItem.gyThumbUrl : Const.houseDefaultImg;
				item.houseTing = (dataItem.gyBedRoomNum && dataItem.gyBedRoomNum != 0 ? dataItem.gyBedRoomNum + "室" : "")
				    + (dataItem.gyLivingRoomNum && dataItem.gyLivingRoomNum != 0 ? dataItem.gyLivingRoomNum + "厅" : "")
				    + (dataItem.gyToiletNum && dataItem.gyToiletNum != 0 ? dataItem.gyToiletNum + "卫" : "");
				item.houseJianText = dataItem.gyRoomHouseNum ? dataItem.gyRoomHouseNum + "房间" : "";
				item.houseResourceText = dataItem.gyAppIdCn || "";
				item.houseName = dataItem.gyHftBuildName || "";
				item.houseAddress = dataItem.gyHftSectionName || "";
				item.housePriceOfMonth = dataItem.gyMonthRent || "";
				item.housePriceOfMonthUnit = dataItem.gyMonthRent ? "元/月" : "";
				item.houseTags = tags;
				item.apartmentUuid = dataItem.gyUuId || "";
				item.roomUuid = dataItem.gyRoomUuid || "";
				item.rentType = dataItem.gyJumpTemplate || "2";
				item.houseSource = dataItem.gyAppIdCn || "";
				return item;
			},
			// 处理记录新房数据
			dealHistoryNewHouseItem(dataItem = {}) {
				let item = new NewHouseListItem();
				let tags = !dataItem.xfBuildTag
					? [] : dataItem.xfBuildTag.indexOf(",") >= 0
						? dataItem.xfBuildTag.split(",") : [dataItem.xfBuildTag];
				let buildTypeTags = !dataItem.xfBuildType
					? [] : dataItem.xfBuildType.indexOf(",") >= 0
						? dataItem.xfBuildType.split(",") : [dataItem.xfBuildType];
				let buildFitmentTags = !dataItem.xfBuildFitment
					? [] : dataItem.xfBuildFitment.indexOf(",") >= 0
						? dataItem.xfBuildFitment.split(",") : [dataItem.xfBuildFitment];
				tags = tags.concat(buildTypeTags);
				tags = tags.concat(buildFitmentTags);
				if (tags.length > 3) {
				    tags = tags.slice(0, 3);
				}
				item.caseType = dataItem.caseType || "";
				item.cityId = dataItem.cityId || "";
				item.buildId = dataItem.xfBuildId || "";
				item.buildStatus = dataItem.xfBuildStatus || "";
				item.buildImg = dataItem.xfPhotoAddr || Const.houseDefaultImg;
				item.buildTing = dataItem.roomText ? dataItem.roomText + " | " : "";
				item.buildArea = (dataItem.areaLow && dataItem.areaHigh)
				    ? parseInt(dataItem.areaLow) + "-" + parseInt(dataItem.areaHigh)
				    : (parseInt(dataItem.areaLow || 0) || parseInt(dataItem.areaHigh || 0) || "");
				item.buildAreaUnit = (dataItem.areaLow || dataItem.areaHigh) ? "m²" : "";
				item.buildAddress = dataItem.xfBuildAddr || "";
				item.buildName = dataItem.xfBuildName || "";
				item.buildTags = tags;
				item.buildPriceOfArea = !dataItem.xfPriceText ? ""
					: dataItem.xfPriceText.indexOf("价格") >= 0 ? "" : parseInt(dataItem.xfPriceText);
				item.buildPriceOfAreaUnit = "元/㎡";
				item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
				return item;
			},
			// 处理记录二手房数据
			dealHistoryErHouseItem(dataItem = {}) {
				let item = new ErHouseListItem();
				let tags = !dataItem.houseTagDesc ? []
						: dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") === -1
								? [dataItem.houseTagDesc] : dataItem.houseTagDesc.split("|");
				if(dataItem.caseType != 1 && dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") < 0) {
					tags.push(dataItem.houseTagDesc);
				}
				if (tags.length > 3) {
				    tags = tags.slice(0, 3);
				}
				item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
				item.cityId = dataItem.cityId || "";
				item.caseType = dataItem.caseType || "";
				item.houseId = dataItem.caseId || "";
				item.reSource = dataItem.reSource || "1";
				item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
				item.houseTitle = dataItem.subject || "";
				item.houseTing = (dataItem.room ? dataItem.room + "室" : "")
				    + (dataItem.hall ? dataItem.hall + "厅" : "");
				item.houseArea = dataItem.area || "";
				item.houseAreaUnit = dataItem.area ? "m²" : "";
				item.houseName = dataItem.buildName || "";
				item.houseTotalPrice = dataItem.totalPrice || "";
				item.houseTotalPriceUnit = dataItem.totalPrice
				    ? (dataItem.priceUnitCn || "") : "";
				item.housePriceOfArea = dataItem.houseUnitPrice || "";
				item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
				item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
				item.hasVideo = !!(dataItem.hasVideo);
				item.houseTags = tags;
				item.houseUseage = dataItem.houseUseage || "";
				item.houseUseageCn = dataItem.houseUseageCn || "";
				return item;
			},


			// 处理收藏房源事件分发处理
			conditionEvent(item) {
				let eventMap = new Map()
					.set("9", "dealNewHouseItem")
					.set("6", "dealNewHouseItem")
					.set("4", "dealNewHouseItem")
					.set("3", "dealErHouseItem")
					.set("2", "dealErHouseItem")
					.set("1", "dealErHouseItem")
					.set("5", "dealApaetmentHouseItem")
					.set("7", "dealApaetmentHouseItem")
					.set("8", "dealApaetmentHouseItem")
				let caseType = item.caseType ? item.caseType + "" : "";
				if(!caseType) return null;

				if(!eventMap.has(caseType)) return null;

				if(!this[eventMap.get(caseType)]) return null;

				return this[eventMap.get(caseType)](item);
			},
			// 处理公寓数据
			dealApaetmentHouseItem(dataItem = {}) {
				let item = new ApartmentHouseListItem();
				let tags = (dataItem.gyRoomTags
				    && dataItem.gyRoomTags.indexOf(",") >= 0)
				    ? dataItem.gyRoomTags.split(",") : [];
				if (tags.length > 3) {
				    tags = tags.slice(0, 3);
				}
				item.caseType = dataItem.caseType || "";
				item.houseId = dataItem.gyUuId || "";
				item.houseImg = dataItem.gyThumbUrl ? dataItem.gyThumbUrl : Const.houseDefaultImg;
				item.houseTing = (dataItem.gyBedRoomNum && dataItem.gyBedRoomNum != 0 ? dataItem.gyBedRoomNum + "室" : "")
				    + (dataItem.gyLivingRoomNum && dataItem.gyLivingRoomNum != 0 ? dataItem.gyLivingRoomNum + "厅" : "")
				    + (dataItem.gyToiletNum && dataItem.gyToiletNum != 0 ? dataItem.gyToiletNum + "卫" : "");
				item.houseJianText = dataItem.gyRoomHouseNum ? dataItem.gyRoomHouseNum + "房间" : "";
				item.houseResourceText = dataItem.gyAppIdCn || "";
				item.houseName = dataItem.gyHftBuildName || "";
				item.houseAddress = dataItem.gyHftSectionName || "";
				item.housePriceOfMonth = dataItem.gyMonthRent || "";
				item.housePriceOfMonthUnit = dataItem.gyMonthRent ? "元/月" : "";
				item.houseTags = tags;
				item.apartmentUuid = dataItem.gyUuId || "";
				item.roomUuid = dataItem.gyRoomUuid || "";
				item.rentType = dataItem.gyJumpTemplate || "2";
				item.houseSource = dataItem.gyAppIdCn || "";
				return item;
			},
			// 处理新房数据
			dealNewHouseItem(dataItem = {}) {
				let item = new NewHouseListItem();
				let tags = !dataItem.xfBuildTag
					? [] : dataItem.xfBuildTag.indexOf(",") >= 0
						? dataItem.xfBuildTag.split(",") : [dataItem.xfBuildTag];
				let buildTypeTags = !dataItem.xfBuildType
					? [] : dataItem.xfBuildType.indexOf(",") >= 0
						? dataItem.xfBuildType.split(",") : [dataItem.xfBuildType];
				let buildFitmentTags = !dataItem.xfBuildFitment
					? [] : dataItem.xfBuildFitment.indexOf(",") >= 0
						? dataItem.xfBuildFitment.split(",") : [dataItem.xfBuildFitment];
				tags = tags.concat(buildTypeTags);
				tags = tags.concat(buildFitmentTags);
				if (tags.length > 3) {
				    tags = tags.slice(0, 3);
				}
				item.caseType = dataItem.caseType || "";
				item.cityId = dataItem.cityId || "";
				item.buildId = dataItem.xfBuildId || "";
				item.buildStatus = dataItem.xfBuildStatus || "";
				item.buildImg = dataItem.xfPhotoAddr || Const.houseDefaultImg;
				item.buildTing = dataItem.roomText ? dataItem.roomText + " | " : "";
				item.buildArea = (dataItem.areaLow && dataItem.areaHigh)
				    ? parseInt(dataItem.areaLow) + "-" + parseInt(dataItem.areaHigh)
				    : (parseInt(dataItem.areaLow || 0) || parseInt(dataItem.areaHigh || 0) || "");
				item.buildAreaUnit = (dataItem.areaLow || dataItem.areaHigh) ? "m²" : "";
				item.buildAddress = dataItem.xfBuildAddr || "";
				item.buildName = dataItem.xfBuildName || "";
				item.buildTags = tags;
				item.buildPriceOfArea = !dataItem.xfPriceText ? ""
					: dataItem.xfPriceText.indexOf("价格") >= 0 ? "" : parseInt(dataItem.xfPriceText);
				item.buildPriceOfAreaUnit = "元/㎡";
				item.isHotSale = !!(dataItem.hotSaleHouse && dataItem.hotSaleHouse == 1);
				return item;
			},
			// 处理收藏二手房数据
			dealErHouseItem(dataItem = {}) {
				let item = new ErHouseListItem();
				let tags = !dataItem.houseTagDesc ? []
						: dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") === -1
								? [dataItem.houseTagDesc] : dataItem.houseTagDesc.split("|");
				if(dataItem.caseType != 1 && dataItem.houseTagDesc && dataItem.houseTagDesc.indexOf("|") < 0) {
					tags.push(dataItem.houseTagDesc);
				}
				if (tags.length > 3) {
				    tags = tags.slice(0, 3);
				}
				item.trueHouse = !!(dataItem.trueFlag && dataItem.trueFlag == 1);
				item.cityId = dataItem.cityId || "";
				item.caseType = dataItem.caseType || "";
				item.houseId = dataItem.houseId || "";
				item.reSource = dataItem.reSource || "0";
				item.houseImg = dataItem.thumbUrl || Const.houseDefaultImg;
				item.houseTitle = dataItem.houseSubject || "";
				item.houseTing = (dataItem.houseRoom ? dataItem.houseRoom + "室" : "")
				    + (dataItem.houseWei ? dataItem.houseWei + "卫" : "");
				item.houseArea = dataItem.houseArea || "";
				item.houseAreaUnit = dataItem.houseArea ? "m²" : "";
				item.houseName = dataItem.buildName || "";
				item.houseTotalPrice = dataItem.houseTotalPrice || "";
				item.houseTotalPriceUnit = dataItem.houseTotalPrice
				    ? (dataItem.priceUnitCn || "") : "";
				item.housePriceOfArea = dataItem.houseUnitPrice || "";
				item.housePriceOfAreaUnit = dataItem.houseUnitPrice ? "元/m²" : "";
				item.hasVr = !!(dataItem.hasPanorama && dataItem.hasPanorama > 0);
				item.hasVideo = !!(dataItem.hasVideo);
				item.houseTags = tags;
				item.houseUseage = dataItem.houseUseage || "";
				item.houseUseageCn = dataItem.houseUseageCn || "";
				return item;
			}
		},
	}
</script>

<style>
	/* 暂无数据 */
	.no_collect_view{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		z-index: 99;
	}
	.no_collect_img{
		width:283upx;
		height:287upx;
		flex-shrink: 0;
		margin: 0 auto;
	}
	.no_collect_text{
		font-size:28upx;
		color:#999;
		text-align:center;
		margin:20upx auto 0;
	}

	.collect_history_list_view{
		margin-top: -20upx;
	}
	.collect_history_list_view .collect_history_time:first-child{
		padding-top: 0;
	}
	.collect_history_time{
		padding:22upx 0 0 0;
		font-size:20upx;
		color:#999;
		box-sizing: border-box;
		margin-bottom:-17upx;
		position: relative;
		z-index: 99;
		text-align: left;
	}
	.collect_view{
		padding: 0 40upx;
		box-sizing: border-box;
	}
	/* 经纪人 */
	.collect_title{
		padding:50upx 0 50upx;
		font-size:36upx;
		font-weight:bold;
		line-height:1;
		text-align: left;
	}
	.collect_agent_list{
		align-items:start;
		overflow-x:auto;
		-webkit-overflow-scrolling:touch;
		padding-bottom:20upx;
		margin-bottom:-20upx;
		margin-top:-20upx;
		padding-top:20upx;
		overflow-y:auto;
	}
	.collect_history_list{

	}
	.collect_agent_item{
		width:200upx;
		box-shadow:0upx 0upx 20upx 0upx rgba(194, 194, 194, 0.3);
		border-radius:6upx;
		border:solid 1upx #f2f2f2;
		padding-top:17upx;
		box-sizing:border-box;
		margin-right:18upx;
		flex-shrink:0;
	}
	.collect_agent_img{
		position:relative;
		width:120upx;
		height:120upx;
		background:url(http://cdn.haofang.net/static/uuweb/buildingBook/housingLongFigure/default_head.png) center center no-repeat;
		background-size:100% 100%;
		flex-shrink: 0;
		border-radius: 120upx;
		margin: 10upx auto 25upx;
		overflow: hidden;
        will-change: transform;
	}
	.collect_agent_img image{
		width: 100%;
		height: 100%;
        border-radius: 100%;
		margin: auto;
	}
	.collect_agent_name{
		color:#333;
		font-size:30upx;
		margin-bottom:13upx;
		font-weight:bold;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		width:100%;
		text-align:center;
	}
	.collect_agent_join{
		color:#597192;
		font-size:22upx;
		text-align: center;
		margin-bottom: 20upx;
	}
	.collect_agent_join::after{
		content: '';
		position: relative;
		display: inline-block;
		top:-1upx;
		width: 10upx;
		height: 16upx;
		margin-left: 8upx;
		vertical-align: middle;
		background: url(http://cdn.haofang.net/static/uuminiapp/focusCollect/left_arrow.png) center center no-repeat;
		background-size: 100% 100%;
	}
</style>
