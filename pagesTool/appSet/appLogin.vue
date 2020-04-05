

<template>
    <view @click="enterConsole" class="login_view f_c_c" :style="{height: windowHeight}">
        <view class="f_r_c top_logo_view">
            <image class="top_logo" mode="aspectFill"
                   src="http://cdn.haofang.net/static/wxPlusApp/yjk/login_icon.png"></image>
        </view>

        <view class="wx_author f_r_c" @click.stop="wxLogin">微信登录</view>
    </view>
</template>

<script>
    import {UserInfoModel} from "../../model/UserInfoModel";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import {DealUserInfo, GetWxIdByUnionId} from "../../net/DealUserInfo";
    import {formatDate, GetTelephoneFormLogin} from "../../utils/common";
    import { Const } from "../../utils/Const";
    import {ConsoleModel} from "../../model/ConsoleModel";
    import {DifferenceApi} from "../../utils/DifferenceApi";

    export default {
        data() {
            return {
                windowHeight: "100%",
                clickNum: 0
            }
        },

        onLoad() {
            this.upSystemInfo();
        },

        methods: {
            // 设置页面尺寸
            upSystemInfo() {
                let res = uni.getSystemInfoSync();
                this.windowHeight = res.windowHeight + "px";
            },

            // 微信登录
            wxLogin() {
                let that = this;
                uni.showLoading({title: "请求中..."});
                uni.login({
                    provider: 'weixin',
                    success: (loginRes) => {
                        console.log("loginRes",loginRes.authResult);
                        // 获取用户信息
                        uni.getUserInfo({
                            provider: 'weixin',
                            success: (infoRes) => {
                                console.log('infoRes：', JSON.stringify(infoRes.userInfo));
                                that.loginCallback(infoRes.userInfo);
                            },
                            fail: () => {
                                uni.hideLoading();
                            }
                        });
                    },
                    fail: () => {
                        uni.hideLoading();
                    }
                });
            },

            loginCallback(userInfo) {
                let _this = this;
                let daelUserInfo = {
                    avatarUrl: userInfo.avatarUrl || "",
                    nickName: userInfo.nickName || "",
                    city: userInfo.city || "",
                    country: userInfo.country || "",
                    gender: userInfo.gender || "",
                    langusage: userInfo.langusage || "zh_cn",
                    provice: userInfo.province || ""
                };
                console.log("--userInfo--", userInfo);
                console.log("--daelUserInfo--", daelUserInfo);
                new GetWxIdByUnionId({
                    unionId: userInfo.unionId || "",
                    openId: userInfo.openId || "",
                    userInfo: daelUserInfo
                }).send().then(me => {
                    console.error("me", JSON.stringify(me));
                    if (!me || !me.DATA || !me.STATUS || me.STATUS != 1) {
                        uni.hideLoading();
                        return Promise.reject({errMsg: "接口返回数据错误"});
                    }

                    let data = me.DATA || {};
                    let response = {openId: userInfo.openid || "", userId: data.userId || ""};
                    new UserInfoModel().setModel(response, "me");
                    new UserInfoModel().setModel({userInfo: daelUserInfo}, "userInfo");
                    if(!new UserInfoModel().getModel("me") || !new UserInfoModel().getModel("me").userId
                        || (new UserInfoModel().getModel("me").userId != response.userId)) {
                        new UserInfoModel().setModel("uu_" + response.userId, "accid");
                        _this.ImChart.uuAccid = new UserInfoModel().getModel("accid");
                        _this.ImChart.upAccid();
                    }
                    return GetTelephoneFormLogin.checkUserInfo(response.userId);
                })
                .then(() => {
                    uni.hideLoading();
                    new DifferenceApi().showToast("登录成功");
                    // new UpDataUserInfo().up();
                    new Notification().postNotification(Notify.UserInfoChanged.Name,
                        new UserInfoModel().getModel("userInfo"));
                    setTimeout(() => {
                        uni.navigateBack({delta: 1});
                    }, 1000);
                })
                .catch(err => {
                    uni.hideLoading();
                    let list = new ConsoleModel().getModel() || [];
                    let time = new Date().getTime();
                    let dateVal = new formatDate(new Date(time));
                    let value = JSON.stringify(err);
                    value += `\n\n 请求参数: \n\n userInfo->${JSON.stringify(userInfo)}\n\n daelUserInfo->${JSON.stringify(daelUserInfo)}`;
                    list.push({
                        id: time,
                        name: dateVal.getYear() + "年" + dateVal.getMonth() + "月" + dateVal.getDay()
                            + "日" + " " + dateVal.getHour() + ": " + dateVal.getMinute(),
                        key: "获取用户wx_id失败",
                        value: value
                    });
                    new ConsoleModel().setModel(list);
                    new DifferenceApi().showToast(`获取用户wx_id失败: ${JSON.stringify(err)}`);
                });
            },

            // 连续点击10下进入到日志页面
            enterConsole() {
                this.clickNum++;
                if (this.clickNum >= 10) {
                    this.clickNum = 0;
                    uni.navigateTo({
                        url: "/pagesTool/appSet/console"
                    });
                }
            },
        }
    }
</script>

<style>
    page{
        width: 100%;
        height: 100%;
    }
    .login_view{
        width: 100%;
        height: 100%;
        padding: 0 60upx;
        box-sizing: border-box;
    }
    .top_logo_view{
        margin: 0 0 210upx;
    }
    .top_logo{
        width: 161upx;
        height: 222upx;
        margin: 0 auto;
    }
    .wx_author{
        height: 96upx;
        background-color: #ffd900;
        border-radius: 10upx;
        line-height: 96upx;
        text-align: center;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        font-size: 32upx;
        font-weight: normal;
        font-stretch: normal;
        color: #101d36;
    }
</style>
