<template>
    <view class="web_view">
        <web-view class="web" :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
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

        onLoad() {
            let that = this;
            uni.showToast({
                title: "文档加载中...",
                icon: "none",
                duration: 999999,
                mask: true
            });
            uni.downloadFile({
                url: "http://uuweb.hftsoft.com/Public/content.pdf",
                success: res => {
                    that.src = res.tempFilePath;
                    uni.openDocument({
                        filePath: that.src,
                        success: res => {
                            uni.hideToast();
                        },
                        fail: err => {
                            uni.hideToast();
                            uni.showToast({
                                title: "文档加载失败",
                                icon: "none",
                                mask: true
                            });
                        }
                    });
                },
                fail: err => {
                    uni.hideToast();
                    uni.showToast({
                        title: "文档加载失败",
                        icon: "none",
                        mask: true
                    });
                }
            })
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
