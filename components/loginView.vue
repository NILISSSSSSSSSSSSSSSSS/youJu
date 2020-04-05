<template>
	<view>
		<!-- #ifdef MP || APP-PLUS || APP-PLUS-NVUE -->
		<view class="login_tips_view f_c_c" v-if="isRefuse || isShow">
			<image class="f_r_c login_view" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/no_auth.png"></image>

		    <view class="login_des_text">你还没有登录，请登录后查看</view>

			<view class="f_r_c login_btn_view">
				<!-- #ifndef MP-ALIPAY || APP-PLUS || APP-PLUS-NVUE-->
				<button :disabled="loginDisabled" form-type="submit"
		            hover-class="none" open-type="getUserInfo"
					@getuserinfo="upSetting" class="login_btn global-confirm-btn f_r_c">授权登录</button>
				<!-- #endif -->

				<!-- #ifdef MP-ALIPAY -->
				<button :disabled="loginDisabled" form-type="submit"
		            hover-class="none" open-type="getAuthorize"
					@click="upSetting" class="login_btn global-confirm-btn f_r_c">授权登录</button>
				<!-- #endif -->

				<!-- #ifdef APP-PLUS || APP-PLUS-NVUE -->
				<button :disabled="loginDisabled" hover-class="none"
						@click="appPageToLogin" class="login_btn global-confirm-btn f_r_c">授权登录</button>
				<!-- #endif -->
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { Notification } from "../utils/Notification.js";
	import { Notify } from "../utils/Notify.js";
	import { UserInfoModel } from "../model/UserInfoModel.js";
	import { DealUserInfo } from "../net/DealUserInfo.js";
	import { DealUserInfoFromLogin, GetTelephoneFormLogin } from "../utils/common.js";
	import {GpsInfoModel} from "../model/GpsInfoModel";
	import {UserIdBindCityId} from "../net/common/GetAxbPhoneNumber";
	import {ImChart} from "../utils/ImChart";
	import {DealChartListModel} from "../model/im/ChatListModel";

	export default {
		data() {
			return {
				isRefuse: false  ,// 是否拒绝
                isShow: false,
                loginDisabled: false,
			}
		},

		mounted() {
            // 监听用户信息授权
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
            new Notification().addObserver(this, "RefuseAuthSettingChanged", Notify.RefuseAuthSettingChanged.Name);
            this.initSetting();
            this.initUserId();
		},

        destroyed() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

		methods: {
            // 用户信息授权通知回调
            UserInfoChanged() {
				if(new UserInfoModel().getModel("me")
					&& new UserInfoModel().getModel("me").userId
					&& new UserInfoModel().getModel("userInfo")
					&& new UserInfoModel().getModel("userInfo").userInfo
					&& new UserInfoModel().getModel("userInfo").userInfo.nickName) {
					this.isShow = false;
				}else{
					this.isShow = true;
				}
            },

            // 初始化是否有userId
            initUserId() {
				if(new UserInfoModel().getModel("me")
					&& new UserInfoModel().getModel("me").userId
					&& new UserInfoModel().getModel("userInfo")
					&& new UserInfoModel().getModel("userInfo").userInfo
					&& new UserInfoModel().getModel("userInfo").userInfo.nickName) {
					this.isShow = false;
				}else{
					this.isShow = true;
				}
                // #ifndef MP || APP-PLUS || APP-PLUS-NVUE
                this.isShow = false;
                // #endif
            },

            // 拒绝的回调
            RefuseAuthSettingChanged(name, val) {
                this.isRefuse = !val;
            },

            // app登录
            appPageToLogin() {
                uni.navigateTo({
                    url: "/pagesTool/appSet/appLogin"
                });
            },

            // 初始化权限是否开启
			initSetting() {
				let that = this;
				// #ifdef MP
				uni.getSetting({
					success: (res) => {
						if(!res.authSetting['scope.userInfo']){
							that.isRefuse = true;
				            return;
						}

				        that.isRefuse = false;
					}
				});
				// #endif
			},

            // 更新用户信息
            initUserInfo(e) {
                //#ifdef MP
                // #ifndef MP-ALIPAY
                if(!e || !e.detail) return;
                // #endif

                let that = this;
                DealUserInfoFromLogin.init(e.detail)
                	.then(res => {
						this.loginDisabled = false;
                		that.initUserId();
                		that.isRefuse = false;

                		let me = new UserInfoModel().getModel("me") || {};
                		let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
						// 授权成功后，用户id和cityId绑定在一起
						if(me.userId && cityInfo.cityId) {
							new UserIdBindCityId({
								userId: me.userId,
								cityId: cityInfo.cityId
							}).send();
						}

						// 授权后更新消息列表
						if(new UserInfoModel().getModel("me")
								&& new UserInfoModel().getModel("me").userId) {
							ImChart.getChartList(() => {
								new DealChartListModel().sendMsgListNc();
							});
						}
                	})
					.catch(() => {
						this.loginDisabled = false;
					});
                //#endif
            },

            // 更新权限
            upSetting(e) {
                let that = this;
                this.loginDisabled = true;
				// #ifdef MP
                // #ifdef MP-ALIPAY
                that.initUserInfo(e);
                // #endif
                // #ifndef MP-ALIPAY
                uni.getSetting({
                	success: (res) => {
                		if(!res.authSetting['scope.userInfo']){
                            that.loginDisabled = false;
                			uni.showModal({
                				title: '授权提示',
                				showCancel: true,
                				content: '要先允许使用[用户信息]才可以登录哦',
                				confirmText:'去设置',
                                confirmColor: "#ab7f2e",
                				success: function(res) {
                					if (res.confirm) {
                						uni.openSetting({
                							success: (res1) => {
                								if(res1.authSetting['scope.userInfo']){
                                                   that.initUserInfo(e)
                								}
                							}
                						});
                					}
                				}
                			});
                            return;
                		}

                       that.initUserInfo(e)
                	},
                    fail: (err) => {
                    	this.loginDisabled = false;
                        uni.showModal({
                        	showCancel: false,
                            title: "温馨提示",
                            content: "登录失败啦！请稍后重试。",
                            confirmColor: "#ab7f2e",
                            confirmText: "我知道了",
                        });
                    }
                });
                // #endif
				// #endif
            },
		},
	}
</script>

<style scoped>
	.userInfo_view{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999999;
	}

	.login_tips_view{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99999999999;
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}
	.login_view{
		width: 318upx;
		height: 264upx;
        margin: 0 auto;
	}
    .login_des_text{
        font-size: 26upx;
        color: #989898;
        text-align: center;
        line-height: 48upx;
        margin: 90upx 0 30upx;
    }
	.login_btn_view{
		width: 100%;
		padding: 0 40upx;
		box-sizing: border-box;
	}
	.login_btn{
		background:rgb(26,173,23);
		width: 100%;
		height:90upx;
		border-radius:10upx;
		background-blend-mode:normal, normal;
		box-sizing: border-box;
		font-size:30upx;
		text-align:center;
		color:#fff;
		line-height:90upx;
		margin: auto 0;
	}
</style>
