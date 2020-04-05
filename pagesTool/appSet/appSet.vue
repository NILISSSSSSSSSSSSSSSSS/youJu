

<template>
    <view @click="enterConsole" :style="{height: windowHeight}" class="app_set">
        <view class="title">账号设置</view>
        <view @click.stop="changePhone" class="set-item f_r_b">
            <view>更换手机号</view>
            <image class="right_arrow" src="http://cdn.haofang.net/static/wxPlusApp/yjk/common/right_arrow.png"></image>
        </view>

        <view style="margin-top: 66upx;" class="title">其他</view>
        <view class="set-item f_r_b" @click.stop="clearStorage">
            <view>清除缓存</view>
            <image class="right_arrow" src="http://cdn.haofang.net/static/wxPlusApp/yjk/common/right_arrow.png"></image>
        </view>
        <view class="set-item f_r_b" @click.stop="checkUp">
            <view>检查更新</view>
            <image class="right_arrow" src="http://cdn.haofang.net/static/wxPlusApp/yjk/common/right_arrow.png"></image>
        </view>

        <view class="empty-bottom-view"></view>
        <view class="login-out" @click.stop="loginOut">退出登录</view>

        <showModal :modal="{title: '', content: '你确定退出当前帐号？'}"
                   ref="modal" @onModalChanged="onModalChanged"></showModal>

        <yomolUpgrade :type="upgradeType" :url="upgradeUrl"
                      :versionName="versionName"
                      :content="upgradeContent" ref="yomolUpgrade"></yomolUpgrade>
    </view>
</template>

<script>
    import {UserInfoModel} from "../../model/UserInfoModel";
    import {DefaultModel} from "../../model/DefaultModel";
    import {ConsoleModel} from "../../model/ConsoleModel";
    import {DifferenceApi} from "../../utils/DifferenceApi";
    import {Utils} from "../../utils/Utils";
    import yomolUpgrade from '@/components/upManage/yomol-upgrade/yomol-upgrade.vue';
    import {Config} from "../../utils/config";

    export default {
        components: {
            yomolUpgrade
        },

        data() {
            return {
                rightArrow: "http://cdn.haofang.net/static/uuminiapp/evaluate/right.jpg",
                windowHeight: "100%",
                clickNum: 0,

                upgradeType: 'wgt', //pkg 整包 wgt 升级包
                upgradeContent: '', //更新内容
                upgradeUrl: '', //更新地址
                versionName: '', //版本号
            }
        },

        onLoad() {
            this.upSystemInfo();
        },

        methods: {
            // 设置页面尺寸
            upSystemInfo() {
                let res = uni.getSystemInfoSync();
                this.windowHeight = res.windowHeight + "px";
            },

            // 更新用户信息
            upUserInfo() {
                uni.login({
                    provider: "weixin",
                    success: (res) => {
                        uni.getUserInfo({
                            success: (info) => {
                                new UserInfoModel().setModel({userInfo: info.userInfo}, "userInfo");
                                plus.nativeUI.toast("更新成功");
                            }
                        });
                    }
                });
            },

            // 清楚缓存
            clearStorage() {
                // let res = uni.getStorageInfoSync();
                // for (let key of (res.keys || [])) {
                //     if (key === new UserInfoModel().getKey()) continue;
                //
                //     if (key === new ConsoleModel().getKey()) continue;
                //
                //     new DefaultModel().removeModel(key);
                // }
                new DifferenceApi().showToast("清除成功");
            },

            // 退出登录
            loginOut() {
                this.$refs.modal.show();
            },
            // 确定退出登录
            onModalChanged(val) {
                if (!val) return;

                let consoleList = new ConsoleModel().getModel() || [];
                new DefaultModel().clearModel();
                new ConsoleModel().setModel(consoleList);
                new DifferenceApi().showToast("退出登录成功");
                setTimeout(() => {
                    uni.reLaunch({
                        url: "/pages/my/my"
                    });
                }, 1000);
            },

            // 连续点击10下进入到日志页面
            enterConsole() {
                this.clickNum++;
                if (this.clickNum >= 10) {
                    this.clickNum = 0;
                    uni.navigateTo({
                        url: "/pagesTool/appSet/console"
                    });
                }
            },

            // 修改手机号
            changePhone() {
                uni.navigateTo({
                    url: "/pagesTool/changePhone/changePhone"
                });
            },

            // 检查更新
            checkUp() {
                // #ifdef APP-PLUS || H5
                uni.showLoading({title: '检查版本中...', mask: Config.mask});
                new Utils().checkUpVersion()
                  .then(res => {
                      console.error(res,"Utils");
                      uni.hideLoading();
                      if(res.status && res.status === 1) {
                          new DifferenceApi().showToast(res.msg);
                          return;
                      }

                      this.upgradeType = res.type;
                      this.upgradeContent = res.content;
                      this.upgradeUrl = res.url;
                      this.versionName = res.versionName;
                      this.$refs.yomolUpgrade.show();
                  })
                  .catch(err => {
                      uni.hideLoading();
                      new DifferenceApi().showToast(err.errMsg || "更新失败");
                  });
                // #endif

                // #ifndef APP-PLUS || H5
                new DifferenceApi().showToast("只有APP支持该功能");
                // #endif
            },
        }
    }
</script>

<style scoped>
    page{
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        overflow: hidden;
    }
    .app_set{
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        overflow-x: hidden;
        overflow-y: auto;
        box-sizing: border-box;
        padding: 50upx 40upx 0;
    }
    .title{
        line-height: 64upx;
        height: 64upx;
        font-family: PingFang-SC-Bold;
        font-size: 40upx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0;
        color: #000000;
        font-weight: bold;
    }
    .set-item{
        height: 116upx;
        line-height: 116upx;
        box-sizing: border-box;
        align-items: center;
        border-bottom: 1px solid #ebebeb;
        font-family: PingFang-SC-Medium;
        font-size: 32upx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0;
        color: #191f25;
    }
    .right_arrow{
        width: 13upx;
        height: 24upx;
        flex-shrink: 0;
    }
    .empty-bottom-view{
        height: 150upx;
        width: 100%;
    }
    .login-out{
        position: fixed;
        height: 150upx;
        line-height: 150upx;
        z-index: 99;
        background-color: #ffffff;
        left: 0;
        width: 100%;
        bottom: 0;
        text-align: center;
        font-family: PingFang-SC-Medium;
        font-size: 32upx;
        font-weight: normal;
        font-stretch: normal;
        color: #fa5741;
    }
</style>
