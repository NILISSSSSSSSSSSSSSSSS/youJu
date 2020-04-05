<template>
	<view>
        <view class="want_trust_view"
              :class="isShowDelBtn && currentDelItem.trustId == item.trustId ? 'want_go_left' : ''"
              @touchstart="touchStart($event)"
              @touchend="touchEnd($event)">
            <!-- 委托介绍 -->
            <view class="f_r_s want_buy_lease_view">
                <!-- tag -->
                <view class="want_buy_lease_tag f_c_c">{{ item.caseType == 3 ? '求购' : '求租' }}</view>

                <!-- 委托内容 -->
                <view class="want_buy_lease_cont">
                    <view class="f_r_s want_buy_lease_positionInfo">
                        <block v-if="item.positionInfo">{{ item.positionInfo }}</block>
                        <block v-else>
                            <block v-if="item.isVip == 1">我的专属委托</block>
                            <block v-else>我的{{item.caseType == 3? "买房" : "租房" }}委托</block>
                        </block>
                    </view>

                    <view class="f_r_s want_buy_lease_des">
                        <view>{{ item.usageName }}</view>

                        <view v-if="item.usageType">{{ item.usageType }}</view>

                        <view>{{ item.zhuangXiuStatus }}</view>

                        <view v-if="item.yongJinVal">佣金{{ item.yongJinVal }}</view>
                    </view>

                    <view class="want_buy_lease_push">发布于{{ item.pushContent }}</view>
                </view>
            </view>

            <!-- 委托icon -->
            <view :class="item.trustStatus == 2 ? 'want_success_icon_trust' : ''" class="want_success_fail_com"></view>
            <view :class="item.trustStatus == 0 ? 'want_fail_icon_trust' : ''" class="want_success_fail_com"></view>

            <!-- 取消/再次委托按钮 -->
            <view class="want_cancle_trust_btn" @click.stop="cancelAgainTrust" v-if="item.trustStatus == 1"></view>

            <!--有委托人委托中的框-->
            <view class="g-property-box" v-if="item.propertyUserVO && (item.trustStatus==1 || item.trustStatus==2)">
                <view class="Invite-portrait">
                    <image class="Invite-portrait-img" :src="item.propertyUserVO.brokerUserPicUrl" mode="aspectFill"></image>
                </view>
                <view class="Inviter-information">
                    <view class="g-contact">
                        <view class="g-contact-name">{{item.propertyUserVO.brokerName}}</view>

                        <view class="g-contact-box marg55" @click="chatOnline">
                            <image class="g-contact-itm-img" src="http://cdn.haofang.net/static/uuminiapp/property/chat_online.png" mode="aspectFill"></image>
                            <view class="g-contact-box-text">在线聊天</view>
                        </view>

                        <view class="g-contact-box" @click="callUp">
                            <image class="g-contact-phone-img" src="http://cdn.haofang.net/static/uuminiapp/property/call_up.png" mode="aspectFill"></image>
                            <view class="g-contact-box-text">拨打电话</view>
                        </view>

                    </view>
                    <view v-if="item.trustStatus==1" class="Inviter-information-text s-textColor-bule pad42">您的委托已由{{item.buildName}}物业公司客户经理受理</view>
                    <view v-if="item.trustStatus==2" class="Inviter-information-text s-textColor-bule pad42">感谢您的信任，祝您生活愉快</view>
                    <view class="Inviter-information-text s-textColor-gray">{{item.propertyUserVO.pushLogTime?(item.propertyUserVO.pushLogTime+' 接单'): ''}}</view>
                </view>
            </view>

            <!-- 无委托人的状态 -->
            <view class="sale_lease_trusting_con_lianmai f_r_s" v-if="!item.propertyUserVO && item.trustStatus==1">
                <view>您的委托已由{{item.buildName}}物业公司受理中，请耐心等待！</view>
            </view>

            <!-- 经纪人信息 -->
            <view class="want_trust_agent_list" v-if="item.entrustUsers && item.entrustUsers.length > 0">
                <block v-for="(agentInfo, agentIndex) in item.entrustUsers" :key="agentIndex">
                    <view @click.stop="lookEntrustDetail(agentInfo)" class="want_trust_agent_item f_r_s">
                        <!-- 经纪人头像 -->
                        <view class="want_trust_agent_img_view">
                            <view class="want_trust_agent_img f_r_c">
                                <image mode="aspectFill" :src="agentInfo.haedImg"></image>
                            </view>

                            <!-- 新内容的红点 -->
                            <view v-if="agentInfo.isUpdateRedFlag == 1 && agentInfo.pushStatus != 0"
                                  class="want_trust_agent_red_point"></view>

                            <!--专属经纪人的皇冠-->
                            <view v-if="item.isVip == 1" class="want_trust_vip_icon"></view>
                        </view>

                        <!-- 经纪人信息 -->
                        <view class="want_trust_agent_cont">
                            <!-- 经纪人介绍 -->
                            <view class="want_trust_agent_title f_r_s">
                                <view class="want_trust_agent_name">{{ agentInfo.agentName }}</view>
                                <block v-if="agentInfo.yongJinVal">
                                    <view class="want_trust_agent_yongJin_text f_c_c">佣金</view>
                                    <view class="want_trust_agent_yongJin_val f_c_e">{{ agentInfo.yongJinVal }}</view>
                                    <view class="want_trust_agent_yongJin_unit f_c_e">{{ agentInfo.yongJinUnit }}</view>
                                </block>
                            </view>

                            <!-- 评分 -->
                            <view class="want_trust_agent_star_view f_r_s"
                                  v-if="agentInfo.starList && agentInfo.starList.length > 0">
                                <image v-for="(starImg, starIndex) in agentInfo.starList" :key="starIndex" :src="starImg"></image>

                                <view class="want_trust_agent_star_num">{{ agentInfo.starNum }}</view>
                            </view>

                            <view class="want_trust_agent_node_text"
                                  v-if="agentInfo.pushStatus == 2">正在为您推荐房源，请耐心等待</view>
                            <view class="want_trust_agent_node_text want_trust_agent_node_text_color"
                                  v-else-if="agentInfo.pushStatus==5">推荐了{{ agentInfo.entrustHouseNum }}套房源></view>
                            <view class="want_trust_agent_node_text want_trust_agent_node_text_color"
                                  v-else-if="agentInfo.pushStatus==3">推荐了{{ agentInfo.entrustHouseNum }}套房源【已带看】></view>
                            <view class="want_trust_agent_node_text"
                                  v-else-if="agentInfo.pushStatus==7">房勘申请通过,即将联系您现场勘察</view>
                            <view class="want_trust_agent_node_text"
                                  v-else-if="agentInfo.isEvaluate==1 && agentInfo.pushStatus==4">感谢您的信任，祝您生活愉快</view>
                            <view class="want_trust_agent_node_text"
                                  v-else-if="agentInfo.isEvaluate==0 && agentInfo.pushStatus==4">请对本次服务做出评价></view>
                            <view class="want_trust_agent_node_text"
                                  v-else-if="agentInfo.pushStatus==0 && agentInfo.cancelStatus == 1">该经纪人已取消委托服务</view>
                            <view class="want_trust_agent_node_text"
                                  v-else-if="agentInfo.pushStatus==0">已拒绝该经纪人继续为您提供服务</view>
                            <view class="want_trust_agent_pushLogTime">{{ agentInfo.getTime }} 接单</view>
                        </view>

                        <!--已取消icon-->
                        <view class="want_trust_agent_cancel_icon"
                              v-if="agentInfo.pushStatus ==0 && agentInfo.cancelStatus == 1"></view>
                        <!--拒绝经纪人icon-->
                        <view class="want_trust_agent_refuse_icon" v-else-if="agentInfo.pushStatus == 0"></view>
                    </view>
                </block>
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
				isShowCancelEntrustTc: false

			}
		},

		methods: {
            moveHandle() {},

            // 拨打电话
            callUp() {
                if (!this.item.propertyUserVO
                    || !this.item.propertyUserVO.brokerMobile) {
                    uni.showToast({
                        title: "暂无电话，无法拨打",
                        icon: "none"
                    });
                    return;
                }

                this.DifferenceApi.makePhoneCall(this.item.propertyUserVO.brokerMobile);
            },

            // 在线联系
            chatOnline() {
                if(!this.item.propertyUserVO || !this.item.propertyUserVO.brokerArchiveId) {
                    uni.showToast({
                        title: "暂无经纪人id",
                        icon: "none"
                    });
                    return;
                }

                let me = new UserInfoModel().getModel("me") || {};
                let url = "/pagesTool/messageDetail/messageDetail";
                uni.navigateTo({
                    url: url + '?messageId=' + this.item.propertyUserVO.brokerArchiveId
                        + "&name=" + (this.item.propertyUserVO
                            ? this.item.propertyUserVO.brokerName || "" : "")
                        + "&userId=" + me.userId + "&openId=" + me.openId
                });
            },

			// 取消/再次推送 弹窗显示事件
			cancelAgainTrust() {
				let that = this;
				let itemList = ["取消委托"];
				uni.showActionSheet({
					itemList: itemList,
					success: function (res) {
						if(itemList[res.tapIndex].indexOf("取消") >= 0) {
							that.cancelEntrust();
							return;
						}

						if(itemList[res.tapIndex].indexOf("再次") >= 0) {
							that.againEntrust();
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

			// 再次委托
			againEntrust() {
				let me = new UserInfoModel().getModel("me") || {};
				if(!me.userId) {
					uni.showToast({
						title: "暂未找到当前用户userId",
						image: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/warning.png',
					});
					return;
				}

				new AgainPushEntrust({
					cityId: this.item.cityId,
					caseId: this.item.vipCaseId,
					caseType: this.item.caseType,
					wxId: me.userId,
					toSend: this.item.toSend,
				}).send()
				.then(res => {
					if(res.STATUS != 1){
						uni.showToast({title: res.INFO || "再次推送失败", icon: 'none'});
						return;
					}

					// 委托再次推送跳转委托经纪人页面
					uni.navigateTo({
						url: `/pagesEntrust/pushMsg/pushMsg?caseId=${this.item.vipCaseId}&caseType=${this.item.caseType}`,
					});
				})
				.catch(() => {
					uni.showToast({title: "再次推送失败", icon: 'none'});
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
				})
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

				if(item.pushLogId) {
					new UpdateHouseRedFlag({pushLogId: item.pushLogId}).send();
				}
				uni.navigateTo({
					url: "/pagesEntrust/entrustDetail/entrustDetail?entrustId=" + item.pushLogId
				});
			},
		},
	}
</script>

<style scoped>
    .sale_lease_trusting_con_lianmai{
        box-sizing: border-box;
        margin-top: 30upx;
        color:#c6c6c6;
        font-size:28upx;
        width:100%;
    }
    /* 物业版样式 start */
    /* 邀请人头像 */
    .g-property-box{
        width: 100%;
        height: 100%;
        padding: 20upx;
        box-sizing: border-box;
        margin: 30upx auto 0;
        background: #F1F1F1;
        overflow: hidden;
    }
    /* 左 */
    .Invite-portrait{
        width: 108upx;
        height: 108upx;
        border-radius: 50%;
        background: url(http://cdn.haofang.net/static/uuminiapp/property/property_portrait.png) no-repeat;
        background-size: 100%;
        background-color: #ffffff;
        float: left;
        overflow: hidden;
    }
    .Invite-portrait-img{
        width: 100%;
        height: 100%;
    }
    /* 右 */
    .Inviter-information{
        width: 525upx;
        height: auto;
        float: right;
        padding-left: 15upx;
        box-sizing: border-box;
    }
    .g-contact{
        width:  100%;
        display: block;
        overflow: hidden;
        margin-bottom: 20upx;
    }
    .marg55{
        margin-right: 55upx;
    }
    .g-contact-name{
        margin-top: 20upx;
        width: 290upx;
        float: left;
        overflow: hidden;
        display: -webkit-box;
        line-height: 50upx;
        -webkit-box-orient: horizontal;
        -webkit-box-align: center;
        font-size: 32upx;
        color: #000000;
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }
    .g-contact-box{
        width: 80upx;
        text-align: center;
        float: left;
    }
    .g-contact-itm-img{
        width: 33upx;
        height: 33upx;
    }
    .g-contact-phone-img{
        width: 32upx;
        height: 33upx;
    }
    .g-contact-box-text{
        font-size: 20upx;
        color: #999999;
    }
    .Inviter-information-text{
        width: 100%;
        font-size: 28upx;

    }
    .pad42{
        padding: 0upx 0 10upx 0;
    }
    .s-textColor-bule{
        color: #7185a0;
    }
    .s-textColor-gray{
        color: #777777;
    }


    .g-property-addImg{
        width: 665upx;
        height: 25upx;
        color: #7388a9;
        font-size: 24upx;
        margin: 0 auto 28upx auto;
    }
    .g-property-foot{
        width: 100%;
        height: auto;
        border-top: 1upx solid #e6e6e6;
    }
    .property-foot-text{
        width: 665upx;
        height: auto;
        color: #aaaaaa;
        font-size: 28upx;
        margin: 31upx auto 26upx auto;
    }

    /* 添加图片 start */
    .g-add-img{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index:1000;
    }
    .g-addImg-mask{
        width: 100%;
        height: 100%;
        background-color: #858585;
        opacity: 0.5;
    }
    .g-addImg-box{
        width: 100%;
        height: auto;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index:1010;
        background-color: #FFFFFF;
    }
    .g-choiceImg{
        background-color:#fbfbfb;
        color:#858585;

    }
    .g-addImg-list{
        height: 80upx;
        line-height: 80upx;
        border-bottom: 1upx solid #eeeeee;
        text-align: center;
        font-size: 24upx;
    }
    .padBtn20{
        padding-bottom: 20upx
    }
    /* 添加图片 end */

    /* 物业版样式 start */

    /* 认领委托 */
    .claim-entrust-title{
        width: 670upx;
        height: 60upx;
        background-color: #fef6e9;
        border-radius: 30upx;
        color: #f68000;
        font-size: 26upx;
        text-align: center;
        line-height: 60upx;
        margin: 30upx 0 30upx 40upx;
    }
    /* 新增委托 */
    .entrust-text{
        color: #aaaaaa;
        font-size: 26upx;
        padding: 0 21upx;
        letter-spacing: 0upx;
        padding-top: 30upx;
        padding-bottom: 28upx;
        border-top: 1upx solid #e6e6e6;
    }
    .entrust-fail-icon{
        width: 170upx;
        height: 112upx;
        background-image: url('http://cdn.haofang.net/static/uuminiapp/personalCenter/enstrust_shibai.png');
    }
    .mar-none{
        margin-bottom: 0upx;
    }
	/* 弹窗 */
	.entrust_tc_view{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
	.entrust_tc_cont_view{

	}

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
	.want_trusting_txt{
		color: #c6c6c6;
		font-size: 28upx;
	}

	/* 经纪人列表 */
	.want_trust_agent_list{
		border-radius:4px;
		will-change: transform;
		position:relative;
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
		/* border-bottom:1px solid #ededed; */
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

	/* 专属经纪人icon */
	.want_trust_vip_icon{
		width:130upx;
		height:34upx;
		background:url('http://cdn.haofang.net/static/uuminiapp/entrustImg/vip-icon.png') center center no-repeat;
		background-size:100%;
		position:absolute;
		left:-12upx;
		top:90upx;
	}
</style>
