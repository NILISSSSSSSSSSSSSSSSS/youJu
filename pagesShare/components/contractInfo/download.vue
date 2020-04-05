<template>
    <view>
        <!--下载-->
        <image @click="downLoad" class="down_load" src="https://cdn.haofang.net/static/uuminiapp/pageNewUi/contract_download.png"></image>

        <!--下载弹窗-->
        <view class="close_down_view f_c_c" @click.stop="closeDown" @touchmove.stop.prevent="moveHandle"
              v-if="downTcShow">
            <view class="down_content f_c_s" @click.stop="">
                <view class="down_title">交易合同将通过邮件发送给您</view>

                <view class="down_input_view f_c_c">
                    <input class="down_input" placeholder-class="down_input_p"
                           :value="emailValue" @input="emailInput"
                           placeholder="请输入邮箱地址" />
                </view>

                <view class="down_btn f_r_b">
                    <view class="cancel_down" @click.stop="closeDown">取消</view>
                    <view class="send_down" @click.stop="sendDown">发送</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {SendContract} from "../../net/ContractNet";
    import {ContractCityIdModel, ContractDealIdModel} from "../../../model/ContractModel";

    export default {
        data() {
            return {
                downTcShow: false,
                emailValue: "",
            }
        },

        props: {},

        methods: {
            moveHandle() {},

            // 邮箱输入
            emailInput(e) {
                this.emailValue = e.detail.value;
            },

            // 下载按钮
            downLoad() {
                this.downTcShow = true;
            },

            // 关闭下载弹窗
            closeDown() {
                this.downTcShow = false;
            },

            // 发送下载
            sendDown() {
                let strRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
                if(!this.emailValue) {
                    uni.showToast({title: "请输入邮箱地址", icon: "none"});
                    return;
                }

                if(!strRegex.test(this.emailValue)) {
                    uni.showToast({title: "邮箱地址有误", icon: "none"});
                    return;
                }

                uni.showLoading({title: "发送中...", mask: true});
                new SendContract({
                    cityId: new ContractCityIdModel().getModel(),
                    emailAddress: this.emailValue,
                    dealId: new ContractDealIdModel().getModel()
                }).send()
                    .then(res => {
                        this.closeDown();
                        uni.hideLoading();
                        uni.showToast({title: "发送成功", icon: "none"});
                    })
                    .catch(err => {
                        uni.hideLoading();
                        uni.showToast({title: err.msg || "发送失败", icon: "none"});
                    });
            }
        }
    }
</script>

<style>
    /*下载*/
    .down_load{
        width: 140upx;
        height: 140upx;
        position: fixed;
        bottom: 200upx;
        right: 30upx;
        z-index: 99;
    }

    /*弹窗*/
    .close_down_view{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    }
    .down_content{
        width: 630upx;
        margin: auto;
        flex-shrink: 0;
        background: #ffffff;
        border-radius: 20upx;
        box-sizing: border-box;
    }
    .down_title{
        font-size: 32upx;
        color: #333333;
        line-height: 70upx;
        text-align: center;
        margin-top: 35upx;
    }
    .down_input_view{
        background: #f4f4f4;
        height: 72upx;
        width: 530upx;
        margin: 18upx auto 47upx auto;
        border-radius: 7upx;
        box-sizing: border-box;
    }
    .down_input_p{
        color: #bbbbbb;
        font-size: 30upx;
        text-align: left;
    }
    .down_input{
        font-size: 30upx;
        height: 40upx;
        line-height: 40upx;
        color: #333333;
        text-align: left;
        width: 100%;
        padding-left: 30upx;
        padding-right: 30upx;
        box-sizing: border-box;
    }
    .down_btn{
        height: 90upx;
        line-height: 90upx;
        width: 100%;
        font-size: 32upx;
        text-align: center;
        border-top: 1upx solid #e7e7e7;
        box-sizing: border-box;
    }
    .cancel_down{
        width: 100%;
        color: #999999;
    }
    .send_down{
        color: #ab7f2e;
        width: 100%;
        border-left: 1upx solid #e7e7e7;
        box-sizing: border-box;
    }
</style>