

<template>
    <image class="app-loading"
           @touchmove.stop.prevent=""
           src="http://cdn.haofang.net/static/wxPlusApp/yjk/common/screen_loading.gif"
           resize="cover"></image>
</template>

<script>
    export default {}
</script>

<style>
    .app-loading{
        background-color: transparent;
        position: fixed;
        flex: 1;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
    }
</style>