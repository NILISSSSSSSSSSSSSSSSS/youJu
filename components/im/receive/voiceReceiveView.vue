<template>
	<view @click="playAudio" class="voiceReceiveView f_r_s">
		<image v-if="!isPlayIng" class="voiceReceiveView_img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/laba_l.png"></image>
		<image v-if="isPlayIng" class="voiceReceiveView_img" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/laba_l.gif"></image>
		<view class="voice_length">{{ item.voiceLength }}″</view>
		<!-- <audio :src="item.content"></audio> -->
	</view>
</template>

<script>
let innerAudioContext = uni.createInnerAudioContext();

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
				innerAudioContext.pause();
				innerAudioContext.stop();
				innerAudioContext.destroy();
				innerAudioContext = uni.createInnerAudioContext();
			} catch (e) {}
			let src = this.item.content;

			if (src.indexOf('mp3') == -1) {
				src = src + '?audioTrans&type=mp3';
			}
			this.isPlayIng = true;
			innerAudioContext.src = src;
			innerAudioContext.play();
			innerAudioContext.onError(res => {
				this.isPlayIng = false;
			});
			innerAudioContext.onStop(res => {
				this.isPlayIng = false;
				innerAudioContext.destroy();
				innerAudioContext = uni.createInnerAudioContext();
			});
			innerAudioContext.onEnded(res => {
				this.isPlayIng = false;
				innerAudioContext.destroy();
				innerAudioContext = uni.createInnerAudioContext();
			});
		}
	}
};
</script>

<style scoped>
.voiceReceiveView {
	background-color: #fff;
	color: #041c0c;
	line-height: 1.5;
	position: relative;
	margin-left: 22upx;
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
}
.voiceReceiveView::before {
	content: '';
	position: absolute;
	top: 15upx;
	width: 20upx;
	height: 20upx;
	left: -16upx;
	border-right: 10upx solid #fff;
	background: url('http://cdn.haofang.net/static/uuminiapp/im/left_icon.png') no-repeat;
	background-size: 17upx 13upx;
}
.voiceReceiveView_img {
	width: 36upx;
	height: 36upx;
	margin: auto 0;
	flex-shrink: 0;
}
.voice_length {
	margin-left: 20upx;
}
</style>
