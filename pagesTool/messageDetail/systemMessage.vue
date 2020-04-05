<template>
    <view class="sys_msg_list">
        <view class="top_line"></view>

        <!-- 加载动画 -->
        <scrollLoading v-if="!sysMsgList" :isScrollIng="true"></scrollLoading>

        <!--空数据-->
        <view class="no_data_list" v-if="sysMsgList && sysMsgList.length == 0">暂无系统消息</view>

        <!--有数据-->
        <block v-if="sysMsgList && sysMsgList.length > 0">
            <block v-for="(item, index) in sysMsgList" :key="index">
                <view class="sys_msg_item" @click="lookDetail(item, index)">
                    <!--title和时间-->
                    <view class="sys_msg_item_top f_r_b">
                        <view class="sys_msg_title f_r_s">
                            {{ item.title }}
                            <view v-if="item.readFlag != 1" class="unRead_red_point"></view>
                        </view>

                        <view>{{ item.timeText }}</view>
                    </view>

                    <!--内容-->
                    <view class="f_c_s sys_msg_cont" v-if="item.contents && item.contents.length > 0">
                        <block v-for="(text, textIndex) in item.contents" :key="textIndex">
                            <view class="sys_msg_cont_text">{{ text }}</view>
                        </block>

                        <!--已失效-->
                        <view v-if="item.isTimeout == 1" class="timeout_icon">已失效</view>
                    </view>

                    <!--查看详情-->
                    <view v-if="item.showDetail == 1 && item.isTimeout != 1" class="check_detail f_r_b">
                        <view class="check_detail_title">查看详情</view>

                        <image class="check_detail_icon" src="http://cdn.haofang.net/static/uuminiapp/evaluate/right.jpg"></image>
                    </view>

                    <!--不显示详情时显示这个空-->
                    <view v-if="!(item.showDetail == 1 && item.isTimeout != 1)" class="empty_item_bottom"></view>
                </view>
            </block>

            <!--  loading  -->
            <view class="loading_view f_r_c" v-if="isScrollIng && haveMoreData">
                <view class="pullUpIcon"></view>
                <view class="pullUpLabel">努力加载中...</view>
            </view>
            <view v-if="!isScrollIng && !haveMoreData" class="no_more_data">没有更多数据了！</view>
        </block>
    </view>
</template>

<script>
    import {UserInfoModel} from "../../model/UserInfoModel";
    import {GetSysMessageAction, UpdateSysMsgReadPoint} from "../../net/im/InitImChart";
    import { Notification } from "@/utils/Notification.js";
    import { Notify } from "@/utils/Notify.js";
    import scrollLoading from "@/components/scrollLoading.vue";

    let privateData = {
        pageNum: 1,
        pageSize: 10,
        total: 0 // 总数
    };

    // 系统消息item
    class SysMsgItem {
        title = ""; // 内容的标题
        timeText = ""; // 格式化后的时间
        timeStr = 0;  // 时间戳
        contents = [];  // 内容数组[String]
        isTimeout = 0;  // 是否失效 ? 1失效 : 0未失效
        readFlag = 1;  // 1 已读 0未读
        showDetail = 0;  // 是否展示详情 ? 1显示 : 其他不显示
        caseType = "";
        entrustId = ""; // 委托id
        wfId = "";  // 	系统消息主键id
    }

    export default {
        components: {
            scrollLoading
        },

        data() {
            return {
                sysMsgList: null,
                isScrollIng: false,
                haveMoreData: true
            }
        },

        onLoad() {
            // 监听委托新消息
            new Notification().addObserver(this, "NewMsgChanged", Notify.NewMsgChanged.Name);
            privateData.pageNum = 1;
            this.initData().then(list => {
                this.sysMsgList = list;
            });
        },

        onUnload() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        onPullDownRefresh() {
            privateData.pageNum = 1;
            this.isScrollIng = false;
            this.haveMoreData = true;
            this.initData()
                .then(list => {
                    uni.stopPullDownRefresh();
                    this.sysMsgList = list;
                })
                .catch(() => {
                    uni.stopPullDownRefresh();
                });
        },

        onReachBottom() {
            this.scrollBottom();
        },

        methods: {
            // 初始化列表
            initData() {
                let me = new UserInfoModel().getModel("me") || {};
                if(!me.userId) return;

                return new GetSysMessageAction({
                    pageNum: privateData.pageNum,
                    pageSize: privateData.pageSize,
                    youyouUserId: me.userId
                }).send().then(res => {
                    if(res.STATUS != 1) {
                        this.sysMsgList = [];
                        return;
                    }

                    privateData.total = res.DATA ? res.DATA.total || 0 : 0;
                    let sysMsgList = [];
                    let list = res.DATA ? res.DATA.list || [] : [];
                    for (let info of list) {
                        if(!info.title) continue;

                        let item = new SysMsgItem();
                        item.title = info.title || "";
                        item.timeText = info.createTime.replace(".", "/");
                        item.timeText = item.timeText.replace(".", "/");
                        item.contents = [];
                        for (let i = 1;i<=4;i++) {
                            if(!info["kwd" + i]) continue;

                            item.contents.push(info["kwd" + i]);
                        }
                        item.isTimeout = info.isTimeout || 0;
                        item.readFlag = info.readFlag;
                        item.showDetail = info.showDetail || 0;
                        item.caseType = info.caseType || "";
                        item.entrustId = info.pushLogId || "";
                        item.wfId = info.wfId || "";
                        sysMsgList.push(item);
                    }
                    if(privateData.total && privateData.total <= sysMsgList.length) {
                        this.haveMoreData = false;
                    }
                    return sysMsgList;
                }).catch(err => {
                    uni.showModal({
                        title: "温馨提示",
                        content: "获取系统消息失败啦！请稍后重试。",
                        showCancel: false,
                        confirmColor: this.Const.confirmColor,
                        confirmText: "我知道了"
                    });
                });
            },

            // 查看详情
            lookDetail(item, index) {
                if(!(item.showDetail == 1 && item.isTimeout != 1)) return;

                if(!item.entrustId) {
                    uni.showToast({title: "暂无委托id", icon: "none"});
                    return;
                }

                // 更新红点
                if(item.readFlag != 1 && item.wfId) {
                    new UpdateSysMsgReadPoint({wfId: item.wfId}).send();
                    item["readFlag"] = 1;
                    this.sysMsgList[index] = item;
                }

                // 跳转到委托列表
                if(!item.caseType) {
                    uni.navigateTo({url: "/pagesEntrust/trustList/trustList"});
                    return;
                }

                let url = "/pagesEntrust/prizeTrustDetail/prizeTrustDetail?entrustId=" + item.entrustId;
                if (item.caseType == 3 || item.caseType == 4) {
                    // 买房、求租委托详情
                    url = "/pagesEntrust/entrustDetail/entrustDetail?entrustId=" + item.entrustId;
                }
                uni.navigateTo({url: url});
            },

            // 触底加载更多
            scrollBottom() {
                if (this.isScrollIng || !this.haveMoreData) return;

                privateData.pageNum++;
                this.isScrollIng = true;
                this.initData()
                    .then((list) => {
                        this.haveMoreData = true;
                        this.isScrollIng = false;
                        this.sysMsgList = (this.sysMsgList || []).concat(list);
                        if (this.sysMsgList.length >= privateData.total && privateData.total) {
                            this.haveMoreData = false;
                        }
                    })
                    .catch(() => {
                        this.isScrollIng = false;
                        this.haveMoreData = true;
                    });
            },

            // 委托消息回调
            NewMsgChanged(name, item) {
                // 委托类型在执行
                if(item.type === Notify.NewMsgChanged.Type_entrust) {
                    privateData.pageNum = 1;
                    this.initData().then(list => {
                        this.sysMsgList = list;
                    });
                }
            }
        }
    }
</script>

<style>
    page{
        width: 100%;
        height: 100%;
        background: #f8f8f8;
    }
    .top_line{
        position: fixed;
        left: 0;
        width: 100%;
        right: 0;
        background: #ececec;
        height: 1upx;
        top: 0;
        z-index: 99;
    }
    .sys_msg_list{
        width: 100%;
        height: 100%;
        background: #f8f8f8;
    }
    .sys_msg_item{
        background: #ffffff;
        padding: 34upx 40upx 0;
        box-sizing: border-box;
        margin-bottom: 15upx;
    }
    .sys_msg_item_top{
        line-height: 60upx;
        color: #7a8190;
        font-size: 22upx;
    }
    .sys_msg_title{
        font-size: 32upx;
        color: #101d36;
        text-align: left;
    }
    .unRead_red_point{
        position: relative;
        height: 12upx;
        width: 12upx;
        margin: 8upx 0 auto 2upx;
        border-radius: 100%;
        background: #ab7f2e;
        box-sizing: border-box;
        flex-shrink: 0;
    }
    .sys_msg_cont{
        color: #7a8190;
        font-size: 30upx;
        padding-top: 13upx;
        box-sizing: border-box;
        position: relative;
    }
    .timeout_icon{
        position: absolute;
        right: 0;
        bottom: 6upx;
        width: 100upx;
        height: 40upx;
        border-radius: 20upx;
        text-align: center;
        background: #b9b9b9;
        line-height: 40upx;
        color: #ffffff;
        font-size: 24upx;
    }
    .sys_msg_cont_text{
        line-height: 45upx;
        text-align: left;
        margin-bottom: 5upx;
    }
    .check_detail{
        height: 90upx;
        line-height: 90upx;
        color: #7a8190;
        font-size: 28upx;
        border-top: 1upx solid #ececec;
        box-sizing: border-box;
        margin-top: 40upx;
    }
    .check_detail_icon{
        width: 15upx;
        height: 24upx;
        margin: auto 0;
        flex-shrink: 0;
    }
    .empty_item_bottom{
        width: 100%;
        height: 40upx;
        flex-shrink: 0;
    }
    .loading_view{
        transform-origin: 0px 0px 0px;
        opacity: 1;
        transform: scale(1, 1);
        height:40px;
        line-height:40px;
        font-size:12px;
        text-align:center;
        margin-top: 10upx;
    }
    .pullUpIcon{
        display:inline-block;
        height:15px;
        width:15px;
        border-radius:100%;
        margin:auto 6px;
        border:2px solid #666;
        border-bottom-color:transparent;
        vertical-align:middle;
        animation:loading 1s linear infinite;
    }
    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .no_more_data{
        height: 80upx;
        line-height: 80upx;
        text-align: center;
        font-size:26upx;
        color:#666666;
    }
    .no_data_list{
        color: #6c6c6c;
        font-size: 24upx;
        text-align: center;
        margin-top: 100upx;
        width: 100%;
    }
</style>