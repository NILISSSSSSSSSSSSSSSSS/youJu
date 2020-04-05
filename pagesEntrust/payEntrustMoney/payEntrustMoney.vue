<template>
	<view class="pay_view">
		<view class="pay_title">佣金（中介费）总额</view>

        <view class="broker_money">￥{{ payEntrustInfo.brokerMoney }}</view>

        <view class="house_price">房屋总价{{ payEntrustInfo.houseMoney }}{{ payEntrustInfo.priceUnit }}</view>

        <view class="pay_particulars f_r_c">
            <view class="line-box"></view>
            <view class="line-txt">佣金支付明细</view>
            <view class="line-box"></view>
        </view>

        <view class='pay-text pay-text-coupan f_r_b' v-if="!!payEntrustInfo.shareMoney">优惠券抵扣：<text>-{{payEntrustInfo.shareMoney}}元</text></view>

        <view class="pay-text f_r_b"><text>线上佣金支付：</text><text>{{ payEntrustInfo.onlinePayMoney }}元</text></view>

        <!-- 专属优惠券 -->
        
        <view class='pay-text f_r_b'>线下佣金支付：<text>{{payEntrustInfo.offlinePayMoney}}元</text></view>
        <view class='pay-btn-box' @click="payMoney">确认支付{{payEntrustInfo.onlinePayMoney}}元</view>
        <view class='reminder-txt'>合同签订前请拒绝支付，剩余佣金请线下支付</view>

        <loginView></loginView>
    </view>
</template>

<script>
    import {CreateOrderId, GetPayMoneyInfo} from "../../net/entrust/PayEntrustMoney";
    import {UserInfoModel} from "../../model/UserInfoModel";
    import { Notify } from "../../utils/Notify.js";
    import { Notification } from "../../utils/Notification.js";
    import {WxAppPay} from "../../utils/PayReqeust";

    let privateData = {
        params: {
            pushLogId: "", // 委托id
            recomInfoId: "",
            caseId: "",
            caseType: ""
        }
    };

    export default {
        data() {
            return {
                payEntrustInfo: {
                    brokerMoney: "",  // 支付的总额
                }
            }
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

        onLoad(options) {
            // 监听用户信息事件
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
            this.initParams(options);
            this.initPayMoneyInfo();
        },

        onUnload() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        methods: {
            // 用户消息回调
            UserInfoChanged() {
                this.initPayMoneyInfo();
            },

            // 初始化参数
            initParams(options) {
                for (let key in options) {
                    if (privateData.params[key] !== undefined) {
                        privateData.params[key] = options[key];
                    }
                }
            },

            // 初始化支付信息
            initPayMoneyInfo() {
                if (!privateData.params.pushLogId || !privateData.params.recomInfoId) {
                    uni.showToast({title: "缺少参数", icon: "none"});
                    return;
                }

                new GetPayMoneyInfo({
                    pushLogId: privateData.params.pushLogId,
                    recomInfoId: privateData.params.recomInfoId}).send()
                    .then(res => {
                        let data = res.DATA || {};
                        this.payEntrustInfo = {
                            brokerMoney: data.brokerMoney || "",
                            houseMoney: data.houseMoney || "",
                            priceUnit: data.priceUnit || "",
                            brokerBuTieMoneyDesc: data.brokerBuTieMoneyDesc || "",
                            onlinePayMoney: data.onlinePayMoney || "",
                            offlinePayMoney: data.offlinePayMoney || "",
                            caseId: data.vipCaseId || "",
                            caseType: data.caseType || "",
                            cityId: data.cityId || "",
                        };
                    })
                    .catch(() => {
                        uni.showModal({
                            title: "温馨提示",
                            content: "获取支付信息失败啦！请稍后重试。",
                            showCancel: false,
                            confirmColor: "#ab7f2e",
                            confirmText: "我知道了"
                        });
                    })
            },

            // 支付订单
            payMoney() {
                let me = new UserInfoModel().getModel("me") || {};
                if (!me.openId || !me.userId) {
                    console.error("暂无用户id、openId");
                    return;
                }

                if (!this.payEntrustInfo.onlinePayMoney || this.payEntrustInfo.onlinePayMoney == 0) {
                    uni.navigateBack({delta: 1});
                    return;
                }

                new CreateOrderId({
                    openId: me.openId || "",
                    money: this.payEntrustInfo.onlinePayMoney,
                    caseId: this.payEntrustInfo.caseId,
                    caseType: this.payEntrustInfo.caseType,
                    cityId: this.payEntrustInfo.cityId,
                    userId: me.userId,
                    logId: privateData.params.pushLogId,
                    recomHouseId: privateData.params.recomInfoId,
                }).send()
                    .then(res => {
                        if (res.STATUS != 1) {
                            uni.showToast({title: "支付失败", icon: "none"});
                            return;
                        }

                        let data = res.DATA || {};
                        let wxPayVal = new WxAppPay();
                        let wxPayItem = wxPayVal.getItem();
                        wxPayItem.appId = data.appId;
                        wxPayItem.timeStamp = data.timeStamp;
                        wxPayItem.nonceStr = data.nonceStr;
                        wxPayItem.package = data.package;
                        wxPayItem.signType = data.signType;
                        wxPayItem.paySign = data.paySign;
                        wxPayVal.initPay(wxPayItem)
                            .then(res => {
                                wx.navigateBack({delta: 1});
                            })
                            .catch(err => {
                                let failTitle = "支付失败";
                                if(err.msg && err.msg.indexOf("fail cancel") >= 0) {
                                    failTitle = "取消支付";
                                }
                                uni.showToast({title: failTitle, icon: "none"});
                            });
                    })
                    .catch(err => {
                        uni.showToast({title: "支付失败", icon: "none"});
                    });
            }
        }
    }
</script>

<style>
    .pay_view{
        padding: 60upx;
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
    }
    .pay_title{
        width:100%;
        box-sizing:border-box;
        font-size:28upx;
        color:#999;
        margin-bottom:60upx;
    }
    .broker_money{
        font-size:64upx;
        text-align:center;
        margin-bottom:40upx;
    }
    .house_price{
        text-align:center;
        font-size:30upx;
        margin-bottom:40upx;
    }
    .pay_particulars{
        width:100%;
        font-size:30upx;
        align-items: center;
        margin-bottom:60upx;
    }
    .line-box{
        width:25%;
        height:1px;
        background:#F5F5F5;
    }
    .line-txt{
        padding:0 20upx;
        flex-shrink: 0;
    }
    .pay-text{
        position:relative;
        left:0;
        right:0;
        margin:auto;
        width:100%;
        padding:30upx 0;
        border-top:1px dashed #eee;
        font-size:30upx;
    }
    .pay-text.pay-text-coupan{
        border-top:none;
    }
    .pay-btn-box{
        position:relative;
        left:0;
        right:0;
        margin:30upx auto 30upx;
        width:100%;
        height:100upx;
        background:-webkit-linear-gradient(left, rgb(255,111,46) , rgb(254,142,13));
        line-height:100upx;
        color:#fff;
        border-radius:10upx;
        will-change: transform;
        font-size:32upx;
        text-align: center;
        box-sizing: border-box;
    }
    .reminder-txt{
        position:relative;
        left:0;
        right:0;
        margin:auto auto 10upx;
        width:100%;
        font-size:24upx;
        color:#999;
        padding-left:20upx;
        box-sizing: border-box;
    }
    .reminder-txt::before{
        content: "";
        display: block;
        position: absolute;
        width: 10upx;
        height: 10upx;
        background: #00ca85;
        top: 12upx;
        left: 0;
        border-radius: 100%;
        will-change: transform;
    }
</style>
