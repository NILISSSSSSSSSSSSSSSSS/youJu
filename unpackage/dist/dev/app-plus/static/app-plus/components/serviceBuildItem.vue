

<template>
    <div class="service-item" :style="{marginLeft:index==0?'40rpx':''}">
        <image class="service-build-pic" resize="cover"
               :placeholder="buildPic" :src="item.buildPic"></image>

        <text class="service-build-name">{{ item.buildName }}</text>
        <text class="service-build-price">{{ item.unitPrice }}</text>
        <div class="f_r_s service-in-cont">
            <text class="service-num-text">在租{{ item.inLeaseNum }}套</text>
            <text class="service-num-text">在售{{ item.inLeaseNum }}套</text>
        </div>
    </div>
</template>

<script>
    import {ServiceBuildItem} from "./ComponentItem";
    import {Const} from "../../../utils/Const";

    export default {
        computed: {
            buildPic() {
                return Const.houseDefaultImg;
            }
        },
        props: {
            item: {
                type: Object,
                default() {
                    return new ServiceBuildItem();
                }
            },
            index: {
                type: Number|String,
                default() {
                    return 1;
                }
            }
        }
    }
</script>

<style>
    .service-item{
        background-color: #ffffff;
        width: 312rpx;
        border-bottom-left-radius: 6rpx;
        border-bottom-right-radius: 6rpx;
        border-top-left-radius: 6rpx;
        border-top-right-radius: 6rpx;
        margin-right: 30rpx;
        padding-bottom: 30rpx;
        margin-top: 20rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 0 20px 0 rgba(194, 194, 194, 0.3);
    }
    .service-build-pic{
        width: 312rpx;
        height: 220rpx;
        border-top-left-radius: 6rpx;
        border-top-right-radius: 6rpx;
    }
    .service-build-name{
        margin-top: 20rpx;
        padding-left: 20rpx;
        flex: 1;
        padding-right: 20rpx;
        line-height: 40rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
    }
    .service-build-price{
        padding-left: 20rpx;
        padding-right: 20rpx;
        line-height: 40rpx;
        margin-top: 10rpx;
        font-size: 30rpx;
        color: #ff5400;
    }
    .service-in-cont{
        padding-left: 20rpx;
        padding-right: 20rpx;
        flex: 1;
        line-height: 40rpx;
    }
    .service-num-text{
        line-height: 40rpx;
        flex: 1;
        text-align: left;
        font-size: 24rpx;
        font-weight: normal;
        color: #999999;
    }
</style>