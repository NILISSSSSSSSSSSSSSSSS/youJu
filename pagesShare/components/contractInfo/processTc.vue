<template>
    <view>
        <view class="process_contract f_c_s" v-if="showTc">
            <image class="process_img" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/contract.png"></image>

            <button open-type="getPhoneNumber" @getphonenumber="getPhone"
                    hover-class="none" class="process_btn global-confirm-btn">查询合同进度</button>
        </view>

        <get-user-info></get-user-info>
    </view>
</template>

<script>
    import {UserInfoModel} from "../../../model/UserInfoModel";
    import {BindTel} from "../../../net/BindTel";
    import {GpsInfoModel} from "../../../model/GpsInfoModel";
    import {Notify} from "../../../utils/Notify";
    import {Notification} from "../../../utils/Notification";
    import {GetUserTel} from "../../../utils/common";
    import {CheckIsCanLookContract} from "../../net/ContractNet";

    export default {
        data() {
            return {
                showTc: false,
            }
        },

        props: ["erpCompId", "cityId", "dealId", "userId"],

        created() {
            this.UserInfoChanged();
            // 监听用户信息事件
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
        },

        destroyed() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        methods: {
            // 用户信息回调
            UserInfoChanged(name, item) {
                if(!new UserInfoModel().getModel("telephone")) {
                    this.showTc = true;
                    return;
                }

                new CheckIsCanLookContract({
                    cityId: this.cityId,
                    dealId: this.dealId,
                    openId: new UserInfoModel().getModel("me").openId || "",
                    userId: this.userId,
                    mobile: new UserInfoModel().getModel("telephone") || ""
                }).send().then(res => {
                    uni.hideLoading();
                    this.showTc = false;
                    this.$emit("TelephoneChanged", new UserInfoModel().getModel("telephone"));
                }).catch(() => {
                    this.showTc = true;
                });
            },

            // 初始化是否显示
            initStatus() {
                if(!new UserInfoModel().getModel("telephone")
                    && new UserInfoModel().getModel("userInfo")
                    && new UserInfoModel().getModel("userInfo").userInfo
                    && new UserInfoModel().getModel("userInfo").userInfo.nickName
                    && new UserInfoModel().getModel("me")
                    && new UserInfoModel().getModel("me").userId) {
                    this.showTc = true;
                    return;
                }

                if(new UserInfoModel().getModel("telephone")) {
                    this.showTc = false;
                }
            },

            // 获取手机号
            getPhone(e) {
                let that = this;
                //拒绝授权
                if(e.detail.errMsg && e.detail.errMsg.indexOf("fail user deny") >= 0) {
                    return;
                }

                // 您的微信还未绑定手机号
                if(e.detail.errMsg && e.detail.errMsg.indexOf("resp data is empty") >= 0) {
                    uni.showModal({
                        title:"未获取到授权信息",
                        content:"您还未绑定手机号",
                        confirmText: "去绑定",
                        success: function (res) {
                            if (res.confirm) {
                                that.changePhone();
                            }
                        }
                    });
                }

                if (!e.detail.encryptedData) {
                    return;
                }

                uni.showLoading({title: "加载中...", mask: true});
                GetUserTel.init(e).then(tel => {
                    if(!new UserInfoModel().getModel("telephone")) {
                        uni.hideLoading();
                        return;
                    }

                    // 认领委托
                    new BindTel({
                        cityId: new GpsInfoModel().getModel("cityInfo").cityId,
                        youyouUserId: new UserInfoModel().getModel("me").userId,
                        userMobile: new UserInfoModel().getModel("telephone"),
                        verify: 9999,
                    }).send();

                    new CheckIsCanLookContract({
                        cityId: that.cityId,
                        dealId: that.dealId,
                        openId: new UserInfoModel().getModel("me").openId || "",
                        userId: that.userId,
                        mobile: new UserInfoModel().getModel("telephone") || ""
                    }).send().then(res => {
                        uni.hideLoading();
                        that.showTc = false;
                        this.$emit("TelephoneChanged", new UserInfoModel().getModel("telephone"));
                    }).catch(err => {
                        uni.hideLoading();
                        uni.showToast({
                            title: "没有查询到您的合同信息，如有疑问请联系经纪人",
                            icon: "none"
                        });
                    });
                }).catch(() => {
                    uni.hideLoading();
                });
            },

            // 绑定电话
            changePhone() {
                uni.navigateTo({
                    url: "@/pagesTool/changePhone/changePhone"
                });
            },
        }
    }
</script>

<style>
    .process_contract{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        z-index: 8888;
    }
    .process_img{
        width: 439upx;
        height: 393upx;
        margin: 215upx auto 0;
        flex-shrink: 0;
    }
    .process_btn{
        margin: 145upx auto auto;
        width: 330upx;
        height: 90upx;
        line-height: 90upx;
        text-align: center;
        font-size: 32upx;
        color: #ffffff;
        border-radius: 45upx;
        box-sizing: border-box;
        background:-webkit-linear-gradient(left, #ff7626, #fe8a11);
    }
</style>