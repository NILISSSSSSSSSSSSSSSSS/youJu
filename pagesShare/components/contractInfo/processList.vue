<template>
    <view class="process_list" v-if="list">
        <view class="process_list_title">交易进度</view>

        <view class="process_list_view" v-if="list.length > 0">
            <block v-for="(item, index) in list" :key="index">
                <view class="f_r_s process_list_item" :class="{ process_list_item_active : item.status == 3 }">
                    <view class="f_c_s process_list_item_left">
                        <view v-if="index == 0" :class="{process_list_icon_active : item.status == 3}"
                              class="process_list_icon f_c_c">
                            <view class="process_list_icon_cont"></view>
                        </view>
                        <view v-if="index != 0 && item.status != 3" class="process_list_point"></view>
                        <view v-if="index != 0 && item.status == 3"
                              class="process_list_point_active f_c_c">
                            <view class="process_list_point_cont"></view>
                        </view>
                    </view>

                    <view class="process_line" :class="{process_line_active : ((index != 0 & item.status == 3) || index == 0)}"></view>

                    <view class="f_c_s process_list_info">
                        <view class="process_list_info_title">{{ item.title }}</view>

                        <view class="f_r_b process_list_info_text">
                            <view class="f_r_s process_list_info_deal">
                                <view class="process_list_info_deal_title">负责人:</view>

                                <view>{{ item.dealName }}</view>
                            </view>

                            <view class="f_r_s process_list_info_time" v-if="(item.status == 2 && item.realityTime) || (item.status != 2 && item.planTime)">
                                <view class="process_list_info_deal_title">{{ item.status == 2 ? '实际完成' : '计划完成' }}:</view>

                                <view>{{ item.status == 2 ? item.realityTime : item.planTime }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </block>
        </view>

        <view class="process_list_empty f_c_c" v-if="list.length === 0">
            <image class="list_empty_img" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/empty_progress.png"></image>
            <view class="list_empty_text">暂无交易进度</view>
        </view>
    </view>
</template>

<script>
    class ProcessListItem {
        title = "";  // 介绍标题
        dealName = ""; // 负责人姓名
        planTime = "";  // 计划完成时间(已处理)
        realityTime = "";  // 实际完成时间(已处理)
        status = 1;  // 1 计划中  2 已完成  3 正在处理
    }

    export default {
        props: {
            list: {
                default() {
                    return null;
                },
                type: Array | null
            }
        }
    }
</script>

<style scoped>
    .process_list{
        padding: 33upx 37upx 0;
        box-sizing: border-box;
        width: 100%;
    }
    .process_list_title{
        width: 100%;
        text-align: left;
        line-height: 60upx;
        color: #101d36;
        font-size: 34upx;
        font-weight: bold;
    }
    .process_list_view{
        margin-top: 20upx;
    }
    .process_list_item{
        width: 100%;
        position: relative;
        color: #abadb9;
    }
    .process_list_item_active{
        color: #3396fb !important;
    }
    .process_list_item_left{
        width: 38upx;
        flex-shrink: 0;
        margin: 7upx 30upx auto 0;
        height: 100%;
    }
    .process_list_icon_active{
        border: 2upx solid #3396fb !important;
    }
    .process_list_icon_active .process_list_icon_cont{
        border-color: #3396fb !important;
    }
    .process_list_icon{
        flex-shrink: 0;
        margin: 0 auto;
        width: 36upx;
        height: 36upx;
        border: 2upx solid #d0d0d0;
        box-sizing: border-box;
        border-radius: 100%;
        position: relative;
    }
    .process_list_icon_cont{
        flex-shrink: 0;
        margin: 0 auto;
        width: 9upx;
        height: 16upx;
        border-color: #d0d0d0;
        border-style: solid;
        border-width: 0 3upx 5upx 0;
        position: absolute;
        left: 50%;
        top: 43%;
        transform: translate(-50%, -50%) rotate(45deg);
    }
    .process_list_point{
        flex-shrink: 0;
        width: 14upx;
        height: 14upx;
        background: #e1e1e1;
        border-radius: 100%;
        margin: 5upx auto 5upx auto;
    }
    .process_list_point_active{
        flex-shrink: 0;
        margin: 5upx auto 5upx auto;
        background: rgba(51,150,251,0.2);
        width: 30upx;
        height: 30upx;
        border-radius: 100%;
        box-sizing: border-box;
        position: relative;
    }
    .process_list_point_cont{
        background: #3396fb;
        width: 14upx;
        height: 14upx;
        border-radius: 100%;
        margin: auto;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .process_list_info{
        width: 100%;
        padding-bottom: 30upx;
        box-sizing: border-box;
    }
    .process_list_info_title{
        width: 100%;
        text-align: left;
        font-size: 28upx;
        line-height: 40upx;
    }
    .process_list_info_text{
        width: 100%;
        text-align: left;
    }
    .process_list_info_deal{
        width: 45%;
        font-size: 26upx;
        line-height: 50upx;
    }
    .process_list_info_deal_title{
        margin-right: 17upx;
    }
    .process_list_info_time{
        width: 55%;
        font-size: 26upx;
        line-height: 50upx;
    }
    .process_line{
        background: #cccccc;
        width: 1upx;
        margin: auto;
        position: absolute;
        left: 18upx;
        top: 33upx;
        bottom: 4upx;
    }
    .process_line_active{
        top: 50upx !important;
    }

    .process_list_empty{
        margin-top: 160upx;
    }
    .list_empty_img{
        width: 323upx;
        height: 223upx;
        flex-shrink: 0;
        margin: auto;
    }
    .list_empty_text{
        color: #89909d;
        font-size: 30upx;
        text-align: center;
        margin-top: 30upx;
    }
</style>