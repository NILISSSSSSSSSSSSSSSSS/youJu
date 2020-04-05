<template>
    <view class="about_look">
        <loading-data v-if="isRequesting"></loading-data>

        <block v-if="!isRequesting">
            <lookHouseHeader :lookInfo="lookInfo"></lookHouseHeader>

            <view class="m-look-title">约看房源</view>

            <houseList :lookList="lookList" :type="1"></houseList>

            <view class="m-prompt">温馨提示：如需变更看房时间或约看房源，请联系经纪人。</view>

            <view class="m-foot">
                <view class="m-agent-icon">
                    <image :src="agentInfo.userPhoto" mode="aspectFill" />
                </view>

                <view class="m-agent-info">
                    <view class="u-agent-name">{{agentInfo.userName}}</view>
                    <view class="u-agent-store">{{agentInfo.deptName}}</view>
                </view>
                <view class="about-consult-btn global-confirm-btn" @click="onlineIm">
                    在线咨询
                </view>
            </view>
        </block>

        <loginView></loginView>
    </view>
</template>

<script>
    import lookHouseHeader from "../components/lookHouseHeader.vue";
    import houseList from "../components/houseList.vue";
    import {GetLookHouseInfo, RelationMakeHouseSchedule} from "../../net/lookHouse/GetLookHouseInfo";
    import {UserInfoModel} from "../../model/UserInfoModel";
    import { Notify } from "../../utils/Notify.js";
    import { Notification } from "../../utils/Notification.js";

    let privateData = {
        params: {
            aboutId: "",
            cityId: ""
        }
    };

    export default {
        components: {
            lookHouseHeader,
            houseList
        },

        data() {
            return {
                lookInfo: {},
                lookList: [],
                agentInfo: {},
                isRequesting: true
            }
        },

        onLoad(options) {
            // 监听用户信息事件
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);

            this.initParams(options);
            this.relevanceUser();
            this.initData();
        },

        onUnload() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        methods: {
            // 用户消息回调
            UserInfoChanged() {
                this.relevanceUser();
            },

            // 关联用户
            relevanceUser() {
                let me = new UserInfoModel().getModel("me") || {};
                if (!me.userId || !me.openId) return;

                new RelationMakeHouseSchedule({
                    cityId: privateData.params.cityId,
                    id : privateData.params.aboutId,
                    wxOpenId: me.openId,
                    wxUserId: me.userId
                }).send()
            },

            // 初始化参数
            initParams(options) {
                for (let key in options) {
                    if (privateData.params[key] !== undefined) {
                        privateData.params[key] = options[key];
                    }
                }
            },

            // 初始化数据
            initData() {
                if (!privateData.params.aboutId || !privateData.params.cityId) {
                    uni.showToast({title: "缺少aboutId、cityId", icon: "none"});
                    return;
                }

                this.isRequesting = true;
                new GetLookHouseInfo({
                    id: privateData.params.aboutId,
                    cityId: privateData.params.cityId,
                }).send()
                    .then(res => {
                        let data = res.data || {};
                        let makeCust = data.makeCust || {};
                        let lookTime = data.lookTime || {};
                        let wxMakeArchiveVO = data.wxMakeArchiveVO || {};
                        let makeHouseList = data.makeHouseList || [];
                        // 切换带看页面
                        if (data.lookStatus == 1 && data.takeLookId){
                            uni.redirectTo({
                                url: "/pagesShare/takeLook/takeLook?takeLookId="
                                    + data.takeLookId + "&cityId=" + privateData.params.cityId
                                    + "&archiveId=" + wxMakeArchiveVO.archiveId
                            });
                            return;
                        }

                        if(data.houseInfo){
                            makeHouseList.push({
                                buildName: data.houseInfo,
                                lookFlag: 1,
                                lookSource: 1,
                            })
                        }
                        let lookList = [];
                        for (let info of makeHouseList) {
                            info.cityId = privateData.params.cityId;
                            info.deptName = wxMakeArchiveVO.deptName;
                            info.archiveId = wxMakeArchiveVO.archiveId;
                            info.caseType = makeCust.custType;
                            lookList.push(info);
                        }
                        this.lookList = lookList;
                        this.lookInfo = {
                            type: 1,
                            castType: makeCust.custType,
                            houseUseage: makeCust.houseUseage,
                            houseAreaHigh: makeCust.houseAreaHigh,
                            houseAreaLow: makeCust.houseAreaLow,
                            houseRoom: makeCust.houseRoom ? makeCust.houseRoom+"室" : "",
                            regionName: makeCust.regionName,
                            sectionName: makeCust.sectionName,
                            lookTime: lookTime.monthDay +' '+ lookTime.weekDay +' '+ lookTime.hoursMinute,
                            distanceTime: lookTime.leftTime.day+"天"+ lookTime.leftTime.hour+"小时",
                            hour: lookTime.leftTime.hour
                        };
                        this.agentInfo = {
                            archiveId: wxMakeArchiveVO.archiveId,
                            userName: wxMakeArchiveVO.userName,
                            userPhoto: wxMakeArchiveVO.userPhoto || this.Const.imDefaultHeadImg,
                            deptName: wxMakeArchiveVO.deptName,
                        };
                        this.isRequesting = false;
                    })
                    .catch(err => {
                        uni.showModal({
                            title: "温馨提示",
                            content: "获取约看信息失败啦！请稍后重试。",
                            showCancel: false,
                            confirmColor: "#ab7f2e",
                            confirmText: "我知道了"
                        });
                    });
            },

            // 在线聊天
            onlineIm() {
                if(!this.agentInfo.archiveId) {
                    uni.showToast({
                        title: "暂无id，无法在线聊天",
                        icon: "none"
                    });
                    return;
                }

                let me = new UserInfoModel().getModel("me") || {};
                let url = "/pagesTool/messageDetail/messageDetail";
                uni.navigateTo({
                    url: url + '?messageId=' + this.agentInfo.archiveId
                        + "&userId=" + me.userId + "&openId=" + me.openId
                });
            }
        }
    }
</script>

<style>
    .about_look{
        widows: 100%;
        height:100%;
        padding: 18upx 30upx 170upx;
        box-sizing: border-box;
    }
    .m-look-title{
        font-size: 38upx;
        color: #0f1d37;
        padding: 51upx 0 10upx 0;
        font-weight: bold;
    }
    .m-prompt{
        padding-top: 30upx;
        font-size: 24upx;
        color: #b9bdc1;
    }

    /* 底部按钮 start */
    .m-foot{
        height: 100upx;
        background: #fff;
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20upx 30upx;
        box-shadow: 0upx 1upx 32upx 0upx rgba(97, 97, 97, 0.11);
    }
    .m-agent-icon{
        width: 90upx;
        height: 90upx;
        border-radius: 50%;
        margin-top: 5upx;
        float: left;
        overflow: hidden;
    }
    .m-agent-icon image{
        width: 100%;
        height: 100%;
    }
    .m-agent-info{
        float: left;
        width: 260upx;
        height: 100upx;
        margin-left: 22upx;
        white-space: nowrap;
        margin-right: 10upx;
    }
    .u-agent-name{
        font-size: 32upx;
        color: #101d36;
        line-height: 50upx;
        font-weight: bold;
    }
    .u-agent-store{
        font-size: 26upx;
        color: #8e94a1;
        line-height: 50upx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .about-consult-btn{
        width: 308upx;
        height: 100upx;
        line-height: 100upx;
        float: left;
        color: #fff;
        background-image: linear-gradient(270deg,#ab7f2e 0%,#ff8400 100%),linear-gradient(#ff6600,#ff6600);
        border-radius: 10upx;
        text-align: center;
        font-size: 30upx;
        position: relative;
    }
    .consult-btn{
        width: 175upx;
        height: 100upx;
        line-height: 100upx;
        float: left;
        color: #fff;
        background-image:
                linear-gradient(270deg,#ff9402 0%,#ffcb00 100%),
                linear-gradient(#ffc100, #ffc100);
        border-radius: 10upx;
        text-align: center;
        font-size: 30upx;
        position: relative;
    }
    .evaluate-btn{
        width: 175upx;
        height: 100upx;
        line-height: 100upx;
        background-image:
                linear-gradient(270deg,#ab7f2e 0%,#ff8400 100%),
                linear-gradient( #ff6600,#ff6600);
        border-radius: 10upx;
        float: left;
        color: #fff;
        text-align: center;
        font-size: 30upx;
        margin-left: 14upx;
        position: relative;
    }
    /* 底部按钮 end */
</style>
