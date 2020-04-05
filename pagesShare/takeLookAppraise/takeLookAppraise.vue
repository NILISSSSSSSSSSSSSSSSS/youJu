<template>
    <view>
        <loading-data v-if="isRequesting"></loading-data>

        <block v-if="!isRequesting">
            <view class="agent-head">
                <image mode="aspectFill" :src="agentInfo.photo"></image>
            </view>

            <view class="agent-name">{{ agentInfo.userName }}</view>
            <view class="agent-store">{{agentInfo.deptName}}</view>
            <view class="appraise-time">
                <text v-if="isAppraise == 0">请对他</text> {{agentInfo.lookTime}}的服务进行评价</view>

            <lookHouseEvaluateView :takeLookId="takeLookId" :cityId="cityId"
                                   :isAppraise="isAppraise" :evaStar="evaStar"
                                   :starTags="starTags" :textarea="textarea"
                                   :evaluateTag="evaluateTag"
                                   :archiveId="archiveId"></lookHouseEvaluateView>
        </block>
    </view>
</template>

<script>
    import lookHouseEvaluateView from "../components/lookHouseEvaluateView.vue";
    import {GetWxTakeLookHouseEvaluate} from "../../net/lookHouse/GetLookHouseInfo";
    import {Const} from "../../utils/Const";

    export default {
        components: {
            lookHouseEvaluateView
        },

        data() {
            return {
                isRequesting: true,
                agentInfo: {
                    archiveId: "",
                    userName: "",
                    deptName: "",
                    photo: "",
                    lookTime: ""
                },
                isAppraise: 0,
                takeLookId: "",
                cityId: "",
                archiveId: "",
                evaStar: 5,
                starTags: [],
                textarea: "",
                evaluateTag: ""
            }
        },

        onLoad(options) {
            this.initParams(options);
            this.initData();
        },

        methods: {
            initParams(options) {
                this.agentInfo = {
                    archiveId: options.archiveId || "",
                    userName: options.userName || "",
                    deptName: options.deptName || "",
                    lookTime: options.lookTime || "",
                    photo: options.userPhoto || this.Const.imDefaultHeadImg
                };
                this.takeLookId = options.takeLookId || "";
                this.cityId = options.cityId || "";
                this.archiveId = options.archiveId || "";
                this.isAppraise = options.isAppraise || 0;
            },

            // 初始化评价信息
            initData() {
                this.isRequesting = true;
                new GetWxTakeLookHouseEvaluate({takeLookId: this.takeLookId}).send()
                    .then(res => {
                        if (res.code !== Const.success) {
                            uni.showModal({
                                title: "温馨提示",
                                content: "获取评价信息失败啦！请稍后重试。",
                                showCancel: false,
                                confirmColor: "#ab7f2e",
                                confirmText: "我知道了"
                            });
                            return;
                        }

                        this.isRequesting = false;
                        let data = res.data || {};
                        this.starTags = data.startTags || [];
                        if (this.isAppraise == 1) {
                            this.evaStar = data.starLevel || 4;
                            this.textarea = data.evaluateContent || "";
                            this.evaluateTag = data.evaluateTag || "";
                        }
                    })
                    .catch(err => {
                        uni.showModal({
                            title: "温馨提示",
                            content: "获取评价信息失败啦！请稍后重试。",
                            showCancel: false,
                            confirmColor: "#ab7f2e",
                            confirmText: "我知道了"
                        });
                    });
            }
        }
    }
</script>

<style>
    .agent-head{
        width: 100upx;
        height: 100upx;
        border-radius: 50%;
        background-size: 100%;
        margin: 0 auto 20upx auto;
    }
    .agent-head image{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .agent-name{
        text-align: center;
        font-size: 34upx;
        color: #101d36;
    }
    .agent-store{
        text-align: center;
        font-size: 24upx;
        color: #8e94a1;
    }
    .appraise-time{
        text-align: center;
        font-size: 24upx;
        color: #8e94a1;
        margin-top: 40upx;
        position: relative;
    }
    .appraise-time:before, .appraise-time:after {
        content: '';                 /*CSS伪类用法*/
        position: absolute;         /*定位背景横线的位置*/
        top: 50%;
        width: 15%;
        border-bottom: 1upx dashed #c6c9d0;
    }
    .appraise-time:before{
        left: 7%;        /*调整背景横线的左右距离*/
    }
    .appraise-time:after {
        right: 7%;
    }
</style>
