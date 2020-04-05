

<template>
    <div class="center-loading" @touchmove.stop.prevent="">
        <image class="app-loading"
               src="http://cdn.haofang.net/static/wxPlusApp/yjk/common/app_loading.gif"
               resize="cover"></image>
    </div>
</template>

<script>
    export default {}
</script>

<style>
    .center-loading{
        flex: 1;
        background-color: transparent;
    }
    .app-loading{
        background-color: transparent;
        position: fixed;
        left: 365rpx;
        top: 682rpx;
        width: 298rpx;
        height: 138rpx;
        margin-top: -69rpx;
        margin-left: -149rpx;
    }
</style>