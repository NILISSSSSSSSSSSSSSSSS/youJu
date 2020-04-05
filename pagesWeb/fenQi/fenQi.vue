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
                src: ""
            }
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

        // phone 经纪人电话
        onLoad(query) {
            if (!query.phone) {
                uni.showToast({title: "暂无电话", icon: "none"});
                return;
            }

            this.src = Config.uuweb + "/App/Index/crashPrize?userMobile=" + query.phone;
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
