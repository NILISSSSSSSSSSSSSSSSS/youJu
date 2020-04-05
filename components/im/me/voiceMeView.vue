<template>
	<view @click="playAudio" class="voiceMeView f_r_e">
		<view class="voice_length">{{ item.voiceLength }}″</view>

		<image v-if="!isPlayIng" class="voiceMeView_img" src="http://cdn.haofang.net/static/uuminiapp/changeImg/listen_icon.png"></image>
		<image v-if="isPlayIng" class="voiceMeView_img" src="http://cdn.haofang.net/static/uuminiapp/im/voice_me.gif"></image>
		<!-- <audio :src="item.content"></audio> -->
	</view>
</template>

<script>
let innerMeAudioContext = uni.createInnerAudioContext();

export default {
	data() {
		return {
			isPlayIng: false
		};
	},

	props: {
		item: {
			type: Object,
			default: {}
		}
	},

	methods: {
		playAudio() {
			try {
				innerMeAudioContext.pause();
				innerMeAudioContext.stop();
				innerMeAudioContext.destroy();
				innerMeAudioContext = uni.createInnerAudioContext();
			} catch (e) {
			}

			let src = this.item.content;
			if (src.indexOf('?audioTrans&type=mp3') >= -1) {
				src = src.replace('?audioTrans&type=mp3', '');
			}
			// if (uni.getSystemInfoSync().platform == 'android' && src.indexOf("?audioTrans&type=mp3") >= -1){
			// 	// src = src + "?audioTrans&type=mp3";
			// 	src = src.replace("?audioTrans&type=mp3", "");
			// }
			// if( uni.getSystemInfoSync().platform !== 'android'){
			// 	src = src + "?audioTrans&type=mp3";
			// }
			// src = 'https://nim.nosdn.127.net/MTA0NTA0NQ==/bmltYV82OTQwNjUzOTEwXzE1NjE4MDMxMzY5MjJfNDhjNzc3YzgtMGM3ZS00MjJlLTllMjgtM2M0N2ZiYTMzNTNj';
			console.log(22222,src)
			this.isPlayIng = true;
			innerMeAudioContext.src = src;
			innerMeAudioContext.play();
			innerMeAudioContext.onError(res => {
				this.isPlayIng = false;
			});
			innerMeAudioContext.onStop(res => {
				this.isPlayIng = false;
				innerMeAudioContext.destroy();
				innerMeAudioContext = uni.createInnerAudioContext();
			});
			innerMeAudioContext.onEnded(res => {
				this.isPlayIng = false;
				innerMeAudioContext.destroy();
				innerMeAudioContext = uni.createInnerAudioContext();
			});
		}
	}
};
</script>

<style scoped>
.voiceMeView {
	background-color: #5786f2;
	color: #ffffff;
	line-height: 1.5;
	margin-right: 22upx;
	min-height: 40upx;
	padding: 19upx 20upx;
	box-sizing: border-box;
	max-width: 65%;
	border-radius: 15upx;
	word-break: break-all;
	font-size: 15px;
	text-align: center;
	line-height: 1.5;
	width: 200upx;
	position: relative;
}
/* 	.voiceMeView::after{
		content: '';
		position: absolute !important;
		top: 15upx;
		width: 20upx;
		height: 20upx;
		right: -17upx;
		background: url('http://cdn.haofang.net/static/uuminiapp/im/right_icon.png') no-repeat;
		background-size: 17upx 13upx;
	} */
.voiceMeView_img {
	width: 36upx;
	height: 36upx;
	margin: auto 0;
	flex-shrink: 0;
}
.voice_length {
	margin-right: 20upx;
}
</style>
