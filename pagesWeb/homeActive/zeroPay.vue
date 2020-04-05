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
                }
            }
        },
        computed: {
            src() {
                let jsonParam = JSON.parse(decodeURIComponent(Config.homeZeroEntrustMoneyWebUrl));
                let url = jsonParam.url;
                for (let k in jsonParam) {
                    if (k === "url") continue;

                    if (url.indexOf("?") >= 0) {
                        url += `&${k}=${jsonParam[k]}`;
                        continue;
                    }

                    url += `?${k}=${jsonParam[k]}`;
                }
                return url;
            }
        }
    }
</script>

<style>
    .web_view {
        background: #FFFFFF;
        width: 100%;
        height: 100%;
    }

    .web {
        background: #FFFFFF;
        width: 100%;
        height: 100%;
    }
</style>
