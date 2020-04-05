<template>
    <view class="web_view">
        <web-view class="web" :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
    import {Config} from "../../utils/config";

    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#ff5a1f'
                    }
                },
                src: "https://zdzfapi.haofang.net/Mini/App/download.html?SSL=1"
            }
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
        },
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
