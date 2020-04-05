<template>
    <view class="m-look-info">
        <view class="m-demand-text">您的需求：
            <text v-if="lookInfo.castType">{{lookInfo.castType==3?"求购":"求租"}}</text>
            <text>{{lookInfo.houseUseage}} </text>
            <text v-if="lookInfo.houseRoom">{{lookInfo.houseRoom}} </text>
            <text>{{ lookInfo.houseAreaLow }}{{lookInfo.houseAreaLow&&lookInfo.houseAreaHigh?'-':''}}{{ lookInfo.houseAreaHigh?lookInfo.houseAreaHigh+'㎡':'' }}</text>
        </view>
        <view class="m-address-info">
            <image class="u-place-icon" v-if="lookInfo.regionName" src="http://cdn.haofang.net/static/uuminiapp/packageShare/takeAboutLook/place_icon.png" />{{lookInfo.regionName}}
            <image class="u-village-icon" v-if="lookInfo.sectionName" src="http://cdn.haofang.net/static/uuminiapp/packageShare/takeAboutLook/village_icon.png" />{{lookInfo.sectionName}}
        </view>

        <view class="m-look-time" v-if="lookInfo.type">{{lookInfo.type == 1? "约看":"带看"}}时间：</view>
        <view class="u-time">{{lookInfo.lookTime}} <text v-if="lookInfo.type == 1 && lookInfo.hour && lookInfo.hour > 0" class="u-distance-time">距离看房还有 {{lookInfo.distanceTime}}</text></view>
    </view>
</template>

<script>
    class LookInfoItem {
        castType = "";
        houseUseage = "";  // 用途
        houseRoom = "";  // 室
        houseAreaLow = "";  // 面积最小值
        houseAreaHigh = "";  // 面积最大值
        regionName = "";  // 区域名称
        sectionName = "";  // 商圈名称
        type = "";  // 1： 约看， 其他：带看
        lookTime = "";
        hour = "";
        distanceTime = "";  // 看房剩余时间
    }

    export default {
        props: {
            lookInfo: {
                type: Object,
                default: function () {
                    return new LookInfoItem();
                }
            },
        },
    }
</script>

<style>
    .m-look-info{
        height: auto;
        background-color: #fff;
        box-shadow: 0upx 0upx 30upx 0upx rgba(0, 0, 0, 0.08);
        border-radius: 20upx;
        padding: 40upx 30upx 51upx 30upx;
    }
    .m-demand-text{
        font-size: 32upx;
        color: #101d36;
        font-weight: bold;
    }
    .m-address-info{
        font-size: 24upx;
        color: #7b8191;
        padding-top: 10upx;
        vertical-align: bottom;
    }
    .m-address-info image{
        padding-right: 8upx;
        margin-bottom: -2upx;
    }
    .u-place-icon{
        width: 24upx;
        height: 24upx;
    }
    .u-village-icon{
        width: 24upx;
        height: 28upx;
        margin-left: 30upx;
    }

    .m-look-time{
        padding-top: 35upx;
        font-size: 32upx;
        color: #101d36;
        font-weight: bold;
    }
    .u-time{
        padding-top: 23upx;
        font-size: 30upx;
        color: #101d36;
        height: 30upx;
        line-height: 30upx;
    }
    .u-distance-time{
        font-size: 24upx;
        color: #7b8191;
        float: right;
    }
</style>
