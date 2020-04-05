<template>
    <view :class="{BottomIphoneX: isIphoneX}" class='bottomtab'>
        <view :class="{contIphoneX: isIphoneX}" class='bottomatab-cont'>
            <view :class="{kf_choose: indexTab == 2}" class="group"
                  @click="swichTab('compshop', 2)">
                <view class='icon_tab icon_kf'></view>
                <view class='group-font'>房源</view>
            </view>

            <view v-if="im.show" :class="{im_choose: indexTab == 4}" class="group"
                  @click="swichTab('im', 4)">
                <view class='icon_tab icon_im'></view>
                <view class="unReadMsgNum" v-if="unReadMsgNum && unReadMsgNum > 0">{{ unReadMsgNum }}</view>
                <view class='group-font'>消息</view>
            </view>

            <view :class="{weituo_choose: indexTab == 3}" class="group"
                  @click="swichTab('myinfo', 3)">
                <view class='icon_tab icon_weituo'></view>
                <view class='group-font'>我的</view>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        CompStoreArchiveIdModel, CompStoreCityIdModel, CompStoreCompIdModel, CompStoreDeptIdModel,
        CompStoreFindDataAgentInfoModel, CompStoreEnterQueryModel,
        CompStoreLeaveCompIndexModel, CompStoreUnReadMsgNumMapModel
    } from "../../model/CompStoreModel";
    import {UserInfoModel} from "../../../model/UserInfoModel";
    import {UnReadMsgModel} from "../../../model/im/UnReadMsgModel";
    import { Notify } from "../../../utils/Notify.js";
    import { Notification } from "../../../utils/Notification.js";

    export default {
        props: {
            isIphoneX: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            indexTab: {
                type: Number | String,
                default() {
                    return 2;
                }
            },
            im: {
                type: Object,
                default() {
                    return {url: "/pages/message/message", show: false, unReadMsgNum: 0};
                }
            }
        },

        data() {
            return {
                unReadMsgNum: 0
            }
        },

        mounted() {
            // 更新消息体NC
            new Notification().addObserver(this, "UpChartMsgChanged", Notify.UpChartMsgChanged.Name);
            this.initUnReadMsgNum();
        },

        methods: {
            UpChartMsgChanged(name, item) {
                this.initUnReadMsgNum();
            },

            initUnReadMsgNum() {
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                let unReadMsgNumMap = new UnReadMsgModel().getModel() || {};
                this.unReadMsgNum = unReadMsgNumMap[archiveId] || 0;
            },

            swichTab(tab, index) {
                if(tab != 'compshop') {
                    new CompStoreLeaveCompIndexModel().setModel(1);
                }
                let userId = new UserInfoModel().getModel("me") ?
                    new UserInfoModel().getModel("me").userId || "" : "";
                let urlParams = {
                    archiveId: new CompStoreArchiveIdModel().getModel() || "",
                    compId: new CompStoreCompIdModel().getModel() || "",
                    compCityId: new CompStoreCompIdModel().getModel() || "",
                    cityId: new CompStoreCityIdModel().getModel() || "",
                    deptId: new CompStoreDeptIdModel().getModel() || ""
                };
                let url = "/pagesStore/mine/mine?archiveId=" + urlParams.archiveId
                    + "&compId=" + urlParams.compId + "&compCityId=" + urlParams.compCityId
                    + "&cityId=" + urlParams.cityId + "&deptId=" + urlParams.deptId;
                if(index == this.indexTab) return;

                if(tab == 'im') {
                    if(!urlParams.archiveId) {
                        uni.showToast({
                            icon: "none",
                            title: "暂无经纪人id"
                        });
                        return;
                    }

                    this.removeUnReadMsgNum();
                    uni.navigateTo({url: "/pagesTool/messageDetail/messageDetail?accid="
                            + "uu_" + userId
                            + "&messageId=" + urlParams.archiveId
                            + "&platform=store"});
                    return;
                }

                if(tab == 'compshop') {
                    url = "/pagesStore/compStore/compStore";
                    let urlParams = new CompStoreEnterQueryModel().getModel() || {};
                    for (let k in urlParams) {
                        if(url.indexOf("?") >= 0) {
                            url += "&" + k + "=" + urlParams[k];
                        }else {
                            url += "?" + k + "=" + urlParams[k];
                        }
                    }
                }

                uni.redirectTo({url: url});
            },

            removeUnReadMsgNum() {
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                let map = new UnReadMsgModel().getModel() || {};
                delete(map[archiveId]);
                new UnReadMsgModel().setModel(map);
                this.unReadMsgNum = 0;
            }
        }
    }
</script>

<style scoped>
    .bottomtab {
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: justify;
        background: #fff;
        border-top: 2upx solid #e7e7e7;
        height: 120upx;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 100%;
        max-width: 760upx;
        box-sizing: border-box;
        z-index: 101;
    }
    .BottomIphoneX {
        height: 168upx;
    }
    .group {
        -webkit-box-flex: 1;
        text-align: center;
        position: relative;
        color: #BBBBBB;
        font-size: 22upx;
    }
    .icon_tab {
        display: inline-block;
        width: 40upx;
        height: 40upx;
        color: #fff;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
    }
    .icon_home {
        background-image: url(https://zdzfapi.haofang.net/Public/wxApp/images/personalStore/home_icon_gray.png);
        background-size: 85%;
    }
    .home_choose .icon_home {
        background-image: url(https://zdzfapi.haofang.net/Public/wxApp/images/personalStore/home_icon.png);
    }
    .home_choose .group-font,
    .weituo_choose .group-font {
        color: #ff5a1f;
    }
    .icon_weituo {
        background-image: url(http://cdn.haofang.net/static/uuminiapp/compStore/tab_mine_gray.png);
    }
    .weituo_choose .icon_weituo {
        background-image: url(http://cdn.haofang.net/static/uuminiapp/compStore/tab_mine.png?t=111);
    }
    .icon_kf {
        background-image: url(http://cdn.haofang.net/static/uuminiapp/compStore/tab_comp_gray.png);
    }
    .kf_choose .icon_kf {
        background-image: url(http://cdn.haofang.net/static/uuminiapp/compStore/tab_comp.png?t=111);
    }
    .icon_im{
        background-image: url(http://cdn.haofang.net/static/uuminiapp/compStore/tab_chart_gray.png);
    }
    .im_choose .icon_im {
        background-image: url(http://cdn.haofang.net/static/uuminiapp/compStore/tab_chart.png?t=111);
    }

    .kf_choose .group-font {
        color: #ff5a1f;
    }
    .unReadMsgNum{
        position: absolute;
        top:-8upx;
        background:#ab7f2e;
        color:#fff;
        border-radius:100%;
        flex-shrink:0;
        width:30upx;
        height:30upx;
        line-height:30upx;
        text-align:center;
        left:55%;
    }
    /*底部中间  */
    .bottomcont {
        width: 100%;
        height: 500upx;
        padding-top: 30upx;

    }
    .bottomatab-cont {
        width: 100%;
        margin: 0 auto;
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: justify;
    }
    .contIphoneX {
        margin-bottom: 50upx;
    }
    .nav-top {
        padding-left: 30upx;
        background-color: #fff;
        width: auto;
    }
    .nav-tab {
        display: block;
        height: 110upx;
        background-color: #fff;
        line-height: 110upx;
        font-size: 30upx;
        position: relative;
        color: #282828;
        margin-bottom: 30upx;
    }
    .navtab-bef {
        content: "";
        position: absolute;
        display: block;
        width: 46upx;
        height: 46upx;
        top: 46%;
        left: 0;
        margin-top: -18upx;
        background-size: 100% 100% !important;
        background: url(http://weidian.haofang.net/Public/web/default/images/broker/icon_publish.png) center no-repeat;
    }
    .navtab-aft {
        content: "";
        display: block;
        width: 16upx;
        height: 26upx;
        background: url(http://weidian.haofang.net/Public/web/default/images/arrow-right.png) center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 26upx;
        top: 40%;
        margin-bottom: 10upx;
    }
    .size {
        display: inline-block;
        width: 120upx;
        height: 1px;
        padding-left: 60upx;
    }
    .nav-tabbott {
        border-bottom: 1px solid #eee;
        margin-bottom: 0upx;
    }
    .bigbox {
        width: 100%;
        height: 100%;
        background-color: #e7e7e7;
    }
</style>