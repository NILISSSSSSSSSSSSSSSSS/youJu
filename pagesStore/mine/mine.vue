<template>
    <view class="app">
        <!-- 个人信息 -->
        <view class="person-info">
            <view class="name-box" hover-class="none" hover-stop-propagation="false">
                <view class="name" hover-class="none" hover-stop-propagation="false">{{userInfo.nickName || '未登录'}}</view>
                <view class="updata-userinfo" hover-class="none" hover-stop-propagation="false">{{!!userInfo?'点击更新个人资料':'点击登录'}}</view>
            </view>
            <view class="head-img" hover-class="none" hover-stop-propagation="false">
                <image :src="userInfo.avatarUrl" mode="widthFix"></image>
            </view>
            <button open-type='getUserInfo' lang="zh_CN" class='login-up-msg-mask' @getuserinfo="upBtn"></button>
        </view>

        <!-- 我的委托(发布委托列表) -->
        <view class='bottom-wrap'></view>

        <!-- 选项部分 -->
        <view class='cont-wraper'>
            <view class='cont-box buy-box navtab-buy' @click='chooseNavBtn(3)'>
                买房委托
            </view>
            <view class='cont-box rent-box navtab-rent' @click='chooseNavBtn(4)'>
                租房委托
            </view>
            <view class='cont-box sale-box navtab-sale' @click='chooseNavBtn(1)'>
                卖房委托
            </view>
            <view class='cont-box lease-box navtab-lease' @click='chooseNavBtn(2)'>
                出租委托
            </view>
        </view>

        <!-- 个人服务 -->
        <view class="person-wallet">
            <view class="wallet-tt clean-mar">个人服务</view>
            <view class='cont-wraper'>
                <view class='cont-box repair-box' @click='contractSearch'>
                    合同查询
                </view>
                <view class='cont-box house-loan-box' @click='calculatorFangDai'>
                    房贷计算
                </view>
                <view class='cont-box protocol-box' @click='calculatorShuiFei'>
                    税费计算
                </view>
            </view>
        </view>

        <!--授权-->
        <get-user-info></get-user-info>

        <!--底部按钮-->
        <bottomTab :isIphoneX="botTab.isIphoneX" :indexTab="botTab.indexTab" :im="botTab.im"></bottomTab>
    </view>
</template>

<script>
    import {UserInfoModel} from "../../model/UserInfoModel";
    import {CompStoreArchiveIdModel, CompStoreEnterQueryModel, CompStoreUnReadMsgNumMapModel} from "../model/CompStoreModel";
    import { Notification } from "../../utils/Notification.js";
    import { Notify } from "../../utils/Notify.js";
    import { DealUserInfoFromLogin } from "../../utils/common.js";
    import bottomTab from "@/pagesStore/components/compStore/bottomTab.vue";

    export default {
        components: {
            bottomTab
        },

        data() {
            return {
                //委托列表数组
                entrustNavList: [
                    {
                        text: '买房委托',
                        typeNum: 3,
                        type: 'buy'
                    },
                    {
                        text: '租房委托',
                        typeNum: 4,
                        type: 'rent'
                    },
                    {
                        text: '卖方委托',
                        type: 'sale',
                        typeNum: 1,
                    },
                    {
                        text: '出租委托',
                        typeNum: 2,
                        type: 'lease'
                    },
                ],
                //用户信息
                userInfo: '',
                // url参数
                urloptions:{
                    compId:'',
                    archiveId:'',
                    compCityId:'',
                    cityId:'',
                },
                // 底部菜单切换
                botTab:{
                    isIphoneX: null,
                    indexTab:3,
                    myinfo:{url:''},
                    compshop:{url:''},
                    im:{url: "/pagesTool/messageDetail/messageDetail", show: false, unReadMsgNum: 0}
                },
            }
        },

        onLoad: function (options) {
            // 监听用户信息授权
            new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);

            //初始化用户信息
            this.initUserInfo();
            // 初始化参数
            let pasmu = this.urloptions;
            pasmu.compId = options.compId;
            pasmu.archiveId = options.archiveId;
            pasmu.compCityId = options.compCityId;
            pasmu.cityId = options.cityId;
            this.setData({urloptions:pasmu});
            this.setBottomMeum();
        },

        onShow() {
            let showImTab = false;
            if(this.urloptions.archiveId) {
                showImTab = true;
            }
            let botTab = this.botTab;
            botTab.im.show = showImTab;
            this.setData({
                botTab: botTab
            });
            if(showImTab) {
                this.initUnReadMsgNum();
            }
        },

        onUnload() {
            // 反注册通知
            new Notification().removeObserverAllNotification(this);
        },

        methods: {
            // 用户信息授权通知回调
            UserInfoChanged() {
                this.initUserInfo();
            },

            // 更新数据方法
            setData(obj = {}) {
                for (let key in obj) {
                    this[key] = obj[key];
                }
            },

            initUnReadMsgNum() {
                let archiveId = new CompStoreArchiveIdModel().getModel() || "";
                let unReadMsgNumMap = new CompStoreUnReadMsgNumMapModel().getModel() || {};
                let unReadMsgNum = unReadMsgNumMap[archiveId] || 0;
                let botTab = this.botTab;
                botTab.im.unReadMsgNum = unReadMsgNum;
                this.botTab = botTab;
            },

            // 初始化用户信息
            initUserInfo() {
                let userInfo = new UserInfoModel().getModel("userInfo") || {};
                this.setData({userInfo: userInfo.userInfo || {}});
            },

            //   设置底部菜单数据
            setBottomMeum(){
                // 获取是否为IphoneX
                let that = this;
                uni.getSystemInfo({
                    success: res => {
                        let modelmes = res.model;
                        let isIphoneX = false;
                        if (modelmes.search('iPhone X') != -1) {
                            isIphoneX = true;
                            let _botTab = that.botTab;
                            _botTab.isIphoneX = isIphoneX;
                            let url = "/pagesStore/compStore/compStore";
                            let urlParams = new CompStoreEnterQueryModel().getModel() || {};
                            for (let k in urlParams) {
                                if(url.indexOf("?") >= 0) {
                                    url += "&" + k + "=" + urlParams[k];
                                }else {
                                    url += "?" + k + "=" + urlParams[k];
                                }
                            }
                            _botTab.compshop.url = url;
                            that.setData({botTab: _botTab});
                        }
                    }
                });
            },

            // 更新资料
            upBtn: function (e) {
                //#ifdef MP

                // #ifndef MP-ALIPAY
                if(!e || !e.detail) return;
                // #endif

                DealUserInfoFromLogin.init(e.detail || {})
                    .then(res => {
                        uni.showToast({title: "更新成功", icon: "none"});
                        this.initUserInfo();
                    });
                //#endif
            },

            // 中间导航选择点击
            chooseNavBtn(caseType) {
                uni.navigateTo({url: "/pagesEntrust/trustList/trustList?caseType=" + caseType});
            },

            // 房贷计算器
            calculatorFangDai() {
                uni.navigateTo({url: "/pagesTool/calculatorFangDai/calculatorFangDai"});
            },

            // 税费计算器
            calculatorShuiFei() {
                uni.navigateTo({url: "/pagesTool/calculatorShuiFei/calculatorShuiFei"});
            },

            // 合同查询
            contractSearch() {
                uni.navigateTo({url: "/pagesStore/contractSearch/contractSearch"});
            }
        }
    }
</script>

<style>
    /* 个人信息 */
    .person-info{width: 670upx;height: 190upx;
        margin: 24upx auto 0;
        padding: 0 30upx;
        box-sizing: border-box;
        box-shadow:0px 6upx 24upx 0upx rgba(0, 0, 0, 0.08);
        border-radius: 14upx;
        display: flex;
        align-items: center;
        position: relative;
    }
    .person-info .name-box {line-height: 1;font-size: 46upx;font-weight: bold;color: #000;flex:1;}
    .person-info .name-box .name {}
    .person-info .name-box .updata-userinfo {font-size: 24upx;color: #999;margin-top: 21upx;}
    .person-info .name-box .updata-userinfo::after{content: '';margin-left: 9upx;display: inline-block;width: 20upx;height: 20upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/compStore/mine_update.png) center center no-repeat;
        background-size: cover;

    }
    .person-info .head-img {width: 130upx;height: 130upx;border-radius: 100%;overflow: hidden;
        background: url(https://zdzfapi.haofang.net/Public/wxApp/images/mine/fang_default.png) center center no-repeat;
        background-size: cover;
    }
    .person-info .head-img image {width: 100%;height: 100%;}
    .person-info .login-up-msg-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: none;
        border-color: #fff;
    }

    .person-info .login-up-msg-mask::after {
        border: 0;
    }

    /* 委托相关(第一期) */
    .bottomcont {
        width: 100%;
        height: 500upx;
        padding-top: 42upx;
    }
    .bottomcont .nav-top {
        padding-left: 50upx;
        background-color: #fff;
        width: auto;
    }
    .bottomcont .line-border-20{
        width: 100%;
        height: 20upx;
        background-color: #f6f6f6;
    }
    .nav-tab {
        display: block;
        height: 110upx;
        background-color: #fff;
        line-height: 110upx;
        font-size: 30upx;
        position: relative;
        color: #282828;
    }

    .bottomcont>.navtab-bef {
        content: "";
        position: absolute;
        display: block;
        width: 46upx;
        height: 46upx;
        top: 50%;
        left: 1;
        transform: translateY(-50%);
        background-size: 100% 100% !important;
        background: url(http://cdn.haofang.net/static/uuminiapp/compStore/icon_my_entrust.png) center no-repeat;
    }

    .bottomcont .navtab-aft {
        content: "";
        display: block;
        width: 12upx;
        height: 21upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/compStore/mine_arrow_right.png) center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 50upx;
        top: 50%;
        transform: translateY(-50%);
    }

    /* 買房 */
    .navtab-buy::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 68upx;
        height: 68upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/buyhouse_btn.png) center center no-repeat;
        background-size: 100% 100%;
    }
    /* 租房 */
    .navtab-rent::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 68upx;
        height: 68upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/renthouse_btn.png) center center no-repeat;
        background-size: 100% 100%;
    }
    /* 賣房 */
    .navtab-sale::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 68upx;
        height: 68upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/sellhouse_btn.png) center center no-repeat;
        background-size: 100% 100%;
    }
    /* 出租 */
    .navtab-lease::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 68upx;
        height:68upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/rent_btn.png) center center no-repeat;
        background-size: 100% 100%;
    }

    .bottomcont .size {
        display: inline-block;
        width: 120upx;
        height: 1px;
        padding-left: 69upx;
    }

    .bottomcont .nav-tabbott {
        border-bottom: 1upx solid #f4f4f4;
        margin-bottom: 0upx;
    }

    /* 委托相关(第一期)end */

    /* 个人中心新优化版 */
    .cont-wraper{
        display: flex;
        flex-wrap: wrap;
        /*background: #ffffff;*/
        /* background-image: url(http://cdn.haofang.net/static/uuminiapp/changeImg/mine_bg.png); */
        /* background-position: center center; */
        /* background-repeat: no-repeat; */
        /* background-size: 100% 100%; */
        margin-bottom:20upx;
        margin-left: 20upx;
        margin-right: 20upx;
    }
    .cont-box{
        position: relative;
        flex-shrink: 0;
        width: 25%;
        height: 190upx;
        color:#101d36;
        line-height: 270upx;
        font-size: 24upx;
        text-align: center;
        box-sizing: border-box;

        /*border-right:1upx solid #e6e6e6;*/
    }

    /*个人钱包*/
    .person-wallet{
        position: relative;
        background: #fff;
        width: 100%;
        height: auto;
    }
    .wallet-tt{
        position: relative;
        width: 100%;
        height: auto;
        line-height: 104upx;
        box-sizing: border-box;
        padding: 0 35upx 0 35upx;
        font-size: 44upx;
        color: #101d36;
        font-weight: bold;
        overflow: hidden;
        margin-bottom: 15upx;
    }
    .clean-mar{margin: 0;}
    .g-all{
        background: red;
    }
    .g-all::after {
        position: absolute;
        content: '';
        width: 17upx;
        height: 30upx;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 40upx;
        background: url(http://cdn.haofang.net/static/uuminiapp/detail/l-jtt.png) center center no-repeat;
        background-size: 100% 100%;
    }
    .wallet-cont{
        position: relative;
        display: flex;
        width: 669upx;
        height: 170upx;
        margin: 0 auto 30upx auto;
        background-color: #ffffff;
        box-shadow: 0px 4upx 33upx 2upx
        rgba(55, 55, 55, 0.1);
        border-radius: 10upx;
    }
    .wallet-cont-li{
        flex: 1;
        text-align: center;
    }
    .wallet-cont-li .cont-li-info{
        display: block;
        margin-top: 28upx;
    }
    .cont-li-info text{
        color: #101d36;
    }
    .cont-li-info text:nth-of-type(1){
        font-size: 48upx;
        margin-right: 10upx;
    }
    .cont-li-info text:nth-of-type(2){
        font-size: 24upx;
    }
    .cont-li-desc{
        margin-top: 15upx;
        font-size: 26upx;
        color: #7a8190;
    }
    /*个人钱包end*/

    /* 个人服务 start */

    /* 合同查询icon */
    .repair-box::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 61upx;
        height: 61upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/flagship/mine/Requirement.png) center center no-repeat;
        background-size: 100% 100%;
    }
    /* 房贷计算icon */
    .house-loan-box::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 61upx;
        height: 61upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/flagship/mine/calculatorFangDai.png) center center no-repeat;
        background-size: 100% 100%;
    }
    /* 税费计算icon */
    .protocol-box::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 61upx;
        height: 61upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/flagship/mine/calculatorShuiFei.png) center center no-repeat;
        background-size: 100% 100%;
    }
    /* 在线消息icon */
    .about-box::before{
        position: absolute;
        top: 45upx;
        margin: auto;
        content: '';
        width: 61upx;
        height: 61upx;
        left: 0;
        right:0;
        background: url(http://cdn.haofang.net/static/uuminiapp/flagship/mine/im-icon.png) center center no-repeat;
        background-size: 100% 100%;
    }
</style>