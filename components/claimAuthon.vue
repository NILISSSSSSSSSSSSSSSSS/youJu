<template>
    <view class='claim-model' v-if="showClaim" @touchmove.stop.prevent="forbiddenMove">
        <view class="claim-model-mask"></view>
        <view class="claim-model-cont">
            <view class="cont-head">
                <view class="close" @click="closeClaimModel"></view>
                <view class="user">
                    <view class="user-box">
                        <image :src="userInfo.avatarUrl || ''"></image>
                    </view>
                    <view class="name" v-if="userInfo.nickName">{{userInfo.nickName || ''}}</view>
                </view>
            </view>

            <view class="cont-main">
                <view class="explain">系统识别到您在平台发布了委托。现在认领委托可与经纪人在线沟通，实时关注委托进度</view>
                <button class="claim-btn" open-type="getPhoneNumber" @getphonenumber="claimePhoneNumber">立即认领</button>
            </view>
        </view>
    </view>
</template>

<script>
    import { Notification } from "@/utils/Notification.js";
    import { Notify } from "@/utils/Notify.js";
    import {UserInfoModel} from "../model/UserInfoModel";
    import {BindTel, SosoEntrustClaim} from "../net/BindTel";
    import {GpsInfoModel} from "../model/GpsInfoModel";
    import { GetUserTel } from "@/utils/common.js";

    export default {
        data() {
            return {
                userInfo: {
                    avatarUrl: "",
                    nickName: ""
                },
                showClaim: false,
            }
        },

        mounted() {
            // 监听授权事件
            new Notification().addObserver(this, "AuthonChanged", Notify.AuthonChanged.Name);
            // 监听用户信息事件
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
        },

        methods: {
            forbiddenMove() {},

            closeClaimModel() {
                this.showClaim = false;
            },

            claimePhoneNumber(e) {
                let that = this;
                //拒绝授权
                if(e.detail.errMsg && e.detail.errMsg.indexOf("fail user deny") >= 0) {
                    that.showClaim = false;
                    return;
                }

                // 您的微信还未绑定手机号
                if(e.detail.errMsg && e.detail.errMsg.indexOf("resp data is empty") >= 0) {
                    that.showClaim = false;
                    uni.showModal({
                        title:"未获取到授权信息",
                        content:"您还未绑定手机号",
                        confirmText: "我知道了"
                    });
                }

                if (!e.detail.encryptedData) {
                    that.showClaim = false;
                    return;
                }

                GetUserTel.init(e).then(tel => {
                    if(!new UserInfoModel().getModel("telephone")) return;

                    // 确认是否有委托
                    new BindTel({
                        cityId: new GpsInfoModel().getModel("cityInfo").cityId,
                        youyouUserId: new UserInfoModel().getModel("me").userId,
                        userMobile: new UserInfoModel().getModel("telephone"),
                        verify: 9999,
                    }).send().then(res => {
                        that.showClaim = false;
                        if(res.STATUS != 1) {
                            uni.showToast({
                                title: res.INFO || info.msg || "认领失败",
                                icon: "none"
                            });
                            return;
                        }

                        if (res.DATA && res.DATA.userMobileEntrusteExite == 1) {
                            uni.showToast({
                                title: "认领成功",
                                icon: 'none'
                            });
                            setTimeout(() => {
                                uni.navigateTo({
                                   url: "/pagesEntrust/trustList/trustList?isfromClaimEntrust=1"
                                });
                            }, 200);
                            return;
                        }

                        uni.showToast({
                            title: "恭喜，绑定成功",
                            icon: 'none'
                        });
                    });
                })
            },

            UserInfoChanged() {
                let userInfo = new UserInfoModel().getModel("userInfo") || {};
                this.userInfo = userInfo.userInfo || {
                    avatarUrl: this.Const.imDefaultHeadImg,
                    nickName: ""
                };
            },

            AuthonChanged() {
                let me = new UserInfoModel().getModel("me") || {};
                if(!me.userId) return;

                new SosoEntrustClaim({
                    youyouUserId: me.userId
                }).send().then(res => {
                    let userInfo = new UserInfoModel().getModel("userInfo") || {};
                    this.userInfo = userInfo.userInfo || {
                        avatarUrl: this.Const.imDefaultHeadImg,
                        nickName: ""
                    };
                    if(res.STATUS == 1 && res.DATA.hasClaim == 1){
                        this.showClaim = true;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    /* 认领委托弹窗 */
    .claim-model{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    .claim-model-mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
    }
    .claim-model-cont{
        position: relative;
        z-index: 200;
        width: 610upx;
        background-color: #ffffff;
        border-radius: 10upx;
        padding-bottom: 60upx;
    }

    .claim-model-cont .cont-head{
        width: 100%;
        height: 190upx;
        position: relative;
        background: url("http://cdn.haofang.net/static/uuminiapp/claimEntrust/model_bg.png") center no-repeat;
        background-size: cover;
        text-align: center;
        border-radius: 10upx 10upx 0upx 0upx;
    }
    .claim-model-cont .close{
        width: 60upx;
        height: 60upx;
        position: absolute;
        right: 0upx;
        top: 0upx;
        z-index: 30;
        background: url("http://cdn.haofang.net/static/uuminiapp/claimEntrust/close_icon.png") center no-repeat;
        background-size: 33% 33%;
    }
    .claim-model-cont .cont-head .user{
        width: 160upx;
        height: 206upx;
        position: absolute;
        top: 90upx;
        left: 0;
        right: 0;
        margin:auto;
    }
    .claim-model-cont .cont-head .user image{
        width: 150upx;
        height: 150upx;
        border-radius: 50% 50%;
        border: 6upx solid #fff;
    }
    .claim-model-cont .cont-head .user .name{
        font-family: MicrosoftYaHei;
        font-size: 32upx;
        color: #333333;
    }
    .cont-main{
        text-align: center;
    }
    .cont-main .explain{
        width: 448upx;
        margin: 0 auto;
        margin-top: 167upx;
        font-family: PingFang-SC-Medium;
        font-size: 28upx;
        line-height: 40upx;
        letter-spacing: 0upx;
        color: #666666;
    }
    .claim-btn{
        text-align: center;
        width: 510upx;
        height: 80upx;
        margin: 0 auto;
        background-image: linear-gradient(-90deg,
        #fe8e0d 0%,
        #ff6f2e 100%),
        linear-gradient(
                #00ca85,
                #00ca85);
        background-blend-mode: normal,
        normal;
        border-radius: 40upx;
        font-size: 32upx;
        color: #ffffff;
        line-height: 80upx;
        margin-top: 64upx;
    }
</style>