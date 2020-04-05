<template>
	<view>
		<!-- 拨打电话按钮 -->
		<view @click="chooseLinkType" class="take_phone_btn" :style="{bottom: phoneHeight}">
		</view>
		
		<!-- 弹窗 -->
		<view class="call-modal-box" v-if="showTypeTc">
			<view class="cl-mask" @click='downCloseEvent'></view>
			<view class="cl-conten">
				<view class="cl-close" @click='downCloseEvent'></view>
				<view class="cl-title" data-text="选择联系方式"></view>
				
				<view class="cl-listinfo">
					<button v-if='!item.userMobile' class="my-button" open-type="getPhoneNumber" 
						@getphonenumber.stop="callHideAgent">
						<view class="clst-con">
							<view class="clast-title">隐号转接
								<image src="http://cdn.haofang.net/static/uuminiapp/im/anli.png"></image>
							</view>
							<view class="clast-titfo">平台为您提供号码保护，对方看不见您的真实号码</view>
						</view>
					</button>
					<view v-if='item.userMobile' class="clst-con" @click.stop='callHideAgent'>
						<view class="clast-title">隐号转接
							<image src="http://cdn.haofang.net/static/uuminiapp/im/anli.png"></image>
						</view>
						<view class="clast-titfo">平台为您提供号码保护，对方看不见您的真实号码</view>
					</view>
				</view>
				
				<view class="cl-listinfo" @click.stop='callAgent'>
					<view class="clst-con clst-zhicall">
						<view class="clast-title">直拨电话</view>
						<view class="clast-titfo">直拨经纪人电话，号码未加密</view>
					</view>
				</view>
			
			</view>
		</view>
	</view>
</template>

<script>
	class TakePhoneItem {
		userMobile = "";  // 用户电话
	}
	import { Const } from '@/utils/Const.js';
	import { AgentInfoModel } from "@/model/AgentInfoModel.js";
	export default {
		props: {
			item: {
				type: Object,
				default() {
					return new TakePhoneItem()
				}
			},
			phoneHeight:{
				type: String,
				default: '200upx'
			}
		},
		
		data() {
			return {
				showTypeTc: false,
				bindTelText: '',
			}
		},
		
		methods: {
			chooseLinkType() {
				this.showTypeTc = false;
				this.callAgent();
			},
			
			downCloseEvent() {
				this.showTypeTc = false;
			},
			
		
			
			callAgent() {
				let id = new AgentInfoModel().getModel("archiveId") || '';
				let phone = new AgentInfoModel().getModel("agentPhone_"+id)[0].phoneNum;
				if (!phone){
					uni.showToast({
						title: "暂无电话, 无法拨打。",
						icon: "none"
					});
					return;
				}
				
				this.DifferenceApi.makePhoneCall(phone);
				this.showTypeTc = false;
			},
		
			// 拨打电话显示弹窗
			callPhone() {
				let agentId = this.agentInfo.agentId;
				// 显示拨打电话弹窗
				let phoneArr = new AgentInfoModel().getModel("agentPhone_"+agentId) || [];
				if (phoneArr.length > 1) {
					this.userPhone.isShow = true;
					this.userPhone.phone = phoneArr;
					return;
				}
				this.UserBehavior.phoneConsult();
				// 直接拨打电话
				if (phoneArr[0].callType == 1) {
					this.DifferenceApi.makePhoneCall(phoneArr[0].phoneNum);
				}
			},
		
			// 隐号转接
			callHideAgent(e){
				let _this = this;
				//判断当前登录用户有没有绑定过号码, 如果绑定过 ,直接用绑定的号码 转 AXB ,否则 先请求微信绑定号码
				let cityId = !!this.data.caseCityId ? this.data.caseCityId : this.data.cityId
				if (!!wx.getStorageSync("userMobile")) {
					this.getAxbPhoneNum(wx.getStorageSync("userMobile"), this.data.toUserInfo.brokerMobile, cityId)
					return;
				}
				if (!e.detail.encryptedData){return}  //拒绝授权
				wx.login({
					success(res) {
						wx.request({
							url: app.buildRequestUrl('getSecretPhone'),
							data: {
								code: res.code,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv,
							},
							success: function (res) {
								if (res.data.STATUS==1){
									if (!!res.data.DATA && !!res.data.DATA.phoneNumber)
									//设置微信绑定号码进入缓存
									wx.setStorageSync('userMobile', res.data.DATA.phoneNumber);
									_this.setData({userMobile:res.data.DATA.phoneNumber})
									_this.getAxbPhoneNum(res.data.DATA.phoneNumber, _this.data.toUserInfo.brokerMobile, cityId)
								}
							}
						})
					}
				})
			},
			/**
			 * IM 隐号通话AXB转接
			 * @param {*} userMobile 拨打人号码
			 * @param {*} customerMobile 被拨打人号码
			 * @param {*} cityId  //被拨打人(经纪人所在城市)
			 */
			getAxbPhoneNum(userMobile, customerMobile, cityId) {
				let _this = this;
				if (userMobile == customerMobile) {
					uni.showToast({
						title: '呼叫方与被叫方号码相同，不可使用隐号转接系统！',
						icon: 'none',
						duration: 1500,
						mask: false,
					});
					return;
				}
				wx.request({
					url: app.buildRequestUrl('getAxbPhoneNumber'),
					data: {
						cityId: cityId,
						customerMobile: customerMobile,
						userMobile: userMobile,
					},
					success: function (res) {
						if (res.data.STATUS == 1) {
							if (!!res.data.DATA && !!res.data.DATA.data){
								let phoneX = res.data.DATA.data.phoneX
								_this.callPhone(phoneX);}
						}
					}
				})
			}
		},
	}
</script>

<style>
	.take_phone_btn{
		width: 100upx;
		height: 100upx;
		background: url("http://cdn.haofang.net/static/kdbweb/zdzfminiapp/btn_home_phone.png") no-repeat;
		background-size: 100% 100%;
		box-shadow: 0px 0px 33.2upx 1.8upx rgba(116, 116, 116, 0.13);
		border-radius: 50%;
	}
	/* 拨打电话弹层 */
	.call-modal-box{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 99;
	}
	/* #ifdef H5 */
	.call-modal-box{
		top: 88upx;
	}
	/* #endif */
	.cl-mask{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		width: 100%;
		background: rgba(0, 0, 0, 0.3);
		height: 100%;
	}
	/* #ifdef H5 */
	.cl-mask{
		top: 88upx;
	}
	/* #endif */
	.cl-conten{
		position: absolute;
		top: 45%;
		left: 50%;
		width: 630upx;
		min-height: 520upx;
		transform: translate(-50%,-50%);
		-webkit-transform: translate(-50%,-50%);
		-moz-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
		-o-transform: translate(-50%,-50%);
		z-index: 20;
		box-sizing: border-box;
		border-radius: 5px;
		background: #fff;
	  }
	.cl-close{
		position: absolute;
		width: 70upx;
		height: 70upx;
		background: url(http://cdn.haofang.net/static/uuminiapp/loadDownImg/close_icon.png)no-repeat center;
		background-size: 27upx 27upx;
		top: 0;
		right: 0;
		z-index: 100;
	}
	.cl-title{
		border-bottom: solid 2upx #f6f6f6;
		width: 500upx;
		margin:0 auto;
		position: relative;
		top:76upx;
	}
	.cl-title::before{
		content: attr(data-text);
		display: block;
		text-align: center;
		background: #fff;
		position: absolute;
		color: #333;
		font-size: 34upx;
		line-height: 30upx;
		font-weight: bold;
		width: 220upx;
		padding:0 25upx;
		left: 50%;
		margin-left: -125upx;
		top:-17upx;
	}
	.cl-conten>.cl-listinfo:last-child{
		border: 0;
	}
	.cl-listinfo{
		position: relative;
		top:109upx;
		margin:0 60upx;
		padding:45upx 0;
		border-bottom:solid 2upx #f6f6f6;
	}
/* 	.clst-con{
		background: url('http://cdn.haofang.net/static/uuminiapp/im/hideNumber.png') no-repeat left center;
		background-size: 90upx 90upx;
		padding-left: 110upx;
	} */
/* 	.clst-zhicall{
		background: url('http://cdn.haofang.net/static/uuminiapp/im/callNumber.png') no-repeat left center; 
		background-size: 90upx 90upx;
		padding:10upx 110upx;
		padding-right:0;
	} */
	.clast-title{
		font-size: 32upx;
		color: #404040;
		line-height: 36upx;
		font-weight: bold;
		margin-bottom: 15upx;
	}
/* 	.clast-title image{
		width: 54upx;
		height: 27upx;
		margin-top:5upx;
	} */
	.clast-titfo{
		font-size: 24upx;
		color: #999;
		line-height: 30upx;
	}
	.my-button{
		width: 100%;
		height: 100%;
		padding: 0;
		background: none;
		text-align: left;
	}
	.my-button::after {
		border: none;
	}
</style>
