<template>
    <view>
        <view v-if="fontSize != 32" class="title_view f_r_s">{{ title }}</view>
        <view v-if="fontSize == 32" class="title_small_view f_r_s">{{ title }}</view>
    </view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
        
        props: {
            title: {
                type: String,
                default: ""
            },
            fontSize: {
                type: String,
                default: "38"
            }
        }
	}
</script>

<style scoped>
    .title_view{
        padding-left: 40upx;
        width:100%;
        height:54upx;
        line-height:54upx;
        color:#101D36;
        font-weight:bolder;
        font-size:38upx;
        position:relative;
		box-sizing: border-box;
		margin: 50upx 0 7upx;
		flex-shrink: 0;
    }
    .title_small_view{
        padding-left: 40upx;
        width:100%;
        height:45upx;
        line-height:45upx;
        color:#101D36;
        font-weight:bolder;
        font-size:32upx;
        position:relative;
        box-sizing: border-box;
        margin: 45upx 0 7upx;
    }
</style>
