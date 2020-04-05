<template>
		<!-- - type 1(约看)、2(带看)  || lookFlag带看里面的 1已看 || lookSource约看房源是否外部房源0=内部 1=外部 - -->
    <view class="m-list-ul">
        <view class="m-list-item" v-for="(item, index) in lookList" :key="index"
              @click="houseDetail(item)">
            <text class="m-round"></text>
            <text class="m-round-line"></text>
            <view class="u-item-image" v-if="item.lookSource !== 1">
                <image :src="item.thumbUrl" mode='aspectFill'/>
                <!-- - 带看展示 未看 显示图片 - -->
                <image v-if="type !== 1 && item.lookFlag !== 1" class="u-item-label"
                       src="http://cdn.haofang.net/static/uuminiapp/packageShare/takeAboutLook/no_house_icon.png" />
            </view>
            <view class="u-item-info">
                <!-- - 带看展示 未看 改变字体颜色 - -->
                <view class="u-info-build-name" :class="type !== 1&&item.lookFlag !== 1?'not-look':''">{{item.buildName}}</view>
                <view class="u-info-build-info" :class="type !== 1&&item.lookFlag !== 1?'not-look':''"
                      v-if="item.lookSource !== 1">
                    <text>{{item.houseRoom?item.houseRoom+"室":""}}{{item.houseWei?item.houseWei+"卫":""}}{{item.houseHall?item.houseHall+"厅":""}}</text>
                    <text v-if="item.houseArea">{{item.houseArea}}㎡</text>
                    <text v-if="item.regionName">{{item.regionName}}</text>
                </view>
                <view class="u-info-build-price" :class="type !== 1&&item.lookFlag !== 1?'not-look':''"  v-if="item.lookSource !== 1">
                    <text v-if="item.houseTotalPrice" class="u-total-price"
                          :class="type !== 1&&item.lookFlag !== 1?'not-look':''">{{item.houseTotalPrice}}
                        <text class="u-total-price-unit">{{item.caseType == 3? "万": "元"}}</text></text>
                    <text v-if="item.houseUnitPrice" class="u-average-price"
                          :class="type !== 1&&item.lookFlag !== 1?'not-look':''">{{item.houseUnitPrice}}元/㎡</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            lookList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            type: {
                type: String | Number,
                default: function () {
                    return 1;
                }
            }
        },

        methods: {
            houseDetail(item) {
                // 判断 是否房源已下架
								console.log(item);
                if (item.houseStatus > 4) {
                    uni.showToast({title: "房源已下架",icon: 'none',});
                    return;
                }

                if (!item.houseId) {
                    uni.showToast({title: "暂无房源id",icon: 'none',});
                    return;
                }
								let caseType = item.caseType == 3 ? 1 : 2;
                uni.navigateTo({
                    url: "/pagesHouse/erHouseDetail/erHouseDetail?isAboutTake=" + true
                        + "&cityId=" + item.cityId + "&caseId=" + item.houseId
                        + "&caseType=" + caseType + "&deptName=" + item.deptName
                        + "&resource=1" + "&archiveId=" + item.archiveId
                });
            }
        }
    }
</script>

<style>
    .m-list-ul{
        height: 100%;
        position: relative;
        padding-left: 36upx;
        overflow: hidden;
    }
    .m-list-item{
        width: 100%;
        height: auto;
        display: block;
        border-bottom: 1upx solid #ececec;
        padding: 36upx 0;
        position: relative;
    }
    .m-list-item:last-child{
        border-bottom: none !important;
    }
    .m-round{
        display: block;
        position: absolute;
        left: -36upx;
        top: 36upx;
        width: 14upx;
        height: 14upx;
        background-color: #e6e6e6;
        border: 2upx solid #fff;
        border-radius: 50%;
    }
    .m-round-line{
        display: block;
        position: absolute;
        left: -29upx;
        top: 60upx;
        width: 2upx;
        height: 210upx;
        background-color: #e6e6e6;
        border-radius: 50%;
    }
    .m-list-item:last-child:after{
        display: block;
        content: '';
        clear: both;
        position: absolute;
        left: -29upx;
        top: 60upx;
        width: 1upx;
        height: 100%;
        background-color: #e6e6e6;
        border-radius: 50%;
    }

    .u-item-image{
        width: 216upx;
        height: 164upx;
        background: url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png?t=20190717) #f8f8f8 no-repeat center;
        background-size: cover;
        float: left;
        position: relative;
        margin-right: 33upx;
        border-radius: 4upx;
    }
    .u-item-image image{
        width: 100%;
        height: 100%;
        border-radius: 4upx;
    }
    .u-item-label{
        width: 93upx !important;
        height: 34upx !important;
        position: absolute;
        top: 0;
        left: 0;
    }
    .u-item-info{
        overflow: hidden;
        height: auto;
    }
    .not-look{
        color: #b9bdc1 !important;
    }
    .u-info-build-name{
        font-size: 34upx;
        color: #101d36;
        font-weight: bold;
    }
    .u-info-build-info{
        font-size: 26upx;
        color: #101d37;
        padding-top: 9upx;
    }
    .u-info-build-info text{
        border-right: 1upx solid #babfc5;
        padding: 0 10upx;
    }
    .u-info-build-info text:first-child{
        padding-left: 0upx !important;
        padding-right: 10upx;
    }
    .u-info-build-info text:last-child{
        border-right: none;
    }
    .u-info-build-price{
        padding-top: 11upx;
    }
    .u-total-price{
        color: #ab7f2e;
        font-size: 34upx;
        font-weight: bold;
    }
    .u-total-price-unit{
        font-size: 24upx !important;
        font-weight: normal;
    }
    .u-average-price{
        font-size: 24upx;
        color: #8e94a1;
        padding-left: 14upx;
    }
</style>
