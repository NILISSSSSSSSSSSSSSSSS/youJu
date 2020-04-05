<template>
	<view class="textMeView">
		<text v-if="!item.hasEmoji">{{ item.content }}</text>
		
		<block v-if="item.hasEmoji && item.emoji && item.emoji.length>0" 
			v-for="(info, key) in (item.emoji[0])" :key="key">
			<block v-if="info.emoji">
				<image :src="info.url" mode="aspectFit" class='emoji_text'></image>
			</block>
			
			<block v-else-if="info != null">{{ info }}</block>
        </block>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: {}
			},
		}
	}
</script>

<style scoped>
	.textMeView{
		background-color: #5786f2;
		color: #fff;
		word-break: break-all;
		line-height: 1.5;
		position:relative;
		margin-right:22upx;
		min-height:40px;
		padding:19upx 20upx;
		box-sizing: border-box;
		max-width:65%;
		border-radius:15upx;
		text-align:left;
		font-size:15px;
	}
	.textMeView>text{
		padding:0;
		margin:0;
		width:100%;
		height:100%;
	}
	.textMeView::before{
		content: '';
		position: absolute !important;
		top: 15upx;
		width: 20upx;
		height: 20upx;
		right: -17upx;
		/* background-color: #0Ed2d3; */
		/* background: url('http://cdn.haofang.net/static/uuminiapp/im/right_icon.png') no-repeat; */
		background-size: 17upx 13upx;
	}
	.emoji_text{
		width: 46upx;
		height: 46upx;
		vertical-align:middle;
		line-height: 23px;
	}
</style>
