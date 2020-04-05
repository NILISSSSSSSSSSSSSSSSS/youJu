<template>
    <view>
        <scrollLoading v-if="!topItem.buildName" :text="'加载中...'" :isScrollIng="true"></scrollLoading>

        <!--默认状态-->
        <processTc v-if="showProcessTc" :dealId="dealId" :erpCompId="erpCompId" :cityId="cityId"
                   :userId="userId" @TelephoneChanged="TelephoneChanged"></processTc>

        <!--合同作废弹窗-->
        <view class="no_use_contract_view f_c_c" @touchmove.stop.prevent="moveHandle"
              v-if="contractStatus == 2">
            <view class="no_use_contract f_c_c">
                <view class="no_use_contract_text">合同已作废，如有疑问请联系经纪人</view>

                <navigator open-type="exit" target="miniProgram"
                           class="no_use_contract_btn">我知道了</navigator>
            </view>
        </view>

        <!--顶部信息-->
        <processTop v-if="topItem.buildName" :item="topItem"
                    :contractStatus="contractStatus" :cityId="cityId"></processTop>

        <!--进展-->
        <processList :list="processList"></processList>

        <!--底部空view-->
        <view style="height: 170upx;"></view>
        <!--底部经纪人信息-->
        <bottomAgent v-if="bottomAgentItem.archiveId" :item="bottomAgentItem"></bottomAgent>
    </view>
</template>

<script>
    import processTc from "@/pagesShare/components/contractInfo/processTc.vue";
    import processTop from "@/pagesShare/components/contractInfo/processTop.vue";
    import processList from "@/pagesShare/components/contractInfo/processList.vue";
    import bottomAgent from "@/pagesShare/components/contractInfo/bottomAgent.vue";
    import {GetContractProcess} from "../net/ContractNet";
    import {ContractCityIdModel, ContractDealIdModel, ContractUserIdModel} from "../../model/ContractModel";
    import scrollLoading from "@/components/scrollLoading.vue";
    import {Notify} from "../../utils/Notify";
    import {Notification} from "../../utils/Notification";
    import {UserInfoModel} from "../../model/UserInfoModel";

    class ProcessTopItem {
        buildName = "";  // 小区名称 String
        propertyAddress = "";  // 产权地址
        houseArea = "";  // 面积 Int
        houseTotalPrice = "";  // 总价 Int
        saleHouseName = ""; // 卖方姓名
        buyHouseName = "";  // 买方姓名
        archiveName = ""; // 经纪人姓名
        archiveDeptName = ""; // 经纪人门店名字
        signTime = "";  // 签约时间  处理之后的

        getAreaUnit() {
            return "㎡";
        }

        getPriceUnit() {
            return "万";
        }
    }
    class BottomAgentItem {
        archiveId = "";  // 经纪人id
        archiveName = "";  // 经纪人姓名
        archiveHeadImg = "";  // 经纪人头像
        archiveDeptName = "";  // 经纪人所在门店
    }

    let privateData = {
        options: {}
    };

    export default {
        components: {
            processTc,
            processTop,
            processList,
            bottomAgent,
            scrollLoading
        },

        data() {
            return {
                erpCompId: "",
                dealId: "",
                cityId: "",  // 合同的cityId 非定位城市id
                userId: "", // 经纪人对应的用户id
                contractStatus: "", // 合同状态  1 正常  2 作废 3 未通过初审
                // 顶部内容
                topItem: new ProcessTopItem(),
                // 进展
                processList: null,
                // 底部经纪人信息
                bottomAgentItem: {},
                showProcessTc: true
            }
        },

        onLoad(options) {
            privateData.options = options;
            // 监听用户信息事件
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);

            //二维码进入详情页
            // [$cityId, $dealId,$archiveId, $erpCompId];
            if (!!options.scene) {
                let scene = options.scene;
                // #ifdef MP-WEIXIN
                scene = decodeURIComponent(scene);
                // #endif
                scene = scene.split('&');
                if (scene.length >= 3) {
                    options.cityId = scene[0];
                    options.dealId = scene[1];
                    options.archiveId = scene[2];
                    options.erpCompId = scene[3];
                    options.userId = scene[4];
                }
            }

            this.initParams(options);
        },

        onShareAppMessage() {
            let path = "/pagesShare/contractShare/contractProcess";
            for (let key in privateData.options) {
                if(path.indexOf("?") >= 0) {
                    path += "&" + key + "=" + privateData.options[key];
                    continue;
                }

                path += "?" + key + "=" + privateData.options[key];
            }

            return {
                path: path,
                imageUrl: "http://cdn.haofang.net/static/uuminiapp/pageNewUi/contract_share.png"
            }
        },

        methods: {
            moveHandle() {},

            TelephoneChanged(tel) {
                this.showProcessTc = false;
                this.initData();
            },

            // 用户信息变化回调
            UserInfoChanged() {
                let me = new UserInfoModel().getModel("me") || {};
                this.userId = me.userId || "";
            },

            // 初始化参数
            initParams(options) {
                let dealParams = {
                    erpCompId: "erpCompId",
                    dealId: "dealId",
                    cityId: "cityId",
                    userId: "userId"
                };
                for (let key in dealParams) {
                    this[dealParams[key]] = options[key];
                }
            },

            // 初始化信息
            initData() {
                if(!this.erpCompId) {
                    uni.showToast({title: "缺少参数erpCompId", icon: "none"});
                    return;
                }

                if(!this.dealId) {
                    uni.showToast({title: "缺少参数dealId", icon: "none"});
                    return;
                }

                if(!this.cityId) {
                    uni.showToast({title: "缺少参数cityId", icon: "none"});
                    return;
                }

                if(!this.userId) return;

                return new GetContractProcess({
                    userId: this.userId,
                    compId: this.erpCompId,
                    cityId: this.cityId,
                    dealId: this.dealId
                }).send().then(res => {
                    if(res.code !== this.Const.success) {
                        return Promise.reject(res);
                    }

                    this.topItem = res.topItem;
                    this.contractStatus = res.contractStatus;
                    this.processList = res.processList;
                    this.bottomAgentItem = res.agentInfo;
                    new ContractCityIdModel().setModel(this.cityId);
                    new ContractDealIdModel().setModel(this.dealId);
                    new ContractUserIdModel().setModel(this.userId);
                })
                .catch(err => {
                    console.error(err);
                    uni.showModal({
                        title: "温馨提示",
                        content: err.msg || "获取交易进度失败啦！请稍后重试。",
                        showCancel: false,
                        confirmColor: this.Const.confirmColor,
                        confirmText: "我知道了"
                    });
                });
            }
        }
    }
</script>

<style>
    /*合同作废*/
    .no_use_contract_view{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
    }
    .no_use_contract{
        width: 550rpx;
        margin: auto;
        flex-shrink: 0;
        background: #ffffff;
        border-radius: 20rpx;
        box-sizing: border-box;
        overflow: hidden;
    }
    .no_use_contract_text{
        font-size: 32rpx;
        color: #333333;
        line-height: 70rpx;
        text-align: center;
        margin-top: 35rpx;
        margin-bottom: 29rpx;
        padding: 0 55rpx;
        box-sizing: border-box;
    }
    .no_use_contract_btn{
        height: 90rpx;
        line-height: 90rpx;
        width: 100%;
        font-size: 32rpx;
        text-align: center;
        border-top: 1rpx solid #e7e7e7;
        box-sizing: border-box;
        color: #5786f2;
        border-left: 1rpx solid #e7e7e7;
    }
</style>