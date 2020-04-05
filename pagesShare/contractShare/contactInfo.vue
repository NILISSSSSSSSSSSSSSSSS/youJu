<template>
    <view>
        <!--未签订-->
        <view v-if="contractInfo.status != 1 && (contractInfo.signType == 3 || contractInfo.signType == 2)" class="f_r_s top_view">
            <icon class="top_view_icon" type="warn" size="14" color="#ff7c00"></icon>

            <view>房源交易电子合同已创建，请详细确认后再签订！</view>
        </view>
        <!--已签订-->
        <!--产品：大白说不要了  2019.08.23-->
        <view class="sign_finish_view f_r_b" v-if="contractInfo.status == 1">
            <view class="f_r_s sign_finish_left">
                <icon class="top_view_icon" type="success" size="34"></icon>

                <view class="f_c_c sign_finish_text">
                    <view class="sign_finish_title">房屋交易已完成</view>
                    <view class="sign_finish_time">{{ contractInfo.finishTime }}</view>
                </view>
            </view>

            <image class="sign_finish_arrow" src="http://uuweb.haofang.net/Public/wxApp/images/mine/arrow_right.png"></image>
        </view>

        <!--合同内容-->
        <view class="contract_loading" v-if="!contractImg">
            <scrollLoading :text="'合同加载中...'" :isScrollIng="true"></scrollLoading>
        </view>
        <block v-if="contractImg">
            <movable-area scale-area style="width: 100%;height: 100%;" v-if="isAndroid">
                <movable-view style="width: 100px;height: 300px;"
                              :x="movableX" :y="movableY" scale-value="4"
                              direction="all" out-of-bounds scale scale-min="3.5" scale-max="8">
                    <image class="contractImg_view" :src="contractImg" mode="widthFix"></image>
                </movable-view>
            </movable-area>

            <view style="width: 100%;height: 90%;overflow: auto;"  v-if="!isAndroid">
                <image
                    class="contractImg_view"
                    @touchstart='touchStartHandle'
                    @touchmove='touchMoveHandle'
                    @load='load'
                    :style="{width: touch.scaleWidth + 'px', height: touch.scaleHeight + 'px'}"
                    :src="contractImg"
                    mode="scaleToFill">
                </image>
            </view>
        </block>

        <!--合同作废弹窗-->
        <view class="no_use_contract_view f_c_c" @touchmove.stop.prevent="moveHandle"
              v-if="isNoUse">
            <view class="no_use_contract f_c_c">
                <view class="no_use_contract_text">合同已作废，如有疑问请联系经纪人</view>

                <navigator open-type="exit" target="miniProgram"
                           class="no_use_contract_btn">我知道了</navigator>
            </view>
        </view>

        <!--下载-->
        <download v-if="((contractInfo.status == 1 && contractInfo.signType == 3) || contractInfo.signType != 3)"></download>

        <!--底部空view-->
        <view style="height: 170upx;"></view>
        <!--底部经济人信息-->
        <bottomAgent v-if="contractImg && bottomAgentItem.archiveId" :item="bottomAgentItem"></bottomAgent>

        <get-user-info></get-user-info>
    </view>
</template>

<script>
    import {GetContractStatus, HtmlToPdf, PdfToImg} from "../net/ContractNet";
    import scrollLoading from "@/components/scrollLoading.vue";
    import {Notification} from "../../utils/Notification";
    import {Notify} from "../../utils/Notify";
    import bottomAgent from "@/pagesShare/components/contractInfo/bottomAgent.vue";
    import download from "@/pagesShare/components/contractInfo/download.vue";
    import {ContractCityIdModel, ContractPdfUrlModel,
        ContractDealIdModel, ContractUserIdModel} from "../../model/ContractModel";

    let privateData = {
        imgAllScreenInfo: {}
    };
    class BottomAgentItem {
        archiveId = "";  // 经纪人id
        archiveName = "";  // 经纪人姓名
        archiveHeadImg = "";  // 经纪人头像
        archiveDeptName = "";  // 经纪人所在门店
    }
    export default {
        components: {
            scrollLoading,
            bottomAgent,
            download
        },

        data() {
            return {
                contractImg: "",  // 合同地址
                contractInfo: {},
                // 底部经纪人信息
                bottomAgentItem: {},
                movableX: -25,
                movableY: 0,
                isNoUse: false,

                isAndroid: false, // 是否是安卓
                touch: {
                    distance: 0,
                    scale: 1,
                    baseWidth: null,
                    baseHeight: null,
                    scaleWidth: null,
                    scaleHeight: null
                }
            }
        },

        onLoad(options) {
            // 监听用户信息授权
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);

            let sceneInfo = uni.getSystemInfoSync();
            let isAndroid = false;
            if(sceneInfo.platform == "android") {
                isAndroid = true;
            }
            this.isAndroid = isAndroid;

            this.initData();
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

        onUnload() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        methods: {
            moveHandle() {},

            // 授权回调
            UserInfoChanged() {},

            // 初始化
            initData() {
                this.getOtherInfo().then(res => {
                    if(res.status === 3) {
                        this.isNoUse = true;
                        return;
                    }

                    if(res.status !== 1) {
                        new HtmlToPdf(new ContractDealIdModel().getModel(),
                            new ContractCityIdModel().getModel()).send()
                            .then(res => {
                                if(!res.data || !res.data.pdfAddr) {
                                    uni.showToast({title: "暂无合同", icon: "none"});
                                    return;
                                }

                                let requestData = {
                                    contractId: new ContractDealIdModel().getModel(),
                                    cityId: new ContractCityIdModel().getModel(),
                                    url: new ContractPdfUrlModel().getModel(),
                                };
                                requestData["isUpdate"] = 1;
                                // if (res.status !== 1 && res.status !== 4) {
                                //     requestData["isUpdate"] = 1;
                                // }
                                this.getContract(requestData);
                            })
                            .catch(err => {
                                uni.showToast({
                                    title: err.msg || "合同加载失败",
                                    icon: "none"
                                });
                            });
                        return;
                    }

                    new ContractPdfUrlModel().setModel(res.pdfUrl ||"");
                    if(!res.pdfUrl) {
                        uni.showToast({title: "暂无合同", icon: "none"});
                        return;
                    }

                    let requestData = {
                        contractId: new ContractDealIdModel().getModel(),
                        cityId: new ContractCityIdModel().getModel(),
                        url: new ContractPdfUrlModel().getModel(),
                    };
                    requestData["isUpdate"] = 1;
                    // if(res.status !== 1) {
                    //     requestData["isUpdate"] = 1;
                    // }
                    this.getContract(requestData);
                });
            },

            // 获取合同相关信息
            getOtherInfo() {
                return new GetContractStatus({
                    cityId: new ContractCityIdModel().getModel(),
                    dealId: new ContractDealIdModel().getModel(),
                    userId: new ContractUserIdModel().getModel()
                }).send().then(res => {
                    let item = new BottomAgentItem();
                    item.archiveDeptName = res.archiveInfo.deptName;
                    item.archiveHeadImg = res.archiveInfo.headerImg
                        || this.Const.imDefaultHeadImg;
                    item.archiveId = res.archiveInfo.archiveId;
                    item.archiveName = res.archiveInfo.name;
                    this.contractInfo = {
                        status: res.status,
                        finishTime: res.finishTime,
                        signType: res.signType
                    };
                    this.bottomAgentItem = item;
                    return res;
                })
                .catch(err => {
                    uni.showModal({
                        title: "温馨提示",
                        content: err.msg || "合同状态信息加载失败，请稍后重试。",
                        showCancel: false,
                        confirmText: "我知道了",
                        confirmColor: this.Const.confirmColor
                    });
                });
            },

            // 获取合同内容
            getContract(requestData) {
                new PdfToImg(requestData).send().then(res => {
                    if(res.code !== this.Const.success) {
                        return Promise.reject(res);
                    }

                    this.contractImg = res.data || "";
                    this.movableX = -25;
                    this.movableY = 0;
                }).catch((err) => {
                    uni.showToast({
                        title: err.msg || "合同加载失败",
                        icon: "none"
                    });
                });
            },

            // ios上图片缩放
            touchStartHandle(e) {
                if (e.touches.length == 1) {
                    return;
                }

                // 注意touchstartCallback 真正代码的开始
                // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug
                // 当两根手指放上去的时候，就将distance 初始化。
                let xMove = e.touches[1].clientX - e.touches[0].clientX;
                let yMove = e.touches[1].clientY - e.touches[0].clientY;
                this.touch.distance = Math.sqrt(xMove * xMove + yMove * yMove);
            },
            touchMoveHandle(e) {
                let touch = this.touch;
                if (e.touches.length == 1) {
                    return;
                }

                let xMove = e.touches[1].clientX - e.touches[0].clientX;
                let yMove = e.touches[1].clientY - e.touches[0].clientY;
                // 新的 ditance
                let distance = Math.sqrt(xMove * xMove + yMove * yMove);
                let distanceDiff = distance - touch.distance;
                let newScale = touch.scale + 0.005 * distanceDiff;
                // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
                if (newScale >= 2) {
                    newScale = 2
                }
                if (newScale <= 0.6) {
                    newScale = 0.6
                }
                let scaleWidth = newScale * touch.baseWidth;
                let scaleHeight = newScale * touch.baseHeight;
                if(newScale === 0.6) {
                    scaleWidth = privateData.imgAllScreenInfo.scaleWidth;
                    scaleHeight = privateData.imgAllScreenInfo.scaleHeight;
                }
                touch.distance = distance;
                touch.scale = newScale;
                touch.scaleWidth = scaleWidth;
                touch.scaleHeight = scaleHeight;
                touch.diff = distanceDiff;
                this.touch = touch;
            },
            load(e) {
                let sceneInfo = uni.getSystemInfoSync();
                let windowWidth = sceneInfo.windowWidth;
                let windowHeight = sceneInfo.windowHeight;
                let imgWidth = e.detail.width;
                let imgHeight = e.detail.height;
                let newHeight = (windowWidth/imgWidth) * imgHeight;
                privateData.imgAllScreenInfo = {
                    scaleWidth: windowWidth,
                    scaleHeight: newHeight
                };
                let touch = this.touch;
                touch.baseWidth = windowWidth * 1.2;
                touch.baseHeight = newHeight * 1.2;
                touch.scaleWidth = windowWidth;
                touch.scaleHeight = newHeight;
            }
        }
    }
</script>

<style scoped>
    page{
        background: #FFFFFF;
    }
    .top_view{
        height: 60upx;
        line-height: 60upx;
        background: #fff5eb;
        color: #ff7c00;
        font-size: 24upx;
        text-align: left;
        padding-left: 24upx;
        box-sizing: border-box;
    }
    .top_view_icon{
        margin: auto 10upx auto 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    /*合同加载中*/
    .contractImg_view{
        display: block;
        width: 100%;
        position: relative;
    }
    .contract_loading{
        text-align: center;
        padding-top: 100upx;
        height: 90%;
        display: flex;
        flex-direction: column;
        width: 100%;
        background: #ffffff;
        color: #6c6c6c;
        font-size: 30upx;
    }

    /*已签订*/
    .sign_finish_view{
        background: #f7f7f7;
        width: 100%;
        height: 128upx;
        padding: 0 30upx;
        box-sizing: border-box;
    }
    .sign_finish_left{
        flex-shrink: 0;
        text-align: left;
        box-sizing: border-box;
    }
    .sign_finish_text{
        padding-left: 22upx;
        box-sizing: border-box;
    }
    .sign_finish_title{
        font-size: 32upx;
        color: #333333;
        line-height: 45upx;
    }
    .sign_finish_time{
        color: #999999;
        font-size: 26upx;
        line-height: 40upx;
    }
    .sign_finish_arrow{
        flex-shrink: 0;
        width: 16upx;
        height: 28upx;
        margin: auto 0;
    }

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