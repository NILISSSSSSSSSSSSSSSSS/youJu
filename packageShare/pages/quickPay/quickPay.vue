<template>
    <view class="web_view">
        <web-view class="web" :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
    import {Config} from "../../../utils/config";

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
            this.src = Config.uuweb + "/Mini/FastPayForXw/index?orderNo="
            + options.orderNo + "&txnNo=" + options.txnNo + "&cityId=" + options.cityId
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