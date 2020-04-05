<template>
	<view class="loading_view f_r_c">
	    <view class="pullUpIcon"></view>
	    <view class="pullUpLabel">努力加载中...</view>
	</view>
</template>

<script>
	export default {

	}
</script>

<style scoped>
	.loading_view{
        transform-origin: 0 0 0;
        opacity: 1;
        transform: scale(1, 1);
        height:40px;
        line-height:40px;
        font-size:12px;
        text-align:center;
    }
    .pullUpIcon{
        display:inline-block;
        height:15px;
        width:15px;
        border-radius:100%;
        margin:auto 6px;
        border:2px solid #666;
        border-bottom-color:transparent;
        vertical-align:middle;
        animation:loading 1s linear infinite;
    }
    @keyframes loading {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
