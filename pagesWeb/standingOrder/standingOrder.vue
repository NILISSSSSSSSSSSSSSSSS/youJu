<template>
    <view class="web_view">
        <web-view class="web" :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
    import {Config} from "../../utils/config";
    import {StandingOrderModel} from "../../model/WebOptionsModel";
    import {UserInfoModel} from "../../model/UserInfoModel";

    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#ff5a1f'
                    }
                },
                src: "",
            }
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

        onLoad(options) {
            let me = new UserInfoModel().getModel("me") || {};
            if(options && Object.keys(options).length > 0) {
                let oldOptions = new StandingOrderModel().getModel() || options || {};
                oldOptions = Object.assign(oldOptions, options);
                new StandingOrderModel().setModel(oldOptions);
            }
            options = new StandingOrderModel().getModel() || options || {};

            let url = Config.uuweb + "/Mini/Html/standingOrder";
            let keysMap = ["proxyId", "mobile", "cityId", "caseType", "caseId", "compId", "source"];
            for (let key in options) {
                if(!keysMap.includes(key)) continue;

                if(url.indexOf("?") >= 0) {
                    url += "&" + key + "=" + options[key];
                    continue;
                }

                url += "?" + key + "=" + options[key];
            }
            if(me.userId) {
                url += "&userId=" + me.userId;
            }
            url += '&source=' + this.Const.cPlateType_zdzfplatfm;
            this.src = url;

            if(options.authorize) {
                let evaUrl = Config.uuweb + '/Mini/Html/standingOrderEva?proxyId=' + options.proxyId
                    + '&cityId=' + options.cityId + '&userId=' + me.userId
                    + '&source=' + this.Const.cPlateType_zdzfplatfm;
                if(options.compId) {
                    evaUrl += '&compId=' + options.compId;
                }
                setTimeout(() => {
                    this.src = evaUrl;
                }, 500);
            }
        }
    }
</script>

<style scoped>
    .web_view{
        background: #FFFFFF;
    }
    .web{
        background: #FFFFFF;
    }
</style>
