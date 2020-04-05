<template>
    <view class="web_view">
        <web-view class="web" :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
    import {Config} from "../../utils/config";
    import {TakeLookHouseModel} from "../../model/WebOptionsModel";
    import {UserInfoModel} from "../../model/UserInfoModel";

    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#ff5a1f'
                    }
                },
                src: ""
            }
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

        onLoad(options) {
            if(options && Object.keys(options).length > 0) {
                let oldOptions = new TakeLookHouseModel().getModel() || options || {};
                oldOptions = Object.assign(oldOptions, options);
                new TakeLookHouseModel().setModel(oldOptions);
            }

            options = new TakeLookHouseModel().getModel() || options || {};
            let lookOrderUuid = options.lookOrderUuid || options.scene;
            let url = Config.uuweb + "/Mini/Html/takeLookInfo?isMiniProgram=1&lookOrderUuid="
                +lookOrderUuid + "&source=zdzf";
            let me = new UserInfoModel().getModel("me") || {};
            if(me.userId) {
                url += "&userId=" + me.userId;
            }
            this.src = url;

            if(options.authorize) {
                setTimeout(() => {
                    this.src = Config.uuweb + '/Mini/Html/takeLookInfo3??isMiniProgram=1&lookOrderUuid='
                        + lookOrderUuid + '&userId=' + me.userId + "&source=zdzf";
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
