<template>
    <view class="finish_evaluate_view_im">
        <view class="f_r_c finish_evaluate_star_view_im">
            <block v-for="(url, index) in noFinishServiceStarList" :key="index">
                <image @click="noFinishStarBtn(index)" class="finish_evaluate_star_im"
                       :src="url"></image>
            </block>
        </view>

        <view class="starTexMap_des_evaluate" v-if="starTexMap[serviceStarVal]">{{ starTexMap[serviceStarVal] }}</view>

        <view class="evaluate_reason_view_im">
            <!-- 原因 -->
            <view class="no_finish_reason_view_im f_r_s">
                <block v-for="(text, index) in (noMeetReasonMap[serviceStarVal] || [])" :key="index">
                    <view :class="[noMeetReasonSelectedMap[serviceStarVal] && ((noMeetReasonSelectedMap[serviceStarVal][0] && noMeetReasonSelectedMap[serviceStarVal][0] == text) || (noMeetReasonSelectedMap[serviceStarVal][1] && noMeetReasonSelectedMap[serviceStarVal][1] == text) || (noMeetReasonSelectedMap[serviceStarVal][2] && noMeetReasonSelectedMap[serviceStarVal][2] == text) || (noMeetReasonSelectedMap[serviceStarVal][3] && noMeetReasonSelectedMap[serviceStarVal][3] == text) ) ? 'no_finish_reason_item_active_im' : '',text.length > 6 ? 'no_finish_reason_item_im_more' : '']"
                          @click="noMeetReasonChoose(text)"
                          class="no_finish_reason_item_im">{{ text }}</view>
                </block>
            </view>

            <!--输入框-->
            <view class="no_finish_remark_im">
                <textarea
                        placeholder="您还有需要补充的吗？"
                        @input="completeEvaContentInput"
                        :disabled="!!(isAppraise == 1)"
                        v-model="completeEvaContent"
                        class="no_finish_textarea_im"
                        placeholder-class="no_finish_textarea_pl_im"
                        maxlength="100"></textarea>
            </view>

            <view v-if="isAppraise == 0" class="m-anonymous" @click="handleAnonymous">
                <view class="u-anonymous-icon" :class="isAnonymous == 1?'u-anonymous-active':''"></view>
                匿名评价
            </view>

            <view class="empty_bottom_view"></view>

            <!--提交-->
            <view v-if="isAppraise == 0" class="no_finish_confirm_btn_im" @click='submitCompleteEvaData'>服务评价</view>
        </view>
    </view>
</template>

<script>
    import { GetStarList } from "../../utils/common.js";
    import {CreateWxTakeLookHouseEvaluate} from "../../net/lookHouse/GetLookHouseInfo";
    import {Config} from "../../utils/config";
    import {Const} from "../../utils/Const";

    export default {
        data() {
            return {
                finishServiceStarList: [],  // 已评价的星数组
                noFinishServiceStarList: [],  // 未评价的星数
                serviceStarVal: 5,  // 未评价星
                // 不满意的原因
                noMeetReasonMap: {
                    1: ["讲解很不清晰", "专业知识不强", "反馈不及时", "服务态度不好"],
                    2: ["讲解一般", "专业度不高", "反馈一般", "服务态度一般"],
                    3: ["讲解有待提升", "专业度有待提升", "反馈一般", "服务态度一般"],
                    4: ["讲解有待提升", "专业度有待提升", "反馈比较及时", "服务有待提升"],
                    5: []
                },
                starTexMap: {
                    1: "非常不满意，各方面都很差",
                    2: "不满意，比较差",
                    3: "一般，还需改善",
                    4: "比较满意，仍可改善",
                    5: "非常满意，无可挑剔"
                },
                noMeetReasonSelectedMap: {
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: []
                },
                completeEvaContent: "",  // 未评价输入原因
                isAnonymous: 0,   // 是否匿名
            }
        },

        props: {
            // 经纪人id
            takeLookId: {
                type: String,
                default: ""
            },
            // 服务初始化评分
            evaStar: {
                type: String | Number,
                default: 4
            },
            cityId: {
                type: String | Number,
                default: ""
            },
            archiveId: {
                type: String | Number,
                default: ""
            },
            // 是否已经评价 1
            isAppraise: {
                type: String | Number,
                default: 0
            },
            // starTags
            starTags: {
                type: Array,
                default() {
                    return []
                }
            },
            textarea: {
                type: String,
                default() {
                    return "";
                }
            },
            evaluateTag: {
                type: String,
                default() {
                    return "";
                }
            },
        },

        watch: {
            evaStar(newValue, oldValue) {
                this.serviceStarVal = this.evaStar;
                if (this.noMeetReasonSelectedMap[this.serviceStarVal] && this.evaluateTag) {
                    this.noMeetReasonSelectedMap[this.serviceStarVal] = this.evaluateTag.split(",");
                }
                this.initNoFinishStarList();
            },
            starTags(newValue, oldValue) {
                if (newValue && newValue.length > 0) {
                    let noMeetReasonMap = this.noMeetReasonMap;
                    for (let i = 0;i<newValue.length;i++) {
                        noMeetReasonMap[i+1] = newValue[i];
                    }
                    this.noMeetReasonMap = noMeetReasonMap;
                }
            },
            textarea(newValue, oldValue) {
                this.completeEvaContent = newValue;
            },
            evaluateTag(newValue, oldValue) {
                if (this.noMeetReasonSelectedMap[this.serviceStarVal]) {
                    this.noMeetReasonSelectedMap[this.serviceStarVal] = newValue.split(",");
                }
            },
        },

        mounted() {
            if (this.starTags && this.starTags.length > 0) {
                let noMeetReasonMap = this.noMeetReasonMap;
                for (let i = 0;i<this.starTags.length;i++) {
                    noMeetReasonMap[i+1] = this.starTags[i];
                }
                this.noMeetReasonMap = noMeetReasonMap;
            }
            this.completeEvaContent = this.textarea;
            this.serviceStarVal = this.evaStar;
            if (this.noMeetReasonSelectedMap[this.serviceStarVal] && this.evaluateTag) {
                this.noMeetReasonSelectedMap[this.serviceStarVal] = this.evaluateTag.split(",");
            }
            this.initNoFinishStarList();
        },

        methods: {
            // 支付后未评价
            initNoFinishStarList() {
                this.noFinishServiceStarList = new GetStarList(this.serviceStarVal,
                    "../../", 5, 0).getList(true,
                    "https://zdzfapi.haofang.net/Public/wxApp/images/entrustDetail/ic_star_yellow.png",
                    "https://zdzfapi.haofang.net/Public/wxApp/images/entrustDetail/ic_star_gray.png");
            },

            // 未评价星点击事件
            noFinishStarBtn(index) {
                if (this.isAppraise == 1) return;

                this.serviceStarVal = index + 1;
                this.initNoFinishStarList();
            },
            // 选择原因
            noMeetReasonChoose(i) {
                if (this.isAppraise == 1) return;

                let selected = this.noMeetReasonSelectedMap[this.serviceStarVal];
                let index = (selected).findIndex((info) => {
                    return info == i;
                });
                do{
                    if(index >= 0) {
                        selected.splice(index, 1);
                        break;
                    }

                    // 暂时没有限制
                    // if(selected.length >= 5) {
                    //     selected.shift();
                    //     selected.push(i);
                    //     break;
                    // }

                    selected.push(i);
                }while(false);
                this.noMeetReasonSelectedMap[this.serviceStarVal] = selected;
            },
            // 输入原因
            completeEvaContentInput(e) {
                this.completeEvaContent = e && e.detail ? e.detail.value || "" : "";
            },
            // 匿名提交改变
            handleAnonymous() {
                this.isAnonymous = (this.isAnonymous == 0 ? 1 : 0);
            },
            // 提交
            submitCompleteEvaData() {
                let that = this;
                let reasonSelected = this.noMeetReasonSelectedMap[this.serviceStarVal] || [];
                // 原来有小于四颗星的必填
                // if(this.serviceStarVal < 4 && reasonSelected.length == 0
                //     && this.completeEvaContent.length == 0) {
                //     uni.showToast({
                //         icon: "none",
                //         title: "请选择标签或填写评论指出经纪人的不足吧"
                //     });
                //     return;
                // }
                let request = {
                    takeLookId: this.takeLookId,
                    starLevel: this.serviceStarVal,
                    evaluateTag: reasonSelected.join(","),
                    evaluateContent: this.completeEvaContent,
                    isAnonymous: this.isAnonymous
                };
                if (!request.takeLookId) {
                    uni.showToast({title: "暂无带看id", icon: "none"});
                    return;
                }

                uni.showLoading({title: "提交中...", mask: Config.mask});
                new CreateWxTakeLookHouseEvaluate(request).send()
                    .then(res => {
                        uni.hideLoading();
                        if (res.code !== Const.success) {
                            uni.showModal({
                                title: "温馨提示",
                                content: "评价失败啦！请稍后重试。",
                                showCancel: false,
                                confirmColor: "#ab7f2e",
                                confirmText: "我知道了"
                            });
                            return;
                        }

                        uni.showToast({
                            title: "评价成功",
                            icon: "success",
                            success:function(){
                                setTimeout(() => {
                                    uni.navigateBack({
                                        delta: 1,
                                        animationType: 'slide-out-right',
                                        animationDuration: 200
                                    });
                                }, 1500);
                            }
                        })
                    })
                    .catch(err => {
                        uni.hideLoading();
                        uni.showModal({
                            title: "温馨提示",
                            content: "评价失败啦！请稍后重试。",
                            showCancel: false,
                            confirmColor: "#ab7f2e",
                            confirmText: "我知道了"
                        });
                    });
            },
        },
    }
</script>

<style scoped>
    .no_finish_reason_item_im_more{
        font-size: 22upx!important;
    }
    .evaluate_reason_view_im{
        padding: 0 30upx;
        box-sizing: border-box;
    }
    .starTexMap_des_evaluate{
        text-align: center;
        color: #f7a023;
        font-size: 24upx;
    }
    .see-evaluate-header_im{
        position: relative;
        text-align: center;
        font-size: 24upx;
        color: #101D36;
        height: 80upx;
        line-height: 80upx;
        border-bottom: 1upx solid #f5f5f5;
        margin-bottom: 20upx;
    }
    .see-evaluate-tt-im{
        font-weight: 400;
        font-size: 30upx;
    }
    .see-evaluate-close-im{
        position: absolute;
        width: 80upx;
        height: 80upx;
        top: 0;
        right: 0;
        background: url(http://cdn.haofang.net/static/uuminiapp/entrustDetail/close2.png) center center no-repeat;
        background-size: 26upx 26upx;
    }
    .finish_evaluate_view_im{
        background:#fff;
        width:100%;
        box-sizing:border-box;
        border-radius: 12upx;
        overflow: hidden;
        padding-bottom: 40upx;
        margin-top: 20upx;
    }
    .no_finish_reason_view_im{
        width: 100%;
        margin: 35upx auto 26upx;
        flex-wrap:wrap;
        padding: 0 10upx;
        box-sizing: border-box;
    }
    .no_finish_reason_item_im{
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding: 0 10upx;
        width: 47%;
        height:70upx;
        line-height:70upx;
        box-sizing:border-box;
        text-align:center;
        border:1upx solid #d5d5d5;
        border-radius: 30upx;
        background-color: #ffffff;
        color:#999;
        font-size: 26upx;
        position:relative;
        margin-right: 5%;
        margin-bottom: 17upx;
    }
    .no_finish_reason_view_im .no_finish_reason_item_im:nth-child(2n){
        margin-right: 0;
    }
    .no_finish_reason_view_im .no_finish_reason_item_active_im{
        border:1upx solid #ffba68;
        color:#f7a023;
        background-color:#fff8ec;
    }
    .no_finish_remark_im{
        position:relative;
        width: 100%;
        height:180upx;
        box-sizing: border-box;
        overflow:hidden;
        margin:0 auto 0;
        padding: 0 20upx;
    }
    .no_finish_textarea_im{
        background-color:#f8f8f8;
        width:100%;
        height:100%;
        font-size:28upx;
        border-radius:8upx;
        padding:30upx;
        box-sizing:border-box;
        color:#101D36;
    }
    .no_finish_textarea_num_im{
        font-size:26upx;
        position:absolute;
        right:15upx;
        bottom:18upx;
        color:#888;
    }
    .no_finish_textarea_pl_im{
        font-size: 28upx;
        color: #c6cacf;
        background-color: #f8f8f8;
    }
    .empty_bottom_view{
        height: 150upx;
        width: 100%;
    }
    .no_finish_confirm_btn_im{
        height: 90rpx;
        border-radius: 10rpx;
        background-image: linear-gradient(270deg,#ab7f2e 0%,#ff8400 100%),
        linear-gradient(#ffffff,#ffffff);
        color: #fff;
        text-align: center;
        line-height: 90rpx;
        position: fixed;
        bottom: 30rpx;
        left: 40upx;
        right: 40upx;
        margin: 0 auto;
    }
    .finish_evaluate_star_view_im{
        height: 50upx;
        margin: 44upx auto 20upx;
    }
    .finish_evaluate_star_im{
        width:50upx;
        height:50upx;
        flex-shrink: 0;
        margin: auto 57upx auto 0;
    }
    .finish_evaluate_star_view_im .finish_evaluate_star_im:last-child{
        margin-right: 0;
    }
    .m-anonymous{
        height: 27upx;
        color: #8e94a1;
        font-size: 28upx;
        padding: 30upx 0 0 20upx;
    }
    .u-anonymous-icon{
        width: 26upx;
        height: 26upx;
        background: url('http://cdn.haofang.net/static/uuminiapp/packageShare/takeAboutLook/rectangle.png') no-repeat center;
        background-size: 100%;
        display: inline-block;
        vertical-align: -3upx;
        margin-right: 10upx;
    }
    .u-anonymous-active{
        background: url('http://cdn.haofang.net/static/uuminiapp/packageShare/takeAboutLook/active_rectangle.png') no-repeat center;
        background-size: 100%;
    }
</style>
