<template>
	<view>
		<!-- 加载动画 -->
		<scrollLoading v-if="isRequesting" :isScrollIng="true"></scrollLoading>

		<!-- 内容区 -->
		<view v-if="!isRequesting && trackInfo.houseDes">
			<!-- 头部 -->
			<view class="f_r_b entrust_top">
				<view class="f_r_s">
					<view class="entrust_casetype f_c_c">{{ caseType == 1 ? '出售' : '出租' }}</view>

					<view class="entrust_create_time f_c_c">{{ trackInfo.createDate }}</view>
				</view>

				<view @click="onlineService" class="f_r_e">
					<image class="entrust_service_img" mode="aspectFill"
						src="https://zdzfapi.haofang.net/PublicC/images/service_new.png"></image>

					<view class="f_c_c entrust_service_text">客服</view>
				</view>
			</view>

			<!-- 房源信息 -->
			<view class="f_r_s track_house_view">
				<view class="track_house_img f_r_c">
					<image @error="houseImgError" mode="aspectFill" :src="trackInfo.houseImg"></image>
				</view>

				<view class="track_house_info">
					<view class="track_house_des">{{ trackInfo.houseDes }}</view>

					<view class="f_r_s track_house_floor">
						<view v-if="trackInfo.houseArea">面积: {{ trackInfo.houseArea }}㎡</view>

						<view v-if="trackInfo.houseFloor && trackInfo.houseFloors">楼层: {{ trackInfo.houseFloor }}/{{ trackInfo.houseFloors }}</view>
					</view>

					<view class="track_house_botttom f_r_b">
						<view v-if="trackInfo.housePrice" class="track_house_price main_color">{{ trackInfo.housePrice }}{{ trackInfo.housePriceUnit }}</view>
						<view class="no_price_view" v-if="!trackInfo.housePrice"></view>

						<view class="f_r_e track_push_look_view">
							<view class="track_push_num">推送 {{ trackInfo.tuisongNumAll }}</view>
							<view class="track_look_num">带看 {{ trackInfo.daikanNumAll }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 跟进列表 -->
			<view class="track_list">
				<block v-for="(item, index) in trackInfo.trackList" :key="index">
					<view class="track_list_item" v-for="(info, infoIdnex) in item.trackInfos" :key="infoIdnex">
						<view class="track_list_item_info">
							<view class="track_list_date">{{ item.date }} {{ info.hour }}</view>
							<view class="track_list_title">[{{ info.trackTitle }}] {{ info.item }}</view>
						</view>
					</view>
				</block>
			</view>
		</view>

		<!-- 授权 -->
		<loginView></loginView>
	</view>
</template>

<script>
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import { Notification } from "@/utils/Notification.js";
	import { Notify } from "@/utils/Notify.js";
	import { GetEntrustTrack } from "@/net/entrust/GetEntrustTrack.js";
	import { Const } from "@/utils/Const.js";
	import { OnlineServicePageTo } from "@/utils/common.js";

	export default {
		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		data() {
			return {
				cityId: "",  // 委托的城市id
				caseType: "",  // 类型
				caseId: "",   // 房源id
				isRequesting: true,  // 请求中...
				trackInfo: {},  // 委托信息
			}
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		onLoad(params) {
			// 监听用户信息授权
			new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
			this.initParams(params);
			this.initData();
		},

		onUnload() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
		},

		methods: {
			// 用户信息授权通知回调
			UserInfoChanged() {
				this.initData();
			},

			// 房源图片error
			houseImgError() {
				this.trackInfo.houseImg = Const.houseDefaultImg;
			},

			// 初始化参数
			initParams(params) {
				let keysMap = new Map()
					.set("cityId", "cityId")
					.set("caseType", "caseType")
					.set("caseId", "caseId")
				for (let key in params) {
					if(!keysMap.has(key)) continue;

					this[keysMap.get(key)] = params[key];
				}
			},

			// 初始化数据
			initData() {
				let me = new UserInfoModel().getModel("me") || {};
				if(!me.userId) {
						this.isRequesting = false;
						return;
				}

				return new GetEntrustTrack({
					vipCaseId: this.caseId,
					caseType: this.caseType,
					cityId: this.cityId,
					youyouUserId: me.userId}).send()
					.then(response => {
						let res = response.data || {};
						this.isRequesting = false;
						this.trackInfo = {
							createDate: res.createDate,
							houseImg: res.PHOTO || Const.houseDefaultImg,
							houseDes: res.buildName +
								(res.houseRoom && parseInt(res.houseRoom)
									? parseInt(res.houseRoom) + "室" : "") +
								(res.houseHall && parseInt(res.houseHall)
									? parseInt(res.houseHall) + "厅" : ""),
							houseArea: (res.houseArea && parseInt(res.houseArea)
								? parseInt(res.houseArea) : ""),
							houseFloor: (res.houseFloor && parseInt(res.houseFloor)
								? parseInt(res.houseFloor) : ""),
							houseFloors: (res.houseFloors && parseInt(res.houseFloors)
								? parseInt(res.houseFloors) : ""),
							housePrice: (res.PRICE_INFO && parseInt(res.PRICE_INFO)
								? parseInt(res.PRICE_INFO) : ""),
							housePriceUnit: (res.PRICE_UNIT_INFO || ""),
							tuisongNumAll: (res.tuisongNumAll && parseInt(res.tuisongNumAll)
								? parseInt(res.tuisongNumAll) : 0),
							daikanNumAll: (res.daikanNumAll && parseInt(res.daikanNumAll)
								? parseInt(res.daikanNumAll) : 0),
							trackList: res.tracks || [],
						};
					})
					.catch(err => {
						uni.showModal({
							confirmText: "我知道了",
							confirmColor: "#ab7f2e",
							showCancel: false,
							title: "温馨提示",
							content: "获取委托跟进数据失败啦！请稍后重试。"
						});
					});
			},

			// 在线客服
			onlineService() {
				new OnlineServicePageTo().go();
			}
		},
	}
</script>

<style>
	/* 头部 */
	.entrust_top{
		width:100%;
		border-bottom:1upx solid #f1f1f1;
		padding: 20upx;
		position:relative;
		box-sizing: border-box;
	}
	.entrust_casetype{
		font-size: 28upx;
		color: #101D36;
	}
	.entrust_create_time{
		color:#c6c6c6;
		font-size:26upx;
		padding-left:20upx;
	}
	.entrust_service_img{
		width: 30upx;
		height: 30upx;
		margin: auto 0;
		flex-shrink: 0;
	}
	.entrust_service_text{
		font-size: 26upx;
		color: #101D36;
		padding-left: 10upx;
	}

	/* 房源信息 */
	.track_house_view{
		padding: 20upx;
		box-sizing: border-box;
		width: 100%;
		border-bottom:1upx solid #f1f1f1;
	}
	.track_house_img{
		width:160upx;
		height:120upx;
		flex-shrink: 0;
	}
	.track_house_img>image{
		width: 100%;
		height: 100%;
	}
	.track_house_info{
		padding-left:20upx;
		box-sizing: border-box;
		width: calc(100% - 165upx);
	}
	.track_house_des{
		width:90%;
		overflow:hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
		font-size:28upx;
		color: #101D36;
	}
	.track_house_floor{
		font-size:26upx;
		margin-top: 6upx;
		color:#999;
	}
	.track_house_botttom{
		margin-top: 8upx;
		line-height: 30upx;
	}
	.no_price_view{
		width: 20upx;
	}
	.track_house_price{
		font-size:28upx;
	}
	.track_push_look_view{
		font-size:25upx;
		color:#c6c6c6;
		padding-right: 30upx;
		box-sizing: border-box;
	}
	.track_push_num{
		padding-left: 34upx;
		box-sizing: border-box;
		background: url("https://zdzfapi.haofang.net/PublicC/images/icon_ts_new.png") left center no-repeat;
		background-size: 30upx 30upx;
	}
	.track_look_num{
		box-sizing: border-box;
		padding-left:34upx;
		background:url("https://zdzfapi.haofang.net/PublicC/images/icon_dk_new.png") left center no-repeat;
		background-size:30upx 30upx;
		margin-left: 14upx;
	}

	/* 跟进列表 */
	.track_list{
		overflow-x:hidden;
		background:#fff;
		padding-top:20upx;
		padding-bottom: 30upx;
		box-sizing: border-box;
	}
	.track_list .track_list_item:first-child:before{
		height: 50%;
		top: 50%;
	}
	.track_list .track_list_item:first-child:after{
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		width: 16px;
		height: 16px;
		border: 4px solid #c6c6c6;
		border-radius: 8px;
		will-change: transform;
		left: 12px;
		-webkit-box-shadow: 0 0 0 3px #00ca85;
		box-shadow: 0 0 0 3px #00ca85;
		z-index: 2;
	}
	.track_list_item{
		position:relative;
		padding-left:80upx;
		padding-top:8upx;
	}
	.track_list_item:before {
		content: "";
		display: inline-block;
		position: absolute;
		top: 0;
		width: 1px;
		height: 100%;
		border-right: 1px solid #00ca85;
		left: 19px;
		z-index: 1;
	}
	.track_list_item:after{
		content: "";
		display: inline-block;
		position: absolute;
		width: 8px;
		height: 8px;
		background-color: #00ca85;
		border-radius: 4px;
		will-change: transform;
		left: 16px;
		top: 50%;
		margin-top: -2px;
		z-index: 1;
	}
	.track_list_item_info{
		padding:10px;
		border-radius:8upx;
		will-change: transform;
		color:#000;
		font-size:26upx;
	}
	.track_list_date{
		color:#333;
		font-size:26upx;
	}
</style>
