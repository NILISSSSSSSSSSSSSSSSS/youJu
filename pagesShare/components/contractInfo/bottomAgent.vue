<template>
    <view class="bottom_agent_view f_r_b">
        <view class="bottom_agent_left f_r_s">
            <view class="bottom_agent_head f_c_c">
                <image mode="aspectFill" class="bottom_agent_img" :src="item.archiveHeadImg"></image>
            </view>

            <view class="bottom_agent_text f_c_c">
                <view class="bottom_agent_mame">{{ item.archiveName }}</view>
                <view class="bottom_agent_deptName">{{ item.archiveDeptName }}</view>
            </view>
        </view>

        <view @click.top="onlineChart" class="online_chart global-confirm-btn">在线咨询</view>
    </view>
</template>

<script>
    import {UserInfoModel} from "../../../model/UserInfoModel";

    class BottomAgentItem {
        archiveId = "";  // 经纪人id
        archiveName = "";  // 经纪人姓名
        archiveHeadImg = "";  // 经纪人头像
        archiveDeptName = "";  // 经纪人所在门店
    }

    export default {
        props: {
            item: {
                default() {
                    return new BottomAgentItem();
                },
                type: Object
            }
        },

        methods: {
            onlineChart() {
                if(!this.item.archiveId) {
                    uni.showToast({title: "暂无经纪人id", icon: "none"});
                    return;
                }

                let me = new UserInfoModel().getModel("me") || {};
                let url = "/pagesTool/messageDetail/messageDetail";
                uni.navigateTo({
                    url: url + '?messageId=' + this.item.archiveId
                        + "&userId=" + me.userId + "&openId=" + me.openId
                        + "&name=" + this.item.archiveName
                });
            }
        }
    }
</script>

<style>
    .bottom_agent_view{
        box-shadow:0 4upx 33upx 2upx rgba(55, 55, 55, 0.1);
        position: fixed;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 20;
        width: 100%;
        box-sizing: border-box;
        background: #ffffff;
        padding: 20upx 30upx;
    }
    .bottom_agent_left{
        width: calc(100% - 335upx);
    }
    .bottom_agent_head{
        border: 1up solid #eeeeee;
        box-sizing: border-box;
        width: 90upx;
        height: 90upx;
        overflow: hidden;
        margin: auto 20upx auto 0;
        flex-shrink: 0;
        border-radius: 100%;
    }
    .bottom_agent_img{
        width: 100%;
        height: 100%;
    }
    .bottom_agent_text{
        text-align: left;
        width: calc(100% - 110upx);
    }
    .bottom_agent_mame{
        font-size: 32upx;
        color: #101d36;
        line-height: 40upx;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: bold;
        margin-top: 10upx;
    }
    .bottom_agent_deptName{
        color: #8e94a1;
        font-size: 26upx;
        line-height: 40upx;
        text-align: left;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .online_chart{
        width: 308upx;
        height: 100upx;
        line-height: 100upx;
        text-align: center;
        border-radius: 10upx;
        box-sizing: border-box;
        overflow: hidden;
        color: #ffffff;
        font-size: 30upx;
        background:-webkit-linear-gradient(left, #ab7f2e, #ff8400);
        margin-left: 25upx;
        flex-shrink: 0;
    }
</style>