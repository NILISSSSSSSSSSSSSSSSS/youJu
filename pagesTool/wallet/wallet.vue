<template>
	<!-- 顶部Swiper -->
	<!-- #ifdef MP-ALIPAY -->
	<view id='account-wrap-1'>
		<view class="swiper-wrap">
			<swiper class='swiper' :current="currentTab" previous-margin='20px'
                    circular
				next-margin='10px' @change='swiperCurrent'>
	<!-- #endif -->

	<!-- #ifdef MP-BAIDU -->
	<view id='account-wrap-1'>
		<swiper class='swiper' :current="currentTab" indicator-dots
                circular
			indicator-color='#dbe2e7' previous-margin='20px'
			next-margin='10px' @change='swiperCurrent'>
	<!-- #endif -->

	<!-- #ifdef MP-WEIXIN -->
	<view id='account-wrap-2'>
		<swiper class='swiper' :current="currentTab" indicator-dots
                circular
			indicator-color='#dbe2e7' previous-margin='40rpx'
			next-margin='20rpx' @change='swiperCurrent'>
	<!-- #endif -->

	<!-- #ifndef MP-WEIXIN || MP-ALIPAY || MP-BAIDU -->
	<view id='account-wrap-2'>
		<swiper class='swiper' :current="currentTab" indicator-dots
                circular
				indicator-color='#dbe2e7' previous-margin='40upx'
				next-margin='20upx' @change='swiperCurrent'>
	<!-- #endif -->

			<swiper-item class="f_r_c" v-for="(item,index) in swiperList" :key="index">
				<view class='swiper-content' :style="[{backgroundImage: 'url(' + item.bg + ')'}]">
					<!--<image :src="item.bg" class="slide-image" mode="aspectFill" />-->
					<view class='swiper-content-top'>
						<view class='swiper-content-top-img' :class="item.className"></view>
						<view class='swiper-content-top-cont'>{{item.swiperTitle}}</view>
					</view>
					<view class='swiper-content-money'>{{item.swiperTopMC}}
						<view>{{item.swiperTopMCS}}</view>
					</view>
					<view class='swiper-content-bottom'>
						<view>{{item.swiperIps_1}}</view>
						<view>{{item.swiperIps_2}}</view>
					</view>
					<view @tap="returnDeposit" v-if="item.isShowBtn && taxiPaidTotal!=0"
						class='swiper-content-btn'>退押金</view>
				</view>
			</swiper-item>
		</swiper>

	<!-- #ifdef MP-ALIPAY -->
		<!-- 自定义swiper指示点 -->
		<view class="dots">
			<block v-for="(item,index) in swiperList" :key="index" >
				<view class="dot" :class="{'active':  index == currentTab}"></view>
			</block>
		</view>
	</view>
	<!-- #endif -->
	<!-- 顶部Swiper END -->

		<!--内容swiper-->
		<view class='tab-cont'>
			<swiper class="tab-content" circular :current="currentTab" @change="switchTab"
				style="height:100%;">
				<!--委托奖励金-->
				<swiper-item v-if="wxAppStatus != 2">
					<scroll-view scroll-y='true' class="scoll-h ticket-box">
						<block v-if="rewardMoney.length>0">
							<view class='ticket-li' v-for="(item,index) in rewardMoney"
								:key="index">
								<view class='tik-pic'>
									<image :src="item.bgImage" mode='widthFix'
										class='no-data-img'></image>
								</view>
								<view class='tik-cont'>
									<view class='tik-title'>{{item.title}}
										<text>{{item.totalFee}}</text>
									</view>
									<view class='tik-time'>{{item.createTime}}
										<text class="reward-btn reward-btn-blue reward-btn-active"
											v-if="item.rewardType == 1 || item.rewardType == 3"
											@tap="rewardBtn(item.vipqueueId,item.totalFee)">{{item.rewardTypeDesc}}
										</text>
										<text class="reward-btn reward-btn-blue"
											v-else-if="item.rewardType == 2">{{item.rewardTypeDesc}}
										</text>
										<text class="reward-btn reward-btn-gray"
											v-else-if="item.rewardType == 5">{{item.rewardTypeDesc}}
										</text>
										<text class="reward-btn reward-btn-error"
											v-else>{{item.rewardTypeDesc}}
										</text>
									</view>
								</view>
							</view>
						</block>

						<view class='no-wrap' v-if="noDataReward">
							<image src="https://zdzfapi.haofang.net/Public/wxApp/images/new_images/nodata_list_new.png"
								class='no-data-img'>
							</image>
							<view class='no-txt'>暂无数据记录...</view>
						</view>
					</scroll-view>
				</swiper-item>
				<!--/委托奖励金-->

				<!--打车押金-->
				<swiper-item>
					<scroll-view scroll-y="true" class="scoll-h ticket-box">
						<block v-if="taxiMoney.length>0">
							<view class='ticket-li' v-for="(item,index) in taxiMoney"
								:key="index">
								<view class='tik-pic'>
									<image :src="item.bgImage" mode='widthFix'
										class='no-data-img'></image>
								</view>
								<view class='tik-cont'>
									<view class='tik-title'>{{item.payDesc}}
										<text>{{item.totalFee}}</text>
									</view>
									<view class='tik-time'>{{item.createTime}}</view>
								</view>
							</view>
						</block>

						<view class='no-wrap' v-if="noDataCar">
							<image src="https://zdzfapi.haofang.net/Public/wxApp/images/new_images/nodata_list_new.png" class='no-data-img'></image>
							<view class='no-txt'>暂无数据记录...</view>
						</view>
					</scroll-view>
				</swiper-item>
				<!--/打车押金-->

				<!--优惠券-->
				<swiper-item style="background: #ffffff;" class='red-packet'>
					<scroll-view scroll-y="true" class="scoll-h" @scrolltolower="loadMore">
						<view class="coupan-li " :class="item.status != 1?'coupan-li-disabled':''"
							v-for="(item,index) in RedPacket" :key="index"
							@tap='couponDisplay(item.shareArchiveId,item.status,item.caseType,item.quanType,item.couponId,item.receiveCouponId)'>

              <view class="coupan-num">
                <view v-if="item.discountType == 1" class="num-text"><text>{{item.quanMoney}}</text>折</view>
                <view v-else class="num-text">￥<text>{{item.quanMoney}}</text></view>
                <!-- type=7 抢单优化的优惠券才有 -->
                <view class="num-desc" v-if="item.quanSubTitle">{{item.quanSubTitle}}</view>

							</view>

							<view class="coupan-info">
                <!-- 专属优惠券 -->
                <block v-if="item.quanType == 5">
                  <view class="title">专属经纪人：{{item.brokerName +' '+ item.deptName}}</view>
                  <view class="date" v-if="item.expireTime">{{item.expireTime}}</view>
                </block>

                <!-- 普通委托优惠券 -->
                <block v-else>
                  <view class="title">{{item.quanTitle}}</view>
                  <view class="desc" v-if="item.fromSource">{{item.fromSource}}</view>
                  <view class="desc" v-if="item.quanDesc">{{item.quanDesc}}</view>
                  <view class="date" v-if="item.expireTime">{{item.expireTime}}</view>
                </block>

                <!-- 金九银十 抽中的 购房/租房 补贴 quanType == 6  -->
                <!-- 专属优惠券 才有 "立即使用" item.quanType == 5-->
                <view class="act-btn" v-if="(item.quanType == 6 || item.quanType == 5) && item.status == 1" 
                @tap='couponDisplay(item.shareArchiveId,item.status,item.caseType,item.quanType,item.couponId,item.receiveCouponId)'>
                {{item.quanType == 5?"立即使用":"发布委托"}}</view>
							</view>

              <!-- 1-已过期，0已失效1未使用,2已使用 -->
              <view class="coupan-status">
                <image v-if="item.status == 0" class="coupan-status-image" src="https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/redPack_bg_disable.png"></image>
                <image v-if="item.status == 2" class="coupan-status-image" src="https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/redPack_bg_used.png"></image>
                <image v-if="item.status == -1" class="coupan-status-image" src="https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/redPack_bg_outdate.png"></image>
              </view>
							
						</view>

						<view class='no-wrap' v-if="noDataCou">
							<image src="https://zdzfapi.haofang.net/Public/wxApp/images/new_images/nodata_list_new.png" class='no-data-img'></image>
							<view class='no-txt'>暂无数据记录...</view>
						</view>
					</scroll-view>
				</swiper-item>
				<!--/优惠券-->
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		GetAcountList,
		GetRedPacket,
		GetPayPaidInit,
		GetRewardMoney,
		ReWardMoney
	} from "../../net/wallet/GetWalletInfo.js";
	import {
		UserInfoModel
	} from "../../model/UserInfoModel.js";
	import {GpsInfoModel} from "../../model/GpsInfoModel";
	export default {
		data() {
			return {
				isShowBtn: true,
				swiperList: [
				    {
						bg: 'http://cdn.haofang.net/static/uuminiapp/pageNewUi/wallet/myAccount_1.png',
						className: "swiper_icon_1",
						icon: 'http://cdn.haofang.net/static/uuminiapp/pageNewUi/wallet/swiper_icon_1.png',
						swiperTitle: '委托奖励金',
						swiperTopMC: 0,
						swiperTopMCS: '元',
						swiperIps_1: '委托奖励金可直接提现',
						swiperIps_2: '',
						isShowBtn: false
					},
					{
						bg: 'http://cdn.haofang.net/static/uuminiapp/pageNewUi/wallet/myAccount_1.png',
						className: "swiper_icon_3",
						icon: 'http://cdn.haofang.net/static/uuminiapp/pageNewUi/wallet/swiper_icon_3.png',
						swiperTitle: '专车看房押金',
						swiperTopMC: 0,
						swiperTopMCS: '元',
						swiperIps_1: '充值押金可享受免费专车看房服务',
						swiperIps_2: '可原路退回',
						isShowBtn: true
					},
					{
						bg: 'http://cdn.haofang.net/static/uuminiapp/pageNewUi/wallet/myAccount_3.png',
						className: "swiper_icon_4",
						icon: 'http://cdn.haofang.net/static/uuminiapp/pageNewUi/wallet/swiper_icon_4.png',
						swiperTitle: '有效优惠券',
						swiperTopMC: 0,
						swiperTopMCS: '张',
						swiperIps_1: '线上成交、优惠券、红包等可直接',
						swiperIps_2: '用于抵扣中介费',
						isShowBtn: false
					}
				], //顶部滑动背景图
				online: 'https://zdzfapi.haofang.net/Mini/App/',
				currentTab: 0, //swiper当前显示页
				pTitle: "",
				noDataPrice: false,
				taxiMoney: [], //打车押金
				taxiTitleTypeInfo: '', //打车押金描述
				taxiPaidTotal: 0, //打车押金总额
				RedPacket: [], //优惠券
				noDataCou: false, //优惠券无数据
				noDataCar: false,
				RedPacketTotal: 0, //优惠券总张数
				tickPageNums: 1, //优惠券页数
				tickPageTotal: "", //优惠券z总页数
				ajaxListTag: true, //
				collectTxt: '', //提示弹框内容
				collectToast: false, //提示弹框
				//有奖委托奖励金
				rewardMoney: [], //委托奖励金
				rewardMoneyTotal: 0, //委托奖励金总额
				rewardMoneyInfo: '', //委托奖励金描述
				noDataReward: false, //委托奖励金 无数据
				wxAppStatus: 1,
				userId: ""
				// wxAppStatus: getApp().private.wxAppStatus
			};
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad: function(options) {
			if (options.type != undefined) {
				let currenttab = Number(options.type);
				this.currentTab = currenttab
			}
			if (this.wxAppStatus == 2) {
				this.swiperList.shift()
			}
			this.RedPacketInit();
			this.getPayPaidInit(); //打车押金初始化
			this.getRewardMoneyInit(); //委托奖励金初始化
		},

    onShow() {
        new this.SetMetaInfo().initDefault();
    },

		methods: {
			/**
			 * 获取缓存中的用户ID
			 */
			getStorage() {
				if (!new UserInfoModel().getModel("me")) return false;

				let res = new UserInfoModel().getModel("me");
				if (res && res.userId) {
					this.userId = res.userId;
					return true
				}
					return false
			},
			/**
			 * 退押金
			 */
			returnDeposit: function() {
				uni.showToast({
					title: '请下载悠居客App进行押金退还',
					icon: 'none',
					duration: 2000
				})
			},
			/**
			 * 优惠券初始化
			 */
			RedPacketInit: function(blooean) {
				var that = this;
				var curPage = that.tickPageNums;
				if (blooean) {
					that.ajaxListTag = false
				}
				if (!that.getStorage()) {
					uni.showToast({
						title: "网络错误！",
						icon: 'none'
					})
					return
				}

				new GetRedPacket({
						youyouUserId: that.userId,
						pageNum: curPage
					}).send()
					.then((res) => {
						console.log('优惠券', res)
						var _arr = that.RedPacket;
						if (!!res.DATA) {
							var _data = res;
							if (_data.STATUS == 1) {
								// 设置轮播的值
								if (that.wxAppStatus != 2) {
									that.swiperList[2].swiperTopMC = _data.DATA.redNum ? _data.DATA.redNum : 0
								} else {
									that.swiperList[1].swiperTopMC = _data.DATA.redNum ? _data.DATA.redNum : 0
								}
								that.RedPacketTotal = _data.DATA.redNum ? _data.DATA.redNum : 0
								_arr = _arr.concat(_data.DATA.list);
								_arr = that.formateData(_arr);
								//当无优惠券数据的时候
								if (!_arr || _arr.length == 0) {
									that.noDataCou = true
								} else {
									//有优惠券数据的时候
									that.RedPacket = _arr,
										that.ajaxListTag = true
								}

							}
						} else {
							that.noDataCou = true
						}
					}).catch(err => {
						console.log("请求失败")
					});
			},
			/**
			 * 打车押金初始化
			 */
			getPayPaidInit: function() {
				var that = this;
				if (!that.getStorage()) {
					uni.showToast({
						title: "网络错误！",
						icon: 'none'
					})
					return
				}
				new GetPayPaidInit({
						youyouUserId: that.userId,
						pageNum: 1,
						type: 1
					}).send()
					.then((res) => {
						if (!!res.DATA) {
							var _data = res;
							if (_data.STATUS == 1) {
								// 设置轮播的值
								if (that.wxAppStatus != 2) {
									that.swiperList[1].swiperTopMC = _data.DATA.totalMoney
								} else {
									that.swiperList[0].swiperTopMC = _data.DATA.totalMoney
								}
								//设置打车押金总额
								that.taxiPaidTotal = _data.DATA.totalMoney
								if (!_data.DATA.typeInfo) {
									that.taxiTitleTypeInfo = '充值押金可享受免费专车看房服务，可原路退回'
								} else {
									that.taxiTitleTypeInfo = _data.DATA.typeInfo
								}
								var _listP = _data.DATA.list;
								//当无打车押金数据的时候
								if (!_listP || _listP.length == 0) {
									that.noDataCar = true
								} else {
									//有打车押金数据的时候
									that.taxiMoney = _listP
								}
							} else {
								that.noDataCar = true
							}
						}
					}).catch(err => {
						console.log("请求失败")
					});
      },
      
			/**
			 * 委托奖励金初始化
			 */
			getRewardMoneyInit: function() {
				var that = this;
				if (!that.getStorage()) {
					uni.showToast({
						title: "网络错误！",
						icon: 'none'
					})
					return
				}
				new GetRewardMoney({
						youyouUserId: that.userId,
						pageNum: 1,
						type: 2
					}).send()
					.then((res) => {
						// console.log('委托奖励金', res)
						if (!!res.DATA) {
							var _data = res;
							if (_data.STATUS == 1) {
								// 设置轮播的值
								if (that.wxAppStatus != 2) {
									that.swiperList[0].swiperTopMC = _data.DATA.totalMoney
								}
								//设置委托奖励金总额 及 委托奖励金描述
								that.rewardMoneyTotal = _data.DATA.totalMoney
								that.rewardMoneyInfo = _data.DATA.typeInfo || ''

								var _listP = _data.DATA.list;
								//当 委托奖励金 数据的时候
								if (!_listP || _listP.length == 0) {
									that.noDataReward = true
								} else {
									//有打车押金数据的时候
									that.rewardMoney = _listP
								}
							} else {
								that.noDataReward = true
							}
						}
					}).catch(err => {
						console.log("请求失败")
					})
			},

			/**
			 * 委托奖励金 提现
			 */
			rewardBtn: function(id, money) {
				var that = this;
				if (!that.getStorage()) {
					uni.showToast({
						title: "网络错误！",
						icon: 'none'
					});
					return
				}

				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				new ReWardMoney({
						youyouUserId: that.userId,
						getMoney: money,
						cityId: cityInfo.cityId || "",
						vipqueueId: id,
					}).send()
					.then((res) => {
						if (!!res.DATA) {
							var _data = res;
							if (_data.STATUS == 1) {
								//修改当前 的 奖励金状态为审核中
								uni.showToast({
									title: _data.INFO,
									icon: 'none'
								});
								that.getRewardMoneyInit(); //委托奖励金初始化
							} else {
								uni.showToast({
									title: _data.INFO,
									icon: 'none'
								});
							}
						}
					})
			},
			/**
			 * swiper切换变换nav
			 */
			switchTab: function(e) {
				const that = this;
				that.currentTab = e.detail.current
			},
			/**
			 * 根据顶部滑动块显示内容
			 */
			swiperCurrent(e) {
				const that = this;
				that.currentTab = e.detail.current
			},

			/*
			 *优惠券加载更多
			 */
			loadMore: function() {
				// console.log('in');
				if (this.ajaxListTag) {
					var _page = this.tickPageNums
					_page += 1;
					this.tickPageNums = _page
				}
				this.RedPacketInit(true);
			},
			/*
			 * 使用优惠券(目前只有专属委托优惠券能跳转使用)
			 */
			useCoupan: function(e) {
				let shareId = e.currentTarget.dataset.shareid;
				let status = e.currentTarget.dataset.status;
				let quanType = e.currentTarget.dataset.type;
				if (quanType == 5 && status == 1 && !!shareId) {
					//只有专属委托优惠券能跳转使用 , 并且要有效
					uni.navigateTo({
						url: '/pages/entrustBrokerCoupon/entrustBrokerCoupon?shareId=' + shareId + '&showCoupon=0'
					})
				}
			},
			/**
			 * 格式化数据
			 * @param  {[type]} data [description]
			 * @return {[type]}      [description]
			 */
			formateData: function(data) {
				if (!!data && data.length) {
					for (var i in data) {
						data[i].quanMoney = data[i].quanMoney.replace(",", '');
					}
				}
				return data;
			},
			/**
			 * 跳转到优惠券展示
			 * @param  {[type]} e [description]
			 * @return {[type]}   [description]
			 * 暂时先不跳，还没有开发优惠券功能
			 */
			couponDisplay: function(shareArchiveId, status, caseType, quanType, couponId, receiveId) {
				//如果是 专属委托优惠券
				// 				if (quanType == 5 && status == 1) {
				// 					uni.navigateTo({
				// 						url: '/pages/couponDisplay/couponDisplay?couponId=' + couponId + '&shareArchiveId=' + shareArchiveId +
				// 							'&receiveId=' + receiveId
				// 					})
				// 				} else if (quanType == 6) {
				// 					//如果是 购房补贴 则跳转进入发布委托
				// 					uni.navigateTo({
				// 						url: '/pages/entrust/entrust?caseType=' + caseType
				// 					})
				// 				}

			},

			// 橙色点击事件的次数
			// 			testClick() {
			// 				this.private.testClickNum++;
			// 				if (this.private.testClickNum < 20) return;
			//
			// 				this.private.testClickNum = 0;
			// 				// let status = getApp().private.wxAppStatus;
			// 				if (status == 2) {
			// 					this.testClickRequest(1);
			// 					return;
			// 				}
			//
			// 				if (this.currentTab == 3) {
			// 					this.currentTab = 0
			// 				}
			// 				this.testClickRequest(2);
			// 			},
			// 			testClickRequest(status) {
			// 				let that = this;
			// 				wx.request({
			// 					url: "https://zdzfapi.haofang.net/Mini/App/updateModuleStat",
			// 					// url: "",
			// 					data: {
			// 						status: status
			// 					},
			// 					method: "GET",
			// 					success: (res) => {
			// 						// stat == 1 正常显示， 其他的都隐藏
			// 						if (res && res.data && res.data.code == 200) {
			// 							getApp().private.wxAppStatus = status;
			// 							that.setData({
			// 								wxAppStatus: status
			// 							});
			// 						}
			// 					}
			// 				});
			// 			}
		}
	}
</script>

<style>
	/* 支付宝swiper自定义 */
	.swiper-wrap{
		width: 100%;
		position: relative;
	}
	.dots{
		position: absolute;
		right: 0;
		bottom: 12upx;
		left: 0;
		height: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	/*未选中时的小圆点样式 */
	.dot{
		margin-right: 8upx;
		width: 10upx;
		height: 10upx;
		border-radius: 50%;
		will-change: transform;
		background-color: #dbe2e7;
	}
	/*选中以后的小圆点样式  */
	.active{
		background-color: #101d36;
	}
	/* 支付宝swiper自定义 END*/

	image {
		width: 100%;
		display: block;
	}

	page {
		position: relative;
		width: 100%;
		height: 100%;
		background: #fff;
		font-family: "Helvetica Neue",
			Helvetica,
			Arial,
			"PingFang SC",
			"Hiragino Sans GB",
			"Heiti SC",
			"Microsoft YaHei",
			"WenQuanYi Micro Hei",
			sans-serif;
	}

	#account-wrap-1 {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	#account-wrap-2 {
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	/* 微信swiper 自定义 */
	/* #ifdef MP-WEIXIN */
	.swiper .wx-swiper-dots.wx-swiper-dots-horizontal {
		margin-bottom: 2rpx;
	}

	.swiper .wx-swiper-dot {
		width: 10rpx;
		display: inline-flex;
		height: 10rpx;
		justify-content: space-between;
	}

	.swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		opacity: 0.3;
		border-radius: 50%;
		will-change: transform;
	}

	.swiper .wx-swiper-dot-active::before {
		background: #101d36;
	}

	/* #endif */
	/* swiper END*/

	.swiper {
		height: 420upx;
		margin-top: 40upx;
	}

	.swiper-content {
		position: relative;
        height: 370upx;
        width: 670upx;
        border-radius: 20upx;
        overflow: hidden;
        will-change: transform;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
	}

	.swiper-content-top {
		position: absolute;
		left: 50upx;
		top: 38upx;
		display: flex;
		align-items: center;
        z-index: 55;
	}

	.swiper-content-top-img {
		width: 42upx;
		height: 42upx;
		margin-right: 12upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/wallet_sprites.png)  no-repeat;
		background-size:148px 30px;
	}
	.swiper_icon_2{height:22px;width:22px;background-position:0 0;}
	.swiper_icon_3{height:22px;width:22px;background-position:-22px 0;}
	.swiper_icon_4{height:22px;width:22px;background-position:-44px 0;}
	.swiper_icon_1{height:22px;width:22px;background-position:-66px 0;}

	.swiper-content-top-cont {
		font-size: 32upx;
		color: #fff;
		line-height: 33px;
	}

	.swiper-content-money {
		position: absolute;
		left: 50upx;
		top: 155upx;
		font-size: 90upx;
		color: #fff;
		line-height: 33px;
        z-index: 55;
	}

	.swiper-content-money>view {
		font-size: 30upx;
		display: inline-block;
	}

	.swiper-content-bottom {
		position: absolute;
		bottom: 74upx;
		left: 50upx;
		font-size: 26upx;
		color: #fff;
		opacity: 0.5;
		margin-top: 30upx;
        z-index: 55;
	}

	.swiper-content-btn {
		position: absolute;
		top: 146upx;
		right: 50upx;
		font-size: 30upx;
		color: #fff;
		border-radius: 32upx;
		will-change: transform;
		border: solid 2upx #fff;
		line-height: 64upx;
		width: 150upx;
		height: 64upx;
		text-align: center;
        z-index: 55;
	}

	.slide-image {
		height: 370upx;
		width: 670upx;
		border-radius: 20upx;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
		will-change: transform;
	}

	.content {
		display: flex;
		flex-direction: row;
		height: 150upx;
		border-bottom: solid 1upx #ececec;
		margin: 0 40upx;
		align-items: center;
	}

	.content-images {
		height: 50upx;
		width: 50upx;
		margin-right: 27upx;
		margin-left: 13upx;
	}

	.content-img {
		height: 50upx;
		width: 50upx;
	}

	.content-detail {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.content-detail-title {
		font-size: 32upx;
		margin-bottom: 12upx;
		color: #101d36;
	}

	.content-detail-time {
		font-size: 24upx;
		color: #7a8190;
	}

	.content-money {
		font-size: 36upx;
		color: #101d36;
	}

	.content-btn {
		font-size: 28upx;
		color: #ab7f2e;
		padding: 10upx 27upx;
		border: solid 1px #ab7f2e;
		border-radius: 24px;
		will-change: transform;
		margin-left: 27upx;
	}

	.content-btning {
		font-size: 28upx;
		color: #69abfe;
		margin-left: 40upx;
		margin-right: 16upx;
	}

	.tab-cont {
		flex: 1;
	}

	.scoll-h {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.no-wrap {
		width: 100%;
		position: relative;
		top: 200upx;
	}

	.no-data-img {
		margin: 0 auto;
		width: 283upx;
		height: 287upx;
	}

	.no-txt {
		width: 100%;
		text-align: center;
		font-size: 32upx;
		color: #999;
	}

	.ticket-box {
		padding-left: 40upx;
		box-sizing: border-box;
	}

	.ticket-li {
		display: -webkit-flex;
		width: 100%;
		padding: 20upx 0;
		border-bottom: 1px solid #eee;
	}

	.tik-pic {
		width: 72upx;
		height: 72upx;
		margin-right: 20upx;
		overflow: hidden;
	}

	.tik-pic image {
		width: 100%;
	}

	.tik-cont {
		flex: 1;
	}

	.tik-title {
		width: 100%;
		font-size: 32upx;
		margin-bottom: 10upx;
	}

	.tik-title text {
		float: right;
		margin-right: 40upx;
	}

	.tik-time {
		font-size: 24upx;
		color: #999;
	}

	.reward-btn {
		float: right;
		font-size: 26upx;
		margin-right: 20upx;
	}

	.reward-btn-blue {
		color: #4daaf0;
	}

	.reward-btn-gray {
		color: #ccc;
	}

	.reward-btn-error {
		color: #ab7f2e;
	}

	.reward-btn-active::after {
		content: '';
		display: inline-block;
		width: 14upx;
		height: 24upx;
		vertical-align: -2upx;
		margin-left: 8upx;
		background: url(https://zdzfapi.haofang.net/Public/wxApp/images/registration/arrow_right.png) center no-repeat;
		background-size: 100% 100%;
	}

	/*优惠券*/

	.coupon-box-has {
		width: 681upx;
		height: 259upx;
		margin: 0 auto;
		color: #999;
		margin-bottom: 20upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/myAccount/yhj_gq.png) no-repeat center;
		background-size: 100%;
	}

	.coupon-box {
		width: 681upx;
		height: 259upx;
		margin: 0 auto;
		color: #999;
		margin-bottom: 20upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/myAccount/yhj_lv.png) no-repeat center;
		background-size: 100%;
	}

	.cou-title {
		padding: 20upx 20upx;
		width: 100%;
		font-size: 32upx;
		box-sizing: border-box;
	}

	.no-use {
		color: #00ca85 !important;
	}

	.cou-title text {
		float: right;
	}

	.from-box {
		width: 100%;
		padding: 0 20upx;
		font-size: 28upx;
		box-sizing: border-box;
		margin-bottom: 40upx;
	}

	.from-box text {
		float: right;
		font-size: 32upx;
	}

	.cou-msg {
		width: 100%;
		padding: 0 20upx;
		box-sizing: border-box;
		font-size: 24upx;
		word-wrap: normal;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.red-packet {
		padding-top: 30upx;
		background: #f6f6f6;
		box-sizing: border-box;
	}

	/** 优惠券:新版样式 **/
.coupan-li {
  position: relative;
  width: 685upx;
  height: 218upx;
  margin: 0 auto;
  display: -webkit-box;
  -webkit-box-align: center;
  background: url(https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/redPack_bg.png) center center no-repeat;
  background-size: 100% 100%;
  margin-bottom: 20upx;
  padding-left: 8upx;
}

.coupan-li.coupan-li-disabled {
  background: url(https://cdn.haofang.net/static/storeWxApp/uu_platform/entrustAdjust/redPack_bg_end.png) center center no-repeat;
  background-size: 100% 100%;
}

.coupan-li .coupan-info {
  -webkit-box-flex: 1;
  line-height: 1;
  padding: 0 30upx;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  text-overflow: ellipsis;
  height: 100%;
  padding-top: 50upx;

}

.coupan-li .coupan-info .title {
  font-size: 28upx;
  color: #7a8190;
}

.coupan-li .coupan-info .desc {
  font-size: 24upx;
  color: #a0a4ad;
  white-space: normal;
  line-height: 30upx;
  margin-top: 20upx;
}

.coupan-li .coupan-info .date {
  font-size: 24upx;
  color: #bbb;
  margin-top: 17upx;
}

.coupan-li .coupan-info .act-btn {
  position: absolute;
  right: 36upx;
  bottom: 28upx;
  width: 150upx;
  height: 54upx;
  line-height: 54upx;
  text-align: center;
  background-color: #fe4e4a;
  border-radius: 27upx;
  font-size: 26upx;
  color: #ffffff;
  z-index: 2;
}

.coupan-li .coupan-num {
  width: 230upx;
  color: #fe4e4a;
  text-align: center;
  line-height: 1;
}

.coupan-li .coupan-num .num-text {
  font-size: 36upx;
}

.coupan-li .coupan-num .num-text text {
  font-weight: bold;
  font-size: 60upx;
  margin-left: 0upx;
}

.coupan-li .coupan-num .num-desc {
  font-size: 26upx;
  margin-top: 20upx;
  letter-spacing: 1upx;
  color: #000;
}

.coupan-li-disabled .coupan-num .num-text,
.coupan-li-disabled .coupan-num .num-desc,
.coupan-li-disabled .coupan-num {
  color: #a7aab2;
}

.coupan-li-disabled .coupan-info .date,
.coupan-li-disabled .coupan-info .desc {
  color: #d0d0d0;
}

.coupan-li .coupan-status {
  width: 130upx;
  height: 113upx;
  position: absolute;
  right: 10upx;
  bottom: 10upx;
}

.coupan-li .coupan-status image {
  display: block;
  width: 100%;
  height: 100%;
}

/** 优惠券:新版样式 :end **/
</style>
