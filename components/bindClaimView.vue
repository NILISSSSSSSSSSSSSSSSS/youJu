<template>
    <view class="bind-claim-model" v-if="showClaim">
        <view class="mask"></view>
        <view class="cont">
            <view class="close" @click="closeBindModel"></view>
            <view class="title">系统识别您在平台发布了委托！</view>
            <view class="text">您可前往查看与经纪人在线沟通，实时关注委托进度。</view>
            <view class="btn" @click="toTrustList">查看委托</view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                showClaim: true
            }
        },

        methods: {
            closeBindModel() {
                this.showClaim = false;
            },

            toTrustList() {
                this.showClaim = false;
                uni.redirectTo({
                    url: '/pagesEntrust/trustList/trustList?isfromClaimEntrust=1'
                });
            }
        }
    }
</script>

<style scoped>
    .bind-claim-model{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: 9999;
    }
    .bind-claim-model .mask{
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0.5;
        z-index: 500;
        position: absolute;
        top: 0;
        left: 0;
    }
    .bind-claim-model .cont{
        width: 610upx;
        height: 425upx;
        background-color: #ffffff;
        border-radius: 10upx;
        padding: 70upx 50upx 60upx 50upx;
        z-index: 999;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        box-sizing: border-box;
        text-align: center;
    }
    .bind-claim-model .btn{
        width: 510upx;
        height: 80upx;
        background-image: linear-gradient(-90deg,
        #fe8e0d 0%,
        #ff6f2e 100%),
        linear-gradient(
                #00ca85,
                #00ca85);
        background-blend-mode: normal,
        normal;
        border-radius: 40upx;
        color: #ffffff;
        font-size: 32upx;
        text-align: center;
        line-height: 80upx;
    }
    .bind-claim-model .title{
        font-size: 34upx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 40upx;
    }
    .bind-claim-model .text{
        font-size: 26upx;
        text-align: left;
        line-height: 36upx;
        color: #666666;
        margin-bottom: 56upx;
    }
    .bind-claim-model .close{
        width: 60upx;
        height: 60upx;
        position: absolute;
        right: 0upx;
        top: 0upx;
        z-index: 30;
        background: url("http://cdn.haofang.net/static/uuminiapp/mine/close_icon.png") center no-repeat;
        background-size: 33%;
    }
</style>