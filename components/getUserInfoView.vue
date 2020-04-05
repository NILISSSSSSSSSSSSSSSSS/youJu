<template>
    <view class="userInfo_view_cont" v-if="isShow">
        <!-- #ifndef MP-ALIPAY || APP-PLUS || APP-PLUS-NVUE-->
        <button form-type="submit" hover-class="none" open-type="getUserInfo"
            @getuserinfo="upMyData" class="userInfo_view f_r_s">
        </button>
        <!-- #endif -->

        <!-- #ifdef MP-ALIPAY -->
        <button form-type="submit" hover-class="none" open-type="getAuthorize"
            @click="upMyData" class="userInfo_view f_r_s">
        </button>
        <!-- #endif -->

        <!-- #ifdef APP-PLUS || APP-PLUS-NVUE -->
        <button hover-class="none"
                @click="appPageToLogin" class="userInfo_view f_r_s">
        </button>
        <!-- #endif -->
    </view>
</template>

<script>
	import { Notification } from "../utils/Notification.js";
	import { Notify } from "../utils/Notify.js";
	import { UserInfoModel } from "../model/UserInfoModel.js";
	import { DealUserInfo } from "../net/DealUserInfo.js";
	import { DealUserInfoFromLogin } from "../utils/common.js";
    import {GpsInfoModel} from "../model/GpsInfoModel";
    import {UserIdBindCityId} from "../net/common/GetAxbPhoneNumber";
    import {ImChart} from "../utils/ImChart";
    import {DealChartListModel} from "../model/im/ChatListModel";

    export default {
		data() {
			return {
				isShow: true,
			}
		},

		mounted() {
            // 监听用户信息授权
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
			new this.InitFormSubmit(this);
			this.UserInfoChanged();
			// #ifndef MP || APP-PLUS || APP-PLUS-NVUE
			this.isShow = false;
			// #endif
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

			// 更新信息
			upMyData(e = {}) {
                //#ifdef MP
                // #ifndef MP-ALIPAY
                if(!e || !e.detail) return;
                // #endif

				let that = this;
				DealUserInfoFromLogin.init(e.detail)
					.then(res => {
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
						that.isShow = false;
                        new Notification().postNotification(Notify.AuthonChanged.Name);
                    });
                //#endif
			},

            // app 未登录跳转到登录页面
            appPageToLogin() {
			    uni.navigateTo({
                    url: "/pagesTool/appSet/appLogin"
                });
            }
		},
	}
</script>

<style scoped>
    .userInfo_view_cont{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99999999;
    }
	.userInfo_view{
		width: 100%;
        height: 100%;
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
		position: relative;
		width: 100%;
		height: 175px;
		background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/index/home_banner_image.png?t=20190218)no-repeat top center;
		background-size: 100%;
	}
	.login_btn_view{
		width: 100%;
		margin: 40upx 0;
		padding: 0 40upx;
		box-sizing: border-box;
	}
	.login_btn{
		background:linear-gradient(270deg,#ff9402 0%,#ffcb00 100%),linear-gradient(#ffc100,#ffc100);
		width: 100%;
		height:100upx;
		border-radius:10upx;
        will-change: transform;
		background-blend-mode:normal, normal;
		box-sizing: border-box;
		font-size:30upx;
		text-align:center;
		color:#fff;
		line-height:100upx;
		margin: auto 0;
	}
</style>
