<template>
	<view>
		<view class="want_trust_view"
			  :class="isShowDelBtn && currentDelItem.trustId == item.trustId ? 'want_go_left' : ''"
			  @touchstart="touchStart($event)"
			  @touchend="touchEnd($event)">
			<!-- 委托介绍 -->
			<view class="f_r_s want_buy_lease_view">
				<!-- tag -->
				<view class="want_buy_lease_tag f_c_c">{{ item.caseType == 1 ? '出售' : '出租' }}</view>

				<!-- 委托内容 -->
				<view class="want_buy_lease_cont">
					<view class="f_c_s want_buy_lease_positionInfo">
						<block v-if="item.isVip != 1">
							<block v-if="item.positionInfo">{{ item.positionInfo }}</block>
							<block v-else>我的{{item.caseType == 1? "卖房" : "出租" }}委托</block>
						</block>

						<block v-if="item.isVip == 1">
							<view v-if="item.positionInfo" style="margin-bottom: 6px;">{{ item.positionInfo }}</view>
							<view>我的专属委托</view>
						</block>
					</view>

					<view class="want_buy_lease_push" v-if="item.isVip != 1">发布于{{ item.pushContent }}</view>
				</view>
			</view>

			<!-- 房源介绍 -->
			<view class="sale_lease_houseInfo f_r_s" >
				<!-- 有奖委托 -->
				<view v-if="item.trustStatus == 1 || item.trustStatus == 2"
					  :class="!item.houseImg ? 'sale_lease_jiang_bg' : ''"
					  @click="saleLeaseAddHouseImg"
					  class="sale_lease_house_img_view">
					<image :src="item.houseImg" mode="aspectFill"></image>

					<view class="sale_lease_jiang_icon" v-if="item.rewardType == 1"></view>
				</view>

				<!-- 取消委托 -->
				<view class="sale_lease_house_img_view sale_lease_house_img_cancel"
					  v-if="item.trustStatus == 0">
					<image :src="item.houseImg" mode='aspectFill'></image>

					<view class="sale_lease_jiang_icon" v-if="item.rewardType == 1"></view>
				</view>

				<!-- 房源信息 -->
				<view @click="lookSaleLeaseHouseDetail" class="sale_lease_house_des f_c_b">
					<view class="main_color sale_lease_house_price"
						  v-if="item.totalPrice">{{ item.totalPrice }}{{ item.priceUnit }}</view>
					<view class="gray_color" v-if="!item.totalPrice">价格面议</view>

					<view class="f_r_s sale_lease_des_text">
						<view style="margin-right: 4px;">{{ item.usageName }}</view>

						<view style="margin-right: 4px;" v-if="item.room">{{ item.room }}室</view>
					</view>

					<!-- 专属委托 -->
					<view class="f_r_s sale_lease_bottom_info">
						<view class="sale_lease_bottom_browse">面积: {{ item.houseArea }}㎡</view>

						<view v-if="item.hhouseFloors && item.hhouseFloors"
							  class="sale_lease_bottom_browse">楼层: {{ item.hhouseFloors }}/{{ item.hhouseFloors }}</view>
					</view>
				</view>
			</view>

			<!-- 完善图片提示 -->
			<view class="g-property-addImg" v-if="!item.houseImg && item.trustStatus == 1">
				完善图片信息，有助高效沟通，避免打扰！
			</view>

			<!-- 委托icon -->
			<view :class="item.trustStatus == 2 ? 'want_success_icon_trust' : ''" class="want_success_fail_com"></view>
			<view :class="item.trustStatus == 0 ? 'want_fail_icon_trust' : ''" class="want_success_fail_com"></view>

			<!-- 取消/再次委托按钮 -->
			<view class="want_cancle_trust_btn" @click.stop="cancelAgainTrust" v-if="item.trustStatus == 1"></view>

			<!-- 抢单状态 -->
			<view class="sale_lease_trusting_con_lianmai f_r_s" v-if="item.trustStatus != 0">
				<view v-if="item.unionHouseInfoVO.auditStatus == 0 && item.unionHouseInfoVO.contactNum < 1">我们已收到您的{{item.caseType==1 ? '出售' : '出租'}}委托，客服人员会尽快联系您确认委托信息，请耐心等待！</view>
				<view v-if="item.unionHouseInfoVO.auditStatus == 2 && item.unionHouseInfoVO.contactNum < 1">委托房源正在推送中，全城经纪人为你服务！</view>
				<view v-if="item.unionHouseInfoVO.contactNum > 0 && item.unionHouseInfoVO.auditStatus!=3 && item.unionHouseInfoVO.auditStatus!=1">已有经纪人查看委托房源，请保持电话通畅，房源成交或改变意愿，您可自主下架房源避免其他经纪人打扰</view>
			</view>

			<!--删除-->
			<view class="want_deal_btn" @click="wantDelTrust">删除</view>
		</view>

		<!-- 取消委托弹窗 -->
		<view class="want_cancel_entrust_tc" @click="closeCancelEntrustTc"
			  @touchmove.stop.prevent="moveHandle"
			  v-if="isShowCancelEntrustTc">
			<view class="want_cancel_entrust_cont" @click.stop="stopCloseCancelEntrustTc">
				<view class="want_cancel_entrust_title">
					<view>取消委托原因</view>
					<view @click.stop="closeCancelEntrustTc" class="want_cancel_entrust_close"></view>
				</view>

				<view class="want_cancel_reason_cont">
					<view class="want_cancel_reason_list f_r_s">
						<view @click.stop="wantChooseCancelReason(info, index)"
							  v-for="(info, index) in cancelEntrustList[item.caseType]"
							  :class="info.selected ? 'want_cancel_reason_item_active' : ''"
							  :key="index"
							  class="want_cancel_reason_item">{{ info.text }}</view>
					</view>
				</view>

				<view class="want_cancel_text_view">
					<textarea class="want_cancel_text_area" maxlength="100" placeholder="其他原因..."
							  @input="wantCancelEntrustTextArea"
							  placeholder-class="want_cancel_text_pla"></textarea>

					<view class="want_cancel_text_num">{{ textareaVal.length }}/100字</view>
				</view>

				<view class="want_cancel_empty"></view>

				<view @click="wantConfirmCancelEntrust(item)" class="want_cancel_confirm global-font-color">确认取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { DeleteEntrust } from "../../../net/entrust/DeleteEntrust.js";
	import { UpdateHouseRedFlag } from "../../../net/entrust/UpdateHouseRedFlag.js";
	import { CancelEntrust } from "../../../net/entrust/CancelEntrust.js";
	import { UserInfoModel } from "../../../model/UserInfoModel.js";
	import { AgainPushEntrust } from "../../../net/entrust/AgainPushEntrust.js";
	import { GpsInfoModel } from "../../../model/GpsInfoModel.js";
	import { Config } from "../../../utils/config.js";
	import { UpDateVipSaleInfo } from "../../../net/entrust/UpDateVipSaleInfo.js";
	import { UpDateVipLeaseInfo } from "../../../net/entrust/UpDateVipLeaseInfo.js";
	import {UploadFile} from "../../../utils/common";

	class TouchMove {
		static startClientX = 0;
		static startClientY = 0;
		static endClientX = 0;
		static endClientY = 0;
		static page = null;  // vue 的作用域
		static index = 0;  // 当前的index

		static init() {
			let yCha = Math.abs(this.endClientY - this.startClientY);
			let xCha = Math.abs(this.endClientX - this.startClientX);
			if(yCha >= xCha) {
				this.hide();
				return;
			}

			if(xCha <= 40) return;

			this.page.isShowCancelEntrustTc = false;
			if(this.endClientX - this.startClientX < 0) {
				this.page.$emit("onMoveDelChange", this.page.item);
				this.show();
				return;
			}

			if(this.endClientX - this.startClientX > 0) {
				this.hide();
			}
		}

		static hide(i = this.index) {
			this.page.isShowDelBtn = false;
		}

		static show() {
			this.page.isShowDelBtn = true;
		}
	}

	export default {
		props: {
			item: {
				type: Object,
				default: {}
			},

			currentDelItem: {
				type: Object,
				default: {}
			},

			index: {
				type: Number || String,
				default: 0
			}
		},

		data() {
			return {
				isShowDelBtn: false,
				cancelEntrustList: {
					1:[
						{text: "暂不出售/租", selected: false},
						{text: "房源信息登记错误", selected: false},
						{text: "无合适经纪人", selected: false},
						{text: "长未出售/租", selected: false}
					],
					2:[
						{text: "暂不出售/租", selected: false},
						{text: "房源信息登记错误", selected: false},
						{text: "无合适经纪人", selected: false},
						{text: "长未出售/租", selected: false}
					],
					3:[
						{text: "暂无购/租房需求", selected: false},
						{text: "需求信息登记错误", selected: false},
						{text: "无合适经纪人", selected: false},
						{text: "长期未找到合适房源", selected: false}
					],
					4:[
						{text: "暂无购/租房需求", selected: false},
						{text: "需求信息登记错误", selected: false},
						{text: "无合适经纪人", selected: false},
						{text: "长期未找到合适房源", selected: false}
					]
				},
				textareaVal: "",
				isShowCancelEntrustTc: false,
				showAllEntrustUsers: false,  // 展示所有经纪人 大于5才有这个展开收起
			}
		},

		methods: {
			moveHandle() {},

			// 查看房源详情
			lookSaleLeaseHouseDetail() {
				if(this.item.trustStatus == 0) return;

				uni.navigateTo({
					url: "/pagesHouse/entrustHouseDetail/entrustHouseDetail?caseType=" + this.item.caseType
						+ "&resource=4" + "&houseName=" + this.item.buildName
						+ "&cityId=" + this.item.cityId + "&caseId=" + this.item.vipCaseId
						+ "&pageFrom=entrust" + "&toSend=" + this.item.toSend
						+ "&brokerArchiveId=" + (this.item.propertyUserVO
									? this.item.propertyUserVO.brokerArchiveId || "" : "")
				});
			},

			// 取消/再次推送 弹窗显示事件
			cancelAgainTrust() {
				let that = this;
				let itemList = ["编辑信息", "取消委托"];
				uni.showActionSheet({
					itemList: itemList,
					success: function (res) {
						if(itemList[res.tapIndex].indexOf("取消") >= 0) {
							that.cancelEntrust();
							return;
						}

						if(itemList[res.tapIndex].indexOf("编辑信息") >= 0) {
							that.editEntrustInfo();
						}
					}
				});
			},

			stopCloseCancelEntrustTc(){},

			// 取消委托
			cancelEntrust() {
				this.$emit("onStopScrollChange", true);
				this.isShowCancelEntrustTc = true;
			},

			// 编辑信息
			editEntrustInfo() {
				// fromStatus = 1 代表编辑
				let archiveId = this.item.entrustUsers && this.item.entrustUsers.length > 0
					? this.item.entrustUsers[0].archiveId || "" : "";
				let pushLogId = this.item.entrustUsers && this.item.entrustUsers.length > 0
					? this.item.entrustUsers[0].pushLogId || "" : "";
				uni.navigateTo({
					url: "/pagesEntrust/editLianMaiEntrust/editLianMaiEntrust?fromStatus=1"
						+ "&caseType=" + this.item.caseType + "&vipCaseId=" + this.item.vipCaseId
						+ "&archiveId=" + archiveId + "&pushLogId=" + pushLogId
						+ "&cityId=" + this.item.cityId + "&isHezu=" + this.item.isHezu
						+ "&isEdit=1"
				});
			},

			// 确定取消委托
			wantConfirmCancelEntrust(item) {
				let me = new UserInfoModel().getModel("me") || {};
				let reasonList = this.cancelEntrustList[this.item.caseType] || [];
				// 原因传对应的index
				let reasonIndexArr = [];
				for(let i = 0;i<reasonList.length;i++) {
					if(reasonList[i].selected) {
						reasonIndexArr.push(i);
					}
				}
				if(reasonIndexArr.length == 0 && !this.textareaVal) {
					uni.showToast({
						title: "请选填原因!",
						image: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/warning.png',
					});
					return;
				}

				if(!me.userId) {
					uni.showToast({
						title: "暂未找到当前用户userId",
						image: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/warning.png',
					});
					return;
				}

				uni.showLoading({
					title: "取消中..."
				});
				new CancelEntrust({
					cityId: this.item.cityId,
					caseId: this.item.vipCaseId,
					caseType: this.item.caseType,
					wxId: me.userId,
					reasonTag: reasonIndexArr.join(","),
					reason: this.textareaVal,
					isVip: this.item.isVip,
					isHezu: this.item.isHezu ? this.item.isHezu : 0
				}).send()
					.then(res => {
						uni.hideLoading();
						if(res.STATUS != 1) {
							uni.showToast({
								title: res.INFO || "取消失败",
								image: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/warning.png'
							});
							return;
						}

						uni.showToast({
							title: "取消成功",
							icon: 'success'
						});
						this.isShowCancelEntrustTc = false;
						this.$emit("onRefreshChanged", this.index);
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: "取消失败",
							image: '/static/images/common/warning.png'
						});
					})
			},

			// 关闭取消委托弹窗
			closeCancelEntrustTc() {
				this.$emit("onStopScrollChange", false);
				this.isShowCancelEntrustTc = false;
			},

			// 委托原因输入
			wantCancelEntrustTextArea(e) {
				this.textareaVal = e && e.detail ? e.detail.value || "" : "";
			},

			// 选择委托原因
			wantChooseCancelReason(info, index) {
				info.selected = !info.selected;
				this.cancelEntrustList[this.item.caseType][index] = info;
			},

			touchStart(e) {
				let changedTouches = e.changedTouches || e.mp.changedTouches || [];
				if(!e || !changedTouches[0]) return;

				TouchMove.startClientX = changedTouches[0].clientX || 0;
				TouchMove.startClientY = changedTouches[0].clientY || 0;
			},

			touchEnd(e) {
			    let changedTouches = e.changedTouches || e.mp.changedTouches || [];
				if(this.item.trustStatus == 1 || this.item.trustStatus == 2) return;

				TouchMove.endClientX = changedTouches[0].clientX || 0;
				TouchMove.endClientY = changedTouches[0].clientY || 0;
				TouchMove.page = this;
				TouchMove.init();
			},

			// 删除委托
			wantDelTrust() {
				if(!this.item.trustId) {
					uni.showToast({
						title: "暂无委托id, 无法删除。",
						icon: "none"
					});
					return;
				}

				uni.showLoading({
					title: "删除中..."
				});
				new DeleteEntrust({vipQueueId: this.item.trustId}).send()
					.then(res => {
						uni.hideLoading();
						if(res.STATUS != 1) {
							uni.showToast({
								title: res.INFO || "删除失败, 请稍后重试。",
								image: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/warning.png',
								duration: 1500
							});
							return;
						}

						uni.showToast({
							title: res.INFO || "删除失败, 请稍后重试。",
							image: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/warning.png',
							duration: 1500
						});
						this.$emit("onDelChange", this.index);
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: "删除失败, 请稍后重试。",
							icon: "none"
						});
					});
			},

			// 查看委托详情
			lookEntrustDetail(item) {
				// 经纪人已拒绝不能进入详情页
				if(item.pushStatus == 0) {
					return;
				}

				if(item.caseType == 1 || item.caseType == 2) return;

				if(item.pushLogId) {
					new UpdateHouseRedFlag({pushLogId: item.pushLogId}).send();
				}
				uni.navigateTo({
					url: "/pagesEntrust/prizeTrustDetail/prizeTrustDetail?entrustId=" + item.pushLogId
				});
			},

			// 添加图片
			saleLeaseAddHouseImg() {
				if(this.item.houseImg) return;

				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				let cityId = cityInfo.cityId || "";
				let that = this
				let obj = {
					vipCaseId: this.item.vipCaseId,
					caseType: this.item.caseType,
					cityId: cityId,
					dataCityId: this.item.cityId,
					fileAddrs: '',
				}

				let imgs = []
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						// 图片上传成功返回路径
						let tempFilePaths = res.tempFilePaths;
						for (let i = 0; i < tempFilePaths.length; i++) {
							(function(j) {
								new UploadFile(tempFilePaths[j]).send().then(json => {
									if (json.STATUS !== 1) {
										uni.showToast({
											title: json.INFO,
											icon: 'none',
											duration: 2000,
										});
										return;
									}

									imgs.push(json.data[0].fullUrl);
									obj.fileAddrs += json.data[0].saveName+','
								});
							})(i);
						}
						setTimeout(function(){
						  obj.fileAddrs = obj.fileAddrs.substr(0, obj.fileAddrs.length - 1);
						  if(that.item.caseType == 1) {
							  new UpDateVipSaleInfo(obj).send()
								.then(info => {
									if (info.STATUS != 1){
										uni.showToast({
										  title: info.INFO || "编辑失败",
										  icon: 'none'
										})
										return;
									}

									that.$emit("onRefreshChanged", that.index);
								});
								return;
						  }

						  new UpDateVipLeaseInfo(obj).send()
							.then(info => {
								if (info.STATUS != 1){
									uni.showToast({
									  title: info.INFO || "编辑失败",
									  icon: 'none'
									})
									return;
								}

								that.$emit("onRefreshChanged", that.index);
							});
						},1000);
					}
				})
			},

			// 切换是否显示所有经纪人
			changeShowMoreAgent() {
				this.showAllEntrustUsers = !this.showAllEntrustUsers;
			}
		},
	}
</script>

<style scoped>
	.want_go_left{
		transform: translateX(-141upx);
	}
	.want_trust_view{
		position: relative;
		padding:20upx;
		background: #FFFFFF;
		position: relative;
		margin-bottom: 20upx;
		border-radius: 10upx;
		will-change: transform;
		box-sizing: border-box;
		transition:0.5s;
	}
	.want_buy_lease_view{
		width: 100%;
	}
	.want_buy_lease_tag{
		font-size:26upx;
		color:#4daaf0;
		border:1px solid #4daaf0;
		height: 40upx;
		line-height: 40upx;
		padding:0 14upx;
		border-radius:4upx;
		will-change: transform;
		flex-shrink: 0;
		box-sizing: border-box;
	}
	.want_buy_lease_cont{
		padding-left:20upx;
		width:100%;
		box-sizing: border-box;
	}
	.want_buy_lease_positionInfo{
		font-size:34upx;
		color:#333;
		margin-bottom:20upx;
		padding-right:60upx;
	}
	.want_buy_lease_des{
		position:relative;
		font-size:24upx;
		color:#cdcdcd;
		width:100%;
		padding-bottom:20upx;
	}
	.want_buy_lease_des>view{
		margin-right: 8upx;
	}
	.want_buy_lease_des>view:last-child{
		margin-right: 0;
	}
	.want_buy_lease_push{
		padding-right:32upx;
		font-size:24upx;
		color:#cdcdcd;
		padding-bottom:10upx;
		box-sizing: border-box;
	}
	.want_success_fail_com{
		position: absolute;
		top: 0;
		right: 0;
		background-size: 100% 100%;
		background-position: center center;
		background-repeat: no-repeat;
	}
	.want_success_icon_trust{
		width: 170upx;
		height: 112upx;
		background-image: url('http://cdn.haofang.net/static/uuminiapp/personalCenter/enstrust-chengjiao.png');
	}
	.want_fail_icon_trust{
		width: 170upx;
		height: 112upx;
		background-image: url('http://cdn.haofang.net/static/uuminiapp/personalCenter/enstrust-quxiao.png');
	}
	.want_cancle_trust_btn{
		width:55upx;
		height:55upx;
		background:url('http://cdn.haofang.net/static/uuminiapp/personalCenter/more-btn-bg.png') center center no-repeat;
		background-size:100% 100%;
		position:absolute;
		top:10upx;
		right:10upx;
	}

	/* 房源信息 */
	.sale_lease_houseInfo{
		padding-top: 20upx;
		box-sizing: border-box;
	}
	.sale_lease_house_img_view{
		width: 200upx;
		height: 150upx;
		position: relative;
		flex-shrink: 0;
	}
	.sale_lease_jiang_bg{
		background:url(http://cdn.haofang.net/static/uuminiapp/property/detail_add_img.png) no-repeat center center;
		background-size:100% 100%;
	}
	.sale_lease_house_img_view>image{
		width: 100%;
		height: 100%;
	}
	.sale_lease_jiang_icon{
		width:108upx;
		height: 47upx;
		background: url('http://cdn.haofang.net/static/uuminiapp/personalCenter/youjiang-icon.png') center center no-repeat;
		background-size: 100% 100%;
		position: absolute;
		left:-8upx;
		top:-20upx;
	}
	.sale_lease_house_des{
		padding-left: 26upx;
		box-sizing: border-box;
		width: 100%;
		position: relative;
	}
	.sale_lease_house_price{
		font-size:40upx;
	}
	.sale_lease_des_text{
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		font-size:28upx;
		color:#999;
		margin-top: 6upx;
	}
	.sale_lease_bottom_info{
		font-size: 28upx;
		color: #999;
		width: 100%;
	}
	.sale_lease_bottom_browse{
		font-size:24upx;
	}
	.sale_lease_consultationNum{
		color:#4DAAF0;
		font-size:26upx;
		padding-right: 20upx;
		box-sizing: border-box;
	}
	.sale_lease_consultationNum_arrow{
		line-height: 26upx;
		color: #4DAAF0;
		font-size: 26upx;
		font-family: '宋体';
		margin: auto 0 auto 10upx;
	}
	.sale_lease_house_img_cancel{
		background:url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png) #f5f5f5 no-repeat 0 0;
		background-size: 100% 100%;
	}
	.reward-differPerson-box{
		position: absolute;
		width: 230upx;
		height: 60upx;
		top: 0;
		right: 0;
		font-size: 24upx;
		color: #666666;
	}
	.g-property-addImg{
		color: #7388a9;
		font-size: 24upx;
		margin: 20upx auto 0 auto;
	}
	.zizu-no-contact-tips{
		line-height: 35upx;
		color: #999999;
		font-size: 28upx;
		text-align: left;
		padding-top: 20upx;
		border-top: 2upx solid #E6E6E6;
		margin-top: 20upx;
	}
	.sale_lease_trusting_con_lianmai{
		box-sizing: border-box;
		margin-top: 30upx;
		color:#c6c6c6;
		font-size:28upx;
		width:100%;
	}
	.trusting-txt-h{
		color:#c6c6c6;
		font-size:28upx;
		width:100%;
		overflow:hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
	}
	.trusting-txt{
		color: #c6c6c6;
		font-size: 28upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.agent-val-time{
		font-size:24upx;
		color:#666666;
		float:right;
		margin: auto 0;
		padding-left: 10upx;
		box-sizing: border-box;
		text-align: left;
		max-width: 60%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.reward-val-person{
		width: 138upx;
		height: 33upx;
		background: url(https://zdzfapi.haofang.net/Public/wxApp/images/registration/true_broker_icon.png) center center no-repeat;
		background-size: 100% 100%;
		margin: auto 0 auto 10upx;
	}


	/* 抢单中 */
	.want_trusting_con{
		background: #FAFAFA;
		margin: 0 20upx;
		padding: 20upx;
		box-sizing: border-box;
	}
	.want_trusting_icon{
		width: 98upx;
		height: 98upx;
		background: url('http://cdn.haofang.net/static/uuminiapp/new_images/qianging.png?t=20180427') center center no-repeat;
		background-size: 100% 100%;
		margin-right: 20upx;
	}
	.upx{
		color: #c6c6c6;
		font-size: 28upx;
	}

	/* 经纪人列表 */
	.sale_lease_trust_agent_list{
		will-change: transform;
		border-radius:4px;
		position:relative;
		margin-top: 20upx;
	}
	.want_trust_agent_item{
		background:#f1f1f1;
		display:-webkit-box;
		-webkit-box-align:start;
		-webkit-box-pack:start;
		padding:20upx 0 20upx 20upx;
		position:relative;
	}
	.want_trust_agent_img{
		width:110upx;
		height:110upx;
		overflow:hidden;
		border-radius:50%;
		will-change: transform;
		position:relative;
	}
	.want_trust_agent_img>image{
		width:100%;
		height:100%;
	}
	.want_trust_agent_cont{
		-webkit-box-flex:1;
		margin-left:10upx;
		border-bottom:1px solid #ededed;
		padding-left:20upx;
		box-sizing: border-box;
	}
	.want_trust_agent_title{
		font-size:28upx;
		margin-bottom:10upx;
		position:relative;
	}
	.want_trust_agent_name{
		font-weight:normal;
		font-size:32upx;
		margin-right:20upx;
	}
	.want_trust_agent_yongJin_text{
		font-weight:normal;
		font-size:28upx;
		color:#999;
	}
	.want_trust_agent_yongJin_val{
		font-size:36upx;
		color:#ff5d2f;
		margin-left:5upx;
	}
	.want_trust_agent_yongJin_unit{
		font-size:28upx;
		color:#ff5d2f;
	}
	.want_trust_agent_star_view{
		margin: auto 0;
	}
	.want_trust_agent_star_view>image{
		width: 20upx;
		height: 20upx;
		margin: auto 8upx auto 0;
		flex-shrink: 0;
	}
	.want_trust_agent_star_view>image:last-child{
		margin-right: 0;
	}
	.want_trust_agent_star_num{
		border-radius:4upx;
		will-change: transform;
		color:#fff;
		background:#FDAD00;
		background-size:100%;
		font-size:20upx;
		padding:4upx 6upx 3upx;
	}
	.want_trust_agent_img_view{
		position: relative;
	}
	.want_trust_agent_red_point{
		width:16upx;
		height:16upx;
		background:url('http://cdn.haofang.net/static/uuminiapp/personalCenter/hongdian.png') center center no-repeat;
		background-size:100% 100%;
		position:absolute;
		top:-5upx;
		right:-5upx;
	}
	.want_trust_agent_node_text{
		color: #7185a0;
		font-size:30upx;
		padding-top:20upx;
	}
	.want_trust_agent_pushLogTime{
		font-size:26upx;
		color:#777;
		margin-top:10upx;
	}
	.want_trust_agent_cancel_icon{
		position: absolute;
		top: 28upx;
		right: 40upx;
		width: 150upx;
		height: 150upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/broker_cancle.png) center center no-repeat;
		background-size: 100% 100%;
	}
	.want_trust_agent_refuse_icon{
		position: absolute;
		top: 28upx;
		right: 40upx;
		width: 150upx;
		height: 150upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/registration/refuse_flag.png) center center no-repeat;
		background-size: 100% 100%;
	}

	/* 删除 */
	.want_deal_btn{
		position:absolute;
		height:100%;
		width:140upx;
		line-height:174upx;
		background:#ff4940;
		color:#fff;
		font-size:30upx;
		letter-spacing:1px;
		text-align:center;
		top:0;
		right:-170upx;
		z-index:9;
	}

	/* 取消委托弹窗 */
	.want_cancel_entrust_tc{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.6);
		z-index:100;
	}
	.want_cancel_entrust_cont{
		position:absolute;
		left:0;
		bottom:0;
		width:100%;
		overflow:hidden;
		background:#fff;
	}
	.want_cancel_entrust_title{
		position:relative;
		text-align:center;
		font-size:36upx;
		color:#000;
		height:128upx;
		line-height:128upx;
		border-bottom:1upx solid #eee;
	}
	.want_cancel_entrust_close{
		position:absolute;
		width:26upx;
		height:26upx;
		top:50%;
		right:38upx;
		margin-top:-13upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/close2.png) center no-repeat;
		background-size:100% 100%;
	}
	.want_cancel_reason_cont{
		padding: 40upx 40upx 0;
	}
	.want_cancel_reason_list{
		flex-wrap: wrap;
	}
	.want_cancel_reason_item{
		width:45%;
		height:60upx;
		flex-shrink: 0;
		line-height:60upx;
		font-size:26upx;
		box-sizing:border-box;
		text-align:center;
		border:1upx solid #ddd;
		border-radius:4upx;
		will-change: transform;
		color:#999;
		position:relative;
		margin-bottom:30upx;
		margin-right: 9%
	}
	.want_cancel_reason_list>.want_cancel_reason_item:nth-child(2n){
		margin-right: 0;
	}
	.want_cancel_text_view{
		position:relative;
		width:100%;
		overflow:hidden;
		padding: 0 40upx 40upx;
		box-sizing: border-box;
	}
	.want_cancel_text_area{
		height:114upx;
		box-sizing: border-box;
		padding: 20upx;
		width: 100%;
		font-size: 28upx;
		color: #101D36;
		background-color: #f1f1f1;
		border-radius: 8upx;
		will-change: transform;
	}
	.want_cancel_text_pla{
		font-size: 28upx;
		color: #888;
		background-color: #f1f1f1;
	}
	.want_cancel_empty{
		background:#eee;
		width:100%;
		height:10upx;
	}
	.want_cancel_confirm{
		text-align:center;
		font-size:36upx;
		height:100upx;
		line-height:100upx;
	}
	.want_cancel_text_num{
		font-size:26upx;
		position:absolute;
		right:55upx;
		bottom:58upx;
		color:#888;
	}
	.want_cancel_reason_item_active{
		border:1upx solid #333;
		color:#333;
		background-color:#f6f6f6;
	}

	/* 专属经纪人皇冠 */
	.sale_trust_vip_icon{
		width:130upx;
		height:34upx;
		background:url('http://cdn.haofang.net/static/uuminiapp/entrustImg/vip-icon.png') center center no-repeat;
		background-size:100%;
		position:absolute;
		left:-12upx;
		top:90upx;
	}
	.want_trust_agent_name_vip{
		color:#fe9441;
		padding-left: 5upx;
	}
	.sale_show_all_agent_view{
		text-align:center;
		font-size:26upx;
		background:#f1f1f1;
		color:#666;
		line-height:70upx;
		height:70upx;
	}
	.sale_show_all_agent_icon{
		width: 20upx;
		height: 12upx;
		flex-shrink: 0;
		margin: auto 10upx auto 0;
	}
</style>
